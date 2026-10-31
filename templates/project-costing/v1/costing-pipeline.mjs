// Pure source-gated calculations. No network, no guessing, no synthetic totals.
const money=x=>Math.round((x+Number.EPSILON)*100)/100;
const okNum=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
export function validateMeasurement(m){
 const fields=['measurementId','projectId','organizationId','workId','workItemId','locationOrGrid','unit','measurementMethod','sourceEvidenceId','sourceRevision'];
 if(!m||m.verificationStatus!=='VERIFIED'||fields.some(k=>!String(m[k]??'').trim()))return {ok:false,reason:'SOURCE_OR_VERIFICATION_PENDING'};
 if(!okNum(m.quantity)||m.quantity<=0)return {ok:false,reason:'INVALID_POSITIVE_QUANTITY'};
 return {ok:true};
}
export function deriveBOQ(measurements,rateSelections){
 if(!Array.isArray(measurements)||!measurements.length)return {status:'NOT_MEASURED_PENDING',lines:[],totalNpr:null};
 if(!Array.isArray(rateSelections)||measurements.some(x=>!validateMeasurement(x).ok))return {status:'BLOCKED_UNVERIFIED_MEASUREMENT',lines:[],totalNpr:null};
 const selections=new Map();
 for(const r of rateSelections)if(r.status==='APPROVED'&&r.workItemId&&r.unit&&r.rateId&&r.sourceId&&r.rateVersion&&okNum(r.unitRateNpr)){
   const k=r.workItemId+'|'+r.unit;
   if(selections.has(k))return {status:'BLOCKED_AMBIGUOUS_RATE_SELECTION',lines:[],totalNpr:null};
   selections.set(k,r);
 }
 const groups=new Map();
 for(const m of measurements){
  const rate=selections.get(m.workItemId+'|'+m.unit);
  if(!rate)return {status:'BLOCKED_RATE_NOT_SELECTED_OR_UNIT_MISMATCH',lines:[],totalNpr:null};
  const key=[m.workItemId,m.unit,rate.rateId].join('|');
  if(!groups.has(key))groups.set(key,{projectId:m.projectId,workItemId:m.workItemId,workId:m.workId,unit:m.unit,quantity:0,unitRateNpr:rate.unitRateNpr,rateId:rate.rateId,rateSourceId:rate.sourceId,rateVersion:rate.rateVersion,scopeFamily:rate.scopeFamily,pricingOption:rate.pricingOption,groupCode:rate.groupCode||m.workId,measurementIds:[],sourceRevisions:[]});
  const g=groups.get(key);g.quantity+=m.quantity;g.measurementIds.push(m.measurementId);g.sourceRevisions.push(m.sourceRevision);
 }
 const lines=[...groups.values()].map(g=>({...g,quantity:money(g.quantity),amountNpr:money(g.quantity*g.unitRateNpr),status:'CALCULATED_DRAFT'}));
 const c=checkPackageAlternatives(lines);if(!c.ok)return {status:c.reason,lines:[],totalNpr:null};
 return {status:'CALCULATED_DRAFT_REQUIRES_BOQ_APPROVAL',lines,totalNpr:null};
}
export function checkPackageAlternatives(lines){
 const seen=new Map();
 for(const l of lines){
  if(!l.scopeFamily||!l.pricingOption)return {ok:false,reason:'BLOCKED_SCOPE_NOT_SELECTED'};
  const s=seen.get(l.scopeFamily)||new Set();s.add(l.pricingOption);seen.set(l.scopeFamily,s);
 }
 for(const s of seen.values()){
  if(s.has('TURNKEY')&&s.size>1)return {ok:false,reason:'BLOCKED_TURNKEY_OVERLAP'};
  if(s.has('GREY_PACKAGE')&&(s.has('CIVIL_TRADE')||s.has('TURNKEY')))return {ok:false,reason:'BLOCKED_GREY_SCOPE_OVERLAP'};
  if(s.has('LABOUR_ONLY')&&s.has('MATERIAL_LABOUR'))return {ok:false,reason:'BLOCKED_PRICE_BASIS_OVERLAP'};
 }
 return {ok:true};
}
export function deriveAOC(boq,config){
 if(!boq||!Array.isArray(boq.lines)||!boq.lines.length||boq.status!=='APPROVED'||boq.lines.some(l=>l.status!=='APPROVED'||!okNum(l.amountNpr)))return {status:'BLOCKED_PENDING_APPROVED_BOQ',groups:[],grandTotalNpr:null};
 const alt=checkPackageAlternatives(boq.lines);if(!alt.ok)return {status:alt.reason,groups:[],grandTotalNpr:null};
 if(!config||!Array.isArray(config.allowances)||!Array.isArray(config.taxes)||!okNum(config.contingencyNpr))return {status:'BLOCKED_PENDING_APPROVED_ALLOWANCES_OR_TAXES',groups:[],grandTotalNpr:null};
 if([...config.allowances,...config.taxes].some(x=>x.status!=='APPROVED'||!okNum(x.amountNpr)))return {status:'BLOCKED_PENDING_APPROVED_ALLOWANCES_OR_TAXES',groups:[],grandTotalNpr:null};
 const groups=new Map();for(const l of boq.lines)groups.set(l.groupCode,money((groups.get(l.groupCode)||0)+l.amountNpr));
 const subtotal=money([...groups.values()].reduce((a,b)=>a+b,0));
 const additional=[...config.allowances,...config.taxes].reduce((s,x)=>s+x.amountNpr,0);
 return {status:'CALCULATED_DRAFT_REQUIRES_AOC_APPROVAL',groups:[...groups].map(([groupCode,amountNpr])=>({groupCode,amountNpr})),subtotalNpr:subtotal,grandTotalNpr:money(subtotal+additional+config.contingencyNpr)};
}
export function certifyRunningBill(bill,previousCertificates,approvedBoq){
 if(!bill||bill.status!=='CERTIFIED'||!bill.projectId||!bill.contractId||!bill.contractorId||!bill.cutoffDate||!bill.certificateEvidenceId||!Array.isArray(bill.lines)||!bill.lines.length)return {status:'PENDING_CERTIFIED_CLAIM',amountNpr:null};
 if(!Array.isArray(previousCertificates)||!Array.isArray(approvedBoq))return {status:'BLOCKED_MISSING_HISTORY_OR_BOQ',amountNpr:null};
 const lineAmounts=[];const used=new Set();
 for(const item of bill.lines){
  if(!item.workItemId||!okNum(item.cumulativeCertifiedQty)||!item.measurementEvidenceId||used.has(item.workItemId))return {status:'BLOCKED_INVALID_BILL_ITEM',amountNpr:null};
  used.add(item.workItemId);
  const match=approvedBoq.find(x=>x.workItemId===item.workItemId&&x.status==='APPROVED'&&x.unit===item.unit);
  if(!match||!okNum(match.unitRateNpr)||!okNum(match.quantity)||item.cumulativeCertifiedQty>match.quantity)return {status:'BLOCKED_UNAPPROVED_OR_EXCEEDED_BOQ',amountNpr:null};
  const prior=previousCertificates.filter(c=>c.contractId===bill.contractId&&c.status==='CERTIFIED').flatMap(c=>c.lines||[]).filter(l=>l.workItemId===item.workItemId);
  if(prior.some(x=>!okNum(x.cumulativeCertifiedQty)))return {status:'BLOCKED_PREVIOUS_CERTIFICATE_INVALID',amountNpr:null};
  const previousQty=Math.max(0,...prior.map(l=>l.cumulativeCertifiedQty));
  if(item.cumulativeCertifiedQty<previousQty)return {status:'BLOCKED_CUMULATIVE_REGRESSION',amountNpr:null};
  const thisPeriodQty=item.cumulativeCertifiedQty-previousQty;
  lineAmounts.push({workItemId:item.workItemId,unit:item.unit,cumulativeQty:item.cumulativeCertifiedQty,previousCertifiedQty:previousQty,thisPeriodQty,rateNpr:match.unitRateNpr,amountNpr:money(thisPeriodQty*match.unitRateNpr)});
 }
 const gross=money(lineAmounts.reduce((s,l)=>s+l.amountNpr,0));
 return {status:'CALCULATED_CERTIFIED_GROSS_BEFORE_CONTRACT_DEDUCTIONS',lines:lineAmounts,grossNpr:gross,amountNpr:null,reason:'Retention, advance recovery, tax, variation, withholding and net payable require separate approved records'};
}
export function matchVendorInvoice(invoice,po,receipts){
 if(!invoice||invoice.status!=='VERIFIED'||!invoice.vendorId||!invoice.invoiceId||!invoice.sourceEvidenceId||!po||po.status!=='APPROVED'||invoice.purchaseOrderId!==po.purchaseOrderId||!Array.isArray(invoice.lines)||!invoice.lines.length||!Array.isArray(receipts))return {status:'PENDING_PO_DELIVERY_INVOICE_VERIFICATION',matchedGrossNpr:null};
 const lines=[];const used=new Set();
 for(const l of invoice.lines){
  const item=po.lines?.find(x=>x.itemId===l.itemId);
  const delivered=receipts.filter(x=>x.purchaseOrderId===invoice.purchaseOrderId&&x.itemId===l.itemId&&x.status==='VERIFIED').reduce((s,x)=>s+x.quantity,0);
  if(!item||used.has(l.itemId)||!okNum(l.quantity)||l.quantity<=0||!okNum(l.unitRateNpr)||l.unitRateNpr!==item.unitRateNpr||l.unit!==item.unit||l.quantity>delivered)return {status:'BLOCKED_INVOICE_QUANTITY_OR_RATE',matchedGrossNpr:null};
  used.add(l.itemId);lines.push({itemId:l.itemId,quantity:l.quantity,amountNpr:money(l.quantity*l.unitRateNpr)});
 }
 return {status:'MATCHED_GROSS_BEFORE_TAX_DISCOUNT_AND_PAYMENT',lines,matchedGrossNpr:money(lines.reduce((a,b)=>a+b.amountNpr,0)),paidNpr:null};
}
export function reconcilePayments(payments){
 if(!Array.isArray(payments)||!payments.length)return {status:'NO_VERIFIED_PAYMENT_MAPPINGS',paidNpr:null};
 if(payments.some(x=>x.status!=='PAID_VERIFIED'||!x.paymentId||!x.sourceTransactionId||!x.billOrInvoiceId||!x.projectId||!okNum(x.amountNpr)))return {status:'BLOCKED_UNVERIFIED_PAYMENT',paidNpr:null};
 if(new Set(payments.map(x=>x.sourceTransactionId)).size!==payments.length)return {status:'BLOCKED_DUPLICATE_TRANSACTION',paidNpr:null};
 return {status:'RECONCILED_DRAFT',paidNpr:money(payments.reduce((s,x)=>s+x.amountNpr,0))};
}
