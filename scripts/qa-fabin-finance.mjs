import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join,resolve} from 'node:path';

const ROOT=resolve(import.meta.dirname,'..');
const text=p=>readFileSync(join(ROOT,p),'utf8');
const html=text('finance.html');
const sources=text('source-sheets.html');
const script=text('finance-fabin-v1.js');
const style=text('finance-fabin-v1.css');
const importer=text('scripts/build_fabin_finance_from_google_sheets.py');

for(const k of ['id="fabinPublicDashboard"','id="fabinProjectRows"',
  'id="fabinReadStatus"','id="fabinLiveContent"',
  'id="fabinProjectRows"','id="fabinSourceNote"',
  'src="finance-fabin-v1.js"','href="finance-fabin-v1.css"'])assert(html.includes(k),'Missing Fabin frontend '+k);
assert(sources.includes('id="fabinPaymentCandidate"'));
assert(sources.includes('finance.html#fabin-finance-review'));
assert(script.includes("fetch('fabin-payments-public.json'")&&script.includes('NOT_VERIFIED'));
assert(script.includes('textContent')&&!script.includes('innerHTML'),'Finance must use safe DOM text rendering');
assert(importer.includes('spreadsheets.readonly')&&importer.includes('SOURCE_ONLY_NOT_APPROVED'));
assert(importer.includes('"V000003", "V000004"')&&importer.includes('Normalized_Event_Version'),'Importer must accept controlled Fabin V000004 while retaining V000001 source events');
assert(importer.includes('NORMALIZED_EVENT_COVERAGE_INCOMPLETE')&&importer.includes('expected_source_rows'),'New original payment entries must not bypass normalization');
assert(importer.includes('EVENT_PARTY_OR_PROJECT_MISMATCH'),'Party and project lineage must match');
const rawId='1_MYCZ98tsfmWgTn_-jQBU9OcdrygwC9nlE9BF1gWK2k';
assert(importer.includes(rawId),'Private importer must read existing original Sheet ID');
assert(![html,sources,script,style].some(x=>x.includes(rawId)),
  'Private Fabin workbook ID must not leak through public HTML/JS/CSS');
assert(style.includes('overflow-x:auto'),'Wide financial tables must scroll independently');
assert(!script.includes('vendor')&&!script.includes('payments['),
  'No party/vendor or payment-level rendering for unverified source');

const i=process.argv.indexOf('--staged');
if(i>=0){
  const site=resolve(process.argv[i+1] || '_site');
  const fp=join(site,'fabin-payments-public.json');
  assert(existsSync(fp),'Authenticated Pages did not stage Fabin financial projection');
  const contents=readFileSync(fp,'utf8');
  assert(!contents.includes(rawId),'Private Sheet ID in public projection');
  const a=JSON.parse(contents);
  assert.equal(a.schema,'jp.fabin-payments.source-aggregate.v1');
  assert.equal(a.publicationStatus,'SOURCE_REPORTED_NOT_VERIFIED');
  assert.equal(a.amountMeaning,'SOURCE_REPORTED_NOT_CERTIFIED_PAID');
  assert.equal(a.authenticatedSourceFetch,true);
  assert.equal(a.sourceProjectCount,5);
  assert.equal(a.projects.length,5);
  assert.equal(a.privacy.publishedIndividualTransactions,0);
  assert.equal(a.privacy.publishedPartyNames,0);
  assert.equal(a.privacy.publishedRawSourceUrls,0);
  assert.equal(a.privacy.officialProjectIdentityVerified,false);
  assert(a.sourceEventCount>100&&a.sourcePartySectionCount>40);
  assert(a.reviewQueueIssueCount>0);
  assert(!Object.hasOwn(a,'payments')&&!Object.hasOwn(a,'vendors'));
  assert(!a.projects.some(p=>p.approval!=='NOT_VERIFIED'||'transactions' in p ||
    'vendor' in p||'sourceSheetId' in p||'sourceUrl' in p));
  assert(Math.abs(a.projects.reduce((v,p)=>v+p.sourceAmountNpr,0)-a.sourceDeclaredGrandTotalNpr)<.01);
  assert(Math.abs(a.normalizedEventsGrandTotalNpr-a.sourceDeclaredGrandTotalNpr-a.reconciliationDifferenceNpr)<.01);
  if(a.sourceVersion==='V000004'){
    assert.equal(a.reconciliationDifferenceNpr,0,'The controlled Pabitra top-summary link must reconcile the original Hari discrepancy');
    assert(a.projects.every(p=>p.reconciliation==='ARITHMETIC_MATCH_ONLY'),'All five displayed source summaries should be arithmetically aligned');
  }else{
    assert(a.projects.some(p=>p.reconciliation==='SOURCE_TOTAL_CONFLICT'),'Preserve historic source exception tests');
  }
  assert(a.exclusions.some(e=>e.includes('Basketball')));
  console.log('FABIN LIVE STAGED QA PASS: authenticated normalized source; 5 unverified project aggregates; no raw rows/party names/private source IDs');
}else{
  console.log('FABIN STATIC QA PASS: privacy gates, graceful UI, separate KKG custody and source-labelled publication');
}
