import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {Script} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const m=JSON.parse(read('data/contractor-work-items.v0.1.json'));
assert.equal(m.source_id,'SRC-RA-001');assert.equal(m.frozen_baseline_commit,'80a3650e8de3be1488b742f79246620543d2cffc');assert.equal(m.semantic_verification_complete,false);
assert.equal(m.items.length,158);assert.equal(new Set(m.items.map(r=>r.id)).size,158);
const row=sn=>m.items.find(r=>r.serial_no===sn);
assert.deepEqual(['1','2','3','4','5','6'].map(sn=>row(sn).rate_npr),[6.11,6.4,472.48,8.12,8.51,880.8]);
assert.deepEqual(['132','133','134'].map(sn=>row(sn).rate_npr),[2625.68,946.16,4.96]);
assert.equal(row('1').specification_clause_no,'201');assert.equal(row('1').unit,'Sqm');assert.equal(row('23d').norm_no,null);
assert.equal(row('22a').rate_npr,4291.69);assert(row('22a').description.includes('300 mm'));assert(row('22a').parent);
assert.equal(row('106b').specification_clause_no,'1501');assert(row('106b').description.includes('60 cm circular'));
assert.equal(m.items.filter(r=>r.serial_no==='131').length,4);assert(m.items.filter(r=>r.source_page===27&&r.serial_no==='131').every(r=>r.parent.page===25));
for(const r of m.items){assert(m.summary_pages.includes(r.source_page));assert(r.source_page_record_id);assert(r.description);assert(r.rate_npr===null||(Number.isFinite(r.rate_npr)&&r.rate_npr>0));assert.equal(r.review_status,'PROVISIONAL_SOURCE_READING');assert(r.raw_fields&&r.row_bbox_deskewed_px.length===4);}
assert(m.items.some(r=>r.rate_npr===null),'unresolved rates stay null');
for(const pn of m.summary_pages){assert(statSync(new URL('../'+m.page_image_pattern.replace('{page}',String(pn).padStart(3,'0')),import.meta.url)).size>10000);}
const pdf=readFileSync(new URL('../'+m.summary_pdf,import.meta.url));assert(pdf.subarray(0,5).toString()==='%PDF-');
const html=read('contractor-road-work-summary.html');assert(html.includes('<dialog'));assert(!html.includes('src="rate-source-skeleton.js"'));assert.equal((html.match(/<th scope="col">/g)||[]).length,4);assert(html.includes('contractor-extracted-evidence.html?view=candidates'));
const js=read('contractor-rate-analysis.js');new Script(js);assert(!js.includes('innerHTML'));assert(js.includes('dialog.showModal()'));assert(js.includes('r.specification_clause_no'));assert(js.includes("'Open actual PDF page ↗'"));assert(js.includes('r.rate_npr===null'));
assert(read('contractor-extracted-evidence.html').includes('src="rate-source-skeleton.js"'));
console.log('PASS contractor iteration 002: 158 source-linked summary items, four-column index, six-field details, original PDF excerpt, preserved raw evidence and unresolved readings.');
// Iteration 003 adds an editorial label overlay without rewriting source readings.
const labels=JSON.parse(read('data/contractor-short-labels.v0.1.json'));
const {createHash}=await import('node:crypto');
assert.equal(labels.source_projection_sha256,createHash('sha256').update(read('data/contractor-work-items.v0.1.json')).digest('hex'),'labels anchor the unchanged full-detail projection');
assert.equal(labels.items.length,m.items.length);assert.equal(new Set(labels.items.map(r=>r.item_id)).size,m.items.length);
const byId=new Map(labels.items.map(r=>[r.item_id,r.short_description]));
for(const r of m.items){assert(byId.has(r.id));assert(byId.get(r.id).length<=120);assert(byId.get(r.id).length<r.description.length,'editorial label is shorter than full source wording');}
const title=sn=>byId.get(row(sn).id);
assert(title('1').includes('30 m lead')&&title('4').includes('1,000 m lead'));
assert(title('47').includes('manually mixed')&&title('48').includes('machine mixed'));
assert(title('64').includes('formwork included')&&title('121').includes('formwork excluded'));
assert(title('54a').includes('up to 3 m')&&title('54b').includes('3–6 m'));
assert(title('110').includes('smooth surface')&&title('111').includes('rough surface'));
assert(js.includes("'contractor-summary',r.short_description")&&js.includes("'contractor-full-description',r.description"),'list labels and full detail remain distinct');
assert(js.includes('searchText:[shortLabels.get(r.id)'),'search includes both editorial and full source wording');
assert(read('contractor-rate-analysis.css').includes('white-space:normal!important'),'source index overrides global nowrap');
console.log('PASS iteration 003: all 158 shortened labels retain key variants; full descriptions and source readings remain byte-identical.');

await import('./qa_contractor_road_analysis_v0.1.mjs');
