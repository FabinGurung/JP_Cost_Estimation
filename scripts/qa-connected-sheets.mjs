import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const catalog=JSON.parse(read('data/connected-website-sheets.v1.json'));
const reg=JSON.parse(read('site-page-registry.v0.8.json'));
assert.equal(catalog.schema,'jp.website.connected-source-sheets.v1');
assert.equal(catalog.records.length,5);
assert.equal(new Set(catalog.records.map(r=>r.ref)).size,5);
assert(catalog.folderUrl.startsWith('https://drive.google.com/drive/folders/'));
const expected=['JP-AEC-RATE-MASTER','RE-AMRIT-RATE-LIVE','RE-AMRIT-QTO-BOQ-LIVE','JP-COSTING-MASTER-TEMPLATE','RE-KKG-FINANCE-LIVE'];
assert.deepEqual(catalog.records.map(r=>r.ref),expected);
assert.equal(catalog.folderName,'Cost Estimation — Working Google Sheets');
const readable=[
 'Construction Rate and Cost References',
 'Amrit Rawat — Site Construction Rates (Indicative)',
 'Amrit Rawat — Measurements, BOQ, Cost Summary and Bills',
 'Construction Costing — Reusable Workbook Template',
 'Krishna Kumar Gupta — Project Payment Register'
];
assert.deepEqual(catalog.records.map(r=>r.title),readable,'Human-readable Google Drive titles need to stay aligned with source custody');
assert(read('source-sheets.html').includes('id="websiteSheetEntryGuide"'),'Missing human workbook-entry instructions');
assert(read('docs/REPOSITORY_BOUNDARIES_AND_SHEET_FILLING.md').includes('The three repository ownership boundaries'));
assert.equal(catalog.records.filter(r=>r.kind==='template_only').length,1);
assert.equal(catalog.records.filter(r=>r.kind==='finance_live_source').length,1);
for(const r of catalog.records){
 assert(r.authority&&r.originalFolder&&r.doesNotImply&&r.publicationStatus);
 assert(read(r.usagePage).includes('<main')||read(r.usagePage).includes('<main '),'Source index page missing '+r.usagePage);
}
assert(!JSON.stringify(catalog).includes('private_key'));
assert(!JSON.stringify(catalog).includes('1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE'),'Private full Sheet IDs are unnecessary in public machine inventory');
assert(!JSON.stringify(catalog).includes('13uIoX0_urXfSEMLYRK01Pt9FWwYj5SfiLOxHhbr9HPE'),'Do not echo client rate Sheet ID into public machine inventory');
assert(reg.pages.length===71);
assert(reg.pages.find(p=>p.id==='SY-04')?.path==='source-sheets.html');
assert(reg.dataAssets.some(a=>a.id==='DATA-SY-CONNECTED-SHEETS'));
const page=read('source-sheets.html');
assert(page.includes(catalog.folderUrl));
assert(page.includes('name="viewport"'));
assert(page.includes('site-navigation-v0.8.js'));
assert(page.includes('not</strong> proof')||page.includes('does not configure authentication'));
assert(read('governance.html').includes('source-sheets.html'));
assert(read('index.html').includes('source-sheets.html'));
console.log('CONNECTED WEBSITE SHEETS PASS: single folder, 5 roles, no public raw client Sheet IDs, 71 registered pages; actual Drive membership separately provider-verified.');
