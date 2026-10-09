(() => {
  const D = window.JP_ESTIMATION_DATA;
  const $ = id => document.getElementById(id);
  const fmt = (n,d=2) => new Intl.NumberFormat("en-IN",{maximumFractionDigits:d}).format(Number(n||0));
  const money = n => "NPR " + new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(Math.round(Number(n||0)));
  let currentView = "dashboard";
  let state = {
    projectName:D.project.name,
    builtSqft:D.project.built_sqft,
    floors:D.project.floors
  };
  let last = null;
  let cr02State = {status:"loading", data:null, error:null};

  const titles = {
    dashboard:"Estimate Dashboard",
    takeoff:"Quantity Takeoff",
    boq:"BOQ / Cost Plan",
    analysis:"Rate Analysis",
    rates:"Rate Library",
    sources:"Source Registry",
    provenance:"Integration / Provenance"
  };

  function calculate(){
    state.projectName = $("projectName").value.trim() || "Untitled Project";
    state.builtSqft = Math.max(1, Number($("builtSqft").value || 0));
    state.floors = Math.max(1, Number($("floors").value || 1));
    const builtM2 = state.builtSqft * D.assumptions.SQFT_TO_M2;
    const items = D.workItems.map(w => {
      let factor = D.assumptions[w.factor_key];
      if(w.factor_key === "REBAR_KG_PER_M2_2F" && state.floors !== 2){
        factor = state.floors <= 1 ? 34 : 43;
      }
      const qty = builtM2 * factor;
      return {...w, factor, qty, amount:qty*w.rate};
    });
    const direct = items.reduce((s,x)=>s+x.amount,0);
    const overhead = direct * D.assumptions.OVERHEAD_PCT/100;
    const contingency = (direct + overhead) * D.assumptions.CONTINGENCY_PCT/100;
    last = {builtM2,items,direct,overhead,contingency,total:direct+overhead+contingency};
    render();
  }

  function metric(k,v,s){return '<div class="metric"><div class="k">'+k+'</div><div class="v">'+v+'</div><div class="s">'+s+'</div></div>'}
  function sourceBadge(text,kind="pending"){return '<span class="badge '+kind+'">'+text+'</span>'}

  async function loadCr02(){
    cr02State = {status:"loading",data:null,error:null};
    try{
      const response = await fetch("/api/cr02-rates",{headers:{Accept:"application/json"}});
      let payload = null;
      try { payload = await response.json(); } catch(_){}
      if(!response.ok || !payload || !payload.ok){
        const code = payload && (payload.error || payload.status) ? (payload.error || payload.status) : "CR02_API_UNAVAILABLE";
        throw new Error(code);
      }
      cr02State = {status:"ready",data:payload,error:null};
    }catch(error){
      cr02State = {status:"error",data:null,error:String(error && error.message ? error.message : error)};
    }
    if(["dashboard","rates","provenance"].includes(currentView)) render();
  }

  function cr02StatusBadge(){
    if(cr02State.status==="ready") return sourceBadge("CR02 READ-ONLY API LIVE","ready");
    if(cr02State.status==="loading") return sourceBadge("CR02 API CHECKING","pending");
    return sourceBadge("CR02 API CONFIG PENDING","demo");
  }

  function dashboard(){
    const sourceCoverage = 67;
    return '<div class="grid metrics">'+
      metric("Research-slice total",money(last.total),"5 seeded work items only")+
      metric("Built-up area",fmt(state.builtSqft,1)+" sq.ft",fmt(last.builtM2,1)+" m²")+
      metric("BOQ items",last.items.length,"Traceable vertical slice")+
      metric("Provenance coverage",sourceCoverage+"%","quantity + demo rate; norm pending")+
    '</div>'+
    '<div class="grid two">'+
      '<section class="panel"><div class="section-head"><div><h2>Cost composition</h2><p class="sub">Current research slice only.</p></div>'+sourceBadge("DEMO RATES","demo")+'</div>'+
      '<div class="progress-list">'+last.items.map(x=>{
        const pct = last.direct ? Math.max(3,x.amount/last.direct*100) : 0;
        return '<div class="progress-row"><span>'+x.name+'</span><div class="track"><div class="fill" style="width:'+pct.toFixed(1)+'%"></div></div><b>'+money(x.amount).replace("NPR ","")+'</b></div>';
      }).join("")+'</div></section>'+
      '<section class="panel"><h2>Research gate</h2><p class="sub">What is real now vs what is still intentionally blocked.</p>'+
        '<div class="notice"><b>Product is functional, but not tender-ready.</b><br>The visible estimate still uses the v0.1 benchmark/demo rates. A bounded canonical Kaski subset is mirrored in production Neon and displayed in the separate read-only Rate Library panel. The estimate still uses demo benchmark rates. DUDBC resource recipes remain pending.</div>'+
        '<div style="margin-top:14px;display:grid;gap:8px">'+
          '<div>'+sourceBadge("Quantity engine working","ready")+' <span class="muted">legacy benchmark basis</span></div>'+
          '<div>'+sourceBadge("BOQ working","ready")+' <span class="muted">5-item vertical slice</span></div>'+
          '<div>'+sourceBadge("DUDBC mapping pending","pending")+'</div>'+
          '<div>'+cr02StatusBadge()+' <span class="muted">'+(cr02State.status==="ready" ? (cr02State.data.counts.rate_observations+" canonical RO rows served from Neon") : "bounded Neon mirror exists; endpoint needs secure runtime configuration")+'</span></div>'+
          '<div>'+sourceBadge("Neon production schema live","ready")+' <span class="muted">source registry seeded</span></div>'+
        '</div></section>'+
    '</div>';
  }

  function takeoff(){
    return '<section class="panel"><div class="section-head"><div><h2>Quantity Takeoff</h2><p class="sub">Every quantity exposes its formula and source status.</p></div>'+sourceBadge("NO INVENTED MODEL QTY","ready")+'</div>'+
      '<div class="table-wrap"><table><thead><tr><th>Work ID</th><th>Item</th><th>Qty</th><th>Unit</th><th>Formula</th><th>Quantity source</th><th>Status</th></tr></thead><tbody>'+
      last.items.map(x=>'<tr><td class="code">'+x.work_id+'</td><td>'+x.name+'</td><td class="num">'+fmt(x.qty,3)+'</td><td>'+x.unit+'</td><td class="code">'+fmt(last.builtM2,3)+' × '+x.factor+'</td><td class="code">'+D.provenance.quantity_source_id+'</td><td>'+sourceBadge("BENCHMARK","demo")+'</td></tr>').join("")+
      '</tbody></table></div></section>';
  }

  function boq(){
    const rows = last.items.map((x,i)=>'<tr><td>'+(i+1)+'</td><td class="code">'+x.code+'</td><td>'+x.name+'</td><td class="num">'+fmt(x.qty,3)+'</td><td>'+x.unit+'</td><td class="num">'+money(x.rate)+'</td><td class="num">'+money(x.amount)+'</td><td>'+sourceBadge("DEMO","demo")+'</td></tr>').join("");
    return '<section class="panel"><div class="section-head"><div><h2>BOQ / Cost Plan</h2><p class="sub">'+state.projectName+' · research estimate '+D.project.estimate_version_id+'</p></div>'+sourceBadge("NOT TENDER BOQ","demo")+'</div>'+
      '<div class="table-wrap"><table><thead><tr><th>#</th><th>Code</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th><th>Rate status</th></tr></thead><tbody>'+rows+
      '<tr><td colspan="6"><b>Direct subtotal</b></td><td class="num"><b>'+money(last.direct)+'</b></td><td></td></tr>'+
      '<tr><td colspan="6">Overhead '+D.assumptions.OVERHEAD_PCT+'%</td><td class="num">'+money(last.overhead)+'</td><td></td></tr>'+
      '<tr><td colspan="6">Contingency '+D.assumptions.CONTINGENCY_PCT+'%</td><td class="num">'+money(last.contingency)+'</td><td></td></tr>'+
      '<tr><td colspan="6"><b>Research-slice total</b></td><td class="num"><b>'+money(last.total)+'</b></td><td></td></tr>'+
      '</tbody></table></div></section>';
  }

  function analysis(){
    return '<section class="panel"><div class="section-head"><div><h2>Rate Analysis</h2><p class="sub">The target architecture is resource-based. Current rows intentionally expose the missing DUDBC recipe layer.</p></div>'+sourceBadge("DUDBC RECIPE PENDING","pending")+'</div>'+
      last.items.map(x=>'<div class="analysis-card"><div><strong>'+x.code+'</strong><small>'+x.name+'</small></div>'+
        '<div class="trace"><span>Quantity → <b>'+D.provenance.quantity_source_id+'</b></span><span>Rate → <b>'+D.provenance.rate_source_id+'</b></span><span>Norm → <b>PENDING</b></span><small>Next: labour + material + equipment coefficients with clause/source provenance.</small></div>'+
        '<div class="money">'+money(x.rate)+' / '+x.unit+'<small>legacy lump unit rate</small></div></div>').join("")+
      '</section>';
  }

  function canonicalRatesPanel(){
    if(cr02State.status==="loading"){
      return '<section class="panel"><div class="section-head"><div><h2>Canonical CR-02 backend</h2><p class="sub">Checking the read-only production API.</p></div>'+cr02StatusBadge()+'</div><div class="empty">Loading canonical rate observations…</div></section>';
    }
    if(cr02State.status!=="ready"){
      const setup = cr02State.error==="CR02_DATABASE_URL_MISSING";
      return '<section class="panel"><div class="section-head"><div><h2>Canonical CR-02 backend</h2><p class="sub">The frontend is wired, but the server-side database connection is not active yet.</p></div>'+cr02StatusBadge()+'</div>'+
        '<div class="notice"><b>'+(setup ? "Secure Vercel environment variable required." : "Read-only API is currently unavailable.")+'</b><br>'+
        (setup ? 'Set <code>CR02_DATABASE_URL</code> in Vercel using the dedicated <code>cr02_api_reader</code> role. No credential belongs in browser code or Git.' : 'The demo estimator remains isolated from this failure. Error: <code>'+cr02State.error+'</code>')+
        '</div></section>';
    }

    const rows=cr02State.data.rates||[];
    return '<section class="panel"><div class="section-head"><div><h2>Canonical CR-02 backend</h2><p class="sub">Read-only production mirror. These rows come from governed <code>cr02</code> data, not the demo estimator seed.</p></div>'+cr02StatusBadge()+'</div>'+
      '<div class="grid metrics" style="margin-bottom:16px">'+
        metric("Canonical observations",rows.length,"served by /api/cr02-rates")+
        metric("Source records",cr02State.data.counts.sources,"governed source mirror")+
        metric("Rate analyses",cr02State.data.counts.rate_analysis,"headers in bounded slice")+
        metric("API mode",cr02State.data.mode,"server-side SELECT only")+
      '</div>'+
      '<div class="table-wrap"><table><thead><tr><th>RO ID</th><th>Material</th><th>Location</th><th>Unit</th><th>Rate</th><th>Source</th><th>Transport</th><th>Confidence</th></tr></thead><tbody>'+
      rows.map(r=>'<tr><td class="code">'+r.rate_observation_id+'</td><td><b>'+(r.material_name||r.subject_id)+'</b><br><span class="muted code">'+r.subject_id+'</span></td><td>'+(r.location_label||r.location_id||"—")+'</td><td>'+r.unit+'</td><td class="num"><b>'+money(r.rate_npr)+'</b></td><td class="code">'+r.source_id+'</td><td>'+r.transport_included+'</td><td>'+sourceBadge(r.confidence||r.status||"VERIFIED","ready")+'</td></tr>').join("")+
      '</tbody></table></div>'+
      '<div class="notice" style="margin-top:14px"><b>Read-only POC:</b> these canonical rows are displayed for lookup/provenance only. They do not replace the demo estimate calculation inputs in this phase.</div></section>';
  }

  function rates(){
    return canonicalRatesPanel()+
      '<section class="panel"><div class="section-head"><div><h2>Legacy demo rate seed</h2><p class="sub">Historical research estimator inputs retained separately until governed mapping replaces them item by item.</p></div>'+sourceBadge("DEMO / NOT OFFICIAL","demo")+'</div>'+
      '<div class="table-wrap"><table><thead><tr><th>Rate code</th><th>Item</th><th>Unit</th><th>Current seed</th><th>Source</th><th>Status</th></tr></thead><tbody>'+
      last.items.map(x=>'<tr><td class="code">'+x.rate_code+'</td><td>'+x.name+'</td><td>'+x.unit+'</td><td class="num">'+money(x.rate)+'</td><td class="code">'+D.provenance.rate_source_id+'</td><td>'+sourceBadge("DEMO / NOT OFFICIAL","demo")+'</td></tr>').join("")+
      '</tbody></table></div>'+
      '<div class="notice" style="margin-top:14px">The visible estimate still uses these legacy research values. Canonical CR-02 observations above remain a separate read-only reference until work-item/specification mapping is explicitly governed.</div></section>';
  }

  function sources(){
    return '<div class="grid source-grid">'+D.sourceRegistry.map(s=>
      '<article class="source-card"><h3>'+s.name+'</h3><p>'+s.role+'</p><div class="source-meta">'+sourceBadge(s.source_id,"ready")+sourceBadge(s.license,"pending")+'</div><p><b>Status:</b> '+s.status+'</p><a href="'+s.url+'" target="_blank" rel="noreferrer">Open source ↗</a></article>'
    ).join("")+'</div>';
  }

  function provenance(){
    return '<section class="panel"><h2>Provenance graph — current slice</h2><p class="sub">The product now exposes where each layer comes from instead of hiding it inside a single calculator.</p>'+
    '<div class="table-wrap"><table><thead><tr><th>Layer</th><th>Current authority/source</th><th>Status</th><th>Next replacement/integration</th></tr></thead><tbody>'+
      '<tr><td>Project / built-up area</td><td>User input</td><td>'+sourceBadge("ACTIVE","ready")+'</td><td>CAD / IFC / governed project model</td></tr>'+
      '<tr><td>Quantity coefficients</td><td class="code">'+D.provenance.quantity_source_id+'</td><td>'+sourceBadge("LEGACY BENCHMARK","demo")+'</td><td>Drawing/IFC/BBS traceable quantities</td></tr>'+
      '<tr><td>Work classification</td><td>JP research work IDs</td><td>'+sourceBadge("ACTIVE","ready")+'</td><td>IFC/QTO + Nepal mapping</td></tr>'+
      '<tr><td>Resource recipe</td><td>DUDBC source registered</td><td>'+sourceBadge("PARSE PENDING","pending")+'</td><td>Structured norm mapping</td></tr>'+
      '<tr><td>Resource prices</td><td>Kaski SRC-0005 bounded production mirror · current displayed values still '+D.provenance.rate_source_id+'</td><td>'+(cr02State.status==="ready" ? sourceBadge(cr02State.data.counts.rate_observations+" RO ROWS LIVE","ready") : cr02StatusBadge())+'</td><td>Govern compatible work-item/rate selection before replacing demo values</td></tr>'+
      '<tr><td>Persistence</td><td>Neon Postgres · jp_estimation / cr02</td><td>'+cr02StatusBadge()+'</td><td>'+(cr02State.status==="ready" ? "Read-only Vercel API connected; governed write workflows remain separate" : "Read-only API code deployed; secure Vercel env configuration pending")+'</td></tr>'+
    '</tbody></table></div></section>';
  }

  function render(){
    $("viewTitle").textContent = titles[currentView];
    const map={dashboard,takeoff,boq,analysis,rates,sources,provenance};
    $("view").innerHTML = map[currentView]();
    document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===currentView));
  }

  document.querySelectorAll(".nav-item[data-view]").forEach(b=>b.addEventListener("click",()=>{currentView=b.dataset.view;render();window.scrollTo({top:0,behavior:"smooth"});}));
  $("recalculate").addEventListener("click",calculate);
  $("exportBtn").addEventListener("click",()=>{
    const payload={system:"JP-CES Open Estimation Engine",version:D.version,project:state,result:last,sources:D.sourceRegistry,provenance:D.provenance};
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));
    a.download="jp_estimation_research_v0_1.json";a.click();URL.revokeObjectURL(a.href);
  });
  calculate();
  loadCr02();
})();