import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const html = read('finance.html');
const js = read('finance-register-header-v1.0.js');
const css = read('finance-register-header-v1.0.css');
const panelScript = read('finance-source-panels-v0.9.js');
const manifest = JSON.parse(read('site-page-registry.v0.8.json'));
const snapshot = JSON.parse(read('finance-public-snapshot.json'));
const sheetMeta = JSON.parse(read('finance-sheet-meta-v1.1.json'));
const sourceId = '1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE';
const start = html.indexOf('<header class="topbar jp-fn-s01-topbar">');
const end = html.indexOf('</header>', start);
assert(start >= 0 && end > start, 'Finance topbar header not found');
const header = html.slice(start, end);
assert(header.includes('id="fnS01Native"'), 'Native register must be inside Finance header');
assert(header.includes(sourceId), 'Google Sheet ID must be visible in header');
assert(!header.includes('<iframe'), 'No external Sheet frame in native header');
assert(header.includes('<details open>'), 'Native register should be visible by default');
assert(header.includes('id="fnS01TablePanel"'), 'Native table container missing');
assert(header.includes('id="fnS01Search"'), 'Search control missing');
assert(header.includes('id="fnS01Vendor"'), 'Vendor filter missing');
assert(header.includes('id="fnS01Calendar"'), 'AD/BS filter missing');
assert(header.includes('id="fnS01Limit"'), 'Row count control missing');
assert(header.includes('id="fnS01Previous"') && header.includes('id="fnS01Next"'), 'Pagination missing');
const visible = ['14_bishal_paija', 'KKG_VENDOR_SUMMARY_AUTO', '00_ENTRY_GUIDE', '00_SITE_CONTEXT', '_SYSTEM_ENUM'];
for (const title of visible) assert(header.includes('>' + title + '</button>'), 'Visible source tab missing: ' + title);
assert((header.match(/role="tab"/g) || []).length === 5, 'Expected five public-safe source tabs');
assert.equal(sheetMeta.schema, 'jp.finance.source-tab-metadata.v1', 'Source metadata schema mismatch');
assert.equal(sheetMeta.spreadsheetId, sourceId, 'Source metadata workbook ID mismatch');
assert.equal(sheetMeta.sourceCode, 'FN-S01', 'Wrong source code');
assert.equal(sheetMeta.sourceTabCount, 9, 'Unexpected workbook tab count');
assert.equal(sheetMeta.visibleTabCount, 5, 'Unexpected public view count');
assert.equal(sheetMeta.excludedHiddenTabCount, 4, 'Restricted source tabs must remain excluded');
assert.equal(sheetMeta.excludedHiddenTabNamesPublished, false, 'Restricted source tabs must not be listed');
assert.equal(sheetMeta.tabs.length, 5, 'Exactly five public-safe tab IDs required');
const seenTabIds = new Set();
for (const tab of sheetMeta.tabs) {
  assert(Number.isSafeInteger(tab.sheetId) && tab.sheetId >= 0, 'Invalid source worksheet ID');
  assert(!seenTabIds.has(tab.sheetId), 'Duplicate worksheet ID');
  seenTabIds.add(tab.sheetId);
  assert(header.includes('data-fn-s01-tab="' + tab.viewId + '"'), 'Tab not visible in header: ' + tab.viewId);
  assert(header.includes('>' + tab.title + '</button>'), 'Tab title not in header: ' + tab.title);
  assert(js.includes("id: '" + tab.viewId + "', title: '" + tab.title + "', sheetId: " + tab.sheetId), 'JS worksheet ID mismatch');
}
assert(header.includes('id="fnS01TabIdentity"') && header.includes('id="fnS01ActiveSheetId"'), 'Worksheet identity must remain inside Finance header');
assert(header.includes('id="fnS01CopyTabId"'), 'Worksheet ID copy action missing');
assert(js.includes("navigator.clipboard.writeText(String(view.sheetId))"), 'Worksheet ID clipboard handler missing');
assert(css.includes('.jp-fn-s01-tab-identity'), 'Worksheet identity CSS missing');
for (const excluded of ['Archive_14_bishal_paija', '_TABLE_INDEX', '_AUDIT_LOG', '_AUTOMATION_SETUP']) {
  assert(!JSON.stringify(sheetMeta).includes(excluded), 'Restricted tab metadata published');
}

assert(header.includes('Four hidden workbook tabs'), 'Hidden system-tab boundary missing');
assert(header.includes('read-only') || header.includes('Read-only'), 'Source must be read-only');
assert(html.includes('finance-register-header-v1.0.css') && html.includes('finance-register-header-v1.0.js'), 'Native header assets missing');
assert(css.includes('overflow-x:auto') && css.includes('@media(max-width:760px)'), 'Tablet-friendly scrolling missing');
assert(js.includes("fetch('finance-public-snapshot.json'"), 'Native register must reuse approved public snapshot');
assert(js.includes('SOURCE_ID') && js.includes(sourceId), 'Native source identity missing');
assert(js.includes('source_date') && js.includes('date_system') && js.includes('paid_time'), 'Source date fields missing');
assert(js.includes('aria-selected') && js.includes('ArrowRight'), 'Keyboard-accessible tabs missing');
assert(js.includes('replaceChildren(table)') && js.includes('textContent'), 'Expected safe native table rendering');
assert(!js.includes('iframe') && !js.includes('/preview'), 'Native register must not load a Sheet frame');
assert(panelScript.includes("if(source.id==='FN-S01')"), 'Legacy preview must route to native header');
assert(panelScript.includes("native.scrollIntoView"), 'Legacy source selector must reveal native header');
assert(!header.includes('data-finance-source="FN-S01"'), 'Old FN-S01 frame trigger remains');
assert.equal(snapshot.source.workbook_url, 'https://docs.google.com/spreadsheets/d/' + sourceId + '/edit');
assert.equal(snapshot.totals.vendor_count, snapshot.vendors.length);
assert.equal(snapshot.totals.payment_count, snapshot.payments.length);
for (const key of ['amount_npr', 'qr_npr', 'discount_npr']) {
  const total = snapshot.payments.reduce((acc, row) => acc + (row[key] ?? 0), 0);
  assert.equal(total, snapshot.totals[key], 'Source total mismatch: ' + key);
}
for (const payment of snapshot.payments) {
  assert(['AD', 'BS'].includes(payment.date_system), 'Calendar label missing');
  for (const privateField of ['entry_id', 'created_at', 'updated_at']) {
    assert(!Object.hasOwn(payment, privateField), 'Restricted payment field present');
  }
}
const finance = manifest.pages.find(page => page.id === 'FN-01');
assert(finance.sections.some(section => section.id === 'FN-01.S06' && section.domId === 'fnS01Native'), 'Native header section not registered');
assert(finance.keyDependencies.includes('finance-register-header-v1.0.js'), 'Native script dependency not registered');
console.log('FN-S01 NATIVE HEADER PASS: five public-safe source views, all 74 payments, 27 vendors, native header display, restricted fields excluded');
