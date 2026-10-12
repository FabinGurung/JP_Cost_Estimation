#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
const d=JSON.parse(read('finance-summary.json'));
assert.equal(d.schema,'jp.ces.finance.summary.v1');
assert.equal(d.snapshot_date,'2026-10-12');
assert.equal(d.rows.length,27);
assert.equal(d.summary.entry_count,d.rows.length);
assert.equal(d.source.source_sheet,'14_bishal_paija');
assert.equal(d.source.range,'A6:E34');
assert.equal(new Set(d.rows.map(x=>x.id)).size,d.rows.length);
d.rows.forEach((x,i)=>{assert.equal(x.id,i+1);assert(Number.isFinite(x.amount_npr)&&x.amount_npr>=0);assert(typeof x.name==='string'&&x.name.length);});
for(const [field,key] of [['amount_npr','amount_npr'],['qr_npr','qr_npr'],['discount_npr','discount_recorded_npr']]){
 assert.equal(d.rows.reduce((n,x)=>n+(x[field]??0),0),d.summary[key],field+' sum');
}
assert.equal(d.summary.amount_npr,268798);
assert.equal(d.summary.qr_npr,160);
assert.equal(d.summary.discount_recorded_npr,2400);
assert.equal(d.rows.at(-1).name,'Thapasthali kitchen plastic and gift house');
assert.equal(d.rows.at(-1).amount_npr,790);
assert.equal(d.rows.find(x=>x.name==='Formwork_yem gurung').qr_npr,30);
assert.equal(d.source_controls.transaction_ids_unique,74);
const js=read('finance.js');
assert(!js.includes('rows.length !== 26'));
assert(js.includes('new Set(ids).size !== rows.length'));
assert(js.includes("data.summary.entry_count+' named rows"));
assert(js.includes('SOURCE GOOGLE SHEET'));
console.log('PASS Krishna Kumar Gupta 27-entry finance snapshot, all source totals and scalable validation.');
