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
assert(!script.includes('length:21')&&!script.includes('W01-V2'),'Worker records must not be generated inside Finance');
for(const code of ['FN-S01','FN-S03'])assert(script.includes("'"+code+"'"),'Missing Finance source code '+code);
for(const code of ['FN-S02','FN-C01','FN-C02'])assert(!script.includes("'"+code+"'"),'Field operations must not be finance inputs '+code);
assert(read('finance.html').includes('JP_Field_and_Desk_Resource_Library'),'Finance missing source owner handoff');
assert(read('finance.html').includes('JP_Communication-Command-Centre-and-Resource-Hub'),'Finance missing progress owner handoff');
assert(script.includes('docs.google.com')&&script.includes("url.hostname!=='docs.google.com'"),'Preview must restrict to Google Sheets');
assert(script.includes('frame.src=')&&script.includes('about:blank'),'Preview must be cleared on request');
const html=read('finance.html');
const toc=html.match(/<nav class="finance-local-toc"[\s\S]*?<\/nav>/)?.[0];
assert(toc && html.includes('finance-local-toc-v1.css'), 'Missing level-one Finance TOC or stylesheet');
const tocLinks=[...toc.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]);
assert.equal(tocLinks.length,12,'Finance TOC must navigate all twelve visible sections');
assert.equal(new Set(tocLinks).size,tocLinks.length,'Finance TOC anchor duplication');
for(const id of tocLinks)assert(html.includes('id="'+id+'"'),'Broken TOC link to '+id);
const css=read('finance-local-toc-v1.css');
assert(css.includes('grid-template-columns')&&css.includes('@media(max-width:820px)')&&css.includes('focus-visible'),'Finance TOC lacks responsive/accessibility styling');

assert(!html.includes('FN-C03'),'Field capture codes must not appear as Finance source selectors');
assert(html.includes('Only the previously approved Krishna Kumar Gupta source link'),'Privacy boundary missing');
assert(html.includes('id="financeSheetIframe"'),'Missing optional Sheet preview');
const approved='1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE';
assert(html.includes(approved),'Approved register link missing from Finance page');
assert(read('finance-register-header-v1.0.js').includes('1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE'),'Native source ID missing');
const publicLinks=(script+'\n'+html).match(/https:\/\/docs\.google\.com\/spreadsheets\/d\/[A-Za-z0-9_-]{20,}/g)||[];
assert(publicLinks.length>=1,'Expected approved source link');
for(const link of publicLinks)assert(link.endsWith(approved),'Only the approved payment register may have a stored workbook URL');
console.log('FINANCE PANELS PASS: payment-ledger-only source options, field/worker custody handoff, protected previews and no restricted source URLs');
