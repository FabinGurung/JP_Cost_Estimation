import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateMeasurement,deriveBOQ,deriveAOC,certifyRunningBill,matchVendorInvoice,reconcilePayments} from '../templates/project-costing/v1/costing-pipeline.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const b='projects/rohini/ward-14/amrit-rawat/';
const master=json('templates/project-costing/v1/master-template.json');
const cat=json('templates/project-costing/v1/work-catalog.json');
const p=json(b+'project-costing.json');
const registry=json('site-page-registry.v0.8.json');
assert.equal(master.templateId,'JP-COSTING-MEAS-BOQ-AOC-V1');
assert.deepEqual(master.sections.map(x=>x.id),['measurements','boq','aoc']);
assert.equal(p.templateId,master.templateId);
assert.equal(p.schema,'jp.project-costing.projection.v1');
assert.equal(p.projectId,'RE-AMRIT-RAWAT-W14');
assert.deepEqual(['measurementRows','rateSelections','boqRows','contractorRunningBills','vendorInvoices','paymentAllocations'].map(x=>p[x].length),[0,0,0,0,0,0]);
assert.equal(p.aoc.grandTotalNpr,null);
assert.equal(p.sourceAuthorities.measurementBookSheetId,null);
assert.equal(p.publicSnapshot.authenticatedSourceFetch,false);
assert.equal(p.publicSnapshot.sourceAdmission,'NOT_ADMITTED');
assert.equal(cat.projectEvidenceImported,false);
assert.equal(cat.works.length,26);
assert.equal(new Set(cat.works.map(w=>w.slug)).size,26);
assert.equal(registry.pages.length,66);
assert.equal(registry.templates[0].id,master.templateId);
for(const w of cat.works){
 const page=b+'measurements/'+w.slug+'.html';
 assert(existsSync(path.join(root,page)),'Work page missing '+page);
 assert(registry.pages.some(x=>x.path===page&&x.department==='PJ'));
 assert(read(page).includes('data-work-slug="'+w.slug+'"'));
 assert(read(page).includes('data-source="../project-costing.json"'));
 assert(w.suggestedUnit&&w.measurementMethodGuide&&w.workId);
}
const m=(measurementId,quantity)=>({measurementId,projectId:'SYNTHETIC_TEST_NOT_PROJECT',organizationId:'TEST_ONLY',workId:'WORK_RCC_FOOTING',workItemId:'W-1',locationOrGrid:'G1',quantity,unit:'m³',measurementMethod:'source drawing dims',sourceEvidenceId:'TEST-SRC-1',sourceRevision:'TEST-REV-1',verificationStatus:'VERIFIED'});
assert.equal(validateMeasurement(m('A',2)).ok,true);
assert.equal(validateMeasurement({...m('X',2),verificationStatus:'DRAFT'}).ok,false);
assert.equal(validateMeasurement({...m('X',0)}).ok,false);
const r={workItemId:'W-1',unit:'m³',rateId:'U-1',sourceId:'S-1',rateVersion:'V000001',unitRateNpr:6000,status:'APPROVED',scopeFamily:'WORK-1',pricingOption:'CIVIL_TRADE',groupCode:'STRUCTURE'};
assert.equal(deriveBOQ([],[]).totalNpr,null);
assert.equal(deriveBOQ([m('A',2)],[{...r,unit:'m²'}]).totalNpr,null);
assert.equal(deriveBOQ([{...m('A',2),verificationStatus:'DRAFT'}],[r]).lines.length,0);
const bill=deriveBOQ([m('A',2),m('B',3)],[r]);
assert.equal(bill.lines.length,1);assert.equal(bill.lines[0].quantity,5);
assert.equal(bill.lines[0].amountNpr,30000);
assert.deepEqual(bill.lines[0].measurementIds,['A','B']);
assert.equal(bill.totalNpr,null); // priced draft is not an approved estimate
const approved={status:'APPROVED',lines:bill.lines.map(l=>({...l,status:'APPROVED'}))};
assert.equal(deriveAOC(bill,{allowances:[],taxes:[],contingencyNpr:0}).grandTotalNpr,null);
const a=deriveAOC(approved,{allowances:[{status:'APPROVED',amountNpr:500}],taxes:[],contingencyNpr:1000});
assert.equal(a.subtotalNpr,30000);assert.equal(a.grandTotalNpr,31500);
assert.equal(deriveAOC({status:'APPROVED',lines:[{...approved.lines[0],scopeFamily:'F',pricingOption:'TURNKEY'}, {...approved.lines[0],scopeFamily:'F',pricingOption:'CIVIL_TRADE'}]},{allowances:[],taxes:[],contingencyNpr:0}).grandTotalNpr,null);
const claim={billId:'RA-01',status:'CERTIFIED',projectId:'TEST',contractId:'CT-1',contractorId:'CON-1',cutoffDate:'2026-10-31',certificateEvidenceId:'CERT-1',lines:[{workItemId:'W-1',unit:'m³',cumulativeCertifiedQty:3,measurementEvidenceId:'M-1'}]};
const calc=certifyRunningBill(claim,[],[{...approved.lines[0],unitRateNpr:6000}]);
assert.equal(calc.grossNpr,18000);assert.equal(calc.amountNpr,null); // no net payable without deductions
const prior=[{contractId:'CT-1',status:'CERTIFIED',lines:[{workItemId:'W-1',cumulativeCertifiedQty:2}]}];
assert.equal(certifyRunningBill(claim,prior,[{...approved.lines[0],unitRateNpr:6000}]).grossNpr,6000);
assert.equal(certifyRunningBill({...claim,lines:[{...claim.lines[0],cumulativeCertifiedQty:1}]},prior,[{...approved.lines[0],unitRateNpr:6000}]).amountNpr,null);
const po={status:'APPROVED',purchaseOrderId:'PO-1',lines:[{itemId:'TILE-1',unit:'box',unitRateNpr:500}]};
const invoice={status:'VERIFIED',vendorId:'V1',invoiceId:'I1',sourceEvidenceId:'DOC1',purchaseOrderId:'PO-1',lines:[{itemId:'TILE-1',unit:'box',quantity:2,unitRateNpr:500}]};
assert.equal(matchVendorInvoice(invoice,po,[{purchaseOrderId:'PO-1',itemId:'TILE-1',status:'VERIFIED',quantity:3}]).matchedGrossNpr,1000);
assert.equal(matchVendorInvoice(invoice,po,[]).matchedGrossNpr,null);
assert.equal(reconcilePayments([]).paidNpr,null);
assert.equal(reconcilePayments([{status:'PAID_VERIFIED',paymentId:'P1',sourceTransactionId:'T1',billOrInvoiceId:'I1',projectId:'TEST',amountNpr:200}]).paidNpr,200);
assert.equal(reconcilePayments([{status:'PAID_VERIFIED',paymentId:'P1',sourceTransactionId:'T1',billOrInvoiceId:'I1',projectId:'TEST',amountNpr:200},{status:'PAID_VERIFIED',paymentId:'P2',sourceTransactionId:'T1',billOrInvoiceId:'I1',projectId:'TEST',amountNpr:300}]).paidNpr,null);
for(const page of registry.pages.filter(x=>x.path.startsWith(b)&&x.path.endsWith('.html'))){
 const html=read(page.path);
 assert(html.includes('site-navigation-v0.8.js')&&html.includes('site-theme-v0.8.css'),'Missing global nav '+page.path);
 assert(html.includes('name="viewport"'),'Missing responsive viewport '+page.path);
 const tags=[...html.matchAll(/(?:href|src)="([^"]+)"/g)];
 for(const [,href] of tags){
  const clean=href.split(/[?#]/)[0];
  if(!clean||/^(https?:|mailto:|data:)/i.test(clean))continue;
  const actual=path.resolve(root,path.dirname(page.path),clean);
  assert(actual.startsWith(root+path.sep),'Path leaves root '+href);
  assert(existsSync(actual),'Broken link from '+page.path+' to '+href);
 }
}
assert(read('boq-template.json').includes('BLOCKED_PENDING_VERIFIED_CAD_FID_DATA'));
console.log('COSTING MASTER PASS: 26 trade pages, common measured/BOQ/AOC schema, source provenance, RA delta, vendor PO/receipt matching, duplicate payment guards, all registered project links.');
