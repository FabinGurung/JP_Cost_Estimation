import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const manifest=JSON.parse(read('site-page-registry.v0.8.json'));
const page=manifest.pages.find(p=>p.id==='FN-01');
const dashboard=manifest.pages.find(p=>p.id==='FN-02');
assert.equal(dashboard.parent,'FN-01');
assert.equal(dashboard.navigation,'secondary');
assert.deepEqual(manifest.navigation.more,['RF-01','SY-02','MP-01','FN-03']);
for(const id of ['finance-sources','worker-records','site-capture','sheet-viewer']){
  assert(read('finance.html').includes('id="'+id+'"'),'Missing Finance panel '+id);
  assert(page.sections.some(s=>s.domId===id),'Missing registry entry '+id);
}
const nav=read('site-navigation-v0.8.js');
const more=nav.split('const extras=[')[1].split('];')[0];
assert(!more.includes('finance-dashboard.html'),'Dashboard must be a Finance child, not in More');
for(const href of ['finance.html','finance-dashboard.html','finance.html#finance-sources','field-expense-guide.html'])assert(nav.includes("'"+href+"'"),'Missing Finance child tab '+href);
for(const name of ['finance.html','finance-dashboard.html','field-expense-guide.html']){
  assert(read(name).includes('finance-panels-v0.9.css'),name+' missing Finance child styling');
}
const script=read('finance-source-panels-v0.9.js');
assert(script.includes('length:21'),'All 21 original worker codes must be generated');
for(const code of ['FN-S01','FN-S02','FN-S03','W01-V2','FN-C01','FN-C02'])assert(script.includes("'"+code+"'"),'Missing source code '+code);
assert(script.includes('docs.google.com')&&script.includes("url.hostname!=='docs.google.com'"),'Preview must restrict to Google Sheets');
assert(script.includes('frame.src=')&&script.includes('about:blank'),'Preview must be cleared on request');
const html=read('finance.html');
assert(html.includes('FN-C03'),'Capture form must remain separate from Sheets');
assert(html.includes('Only the previously approved Krishna Kumar Gupta source link'),'Privacy boundary missing');
assert(html.includes('id="financeSheetIframe"'),'Missing optional Sheet preview');
const approved='1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE';
assert(html.includes(approved),'Approved register link missing from Finance page');
assert(read('finance-register-header-v1.0.js').includes('1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE'),'Native source ID missing');
const publicLinks=(script+'\n'+html).match(/https:\/\/docs\.google\.com\/spreadsheets\/d\/[A-Za-z0-9_-]{20,}/g)||[];
assert(publicLinks.length>=1,'Expected approved source link');
for(const link of publicLinks)assert(link.endsWith(approved),'Only the approved payment register may have a stored workbook URL');
console.log('FINANCE PANELS PASS: Finance child dashboard, 27 Sheet codes, optional protected previews, no restricted source URLs');
