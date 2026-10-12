#!/usr/bin/env node
// Offline, synthetic-only tests. No Google credentials, network, or real financial data.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const js=readFileSync(new URL('./kkg_v2_entry_test_v0.6.0.js',import.meta.url),'utf8');
const ctx=vm.createContext({
  Utilities:{getUuid:()=> '11111111-2222-4333-8444-555555555555'},
  SpreadsheetApp:{getUi:()=>({createMenu:()=>{throw Error('not used')}})},
  Set, Date, Number
});
vm.runInContext(js,ctx,{filename:'kkg_v2_entry_test_v0.6.0.js'});
const failures=(fn,re)=>assert.throws(fn,re);
assert.equal(ctx.KKG_V2.company,'REB');
assert.equal(ctx.KKG_V2.project,'14_bishal_paija');
assert.equal(ctx.KKG_V2.legacy,'14_bishal_paija');
assert.equal(ctx.kkgV2Normalize_('   SAMPLE    Vendor  '),'sample vendor');
assert.equal(ctx.kkgV2ValidateMoney_(100,true,'Amount'),100);
assert.equal(ctx.kkgV2ValidateMoney_('5',false,'QR'),5);
assert.equal(ctx.kkgV2ValidateMoney_('',false,'Discount'),0);
failures(()=>ctx.kkgV2ValidateMoney_('',true,'Amount'),/required/);
failures(()=>ctx.kkgV2ValidateMoney_(-1,true,'Amount'),/nonnegative/);
failures(()=>ctx.kkgV2ValidateMoney_('banana',true,'Amount'),/nonnegative/);
failures(()=>ctx.kkgV2ValidateMoney_(1.234,true,'Amount'),/two decimals/);
assert.equal(ctx.kkgV2ValidateDate_('2026-10-12'),'2026-10-12');
failures(()=>ctx.kkgV2ValidateDate_('2026-02-30'),/Invalid payment date/);
failures(()=>ctx.kkgV2ValidateDate_('2083_01_17'),/YYYY-MM-DD/);
assert.equal(ctx.kkgV2ValidateTime_('14:10'),'14:10');
failures(()=>ctx.kkgV2ValidateTime_('25:99'),/HH:MM/);
const generated=ctx.kkgV2UniqueId_(new Set(),'KKG-TX-');
assert.match(generated,/^KKG-TX-[A-F0-9]{20}$/);
failures(()=>ctx.kkgV2UniqueId_(new Set([generated]),'KKG-TX-'),/Failed to allocate/);
const config=[
['MODE','TEST_ONLY'],['COMPANY_ID','REB'],['PROJECT_ID','14_bishal_paija'],
['BOUND_SPREADSHEET_ID','test-sheet-id'],['ORIGINAL_LEDGER_TAB','14_bishal_paija'],
['LEGACY_VENDOR_MAX_AT_SEED','27'],['INSTALLATION_STATUS','NOT_INSTALLED'],
['READ_ONLY_LIVE','TRUE'],['ROLE','TEST_COPY_NO_PRODUCTION_WRITES'],
['CONTROL_VERSION','KKG_V2_0.6.0_TEST'],['ORIGIN','test'],['','']
];
const makeSheet=(mode,ssId)=>({
 getId:()=>ssId,getSheetByName:n=>{
   if(n==='_KKG_V2_CONTROL')return {getRange:()=>({getDisplayValues:()=>config.map(([a,b])=>[a,a==='MODE'?mode:b])})};
   return {getName:()=>n};
 }
});
assert.equal(ctx.kkgV2Context_(makeSheet('TEST_ONLY','test-sheet-id')).MODE,'TEST_ONLY');
failures(()=>ctx.kkgV2Context_(makeSheet('LIVE','test-sheet-id')),/Test-only guard failed/);
failures(()=>ctx.kkgV2Context_(makeSheet('TEST_ONLY','production-id')),/Test-only guard failed/);
assert(!js.includes('SpreadsheetApp.openById('),'No general cross-workbook writes');
assert(!js.includes('UrlFetchApp'),'No external finance transmission');
assert(!js.includes('1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE'),'No live spreadsheet ID in public script');
for (const name of ['KKG_V2_Test_Vendors','KKG_V2_Test_Payments','KKG_V2_Test_Audit'])
 assert(js.includes(name),'Native test-table update missing: '+name);
console.log('PASS KKG v0.6.0 synthetic validation, unique ID, company/project and test-only authorization checks.');
