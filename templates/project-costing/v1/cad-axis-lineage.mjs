// CAD → Cost read-only axis/quantity boundary. Source identity belongs to CAD.
// A provisional source label alone never authorizes a measured quantity or BOQ.
export const CAD_AXIS_CONTRACT='jp-cad://control-tower/view-lineage/1.0';
export const CAD_SOURCE_REGISTRY='jp-cad://source-axis-register/1';
const required=['cadRepository','cadRevision','cadElementId','axisRef','floorId','sourceFileSha256','sourceCoordinateFrame'];
const looksLikeHash=x=>typeof x==='string'&&/^[a-f\d]{64}$/i.test(x);
export function validateCadQuantityLineage(measurement){
 const cad=measurement?.cadLineage;
 if(!cad)return {ok:false,reason:'CAD_LINEAGE_ABSENT'};
 if(cad.contract!==CAD_AXIS_CONTRACT)return {ok:false,reason:'CAD_CONTRACT_UNRECOGNIZED'};
 if(required.some(k=>!String(cad[k]??'').trim()))return {ok:false,reason:'CAD_ELEMENT_AXIS_SOURCE_REQUIRED'};
 if(cad.cadRepository!=='FabinGurung/JP_Computer-Aided-Drawings')return {ok:false,reason:'CAD_REPOSITORY_MISMATCH'};
 if(!looksLikeHash(cad.sourceFileSha256))return {ok:false,reason:'CAD_SOURCE_FINGERPRINT_INVALID'};
 if(!/^[A-Z]+[1-9]\d*$/.test(cad.axisRef))return {ok:false,reason:'CAD_AXIS_REFERENCE_MALFORMED'};
 if(measurement.locationOrGrid!==cad.axisRef)return {ok:false,reason:'CAD_LOCATION_MUST_MATCH_AXIS_REFERENCE'};
 if(cad.axisStatus!=='SOURCE_MODEL_REGISTERED_VERIFIED')return {ok:false,reason:'CAD_AXIS_REVIEW_ONLY_NOT_QUANTITY_APPROVED'};
 if(cad.coordinateRegistrationVerified!==true||cad.memberGeometryVerified!==true)return {ok:false,reason:'CAD_GEOMETRY_REGISTRATION_HOLD'};
 if(cad.quantitySourceVerified!==true||cad.verifierId==null||!String(cad.verifierId).trim())return {ok:false,reason:'CAD_MEASUREMENT_VERIFICATION_HOLD'};
 return {ok:true,axisRef:cad.axisRef,sourceElementId:cad.cadElementId,revision:cad.cadRevision};
}
export function summarizeCadHandoff(lineage){
 const result=validateCadQuantityLineage(lineage);
 return {...result,canCreateApprovedBOQ:false,meaning:'An eligible measured instance may create a draft BOQ line with separately approved compatible rates; engineer/contract approvals remain distinct.'};
}
