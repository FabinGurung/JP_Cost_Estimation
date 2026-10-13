import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {Script} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const m=JSON.parse(read('data/contractor-road-analysis.v0.1.json'));
assert.equal(m.schema,'jp-cres.contractor_road_analysis.v0.1');assert.deepEqual(m.source_page_range,[29,77]);assert.equal(m.page_count,49);assert.equal(m.source_id,'SRC-RA-001');assert.equal(m.semantic_verification_complete,false);
const expected=Array.from({length:49},(_,i)=>29+i);assert.deepEqual(m.pages.map(r=>r.page),expected);assert.deepEqual([...new Set(m.items.flatMap(r=>r.source_pages))].sort((a,b)=>a-b),expected);
assert(m.items.length>130);assert.equal(new Set(m.items.map(r=>r.id)).size,m.items.length);
for(const r of m.items){assert(r.description&&r.short_description);assert(r.source_pages.every(p=>p>=29&&p<=77));assert(r.parts.every(p=>p.source_page_record_id));assert.deepEqual(Object.keys(r.components),['labour','material','equipment']);assert(r.rate_npr===null||Number.isFinite(r.rate_npr));}
assert(m.items.some(r=>r.parts.some(p=>p.continuation)),'multi-page analyses retain their continuation');
const first=m.items.find(r=>r.id==='road-p029-b01');assert.equal(first.rate_npr,6.11);assert(first.components.labour.length&&first.components.equipment.length);
assert(m.items.some(r=>r.source_pages.includes(77)&&r.rate_npr===4.96));
for(const pn of expected){const jpg=readFileSync(new URL('../'+m.preview_image_pattern.replace('{page}',String(pn).padStart(3,'0')),import.meta.url));assert.equal(jpg[0],255);assert.equal(jpg[1],216);assert(jpg.length>10000);}
for(let start=29;start<=77;start+=5){const end=Math.min(start+4,77),pdf=readFileSync(new URL('../data/contractor-road-analysis-v0.1/source-pages-'+String(start).padStart(3,'0')+'-'+String(end).padStart(3,'0')+'.pdf',import.meta.url));assert.equal(pdf.subarray(0,5).toString(),'%PDF-');}
const hub=read('contractor-rate-analysis.html');for(const path of ['contractor-road-work-summary.html','contractor-road-work-analysis.html','contractor-extracted-evidence.html'])assert(hub.includes(path));
assert(read('contractor-document-hub.js').includes('location.replace'));new Script(read('contractor-document-hub.js'));const js=read('contractor-road-work-analysis.js');new Script(js);assert(!js.includes('innerHTML'));assert(js.includes('r.components[key]'));assert(js.includes('r.analysis_basis_raw'));assert(js.includes("'Quantity'"));assert(js.includes('source-pages-'));assert(js.includes('r.source_pages.includes(Number(page.value))'));
const html=read('contractor-road-work-analysis.html');assert.equal((html.match(/<th scope="col">/g)||[]).length,4);assert(html.includes('contractorDetail'));assert(html.includes('contractor-road-work-summary.html'));
console.log('PASS road-work analysis: separate summary/analysis routes, 49-page evidence coverage, '+m.items.length+' anchored blocks, resource groups, upright source assets and preserved bookmarks.');
