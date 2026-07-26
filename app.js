(() => {
  const $ = (id) => document.getElementById(id);
  const steps = [...document.querySelectorAll(".step")];
  let step = 0;
  let engineerTable = false;
  let rates = JSON.parse(JSON.stringify(JP_DATA.demoRateProfile));
  let lastResult = null;

  const fmtMoney = n => new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(Math.round(n || 0));
  const fmt = (n,d=2) => new Intl.NumberFormat("en-IN",{maximumFractionDigits:d}).format(n || 0);
  const val = id => $(id)?.value;
  const num = id => Number(val(id) || 0);

  function setEngineerMode(on){
    document.body.classList.toggle("show-engineer", on);
  }
  $("engineerMode").addEventListener("change", e => setEngineerMode(e.target.checked));

  function showEstimator(){
    $("landing").classList.add("hidden");
    $("results").classList.add("hidden");
    $("estimator").classList.remove("hidden");
    step = 0; renderStep();
  }

  function applyPreset(p){
    Object.entries(p).forEach(([k,v]) => { const el=$(k); if(el) el.value=v; });
  }

  $("startBlank").addEventListener("click", showEstimator);
  $("loadKumari").addEventListener("click", () => { showEstimator(); applyPreset(JP_DATA.kumariPreset); });

  function renderStep(){
    steps.forEach((s,i) => s.classList.toggle("hidden", i !== step));
    $("backBtn").style.visibility = step === 0 ? "hidden" : "visible";
    $("nextBtn").textContent = step === steps.length-1 ? "Calculate estimate" : "Next";
    $("progressText").textContent = `Step ${step+1} of ${steps.length}`;
    $("stepTitle").textContent = steps[step].querySelector("h2").textContent.replace(/^\d+\.\s*/,"");
    $("progressBar").style.width = `${((step+1)/steps.length)*100}%`;
    window.scrollTo({top:0,behavior:"smooth"});
  }
  $("backBtn").addEventListener("click",()=>{ if(step>0){step--;renderStep();}});
  $("nextBtn").addEventListener("click",()=>{
    if(step < steps.length-1){step++;renderStep();} else calculate();
  });

  function inputs(){
    const ids=["projectName","location","floors","gfArea","upperArea","hasPlan","slope","access","retaining","soil","bedrooms","bathrooms","kitchens","livingRooms","balconies","balconyArea","structure","wall","roof","roofWaterproof","finish","windowType","doorType","ceiling","sewer","ugt","oht","kitchenPackage","electrical","solar","ac","cctv","compound","compoundLength","pavingArea","landscaping"];
    const out={}; ids.forEach(id=>out[id]=$(id).value); return out;
  }

  function rate(code){ return Number(rates[code]?.rate || 0); }
  function addLine(lines, pk, category, simpleName, engineerName, qty, unit, rateCode, confidence, formula, active=true){
    if(!active || qty<=0) return;
    const r=rate(rateCode), amount=qty*r;
    lines.push({pk,category,simpleName,engineerName,qty,unit,rateCode,rate:r,amount,confidence,formula});
  }

  function calculate(){
    const i=inputs(), A=JP_DATA.assumptions;
    const floors=Number(i.floors), gf=Number(i.gfArea), upper=Number(i.upperArea);
    const builtSqft = gf + Math.max(0,floors-1)*upper;
    const builtM2 = builtSqft * 0.09290304;
    const floorM2 = builtM2 * A.FLOOR_FINISH_FACTOR;
    const slopeMult = i.slope==="flat"?1:i.slope==="gentle"?1.15:1.35;
    const accessMult = i.access==="easy"?1:i.access==="medium"?1.05:1.12;
    const soilMult = i.soil==="rock"?1.25:i.soil==="soft"?1.15:1;

    const excavation = builtM2*A.EXCAVATION_M3_PER_M2*slopeMult*soilMult;
    const pcc = builtM2*A.PCC_M3_PER_M2;
    const rcc = i.structure==="rcc" ? builtM2*A.RCC_CONCRETE_M3_PER_M2 : builtM2*0.12;
    const rebarCoeff = floors<=1?A.RCC_REBAR_KG_PER_M2_1F:(floors===2?A.RCC_REBAR_KG_PER_M2_2F:A.RCC_REBAR_KG_PER_M2_3PLUS);
    const rebar = i.structure==="rcc" ? builtM2*rebarCoeff : builtM2*12;
    const formwork = i.structure==="rcc" ? builtM2*A.FORMWORK_M2_PER_M2 : builtM2*0.7;
    const masonry = builtM2*A.MASONRY_M3_PER_M2;
    const plaster = builtM2*A.PLASTER_M2_PER_M2;
    const paint = builtM2*A.PAINT_M2_PER_M2;
    const backfill = excavation*A.BACKFILL_FACTOR;
    const bathrooms=Number(i.bathrooms), kitchens=Number(i.kitchens), bedrooms=Number(i.bedrooms), living=Number(i.livingRooms);
    const doorCount = Math.max(1, 1+bedrooms+bathrooms+kitchens+Math.max(0,floors-1));
    const windowCount = Math.max(4, Math.round(bedrooms*1.5 + bathrooms*.5 + kitchens + living*2 + floors));
    const electricPoints = Math.round(bedrooms*6+bathrooms*3+kitchens*8+living*8+floors*5+4);
    const roofBaseM2 = (floors>1?upper:gf)*0.09290304;
    const balconyM2 = Number(i.balconyArea)*0.09290304;
    const waterproofM2 = (i.roofWaterproof==="yes" && (i.roof==="flat"||i.roof==="mixed") ? roofBaseM2*A.FLAT_ROOF_WATERPROOF_FACTOR : 0) + bathrooms*A.BATH_WATERPROOF_M2_EACH + balconyM2*.6;
    const falseCeilingM2 = i.ceiling==="plaster"?0:(i.ceiling==="partialFalse"?builtM2*.25:builtM2*.75);

    const lines=[];
    addLine(lines,"BOQ-PRE-001","Preliminaries","Getting ready to build","Preliminaries & temporary works",1,"LS","PRELIM_LS","Medium","Lump-sum planning allowance");
    addLine(lines,"BOQ-EW-001","Earthworks","Digging for foundations","Foundation excavation",excavation,"m³","EXCAVATION_M3","Low",`Built-up area × ${A.EXCAVATION_M3_PER_M2} × site multipliers`);
    addLine(lines,"BOQ-EW-002","Earthworks","Refilling and compacting soil","Backfilling & compaction",backfill,"m³","BACKFILL_M3","Low",`Excavation × ${A.BACKFILL_FACTOR}`);
    addLine(lines,"BOQ-FND-001","Foundation","Concrete base below structure","PCC below foundations",pcc,"m³","PCC_M3","Low",`Built-up area × ${A.PCC_M3_PER_M2}`);
    addLine(lines,"BOQ-STR-001","Structure","Main structural concrete","RCC concrete",rcc,"m³","RCC_M3","Low",`Built-up area × structure coefficient`);
    addLine(lines,"BOQ-STR-002","Structure","Steel inside concrete","Reinforcement steel",rebar,"kg","REBAR_KG","Low",`Built-up area × ${rebarCoeff} kg/m² benchmark`);
    addLine(lines,"BOQ-STR-003","Structure","Moulds used to cast concrete","Formwork / shuttering",formwork,"m²","FORMWORK_M2","Low",`Built-up area × ${A.FORMWORK_M2_PER_M2}`);
    addLine(lines,"BOQ-WALL-001","Walls","Building the walls",`${i.wall} masonry`,masonry,"m³","MASONRY_M3","Low",`Built-up area × ${A.MASONRY_M3_PER_M2}`);
    addLine(lines,"BOQ-PLS-001","Finishes","Making walls smooth","Internal/external plaster",plaster,"m²","PLASTER_M2","Low",`Built-up area × ${A.PLASTER_M2_PER_M2}`);
    const floorRate=i.finish==="economy"?"FLOOR_M2_ECON":i.finish==="premium"?"FLOOR_M2_PREM":"FLOOR_M2_STD";
    addLine(lines,"BOQ-FLR-001","Finishes","Floor finish","Flooring & skirting allowance",floorM2,"m²",floorRate,"Medium",`Built-up area × ${A.FLOOR_FINISH_FACTOR}`);
    addLine(lines,"BOQ-PNT-001","Finishes","Painting the house","Wall & ceiling paint system",paint,"m²","PAINT_M2","Low",`Built-up area × ${A.PAINT_M2_PER_M2}`);
    const doorRate=i.doorType==="basic"?"DOOR_EACH_BASIC":i.doorType==="premium"?"DOOR_EACH_PREM":"DOOR_EACH_STD";
    addLine(lines,"BOQ-DR-001","Openings","Doors and locks","Door sets",doorCount,"No.",doorRate,"Medium","Room-count based door estimate");
    const winRate=i.windowType==="upvc"?"WINDOW_EACH_UPVC":i.windowType==="timber"?"WINDOW_EACH_TIMBER":"WINDOW_EACH_AL";
    addLine(lines,"BOQ-WIN-001","Openings","Windows","Window sets",windowCount,"No.",winRate,"Medium","Room-count based window estimate");
    addLine(lines,"BOQ-WP-001","Waterproofing","Preventing leakage","Roof/bathroom/balcony waterproofing",waterproofM2,"m²","WATERPROOF_M2","Medium","Wet-area + roof allowance");
    addLine(lines,"BOQ-SAN-001","Plumbing","Bathroom plumbing and fixtures","Bathroom package",bathrooms,"No.","BATHROOM_EACH","Medium","Bathroom count");
    const kitRate=i.kitchenPackage==="basic"?"KITCHEN_BASIC":i.kitchenPackage==="premium"?"KITCHEN_PREM":"KITCHEN_STD";
    addLine(lines,"BOQ-KIT-001","Kitchen","Kitchen work","Kitchen package",kitchens,"No.",kitRate,"Medium","Kitchen count × package");
    addLine(lines,"BOQ-ELE-001","Electrical","Lights, fans, sockets and power","Electrical points",electricPoints,"Point","ELECTRICAL_POINT","Medium","Room-based point count");
    addLine(lines,"BOQ-DW-001","Drainage","Septic tank and soak pit","Septic system",1,"LS","SEPTIC_LS","Low","Planning allowance",i.sewer==="septic");
    addLine(lines,"BOQ-WS-001","Water supply","Underground water storage","Underground water tank",1,"LS","UGT_LS","Low","Planning allowance",i.ugt==="yes");
    addLine(lines,"BOQ-WS-002","Water supply","Overhead water storage","Overhead tank & connection",1,"LS","OHT_LS","Medium","Planning allowance",i.oht==="yes");
    addLine(lines,"BOQ-ROOF-001","Roof","Sloped roof","Roof frame & covering",roofBaseM2,"m²","SLOPED_ROOF_M2","Low","Top-floor plan area",i.roof==="sloped"||i.roof==="mixed");
    addLine(lines,"BOQ-CLG-001","Ceiling","False ceiling","False ceiling",falseCeilingM2,"m²","FALSE_CEILING_M2","Medium","Selected ceiling coverage",falseCeilingM2>0);
    addLine(lines,"BOQ-EXT-001","External works","Boundary wall","Compound wall",Number(i.compoundLength),"m","COMPOUND_WALL_M","Medium","User-entered length",i.compound==="yes");
    addLine(lines,"BOQ-EXT-002","External works","Driveway / paving","Paving",Number(i.pavingArea)*0.09290304,"m²","PAVING_M2","High","User-entered area",Number(i.pavingArea)>0);
    addLine(lines,"BOQ-EXT-003","External works","Basic landscaping","Landscaping allowance",1,"LS","LANDSCAPE_LS","Low","Lump-sum allowance",i.landscaping==="yes");
    addLine(lines,"BOQ-OPT-001","Optional systems","Solar provision","Solar allowance",1,"LS","SOLAR_LS","Low","Planning allowance",i.solar==="yes");
    addLine(lines,"BOQ-OPT-002","Optional systems","AC provision","AC points",bedrooms+living,"Point","AC_POINT","Medium","Bedrooms + living rooms",i.ac==="yes");
    addLine(lines,"BOQ-OPT-003","Optional systems","CCTV security","CCTV allowance",1,"LS","CCTV_LS","Low","Lump-sum allowance",i.cctv==="yes");
    addLine(lines,"BOQ-EXT-004","External works","Retaining wall allowance","Retaining wall planning allowance",Math.max(8,Math.sqrt(gf*0.09290304)*2),"m","RETAINING_M","Low","Planning placeholder only",i.retaining==="yes");

    lines.forEach(l=>l.amount*=accessMult);
    const directSubtotal=lines.reduce((s,l)=>s+l.amount,0);
    const overhead=directSubtotal*A.OVERHEAD_PROFIT_PCT/100;
    const contingency=(directSubtotal+overhead)*A.CONTINGENCY_PCT/100;
    const total=directSubtotal+overhead+contingency;
    const costPerSqft=total/builtSqft;

    const cats={}; lines.forEach(l=>cats[l.category]=(cats[l.category]||0)+l.amount);
    cats["Overhead & contingency"]=overhead+contingency;

    let score=40;
    if(i.hasPlan==="yes") score+=12;
    if(i.soil!=="unknown") score+=8;
    if(i.retaining!=="unsure") score+=5;
    if(Number(i.bedrooms)+Number(i.bathrooms)+Number(i.kitchens)>0) score+=10;
    if(i.sewer!=="unknown") score+=5;
    if(Number(i.compoundLength)>0 || i.compound==="no") score+=5;
    score=Math.min(score,85);
    const level=score>=75?"Level 2+ Planning Estimate":score>=60?"Level 2 Planning Estimate":"Level 1 Quick Estimate";

    lastResult={inputs:i,builtSqft,builtM2,lines,cats,directSubtotal,overhead,contingency,total,costPerSqft,score,level,
      quantities:{excavation,pcc,rcc,rebar,formwork,masonry,plaster,paint,doorCount,windowCount,electricPoints,waterproofM2}
    };
    renderResults(lastResult);
  }

  function renderResults(r){
    $("estimator").classList.add("hidden"); $("landing").classList.add("hidden"); $("results").classList.remove("hidden");
    $("resultProject").textContent=r.inputs.projectName; $("resultLocation").textContent=r.inputs.location;
    $("metrics").innerHTML=[
      ["Preliminary total",`NPR ${fmtMoney(r.total)}`,"Demo rate profile"],
      ["Cost per sq.ft",`NPR ${fmtMoney(r.costPerSqft)}`,"Planning figure"],
      ["Built-up area",`${fmt(r.builtSqft,1)} sq.ft`,`${fmt(r.builtM2,1)} m²`],
      ["Readiness",`${r.score}%`,r.level]
    ].map(x=>`<div class="metric"><div class="k">${x[0]}</div><div class="v">${x[1]}</div><div class="s">${x[2]}</div></div>`).join("");

    const entries=Object.entries(r.cats).sort((a,b)=>b[1]-a[1]), max=Math.max(...entries.map(x=>x[1]));
    $("costBars").innerHTML=entries.map(([k,v])=>`<div class="bar-row"><div class="bar-label">${k}</div><div class="bar-track"><div class="bar-fill" style="width:${(v/max*100).toFixed(1)}%"></div></div><div class="bar-value">NPR ${fmtMoney(v)}</div></div>`).join("");

    const readiness=[
      ["Architectural plan", r.inputs.hasPlan==="yes"?"Available":"Not supplied", r.inputs.hasPlan==="yes"?"good":"warn"],
      ["Room counts","Available","good"],
      ["Structural drawings","Not connected in v0.1","bad"],
      ["Reinforcement schedule","Estimated by benchmark only","bad"],
      ["MEP drawings","Not connected in v0.1","bad"],
      ["Current approved rates","DEMO rates loaded","warn"]
    ];
    $("readinessBadge").textContent=r.level;
    $("readiness").innerHTML=readiness.map(x=>`<div class="readiness-item"><span>${x[0]}</span><span class="status ${x[2]}">${x[1]}</span></div>`).join("");

    renderBoq();
    renderAssumptions(r);
    renderRates();
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function renderBoq(){
    if(!lastResult)return;
    $("civilianTab").classList.toggle("active",!engineerTable); $("engineerTab").classList.toggle("active",engineerTable);
    if(!engineerTable){
      $("boqHead").innerHTML="<tr><th>What you are paying for</th><th>Category</th><th>Approx. quantity</th><th>Amount</th><th>Confidence</th></tr>";
      $("boqBody").innerHTML=lastResult.lines.map(l=>`<tr><td>${l.simpleName}</td><td>${l.category}</td><td class="num">${fmt(l.qty)} ${l.unit}</td><td class="num">NPR ${fmtMoney(l.amount)}</td><td>${l.confidence}</td></tr>`).join("");
    }else{
      $("boqHead").innerHTML="<tr><th>BOQ PK</th><th>Engineering item</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th><th>Formula / basis</th></tr>";
      $("boqBody").innerHTML=lastResult.lines.map(l=>`<tr><td>${l.pk}</td><td>${l.engineerName}</td><td class="num">${fmt(l.qty,3)}</td><td>${l.unit}</td><td class="num">NPR ${fmtMoney(l.rate)}</td><td class="num">NPR ${fmtMoney(l.amount)}</td><td>${l.formula}</td></tr>`).join("");
    }
  }
  $("civilianTab").addEventListener("click",()=>{engineerTable=false;renderBoq()});
  $("engineerTab").addEventListener("click",()=>{engineerTable=true;renderBoq()});

  function renderAssumptions(r){
    const A=JP_DATA.assumptions;
    const items=[
      ["Structural quantities","Calculated with benchmark coefficients, not member-by-member structural drawings."],
      ["Floor-to-floor height",`${A.DEFAULT_STOREY_HEIGHT_M.toFixed(1)} m working assumption in the engineering model where height is needed later.`],
      ["RCC concrete benchmark",`${A.RCC_CONCRETE_M3_PER_M2} m³ per m² of built-up area in RCC mode.`],
      ["Reinforcement benchmark",`${r.inputs.floors<=1?A.RCC_REBAR_KG_PER_M2_1F:(r.inputs.floors==="2"?A.RCC_REBAR_KG_PER_M2_2F:A.RCC_REBAR_KG_PER_M2_3PLUS)} kg per m² depending on floor count.`],
      ["Formwork benchmark",`${A.FORMWORK_M2_PER_M2} m² formwork per m² built-up area.`],
      ["Overhead & profit",`${A.OVERHEAD_PROFIT_PCT}% of direct cost.`],
      ["Contingency",`${A.CONTINGENCY_PCT}% after overhead/profit.`],
      ["Rate status","All rates in v0.1 are demo values for system testing, not approved Pokhara market rates."]
    ];
    $("assumptions").innerHTML=items.map(x=>`<div class="assumption"><b>${x[0]}</b><small>${x[1]}</small></div>`).join("");
  }

  function renderRates(){
    $("rateEditor").innerHTML=Object.entries(rates).map(([code,o])=>`<div class="rate-item"><label>${o.label}<input data-rate="${code}" type="number" value="${o.rate}"></label><small>${code} · ${o.unit}</small></div>`).join("");
  }
  $("recalcRates").addEventListener("click",()=>{
    document.querySelectorAll("[data-rate]").forEach(el=>{rates[el.dataset.rate].rate=Number(el.value||0)});
    const wasResults=!$("results").classList.contains("hidden");
    if(lastResult){
      applyPreset(lastResult.inputs);
      calculate();
    }
  });
  $("resetRates").addEventListener("click",()=>{rates=JSON.parse(JSON.stringify(JP_DATA.demoRateProfile));renderRates();});

  $("editEstimate").addEventListener("click",()=>{$("results").classList.add("hidden");$("estimator").classList.remove("hidden");step=0;renderStep()});
  $("printReport").addEventListener("click",()=>window.print());
  $("exportJson").addEventListener("click",()=>{
    if(!lastResult)return;
    const blob=new Blob([JSON.stringify({system:"JP-CES",version:JP_DATA.version,result:lastResult},null,2)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=(lastResult.inputs.projectName||"project").replace(/\s+/g,"_")+"_estimate.json"; a.click(); URL.revokeObjectURL(a.href);
  });

  $("floors").addEventListener("change",()=>{$("upperAreaLabel").style.opacity=Number($("floors").value)>1?"1":".45"});
  renderStep();
})();
