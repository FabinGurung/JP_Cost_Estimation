import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8');
const m=JSON.parse(read('data/rate-source-derived.v0.5.15.json'));
assert.equal(m.schema,'jp-cres.source_derivations.v0.5.15');
assert.equal(m.sources.length,6);assert.equal(m.groups.length,4);
assert.equal(m.sources.reduce((a,s)=>a+s.page_count,0),697);
assert.equal(m.baseline_commit,'80a3650e8de3be1488b742f79246620543d2cffc');
const forbidden=/drive\.google\.com|docs\.google\.com|source_file_drive_id|original_master_row|SAQ-HO|SAFAL DAWADI|Susmita Bhujel/i;
assert(!forbidden.test(JSON.stringify(m)));
const expected={'SRC-GOV-001':[973,4824,80],'SRC-VEN-001':[1430,1469,0],'SRC-VEN-002':[58,0,0],'SRC-RA-001':[0,9574,234],'SRC-RA-002':[0,8255,302],'SRC-RA-003':[0,1205,60]};
for(const s of m.sources){
 const data={};
 for(const key of ['entries','candidates','pages']){
  data[key]=s[key].flatMap(p=>{assert(p.includes(s.id.toLowerCase()+'-'), 'chunks stay in their own source');const text=gunzipSync(fs.readFileSync(p)).toString('utf8');assert(!forbidden.test(text),p+' private data');return JSON.parse(text);});
  assert.equal(data[key].length,s[{entries:'entry_count',candidates:'candidate_count',pages:'transcript_count'}[key]]);
  for(const r of data[key])assert((key==='entries'&&r.page===null)||(r.page>=1&&r.page<=s.page_count));
 }
 assert.deepEqual([data.entries.length,data.candidates.length,data.pages.length],expected[s.id]);
 assert.equal(new Set(data.entries.map(r=>r.id)).size,data.entries.length);
 assert.equal(new Set(data.candidates.map(r=>r.id)).size,data.candidates.length);
 if(s.id==='SRC-VEN-002'){
  assert(s.private_fields_withheld);
  assert(data.entries.every(r=>r.value===null&&r.raw_value===null));
  assert.deepEqual([...new Set(data.entries.map(r=>r.part))],['Typed quotation','Handwritten estimate']);
 }
 if(data.pages.length)assert.deepEqual(data.pages.map(r=>r.page),Array.from({length:s.page_count},(_,i)=>i+1));
}
const js=read('rate-source-skeleton.js');assert(!js.includes('innerHTML'),'source text safely rendered');assert(js.includes('history.replaceState'));assert(js.includes('generation'));
assert.equal(JSON.parse(read('data/historical-work-rates-v0.5.3.json')).items.length,204);
console.log('PASS v0.5.15: six isolated sources, 697-page baseline, 2,461 entries, 25,327 numeric candidates, redacted quotation, complete transcript coverage and stable routes.');
