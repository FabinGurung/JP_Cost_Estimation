/** Source-backed cost logic. A missing quantity is null/PENDING, NEVER zero. */
export function validateMeasurement(m){
  if(!m||m.verificationStatus!=="VERIFIED")return {ok:false,reason:"NOT_MEASURED / PENDING"};
  if(!m.workItemId||!m.measurementMethod||!m.sourceRevision||!m.sourceEvidenceId) return {ok:false,reason:"SOURCE_LINEAGE_MISSING"};
  if(typeof m.quantity!=="number"||!Number.isFinite(m.quantity)||m.quantity<=0||!m.unit)return {ok:false,reason:"INVALID_MEASURED_QUANTITY"};
  return {ok:true};
}
export function priceBOQLine(measurement,rate){
  const valid=validateMeasurement(measurement);
  if(!valid.ok)return {status:"BLOCKED",reason:valid.reason,amountNpr:null};
  if(!rate||rate.approvalStatus!=="APPROVED"||!rate.rateId||!rate.sourceId) return {status:"BLOCKED",reason:"RATE_NOT_APPROVED",amountNpr:null};
  if(rate.unit!==measurement.unit||typeof rate.unitRateNpr!=="number"||!Number.isFinite(rate.unitRateNpr)||rate.unitRateNpr<0)return {status:"BLOCKED",reason:"RATE_UNIT_MISMATCH",amountNpr:null};
  if(rate.scopeGroup==="TURNKEY"&&rate.componentTradeIds?.length) return {status:"BLOCKED",reason:"OVERLAPPING_TURNKEY_TRADE",amountNpr:null};
  return {status:"CALCULATED_DRAFT",workItemId:measurement.workItemId,quantity:measurement.quantity,quantityUnit:measurement.unit,rateId:rate.rateId,scopeGroup:rate.scopeGroup||null,scopeFamily:rate.scopeFamily||null,pricingOption:rate.pricingOption||null,exclusiveGroup:rate.exclusiveGroup||null,amountNpr:Math.round(measurement.quantity*rate.unitRateNpr*100)/100};
}
export function costAbstract(lines,{allowances=[],contingencyNpr=null}={}){
  if(!Array.isArray(lines)||!lines.length||lines.some(l=>l.status!=="APPROVED"||!Number.isFinite(l.amountNpr)))return {status:"BLOCKED_PENDING_VERIFIED_BOQ",subtotalNpr:null,totalNpr:null};
  if(contingencyNpr===null||!Number.isFinite(contingencyNpr)||contingencyNpr<0||allowances.some(a=>a.status!=="APPROVED"||!Number.isFinite(a.amountNpr)))return {status:"BLOCKED_PENDING_APPROVED_ALLOWANCES",subtotalNpr:null,totalNpr:null};
  // Reject overlap before financial aggregation, even if individual lines are approved.
  const groups=new Map();
  for(const l of lines){
    if(!l.scopeFamily||!l.pricingOption)return {status:"BLOCKED_MISSING_SCOPE_SELECTION",subtotalNpr:null,totalNpr:null};
    const options=groups.get(l.scopeFamily)||new Set();options.add(l.pricingOption);groups.set(l.scopeFamily,options);
  }
  for(const [family,options] of groups){
    if(options.has('TURNKEY')&&options.size>1)return {status:"BLOCKED_OVERLAPPING_TURNKEY",subtotalNpr:null,totalNpr:null};
    if(options.has('GREY_PACKAGE')&&[...options].some(x=>x==='CIVIL_TRADE'||x==='TURNKEY'))return {status:"BLOCKED_OVERLAPPING_CIVIL",subtotalNpr:null,totalNpr:null};
    if(options.has('LABOUR_ONLY')&&options.has('MATERIAL_LABOUR'))return {status:"BLOCKED_MUTUALLY_EXCLUSIVE_RATE_BASIS",subtotalNpr:null,totalNpr:null};
  }
  const n=lines.reduce((sum,line)=>sum+line.amountNpr,0);
  const extra=allowances.reduce((sum,a)=>sum+a.amountNpr,0);
  return {status:"CALCULATED_DRAFT",subtotalNpr:Math.round(n*100)/100,totalNpr:Math.round((n+extra+contingencyNpr)*100)/100};
}
