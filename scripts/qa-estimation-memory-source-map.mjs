import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {resolve, join} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const read=p=>readFileSync(join(root,p),'utf8');
const catalog=JSON.parse(read('data/connected-website-sheets.v1.json'));
const html=read('memory-posters.html');
const js=read('memory-source-register.js');
const guide=read('source-sheets.html');
const status=JSON.parse(read('data/vendor-bills-status.v1.json'));

assert.equal(catalog.schema,'jp.website.connected-source-sheets.v1');
assert.equal(catalog.version,'V000006');
assert.equal(catalog.repository,'FabinGurung/jp-estimating-and-boq');
assert.equal(catalog.operatorPolicy.mode,'MANUAL_FIRST_NO_CRON');
assert.equal(catalog.operatorPolicy.automatedIntervalMinutes,null);
assert.equal(catalog.operatorPolicy.templateTestHarness,'NOT_BUILT');
assert.equal(catalog.records.length,7);
assert.equal(new Set(catalog.records.map(x=>x.ref)).size,7);

const feeds=catalog.records.filter(x=>x.fetchContract?.mode.startsWith('AUTHENTICATED'));
const optional=catalog.records.filter(x=>x.fetchContract?.mode.startsWith('OPTIONAL_'));
const reference=catalog.records.filter(x=>['REFERENCE_ONLY','TEMPLATE_ONLY_NO_FETCH'].includes(x.fetchContract?.mode));
assert.equal(feeds.length,4);
assert.equal(optional.length,1);
assert.equal(reference.length,2);
assert.deepEqual(feeds.map(x=>x.ref).sort(),['JP-FABIN-PAYMENTS-LIVE','RE-AMRIT-QTO-BOQ-LIVE','RE-AMRIT-RATE-LIVE','RE-KKG-FINANCE-LIVE']);
const vendor=optional[0];
assert.equal(vendor.ref,'JP-VENDOR-BILLS-LIVE');
assert.equal(vendor.controlVersion,'V000004');
assert.equal(vendor.normalizedDataVersion,'V000001');
assert.equal(vendor.liveTabCount,46);
assert.equal(vendor.originalSourceTabs,35);
assert(vendor.publicationStatus.includes('VERIFIED_SNAPSHOT V000004'));
assert(vendor.publicationStatus.includes('NOT A CONFIRMED LIVE AUTHENTICATED READ'));
assert.equal(vendor.fetchContract.mode,'OPTIONAL_AUTHENTICATED_ON_MANUAL_DISPATCH');
assert.equal(vendor.fetchContract.readTabs.length,6);
assert.equal(vendor.fetchContract.output,'data/vendor-bills-status.v1.json');
for(const x of [...feeds,...optional]){
 assert(Array.isArray(x.fetchContract.readTabs) && x.fetchContract.readTabs.length>0);
 assert(new Set(x.fetchContract.readTabs).size===x.fetchContract.readTabs.length);
 assert(existsSync(join(root,x.fetchContract.importer)), 'Missing source adapter: '+x.fetchContract.importer);
 const source=read(x.fetchContract.importer);
 for(const tab of x.fetchContract.readTabs)assert(source.includes(tab),'Source importer missing tab: '+x.ref+' / '+tab);
 assert(x.fetchContract.approval && x.fetchContract.trigger);
 assert(!x.sourceSheetUrl && !x.sourceId,'Public inventory must not contain restricted Sheet links');
}
for(const x of reference)assert.equal(x.fetchContract.readTabs.length,0);

for(const part of ['id="google-sheets-fetched"','id="estimationSourceCount"','id="estimationSourceCards"','src="memory-source-register.js"','MANUAL-FIRST MODE','No cron / unattended interval','V000004 human-first QA','30 original supplier tabs']){
 assert(html.includes(part),'Memory Wall missing '+part);
}
assert(html.indexOf('id="google-sheets-fetched"')<html.indexOf('id="vendor-bills-intake"'));
assert(js.includes("fetch('data/connected-website-sheets.v1.json'"));
assert(js.includes('data.records.length!==7')&&js.includes('OPTIONAL_'));
assert(!js.includes('innerHTML')&&!js.includes('localStorage'));
assert(guide.includes('Seven original and working Sheets')&&guide.includes('14 November 2026'));
assert(guide.includes('Vendor Bills — Working Register — LIVE'));
assert(guide.includes('V000004') && guide.includes('NPR 500'));

const privateIds=['1eLxWq8eKgod6i98uxrRqF-xJA85HLScWBPNj0ztUgz4','1R6GoESJmuJ6hFtAc69J8c2gnjgJfxWStjQ1tgeO8i3E',
 '1_MYCZ98tsfmWgTn_-jQBU9OcdrygwC9nlE9BF1gWK2k','1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE',
 '1QfVM08Zvd_mv7EXcTxT9WMYPHzTAUHOTmL10ULo4oIA','13uIoX0_urXfSEMLYRK01Pt9FWwYj5SfiLOxHhbr9HPE'];
for(const privateId of privateIds){
 assert(!JSON.stringify(catalog).includes(privateId),'Private file ID leaked to source inventory');
 assert(!html.includes(privateId),'Private ID leaked to Memory Wall');
 assert(!guide.includes(privateId),'Private ID leaked to public directory');
}
const intake=read('docs/source-intake/VENDOR_BILLS_READ_FIRST_20261113.md');
const current=read('docs/source-intake/VENDOR_BILLS_REVIEW_V000004.md');
assert(intake.includes('CONSUMING_REPOSITORY = UNMAPPED'),'Historical intake file changed');
assert(current.includes('V000004')&&current.includes('509')&&current.includes('35/35'));
assert(current.includes('VERIFIED_SNAPSHOT V000004'));
assert(!/\/spreadsheets\/d\/[A-Za-z0-9_-]{20,}/.test(current),'Private direct Sheet link leaked in new readme');
assert.equal(status.schema,'jp.vendor-bills-status.v1');
assert.equal(status.revision,'V000004');
assert.equal(status.sourceMode,'VERIFIED_SNAPSHOT');
assert.equal(status.sourceTabs,35);
assert.equal(status.sourceRows,1895);
assert.equal(status.billRows,259);
assert.equal(status.detailRows,930);
assert.equal(status.comparisonRows,46);
assert.equal(status.reviewFlags,509);

const deploy=read('.github/workflows/deploy-research-pages.yml');
assert(deploy.includes('workflow_dispatch:'));
assert(!/^\s*schedule:/m.test(deploy),'Research Pages must not run on cron');
assert(!/^\s*schedule:/m.test(read('.github/workflows/sync-amrit-rawat-rates.yml')));
assert(deploy.includes('JP_VENDOR_BILLS_SHEET_ID')&&deploy.includes("github.event_name == 'workflow_dispatch'"));
assert(read('scripts/build_fabin_finance_from_google_sheets.py').includes('"V000004"'));
console.log('ESTIMATION SOURCE MEMORY PASS: 7 owner Sheets / 4 established fetches / 1 optional manual Vendor Bills / 2 reference; V000004 checked snapshot; no private IDs or cron');
