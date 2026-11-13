import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {resolve, join} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const read=p=>readFileSync(join(root,p),'utf8');
const catalog=JSON.parse(read('data/connected-website-sheets.v1.json'));
const html=read('memory-posters.html');
const js=read('memory-source-register.js');
const guide=read('source-sheets.html');
assert.equal(catalog.version,'V000005');
assert.equal(catalog.repository,'FabinGurung/jp-estimating-and-boq');
assert.equal(catalog.operatorPolicy.mode,'MANUAL_FIRST_NO_CRON');
assert.equal(catalog.operatorPolicy.automatedIntervalMinutes,null);
assert.equal(catalog.operatorPolicy.templateTestHarness,'NOT_BUILT');
assert.equal(catalog.records.length,6);
assert.equal(new Set(catalog.records.map(x=>x.ref)).size,6);
const feeds=catalog.records.filter(x=>x.fetchContract?.mode.startsWith('AUTHENTICATED'));
const nonFeeds=catalog.records.filter(x=>!x.fetchContract?.mode.startsWith('AUTHENTICATED'));
assert.equal(feeds.length,4);
assert.equal(nonFeeds.length,2);
const names=new Set(feeds.map(x=>x.ref));
assert.deepEqual([...names].sort(),['JP-FABIN-PAYMENTS-LIVE','RE-AMRIT-QTO-BOQ-LIVE','RE-AMRIT-RATE-LIVE','RE-KKG-FINANCE-LIVE']);
for(const x of feeds){
 assert(Array.isArray(x.fetchContract.readTabs) && x.fetchContract.readTabs.length>0);
 assert(new Set(x.fetchContract.readTabs).size===x.fetchContract.readTabs.length);
 assert(existsSync(join(root,x.fetchContract.importer)), 'Importer missing: '+x.fetchContract.importer);
 const importer=read(x.fetchContract.importer);
 for(const tab of x.fetchContract.readTabs)assert(importer.includes(tab),'Source importer missing tab '+tab);
 assert(x.fetchContract.approval && x.fetchContract.trigger);
 assert(!x.sourceSheetUrl&&!x.sourceId,'Public curation cannot embed restricted source link');
}
for(const x of nonFeeds)assert.equal(x.fetchContract.readTabs.length,0);
for(const part of ['id="google-sheets-fetched"','id="estimationSourceCount"','id="estimationSourceCards"','src="memory-source-register.js"','MANUAL-FIRST MODE','No cron / unattended interval']){
 assert(html.includes(part),'Memory Wall missing: '+part);
}
assert(html.indexOf('id="google-sheets-fetched"')<html.indexOf('id="memory-status"'));
assert(js.includes("fetch('data/connected-website-sheets.v1.json'")&&js.includes('textContent'));
assert(!js.includes('innerHTML')&&!js.includes('localStorage'));
assert(guide.includes('Six original and working Sheets')&&guide.includes('13 November 2026'));
assert(guide.includes('V000004')&&guide.includes('NPR 500'));
assert(!JSON.stringify(catalog).includes('1_MYCZ98tsfmWgTn_-jQBU9OcdrygwC9nlE9BF1gWK2k'));
assert(!JSON.stringify(catalog).includes('1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE'));
assert(!JSON.stringify(catalog).includes('1QfVM08Zvd_mv7EXcTxT9WMYPHzTAUHOTmL10ULo4oIA'));
assert(!JSON.stringify(catalog).includes('13uIoX0_urXfSEMLYRK01Pt9FWwYj5SfiLOxHhbr9HPE'));
const deploy=read('.github/workflows/deploy-research-pages.yml');
assert(deploy.includes('workflow_dispatch:'));
assert(!/^\s*schedule:/m.test(deploy),'Research Pages should not run on cron');
assert(!/^\s*schedule:/m.test(read('.github/workflows/sync-amrit-rawat-rates.yml')));
assert(read('scripts/build_fabin_finance_from_google_sheets.py').includes('"V000004"'));
const intake=read('docs/source-intake/VENDOR_BILLS_READ_FIRST_20261113.md');
assert(html.includes('id="vendor-bills-intake"'),'Vendor Bills next-stage memory anchor missing');
assert(html.includes('Vendor Bills &amp; Supplier Invoices'));
assert(intake.includes('CONSUMING_REPOSITORY = UNMAPPED'));
assert(intake.includes('NOT A FIFTH FEED'));
assert(!catalog.records.some(r=>/bill.of.vendor|Vendor Bills/i.test(r.title)),'Unverified vendor bill source must not join the six live/reference Sheet inventory');
assert(!/\/spreadsheets\/d\/[A-Za-z0-9_-]{20,}/.test(intake),'No restricted Google Sheet URL in public intake notes');
console.log('ESTIMATION MEMORY SOURCE MAP PASS: 6 source roles / 4 live importer contracts / manual-first / no exposed private Google Sheet IDs');
