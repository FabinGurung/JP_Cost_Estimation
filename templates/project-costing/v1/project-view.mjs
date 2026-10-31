// One read-only shared renderer for each project's measurement/BOQ/AOC/billing pages.
import {deriveBOQ,deriveAOC,certifyRunningBill,matchVendorInvoice,reconcilePayments} from './costing-pipeline.mjs';
const main=document.querySelector('main[data-costing-view]');
const status=main?.querySelector('[data-status]'),notes=main?.querySelector('[data-summary]'),body=main?.querySelector('[data-rows]');
const set=(el,val)=>{if(el)el.textContent=val};
function writeTable(cols,rows){
 if(!body)return;
 body.replaceChildren();
 if(!rows.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=cols.length;td.textContent='No verified source-backed records admitted. NOT MEASURED / PENDING — not zero.';tr.append(td);body.append(tr);return;}
 for(const row of rows){const tr=document.createElement('tr');for(const col of cols){const td=document.createElement('td');td.textContent=String(row[col]??'PENDING');tr.append(td);}body.append(tr);}
}
if(main){
 try{
  const url=new URL(main.dataset.source||'project-costing.json',location.href);
  const resp=await fetch(url,{cache:'no-store'});if(!resp.ok)throw Error('Project source unavailable');
  const p=await resp.json();
  if(p.schema!=='jp.project-costing.projection.v1'||!p.projectId||!p.templateId)throw Error('Unrecognized project source');
  const view=main.dataset.costingView,slug=main.dataset.workSlug;
  const catResp=await fetch(new URL('./work-catalog.json',import.meta.url));
  if(!catResp.ok)throw Error('Work method catalog unavailable');
  const catalog=(await catResp.json()).works;
  if(view==='measurement'){
    const work=catalog.find(c=>c.slug===slug);if(!work)throw Error('Unknown work taxonomy');
    set(main.querySelector('[data-work-method]'),work.measurementMethodGuide);
    set(main.querySelector('[data-unit]'),work.suggestedUnit+' suggested; contract/scope unit prevails');
    const rows=p.measurementRows.filter(x=>x.workId===work.workId&&x.verificationStatus==='VERIFIED');
    set(status,rows.length?'VERIFIED ROWS AVAILABLE; DETAILED SOURCE REVIEW REQUIRED':'NOT MEASURED / PENDING');
    set(notes,rows.length+' verified row(s). Raw Discord archive classification does not establish this project’s quantities.');
    writeTable(['measurementId','locationOrGrid','quantity','unit','sourceRevision','sourceEvidenceId','verificationStatus'],rows);
  }else if(view==='boq'){
    const b=deriveBOQ(p.measurementRows,p.rateSelections);set(status,b.status);set(notes,'Detailed source rows: '+p.measurementRows.length+' · BOQ group amounts are draft until certified / approved.');
    writeTable(['workItemId','quantity','unit','unitRateNpr','amountNpr','rateId'],b.lines);
  }else if(view==='aoc'){
    const b=deriveBOQ(p.measurementRows,p.rateSelections);
    const approved=p.boqRows?.length?{status:'APPROVED',lines:p.boqRows}:b;
    const a=deriveAOC(approved,{...p.aoc,contingencyNpr:p.aoc.contingency?.amountNpr??null});
    set(status,a.status);set(notes,'Grand total: '+(a.grandTotalNpr===null?'NOT AVAILABLE':('NPR '+a.grandTotalNpr.toLocaleString()))+' · Summary only, not payment evidence.');
    writeTable(['groupCode','amountNpr'],a.groups);
  }else if(view==='contractor'){
    set(status,p.contractorRunningBills.length?'CERTIFICATE REVIEW REQUIRED':'NO VERIFIED CONTRACTOR RUNNING BILLS');
    set(notes,'No source-verified contractor certificates admitted. Cumulative measured quantity, prior certificates, deductions, retention and tax are separate fields.');
    writeTable(['billId','contractorId','cutoffDate','status','sourceEvidenceId'],p.contractorRunningBills);
  }else if(view==='vendor'){
    set(status,p.vendorInvoices.length?'INVOICE/PO/DELIVERY MATCH REQUIRED':'NO VERIFIED VENDOR INVOICES');
    set(notes,'Vendor invoices are claims for delivered goods/services, not payments. Invoice/PO/delivery references must match.');
    writeTable(['invoiceId','vendorId','invoiceDate','status','sourceEvidenceId'],p.vendorInvoices);
  }else if(view==='payments'){
    const r=reconcilePayments(p.paymentAllocations);
    set(status,r.status);set(notes,'Matched paid amount: '+(r.paidNpr===null?'NOT AVAILABLE':('NPR '+r.paidNpr.toLocaleString()))+' · Original Finance Sheets own transactions.');
    writeTable(['paymentId','billOrInvoiceId','amountNpr','status','sourceTransactionId'],p.paymentAllocations);
  }
 }catch(e){set(status,'SOURCE UNAVAILABLE — NO DATA PUBLISHED');set(notes,'The project source could not be validated. No quantities or financial totals are inferred.');writeTable(['record'],[]);}
}
