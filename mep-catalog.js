/* v0.5.9 · MEP navigation classification only. Does not modify stored source taxonomy or rates. */
(function(root){
 "use strict";
 const trades=Object.freeze({
  mechanical:Object.freeze({name:"Mechanical",icon:"⚙️",lead:"Cooling & ventilation",description:"Air-conditioning systems and ventilation equipment found in the source estimate.",file:"mep-mechanical.html",hint:"The exhaust fan is recorded in the Electrical worksheet but appears here as ventilation equipment for easier browsing."}),
  electrical:Object.freeze({name:"Electrical",icon:"⚡",lead:"Power, safety & lighting",description:"Wiring, cables, earthing, distribution, switchgear, switches, sockets and lighting.",file:"mep-electrical.html",hint:"Electrical-worksheet HVAC and ventilation equipment are navigated under Mechanical; original worksheet provenance remains on the item detail page."}),
  plumbing:Object.freeze({name:"Plumbing",icon:"🚰",lead:"Water & sanitary systems",description:"Water supply, drainage, tanks, pumps, sanitary fittings and bathroom fixtures.",file:"mep-plumbing.html",hint:"Includes the original Plumbing and Sanitary categories in the same Sanitary Works worksheets."})
 });
 const sequencing=Object.freeze({
  mechanical:["Ventilation","Air Conditioning"],
  electrical:["Earthing","Cables","Wiring Points","Panels","Distribution Boards","Protection Devices","Panel Accessories","Switches","Sockets","Lighting"],
  plumbing:["Drainage","Water Supply Pipes","Valves","Meters","Storage","Pumps","Solar Fittings","Fixtures","Fittings","Traps","Accessories","Miscellaneous"]
 });
 function tradeOf(row,t){
  if(!row||!t)return null;
  if(t.family==="HVAC"||(t.family==="Electrical"&&t.work_type==="Ventilation"))return "mechanical";
  if(t.family==="Electrical")return "electrical";
  if(t.family==="Plumbing"||t.family==="Sanitary")return "plumbing";
  return null;
 }
 function displayCategory(row,t,trade){
  const k=trade||tradeOf(row,t);
  if(k==="mechanical")return t.work_type==="Ventilation"?"Ventilation fans":"Air conditioning";
  if(k==="electrical")return t.work_type;
  if(k==="plumbing")return t.work_type;
  return t.work_type;
 }
 function phaseOf(row,t,trade){
  const tr=trade||tradeOf(row,t);
  const order=sequencing[tr]||[];
  const idx=order.indexOf(t.work_type);
  return idx<0?99:idx;
 }
 function iconFor(row,t,trade){
  const tr=trade||tradeOf(row,t);
  if(tr==="mechanical")return t.work_type==="Ventilation"?"🌀":"❄️";
  if(tr==="electrical"){
   if(t.work_type==="Lighting")return "💡";
   if(t.work_type==="Earthing")return "🛡️";
   if(t.work_type==="Cables"||t.work_type==="Wiring Points")return "🔌";
   if(["Panels","Distribution Boards","Protection Devices","Panel Accessories"].includes(t.work_type))return "⚡";
   return "🔘";
  }
  if(tr==="plumbing"){
   if(t.work_type==="Drainage")return "🪠";
   if(t.work_type==="Water Supply Pipes")return "🚰";
   if(["Storage","Pumps","Meters"].includes(t.work_type))return "💧";
   if(["Fixtures","Traps"].includes(t.work_type))return "🚽";
   if(t.work_type==="Solar Fittings")return "☀️";
   return "🚿";
  }
  return "🛠️";
 }
 function partition(items,records,version){
  const grouped={mechanical:[],electrical:[],plumbing:[]};
  for(const row of items){if(row.version!==version)continue;const category=records[row.id];const trade=tradeOf(row,category);if(trade)grouped[trade].push(row);}
  return grouped;
 }
 function check(items,records){
  if(!Array.isArray(items)||items.length!==204||!records)throw Error("Invalid historical rate source");
  const all={};
  for(const version of ["visible","hidden"]){
   const groups=partition(items,records,version);
   const result=Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,v.length]));
   if(result.mechanical!==3||result.electrical!==37||result.plumbing!==22)throw Error("MEP source assignment mismatch: "+JSON.stringify(result));
   const ids=Object.values(groups).flat().map(x=>x.id);
   if(new Set(ids).size!==62)throw Error("MEP item appears twice in a worksheet set");
   all[version]=result;
  }
  return all;
 }
 root.JPMep=Object.freeze({trades,tradeOf,displayCategory,phaseOf,iconFor,partition,check});
})(typeof window!=="undefined"?window:globalThis);
