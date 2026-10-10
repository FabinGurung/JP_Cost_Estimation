/* JP Rate Library v0.5.7: editorial construction-sequence and review guidance.
   No rates, project specs, statutory codes or source evidence are generated here. */
(function(root){
 "use strict";
 const stages=Object.freeze([
  {id:"excavate",order:10,emoji:"🕳️",label:"Excavation & site preparation",short:"Excavate"},
  {id:"soling",order:20,emoji:"🪨",label:"Foundation soling",short:"Soling"},
  {id:"pcc",order:30,emoji:"🪣",label:"Foundation PCC",short:"PCC"},
  {id:"steel",order:40,emoji:"🧲",label:"RCC reinforcement & formwork",short:"Rebar / Forms"},
  {id:"rcc",order:50,emoji:"🏗️",label:"RCC and structural concrete",short:"RCC"},
  {id:"masonry",order:60,emoji:"🧱",label:"Masonry & wall construction",short:"Walls"},
  {id:"backfill",order:55,emoji:"🚜",label:"Foundation backfilling",short:"Backfill"},
  {id:"openings",order:80,emoji:"🚪",label:"Doors, windows & joinery",short:"Openings"},
  {id:"roughin",order:90,emoji:"🔌",label:"Electrical & plumbing rough-in",short:"MEP rough-in"},
  {id:"substrates",order:100,emoji:"🧰",label:"Plaster, screed & waterproofing",short:"Plaster"},
  {id:"surfaces",order:110,emoji:"🔲",label:"Flooring, cladding & stonework",short:"Surfaces"},
  {id:"painting",order:120,emoji:"🎨",label:"Painting & final finishes",short:"Finishes"},
  {id:"fixtures",order:130,emoji:"💡",label:"Services, fixtures & commissioning",short:"Fixtures"},
  {id:"external",order:140,emoji:"🏡",label:"External works & boundaries",short:"External"}
 ]);
 const byId=Object.fromEntries(stages.map(s=>[s.id,s]));
 function stageFor(item,t){
  const family=t.family,type=t.work_type,variant=t.variant;
  if(type==="Excavation"||family==="Site Preparation")return "excavate";
  if(type==="Boulder Soling")return "soling";
  if(type==="PCC")return "pcc";
  if(family==="Reinforcement"||family==="Formwork")return "steel";
  if(type==="M20 Concrete")return "rcc";
  if(family==="Masonry")return "masonry";
  if(type==="Backfilling")return "backfill";
  if(family==="Joinery"&&type!=="Wood Finish")return "openings";
  if(family==="Plumbing"&&["Drainage","Water Supply Pipes","Valves"].includes(type))return "roughin";
  if(family==="Electrical"&&["Cables","Wiring Points","Earthing","Panels","Distribution Boards","Protection Devices","Panel Accessories"].includes(type))return "roughin";
  if(family==="Waterproofing"||type==="Wall Plaster"||type==="Screed"||type==="Screed Finish")return "substrates";
  if(family==="Flooring"||type==="Stone Cladding")return "surfaces";
  if(type==="Painting"||type==="Putty"||type==="Wood Finish")return "painting";
  if(family==="Boundary Works"||family==="Metalwork")return "external";
  if(family==="Electrical"||family==="HVAC"||family==="Sanitary"||family==="Plumbing")return "fixtures";
  return "fixtures";
 }
 function iconFor(item,t){
  const f=t.family,k=t.work_type;
  if(k==="Excavation")return "🕳️";
  if(k==="Backfilling")return "🚜";
  if(k==="Boulder Soling")return "🪨";
  if(k==="PCC")return "🪣";
  if(f==="Reinforcement")return "🧲";
  if(f==="Formwork")return "🪚";
  if(k==="M20 Concrete")return "🏗️";
  if(k==="Brick Masonry")return "🧱";
  if(k==="Stone Masonry"||k==="Stone Cladding")return "🪨";
  if(f==="Joinery")return k==="Wood Finish"?"✨":"🚪";
  if(k==="Wall Plaster")return "🧰";
  if(k==="Putty"||k==="Painting")return "🎨";
  if(f==="Flooring")return k==="Granite"?"🪨":"🔲";
  if(f==="Waterproofing")return "💧";
  if(f==="Metalwork"||f==="Boundary Works")return "🚧";
  if(f==="HVAC")return "❄️";
  if(f==="Electrical")return k==="Lighting"?"💡":k==="Ventilation"?"🌀":"🔌";
  if(f==="Plumbing")return ["Storage","Pumps","Meters"].includes(k)?"🚰":"🪠";
  if(f==="Sanitary")return ["Fixtures","Traps"].includes(k)?"🚽":"🚿";
  if(f==="Site Preparation")return "🧹";
  return "🛠️";
 }
 function priority(t){
  const keys={"Clearance":1,"Excavation":2,"Boulder Soling":1,"PCC":1,"Steel Bars":1,"RCC Shuttering":2,
  "M20 Concrete":1,"Stone Masonry":1,"Brick Masonry":2,"Backfilling":1,
  "Timber Frames":1,"Timber Shutters":2,"Aluminium Windows":3,
  "Drainage":1,"Water Supply Pipes":2,"Cables":3,"Wiring Points":4,"Earthing":5,"Panels":6,"Distribution Boards":7,
  "Protection Devices":8,"Panel Accessories":9,"Valves":10,
  "Terrace Treatment":1,"Wall Plaster":2,"Screed":3,"Screed Finish":4,
  "Tiles":1,"Granite":2,"Stone Cladding":3,
  "Putty":1,"Painting":2,"Wood Finish":3,
  "Lighting":1,"Sockets":2,"Switches":3,"Fittings":4,"Fixtures":5,"Accessories":6,"Traps":7,"Miscellaneous":8,
  "Railing":1,"Metal Gate":2};
  return keys[t.work_type]??20;
 }
 function sequence(item,t){
  const stage=byId[stageFor(item,t)];
  if(!stage)throw Error("Unknown construction stage");
  return {stage_id:stage.id,stage,emoji:iconFor(item,t),priority:priority(t)};
 }
 const BASE=[
  "Check the approved project drawings and the actual item scope before execution.",
  "Check installed dimensions, materials and workmanship against the applicable approved requirements.",
  "Record required inspections and resolve observed nonconformities before handover or concealment."
 ];
 const quality={
  Excavation:["Confirm excavation lines, founding level and dimensions with approved drawings.","Check exposed ground conditions and trench stability before following trades.","Remove unsuitable loose material and manage water before placing foundation layers."],
  Clearance:["Confirm the designated work area and identify utilities or elements to protect.","Clear and segregate debris without disturbing retained structures.","Record site condition before foundation activities."],
  Backfilling:["Check backfill material type and lift/compaction requirements against the approved project specification.","Confirm below-ground concrete, waterproofing and services are inspected or protected before covering.","Inspect placement, compaction and final levels against approved drawings and test requirements."],
  "Boulder Soling":["Inspect stone quality and cleanliness against the project specification.","Check packing, level and thickness before placing concrete.","Confirm bedding and void-filling method with the approved detail."],
  PCC:["Check specified concrete grade/mix, approved proportions and placement surface.","Check thickness, levels, batching and compaction during placement.","Maintain the curing approach and record inspections required by the project."],
  "Steel Bars":["Check reinforcement grade, bar diameter, quantity and spacing from the structural drawings.","Inspect bending, laps, anchorage, cover and positioning before pouring concrete.","Keep bars clean and supported with suitable spacers/chairs."],
  "RCC Shuttering":["Check formwork alignment, dimensions, support and stability.","Confirm joints, openings, release agent and safe access before concreting.","Inspect before pour and follow an approved striking/removal procedure."],
  "M20 Concrete":["Confirm the approved concrete grade/design and reinforcement/formwork readiness.","Monitor placement, compaction, construction joints and finishing.","Protect and cure concrete; record project-required test results before acceptance."],
  "Brick Masonry":["Check brick type, condition and mortar mix against the project specification.","Inspect line, level, plumb, joint thickness and bond.","Check reinforcement/ties, openings and curing as required by approved details."],
  "Stone Masonry":["Check stone soundness, bedding, mortar and bond.","Inspect wall line, plumb and filling of joints/voids.","Check interfaces and curing against approved detail."],
  "Wall Plaster":["Confirm substrate preparation and any required interface treatments.","Check mortar mix, thickness, straightness and surface finish.","Cure/protect the work and check for cracks or debonding."],
  "Painting":["Check substrate dryness, cleanliness and primer/putty compatibility.","Verify approved product, coat sequence and appearance under suitable lighting.","Inspect coverage, adhesion, patchiness and protection of adjacent finishes."],
  "Putty":["Check prepared substrate and compatible primer/putty product.","Verify layer thickness and smoothness against product instructions.","Inspect surface before paint coats."],
  "Tiles":["Check substrate level, tile layout, approved adhesive/mortar and joint widths.","Inspect lippage, alignment, bond and suitable movement joints.","Check grout, edge treatment and surface protection."],
  "Granite":["Check approved slab selection, dimensions, edge profiles and support.","Inspect bond/setting, joints, level and slip-resistant treatment where required.","Protect finished surfaces and check defects."],
  "Stone Cladding":["Confirm stone type, cut sizes, backing and fixing method for the location.","Check alignment, anchors/adhesive, joints and edge detailing as specified.","Inspect bond/security and surface treatment before accepting work."],
  "Screed":["Check substrate preparation, levels and intended fall.","Verify thickness, bonding, finishing and curing/protection.","Confirm readiness for flooring/waterproofing layers."],
  "Screed Finish":["Check base screed soundness, level and surface preparation.","Inspect finishing consistency and required falls.","Protect the finished surface before subsequent trades."],
  "Terrace Treatment":["Check surface falls, dryness/preparation and terminations.","Verify compatible waterproofing system, coat continuity and detailing at penetrations.","Carry out project-required leak or ponding tests before covering."],
  "Drainage":["Verify pipe material, routing, gradient and access points from approved service drawings.","Inspect joints, support and clearances before concealing.","Test for leakage/flow using the approved inspection method."],
  "Water Supply Pipes":["Verify correct pipe class/size, routing and compatible fittings.","Inspect joining, support, insulation/protection and isolation arrangements.","Complete an approved pressure/leak test before concealment."],
  "Cables":["Check conductor type, size, protective routing and identification against approved electrical design.","Inspect bends, terminations, earthing and segregation.","Arrange qualified-person continuity/insulation tests before energising."],
  "Wiring Points":["Check circuit allocation, cable size, conduits and protective devices against approved design.","Inspect joints, labeling, boxes and earthing.","Test safety and operation using qualified personnel."],
  "Lighting":["Confirm fixture type, location, mounting and power rating against approved lighting layout.","Check secure installation, connections and protection rating where applicable.","Functional-test the fixture and controls after electrical safety checks."],
  "Fixtures":["Confirm model, fit, setting-out and connection interfaces.","Inspect mounting, sealants, drainage/water supply and clearances.","Test installed operation and check for leakage/damage."],
  "Air Conditioning":["Verify unit location, access, drainage and electrical design requirements.","Check mounting, refrigerant piping and condensate drainage workmanship.","Commission and record functional performance through qualified personnel."]
 };
 function checks(item,t){
  if(quality[t.work_type])return quality[t.work_type];
  if(t.family==="Electrical")return [
   "Check the selected component, rating, location and installation against approved electrical drawings.",
   "Inspect connections, earthing, enclosures and safe access to relevant equipment.",
   "Arrange required electrical tests and operation checks before handover."
  ];
  if(t.family==="Plumbing"||t.family==="Sanitary")return [
   "Check product/model, fixing and dimensions against approved plumbing/sanitary schedule.",
   "Inspect jointing, supports, water tightness and service accessibility.",
   "Test operation and record defects before closing or handing over."
  ];
  if(t.family==="Joinery")return [
   "Check timber/metal section, finish and dimensions against approved opening schedule.",
   "Inspect frames, fixing, alignment, hardware and movement clearances.",
   "Test operation and protect completed surfaces."
  ];
  return BASE;
 }
 root.JPConstructionGuide=Object.freeze({stages,sequence,checks});
})(typeof window!=="undefined"?window:globalThis);
