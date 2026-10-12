/**
 * KKG v0.6.0 TEST-ONLY entry pilot.
 * Strictly restricted to a copied workbook containing _KKG_V2_CONTROL.MODE=TEST_ONLY.
 * Not a production payment migration. Requires Advanced Google Sheets API and a
 * separately installed onEdit trigger (do not name this function 'onEdit').
 * Source: JP_Cost_Estimation / feature/kkg-finance-entry-v0.6.0-test-20261012
 */
var KKG_V2 = Object.freeze({
  control: '_KKG_V2_CONTROL', entry: '00_V2_ENTRY_TEST',
  vendors: '_KKG_V2_VENDORS', payments: '_KKG_V2_PAYMENTS',
  audit: '_KKG_V2_AUDIT', summary: 'KKG_V2_SUMMARY_TEST',
  legacy: '14_bishal_paija', company: 'REB', project: '14_bishal_paija',
  tz: 'Asia/Katmandu'
});
function onOpen() {
  SpreadsheetApp.getUi().createMenu('KKG TEST Payment Tools')
    .addItem('Submit new vendor', 'kkgV2SubmitVendor')
    .addItem('Submit new payment', 'kkgV2SubmitPayment')
    .addItem('Check test reconciliation', 'kkgV2Check')
    .addToUi();
}
function kkgV2InstallTestTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  kkgV2Context_(ss);
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'kkgV2OnEdit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('kkgV2OnEdit').forSpreadsheet(ss).onEdit().create();
  ss.getSheetByName(KKG_V2.control).getRange('B8').setValue('INSTALLED_TEST_ONLY');
  return 'TEST trigger installed only for bound copy ' + ss.getId();
}
function kkgV2OnEdit(e) {
  if (!e || !e.range || e.range.getSheet().getName() !== KKG_V2.entry) return;
  var a1 = e.range.getA1Notation();
  if (a1 === 'B6' && e.range.getDisplayValue() === 'ADD_VENDOR') kkgV2Run_('VENDOR');
  if (a1 === 'B18' && e.range.getDisplayValue() === 'ADD_PAYMENT') kkgV2Run_('PAYMENT');
}
function kkgV2SubmitVendor() { return kkgV2Run_('VENDOR'); }
function kkgV2SubmitPayment() { return kkgV2Run_('PAYMENT'); }
function kkgV2Check() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  kkgV2Context_(ss);
  var outcome = kkgV2Reconcile_(ss);
  ss.getSheetByName(KKG_V2.entry).getRange('B20').setValue(outcome);
  return outcome;
}
function kkgV2Run_(kind) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), form = ss.getSheetByName(KKG_V2.entry);
  var actionCell = kind === 'VENDOR' ? 'B6' : 'B18';
  var lock = LockService.getDocumentLock();
  if (!lock || !lock.tryLock(20000)) throw new Error('Another payment entry is in progress.');
  try {
    kkgV2Context_(ss);
    var result = kind === 'VENDOR' ? kkgV2AddVendor_(ss) : kkgV2AddPayment_(ss);
    SpreadsheetApp.flush();
    var check = kkgV2Reconcile_(ss);
    form.getRange('B20').setValue('SUCCESS ' + result + ' | ' + check);
    return result;
  } catch (err) {
    if (form) form.getRange('B20').setValue('ERROR: ' + String(err.message || err));
    throw err; // No silent success. Partial writes must be reconciled before retry.
  } finally {
    if (form) form.getRange(actionCell).setValue('IDLE');
    lock.releaseLock();
  }
}
function kkgV2Context_(ss) {
  if (!ss) throw new Error('No active Google Sheet');
  var cfg = ss.getSheetByName(KKG_V2.control);
  if (!cfg) throw new Error('Missing TEST_ONLY control sheet; production operation blocked.');
  var matrix = cfg.getRange('A1:B12').getDisplayValues();
  var conf = {};
  matrix.forEach(function(row) { conf[row[0]] = row[1]; });
  if (conf.MODE !== 'TEST_ONLY' || conf.ROLE !== 'TEST_COPY_NO_PRODUCTION_WRITES' ||
      conf.BOUND_SPREADSHEET_ID !== ss.getId() ||
      conf.COMPANY_ID !== KKG_V2.company || conf.PROJECT_ID !== KKG_V2.project ||
      conf.ORIGINAL_LEDGER_TAB !== KKG_V2.legacy ||
      conf.READ_ONLY_LIVE !== 'TRUE') {
    throw new Error('Test-only guard failed; no live workbook write authorized.');
  }
  [KKG_V2.entry, KKG_V2.vendors, KKG_V2.payments, KKG_V2.audit, KKG_V2.summary, KKG_V2.legacy]
    .forEach(function(n) { if (!ss.getSheetByName(n)) throw new Error('Missing expected test tab ' + n); });
  return conf;
}
function kkgV2Clean_(x) { return String(x == null ? '' : x).trim(); }
function kkgV2Normalize_(x) { return kkgV2Clean_(x).replace(/\s+/g,' ').toLocaleLowerCase(); }
function kkgV2ValidateMoney_(raw, required, label) {
  if (raw === '' || raw == null) {
    if (required) throw new Error(label + ' is required.');
    return 0;
  }
  var num = Number(raw);
  if (!Number.isFinite(num) || num < 0 || Math.abs(Math.round(num * 100) - num * 100) > 1e-7)
    throw new Error(label + ' must be a nonnegative NPR value with at most two decimals.');
  return num;
}
function kkgV2ValidateDate_(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error('Use payment date YYYY-MM-DD (AD).');
  var d = new Date(s + 'T00:00:00Z');
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0,10) !== s)
    throw new Error('Invalid payment date.');
  return s;
}
function kkgV2ValidateTime_(s) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s)) throw new Error('Use paid time HH:MM in 24-hour format.');
  return s;
}
function kkgV2Data_(sheet, columns) {
  var last = sheet.getLastRow();
  return last < 2 ? [] : sheet.getRange(2, 1, last - 1, columns).getValues()
    .filter(function(r) { return kkgV2Clean_(r[0]) !== ''; });
}
function kkgV2Legacy_(ss) {
  var values = ss.getSheetByName(KKG_V2.legacy).getRange('A6:E35').getDisplayValues();
  var result = [];
  values.slice(1).forEach(function(r) {
    if (kkgV2Clean_(r[1]).toLowerCase() === 'total') return;
    if (/^\d+$/.test(kkgV2Clean_(r[0])) && kkgV2Clean_(r[1]))
      result.push({ no: Number(r[0]), name: r[1] });
  });
  return result;
}
function kkgV2UniqueId_(existing, prefix) {
  for (var i = 0; i < 10; i++) {
    var proposed = prefix + Utilities.getUuid().replace(/-/g,'').slice(0,20).toUpperCase();
    if (!existing.has(proposed)) return proposed;
  }
  throw new Error('Failed to allocate a unique transaction/audit ID.');
}
function kkgV2AddVendor_(ss) {
  var f = ss.getSheetByName(KKG_V2.entry);
  var name = kkgV2Clean_(f.getRange('B4').getDisplayValue());
  if (name.length < 2 || name.length > 160) throw new Error('Enter a unique vendor name (2–160 chars).');
  var existing = kkgV2Legacy_(ss);
  var table = ss.getSheetByName(KKG_V2.vendors), rows = kkgV2Data_(table, 7);
  var allNames = existing.map(function(x){return kkgV2Normalize_(x.name);})
    .concat(rows.map(function(x){return kkgV2Normalize_(x[2]);}));
  if (allNames.indexOf(kkgV2Normalize_(name)) !== -1)
    throw new Error('Vendor already exists. No duplicate added.');
  var maxNumber = existing.concat(rows.map(function(r){return { no: Number(r[0]) };}))
    .reduce(function(v,x){return Math.max(v,x.no || 0);},0);
  var number = maxNumber + 1, vendorId = 'KKG-V-' + String(number).padStart(4,'0');
  if (rows.some(function(r){return r[1] === vendorId;})) throw new Error('Duplicate vendor ID blocked.');
  var stamp = Utilities.formatDate(new Date(), KKG_V2.tz, 'yyyy-MM-dd HH:mm:ss');
  var auditId = kkgV2UniqueId_(new Set(kkgV2Data_(ss.getSheetByName(KKG_V2.audit),10).map(function(x){return x[0];})), 'KKG-AUD-');
  table.appendRow([number,vendorId,name,KKG_V2.company,KKG_V2.project,stamp,'ACTIVE']);
  kkgV2ExpandTable_(ss, KKG_V2.vendors, 'KKG_V2_Test_Vendors', 7);
  ss.getSheetByName(KKG_V2.audit).appendRow([auditId,stamp,'BOUND_TEST_SCRIPT','VENDOR_CREATED_TEST',
    'VENDOR',vendorId,KKG_V2.company,KKG_V2.project,'CREATED',name]);
  kkgV2ExpandTable_(ss, KKG_V2.audit,'KKG_V2_Test_Audit',10);
  kkgV2RebuildSummary_(ss);
  f.getRange('B9').setValue(vendorId);
  f.getRange('B4:B5').clearContent();
  return 'Vendor ' + number + ' / ' + vendorId;
}
function kkgV2AddPayment_(ss) {
  var f = ss.getSheetByName(KKG_V2.entry);
  var data = f.getRange('B9:B17').getValues().map(function(r){return r[0];});
  var vendorId = kkgV2Clean_(data[0]);
  var vendors = kkgV2Data_(ss.getSheetByName(KKG_V2.vendors),7);
  if (!vendors.some(function(v){return v[1] === vendorId && v[3] === KKG_V2.company &&
    v[4] === KKG_V2.project && v[6] === 'ACTIVE';}))
    throw new Error('Unknown or cross-project vendor. Only test registry IDs accepted.');
  var date = kkgV2ValidateDate_(kkgV2Clean_(data[1]));
  var time = kkgV2ValidateTime_(kkgV2Clean_(data[2]));
  var amount = kkgV2ValidateMoney_(data[3], true, 'Amount');
  if (amount === 0) throw new Error('Payment must be greater than zero.');
  var qr = kkgV2ValidateMoney_(data[4], false, 'QR');
  var discount = kkgV2ValidateMoney_(data[5], false, 'Discount');
  var method = kkgV2Clean_(data[6]) || 'UNSPECIFIED';
  if (method.length > 40) throw new Error('Payment method too long.');
  var description = kkgV2Clean_(data[7]), evidence = kkgV2Clean_(data[8]);
  var sheet = ss.getSheetByName(KKG_V2.payments), old = kkgV2Data_(sheet,16);
  var tx = kkgV2UniqueId_(new Set(old.map(function(x){return x[0];})), 'KKG-TX-');
  var auditId = kkgV2UniqueId_(new Set(kkgV2Data_(ss.getSheetByName(KKG_V2.audit),10).map(function(x){return x[0];})), 'KKG-AUD-');
  var stamp = Utilities.formatDate(new Date(),KKG_V2.tz,'yyyy-MM-dd HH:mm:ss');
  sheet.appendRow([tx,vendorId,KKG_V2.company,KKG_V2.project,date,time,amount,qr,discount,
    method,description,evidence,stamp,stamp,'ACTIVE',auditId]);
  kkgV2ExpandTable_(ss, KKG_V2.payments,'KKG_V2_Test_Payments',16);
  ss.getSheetByName(KKG_V2.audit).appendRow([auditId,stamp,'BOUND_TEST_SCRIPT','PAYMENT_CREATED_TEST',
    'PAYMENT',tx,KKG_V2.company,KKG_V2.project,'CREATED',vendorId+'; amount='+amount+'; QR='+qr]);
  kkgV2ExpandTable_(ss, KKG_V2.audit,'KKG_V2_Test_Audit',10);
  f.getRange('B10:B14').clearContent();
  f.getRange('B16:B17').clearContent();
  return 'Payment ' + tx;
}
function kkgV2ExpandTable_(ss, tab, tableName, cols) {
  // Requires Apps Script Services > Google Sheets API.
  if (typeof Sheets === 'undefined' || !Sheets.Spreadsheets)
    throw new Error('Enable the Advanced Google Sheets API service. Data may have been appended; reconcile before retry.');
  var sh = ss.getSheetByName(tab), sheetId = sh.getSheetId();
  var resource = Sheets.Spreadsheets.get(ss.getId(),{
    fields:'sheets(properties(sheetId,title),tables(tableId,name,range))'
  });
  var match;
  (resource.sheets || []).forEach(function(x){
    if (x.properties.sheetId === sheetId)
      (x.tables || []).forEach(function(t){if(t.name === tableName)match=t;});
  });
  if (!match) throw new Error('Expected native table '+tableName+' missing. Reconcile before retry.');
  var range = { sheetId:sheetId, startRowIndex:0, endRowIndex:sh.getLastRow(),
    startColumnIndex:0, endColumnIndex:cols };
  if (match.range.endRowIndex === range.endRowIndex) return;
  Sheets.Spreadsheets.batchUpdate({requests:[{updateTable:{table:{tableId:match.tableId,range:range},
    fields:'range'}}]},ss.getId());
}
function kkgV2RebuildSummary_(ss) {
  var sum = ss.getSheetByName(KKG_V2.summary);
  var vendors = kkgV2Data_(ss.getSheetByName(KKG_V2.vendors),7);
  var rowCount = Math.max(sum.getLastRow(),4);
  sum.getRange(3,1,rowCount-2,7).clearContent();
  var lines = vendors.map(function(v) {
    var id = String(v[1]);
    // Formula looks up a stable ID; no implicit arithmetic against QR or discounts.
    return [v[0],id,v[2],
      '=SUMIF(_KKG_V2_PAYMENTS!B$2:B,B'+(3+vendors.indexOf(v))+',_KKG_V2_PAYMENTS!G$2:G)',
      '=SUMIF(_KKG_V2_PAYMENTS!B$2:B,B'+(3+vendors.indexOf(v))+',_KKG_V2_PAYMENTS!H$2:H)',
      '=SUMIF(_KKG_V2_PAYMENTS!B$2:B,B'+(3+vendors.indexOf(v))+',_KKG_V2_PAYMENTS!I$2:I)',
      '=COUNTIF(_KKG_V2_PAYMENTS!B$2:B,B'+(3+vendors.indexOf(v))+')'];
  });
  if (lines.length)sum.getRange(3,1,lines.length,7).setValues(lines);
  var total=3+lines.length;
  sum.getRange(total,1,1,7).setValues([['TEST TOTAL','','',
    '=SUM(D3:D'+(total-1)+')','=SUM(E3:E'+(total-1)+')',
    '=SUM(F3:F'+(total-1)+')','=SUM(G3:G'+(total-1)+')']]);
  sum.getRange(total+1,1,1,7).setValues([['LIVE BASELINE REFERENCE (DO NOT ADD)','','',
    268798,160,2400,74]]);
}
function kkgV2Reconcile_(ss) {
  var vs=kkgV2Data_(ss.getSheetByName(KKG_V2.vendors),7),
      ps=kkgV2Data_(ss.getSheetByName(KKG_V2.payments),16);
  var vendors=new Set(), names=new Set(), payments=new Set();
  vs.forEach(function(r){
    if (vendors.has(r[1]) || names.has(kkgV2Normalize_(r[2])))throw new Error('Duplicate test vendor.');
    if (r[3]!==KKG_V2.company || r[4]!==KKG_V2.project)throw new Error('Cross-project test vendor.');
    vendors.add(r[1]);names.add(kkgV2Normalize_(r[2]));
  });
  var amount=0,qr=0,discount=0;
  ps.forEach(function(r){
    if (payments.has(r[0]) || !vendors.has(r[1])) throw new Error('Duplicate ID or broken payment vendor FK.');
    if (r[2]!==KKG_V2.company || r[3]!==KKG_V2.project)throw new Error('Cross-project payment.');
    payments.add(r[0]);amount+=Number(r[6]);qr+=Number(r[7]);discount+=Number(r[8]);
  });
  var legacy=ss.getSheetByName(KKG_V2.legacy).getRange('C34:D34').getValues()[0];
  if (legacy[0]!==268798 || legacy[1]!==160)
    throw new Error('Copied legacy ledger deviated from baseline; reconcile immediately.');
  var summary=ss.getSheetByName(KKG_V2.summary).getRange(3+vs.length,4,1,4).getValues()[0];
  if (summary[0]!==amount||summary[1]!==qr||summary[2]!==discount||summary[3]!==ps.length)
    throw new Error('Derived test summary is not reconciled; no success acknowledgment.');
  return vs.length+' test vendors, '+ps.length+' test payments, NPR '+amount+' amount, '+qr+' QR; legacy copy untouched.';
}
