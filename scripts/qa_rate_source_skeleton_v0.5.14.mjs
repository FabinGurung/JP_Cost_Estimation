#!/usr/bin/env node
/* JP Cost v0.5.14 public-safe source-catalog skeleton contract. */
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const data=JSON.parse(read('data/rate-source-public-skeleton.v0.5.14.json'));
assert.equal(data.schema,'jp-cres.rate_source_public_skeleton.v0.5.14');
assert.equal(data.rate_observation_count,0,'skeleton never claims verified rates');
assert.equal(data.extraction_complete,false,'no full source extraction claim');
assert.equal(data.source_root_inventory_count,5);
assert.equal(data.extra_source_count,1);
assert.equal(data.groups.length,4,'four peer rate families');
assert.equal(data.sources.length,6,'six source docs');
assert.deepEqual(Object.fromEntries(data.groups.map(g=>[g.id,g.entries.length])),{'personal':0,'government':1,'vendors':2,'rate-analysis':3});
const ids=data.sources.map(s=>s.id);
assert.equal(new Set(ids).size,6,'stable unique projection source keys');
const sensitive=/(?:drive\.google\.com\/file\/d\/|docs\.google\.com\/document\/d\/|1RDinUWvdJXICsGUP8CDVDausf-jk_97X|1oxCgYelo5KovqafqBPoG495M2yznklQi|1BEF0VdCzw42annGHgp2ejKYhGmcHdQKP)/;
assert(!sensitive.test(read('data/rate-source-public-skeleton.v0.5.14.json')),'no private source Drive IDs published');
const routes={
'personal':'rate-library.html','government':'government-rates.html',
'vendors':'vendor-price-lists.html','rate-analysis':'rate-analysis-references.html'
};
for(const [id,path] of Object.entries(routes))assert.equal(data.groups.find(g=>g.id===id).href,path);
const docs={
'SRC-GOV-001':'kaski-district-rates.html','SRC-VEN-001':'pipes-price-list.html',
'SRC-VEN-002':'electrical-wire-quotation.html',
'SRC-RA-001':'contractor-rate-analysis.html',
'SRC-RA-002':'users-rate-analysis.html','SRC-RA-003':'dudbc-rate-analysis.html'
};
for(const [id,path] of Object.entries(docs)){
const html=read(path);
assert(html.includes('data-source-document="'+id+'"'),path+' source ID');
assert(html.includes('sourcePreviewRows'),path+' blank table');
assert(html.includes('rate-source-skeleton.js'),path+' loader');
assert(!html.includes('href="https://drive.google.com'),path+' does not expose private links');
}
assert(read('rate-sources.html').includes('data-source-collection="hub"'));
for(const id of ['government','vendors','rate-analysis']){
const html=read(routes[id]);assert(html.includes('data-source-collection="'+id+'"'));
}
const home=read('index.html');
for(const id of ['rate-library.html','government-rates.html','vendor-price-lists.html','rate-analysis-references.html']){
assert(home.includes('href="'+id+'"'),'all rate families shown at equal level');
}
assert(home.includes('href="rate-sources.html"'),'source hub accessible');
assert(read('rate-library.html').includes('href="rate-sources.html"'),'personal library linked to peer hub');
assert(read('rate-library.html').includes('id="mepTradeTabs"'),'existing MEP intact');
assert(read('rate-intelligence.css').includes('v0.5.14'),'responsive site grid updated');
assert(data.sources.find(s=>s.id==='SRC-VEN-002').kind==='vendor_pending_sales_quotation','pending quotation is not approved catalogue');
assert(data.sources.find(s=>s.id==='SRC-RA-003').group==='rate-analysis','DUDBC separate original is not misfiled under Kaski or private source root');
assert(data.sources.every(s=>s.verified_observations===null&&s.verified_pages===null),'no invented PDF page counts or observations');
const original=JSON.parse(read('data/historical-work-rates-v0.5.3.json'));
assert.equal(original.items.length,204,'JP personal source unchanged');
for(const src of ['schemas/source-evidence.v0.1.schema.json','schemas/rate-observation.v0.1.schema.json']){
 const j=JSON.parse(read(src));assert(j['$schema'].includes('2020-12'));assert(j.properties.source_id);
}
console.log('PASS v0.5.14: four independent peer libraries, six source skeletons, no invented rate rows or private Drive IDs, existing 204 JP rates/MEP retained.');
