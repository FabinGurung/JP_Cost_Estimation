(() => {
  "use strict";
  const D = window.JP_RATE_INTELLIGENCE_DATA;
  const K = window.JP_KNOWN_RATES_DATA;
  const $ = id => document.getElementById(id);
  const fmt = (v, places=2) => Number(v).toLocaleString("en-IN",{maximumFractionDigits:places});
  const text = v => String(v === null || v === undefined ? "" : v);
  const safe = v => text(v).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const label = v => text(v) || "Not specified";
  const isFiniteNumber = v => v !== "" && v !== null && Number.isFinite(Number(v));
  const knownRates = Array.isArray(K && K.entries) ? K.entries : [];
  let canonical = {status:"loading", rates:[], analyses:[], sources:[], error:"",origin:null};
  let exportPayload = null;
  let rowSequence = 0;

  function navigate(name) {
    const panels = {rates:"rateLibraryPanel",analysis:"rateAnalysisPanel",sources:"rateSourcesPanel"};
    if(!Object.hasOwn(panels,name))return;
    Object.values(panels).forEach(id => { $(id).hidden = id !== panels[name]; });
    document.querySelectorAll("[data-rate-view]").forEach(n => n.classList.toggle("active",n.dataset.rateView===name));
    document.querySelectorAll("[data-jump-view]").forEach(n => n.classList.toggle("active",n.dataset.jumpView===name));
    $("viewTitle").textContent = {rates:"Rate Library",analysis:"Rate Analysis",sources:"Sources & Provenance"}[name];
    if (name === "rates") renderRates();
    if (name === "sources") renderSources();
    const node=$("rateWorkspace");window.scrollTo({top:Math.max(0,node.getBoundingClientRect().top + window.scrollY - 96),behavior:"smooth"});
  }
  document.querySelectorAll("[data-jump-view]").forEach(btn => btn.addEventListener("click",()=>navigate(btn.dataset.jumpView)));
  document.querySelectorAll("[data-rate-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      navigate(btn.dataset.rateView);
    });
  });

  function rateCard(r) {
    const location = label(r.location);
    const date = label(r.date);
    const amount = isFiniteNumber(r.rate) ? "NPR " + fmt(r.rate) : "Unavailable";
    const tags = "<span class='badge " + (r.kind === "Canonical" ? "ready" : "demo") + "'>" + safe(r.kind) + "</span>";
    return "<article class='rate-entry'>" +
      "<div class='rate-entry-head'><div><span class='code'>" + safe(r.id) + "</span><h3>" + safe(r.name) +
      "</h3><p>" + safe(r.specification) + "</p></div><div class='rate-price'><strong>" + safe(amount) +
      "</strong><span>per " + safe(label(r.unit)) + "</span></div></div>" +
      "<div class='rate-entry-tags'>" + tags + "<span class='badge pending'>SOURCE " + safe(label(r.source)) + "</span>" +
      "<span class='badge pending'>" + safe(label(r.status)) + "</span></div>" +
      "<dl class='rate-evidence'>" +
      "<div><dt>Location</dt><dd>" + safe(location) + "</dd></div>" +
      "<div><dt>Effective date</dt><dd>" + safe(date) + "</dd></div>" +
      "<div><dt>Basis / scope</dt><dd>" + safe(label(r.basis)) + "</dd></div>" +
      "<div><dt>Transport</dt><dd>" + safe(label(r.transport)) + "</dd></div>" +
      "<div><dt>Tax</dt><dd>" + safe(label(r.tax)) + "</dd></div>" +
      "<div><dt>Authority</dt><dd>" + safe(r.kind === "Canonical" ? "Governed CR-02 observation (verify source)" : "User-known reference only") + "</dd></div>" +
      "</dl></article>";
  }

  function normalizeKnown(k) {
    return {
      kind:"User-known",
      id:k.known_rate_id, name:k.work_name,
      specification:(k.aliases || []).join(" · "),
      rate:k.rate_npr,unit:k.unit,source:k.source_label || k.source_type,
      location:k.location,date:k.effective_date,status:k.status,
      basis:k.rate_basis + "; includes: " + (k.included || []).join(", ") + "; excludes: " + (k.excluded || []).join(", "),
      transport:(k.unspecified || []).some(x=>/transport/i.test(x)) ? "Not specified" : k.transport_included,
      tax:(k.unspecified || []).some(x=>/tax/i.test(x)) ? "Not specified" : k.tax_included
    };
  }

  function normalizeCanonical(r) {
    return {
      kind:"Canonical",id:r.rate_observation_id,name:r.material_name || r.subject_id,
      specification:[r.material_specification,r.variant_spec,r.subject_id].filter(Boolean).join(" · "),
      rate:r.rate_npr,unit:r.unit,source:r.source_id,location:r.location_label || r.location_id,
      date:r.effective_date,status:r.status || r.confidence,basis:r.rate_basis,
      transport:r.transport_included,tax:r.tax_included
    };
  }

  function renderRates() {
    const query=$("rateSearch").value.trim().toLowerCase();
    const cls=$("rateClass").value;
    const all=[
      ...(cls !== "known" && canonical.status==="ready" ? canonical.rates.map(normalizeCanonical) : []),
      ...(cls !== "canonical" ? knownRates.map(normalizeKnown) : [])
    ];
    const list=all.filter(r => Object.values(r).some(v => text(v).toLowerCase().includes(query)));
    $("rateMetrics").innerHTML =
      "<span><strong>" + knownRates.length + "</strong> user-known entries</span>" +
      "<span><strong>" + (canonical.status==="ready"?canonical.rates.length:"—") + "</strong> canonical observations (" + safe(canonical.origin||"unavailable") + ")</span>" +
      "<span><strong>" + list.length + "</strong> shown</span>";
    $("rateResults").innerHTML = list.length ? list.map(rateCard).join("") :
      "<div class='panel'><h2>No matching accessible rate observations</h2><p class='sub'>Clear the search or try another source class. Unavailable canonical rows are not replaced with guessed prices.</p></div>";
    $("rateStatus").textContent = canonical.status==="ready" ?
      (canonical.origin==="LIVE_READ_ONLY_API" ?
       "LIVE CR-02 read-only API available. Observations are source-linked but not automatically approved project prices." :
       "DATED STATIC SNAPSHOT · Kaski District FY 2083/84 · source observation snapshot 2026-10-09. These are NOT live current prices. Tax/transport unknowns are retained. Open the AEC Master for updated records.") :
      canonical.status==="loading" ? "Checking canonical read-only API and dated public snapshot…" :
      "Canonical source unavailable (" + canonical.error + "). No guessed government prices are displayed; user-known references remain searchable.";
  }

  async function loadCanonical() {
    let liveError="";
    try {
      const response = await fetch("/api/cr02-rates",{headers:{"Accept":"application/json"}});
      if(!response.ok)throw new Error("API_HTTP_"+response.status);
      const payload = await response.json();
      if(!payload || payload.ok !== true || !Array.isArray(payload.rates))throw new Error("INVALID_API_RESULT");
      canonical = {status:"ready",rates:payload.rates,analyses:payload.analyses||[],sources:payload.sources||[],error:"",origin:"LIVE_READ_ONLY_API"};
    }catch(error) {
      liveError=text(error && error.message || error);
      try {
        const response=await fetch("public-kaski-rates-v0.5.1.json",{headers:{"Accept":"application/json"}});
        if(!response.ok)throw new Error("SNAPSHOT_HTTP_"+response.status);
        const payload=await response.json();
        if(payload.schema!=="JP_CES_PUBLIC_GOVERNMENT_RATE_OBSERVATION_SNAPSHOT"||
            payload.snapshot_date!=="2026-10-09"||!Array.isArray(payload.rates)||
            payload.rates.some(r=>r.source_id!=="SRC-0005")) throw new Error("INVALID_SNAPSHOT_SCHEMA");
        canonical = {status:"ready",rates:payload.rates,analyses:[],sources:[],error:liveError,origin:"STATIC_SNAPSHOT_2026-10-09"};
      }catch(snapshotError) {
        canonical={status:"unavailable",rates:[],analyses:[],sources:[],error:"API: "+liveError+"; snapshot: "+text(snapshotError && snapshotError.message || snapshotError),origin:null};
      }
    }
    renderRates();
  }

  function renderSources() {
    $("sourceList").innerHTML = D.sources.map(s =>
      "<article class='source-card'><h3>" + safe(s.name) + "</h3><p>" + safe(s.role) +
      "</p><div class='source-meta'><span class='badge pending'>" + safe(s.id) +
      "</span><span class='badge pending'>" + safe(s.status) +
      "</span></div><a href='" + safe(s.url) + "' target='_blank' rel='noopener noreferrer'>Open source ↗</a></article>"
    ).join("");
  }

  function addResource() {
    const number = ++rowSequence;
    const tr = document.createElement("tr");
    tr.dataset.rowNumber = String(number);
    const configs = [
      {key:"resource",kind:"text",placeholder:"e.g. cement"},
      {key:"category",kind:"select"},
      {key:"qty",kind:"number",placeholder:"0.0000"},
      {key:"unit",kind:"text",placeholder:"e.g. bag"},
      {key:"waste",kind:"number",value:"0"},
      {key:"price",kind:"number",placeholder:"NPR"},
      {key:"source",kind:"text",placeholder:"RO-... / quote ID"}
    ];
    configs.forEach(c => {
      const td = document.createElement("td");
      let control;
      if(c.kind==="select") {
        control=document.createElement("select");
        ["Material","Labour","Equipment / Machinery","Transport","Other direct cost"].forEach(v=> {
          const opt=document.createElement("option"); opt.value=v;opt.textContent=v;control.appendChild(opt);
        });
      } else {
        control=document.createElement("input");
        control.type=c.kind;control.placeholder=c.placeholder || "";
        if(c.kind==="number") {control.step="any";control.min="0";}
        if(c.value!==undefined)control.value=c.value;
      }
      control.dataset.field=c.key;
      control.setAttribute("aria-label",c.key+" row "+number);
      control.addEventListener("input",calculateDraft);
      control.addEventListener("change",calculateDraft);
      td.appendChild(control);tr.appendChild(td);
    });
    const costCell=document.createElement("td");costCell.className="num";costCell.dataset.amount="";costCell.textContent="—";tr.appendChild(costCell);
    const removeCell=document.createElement("td");const remove=document.createElement("button");remove.type="button";remove.className="btn rate-remove";remove.textContent="Remove";remove.setAttribute("aria-label","Remove resource row "+number);
    remove.addEventListener("click",()=>{tr.remove();calculateDraft();});
    removeCell.appendChild(remove);tr.appendChild(removeCell);
    $("resourceRows").appendChild(tr);
    calculateDraft();
  }

  function readRow(tr) {
    const g=key=>tr.querySelector('[data-field="'+key+'"]').value.trim();
    const qty=g("qty"),waste=g("waste"),price=g("price");
    const entries=[qty,waste,price];
    const values=entries.map(Number);
    const valid=Boolean(g("resource") && g("unit") && g("source") && entries.every(isFiniteNumber) &&
      values[0]>0 && values[1]>=0 && values[2]>=0);
    const effectiveQuantity=valid?values[0]*(1+values[1]/100):null;
    const amount=valid?effectiveQuantity*values[2]:null;
    tr.querySelector("[data-amount]").textContent=valid ? "NPR "+fmt(amount,4) : "—";
    return {resource:g("resource"),category:g("category"),consumption_qty:qty===""?null:values[0],resource_unit:g("unit"),waste_pct:waste===""?null:values[1],unit_price_npr:price===""?null:values[2],price_source_id:g("source"),effective_qty:effectiveQuantity,amount_npr:amount,valid:valid,formula:valid?"("+values[0]+" × (1 + "+values[1]+" / 100)) × "+values[2]:null};
  }

  function calculateDraft() {
    const components=[...$("resourceRows").children].map(readRow);
    const hasRows=components.length>0;
    const hasHeader=Boolean($("analysisName").value.trim() && $("analysisCode").value.trim() && $("outputUnit").value.trim());
    const allValid=hasRows && hasHeader && components.every(c=>c.valid);
    const direct=allValid?components.reduce((s,c)=>s+c.amount_npr,0):null;
    exportPayload={
      system:"JP Cost & Rate Intelligence",
      version:D.version,
      status:"DRAFT_UNVERIFIED",
      calculation_status:allValid?"COMPLETE_DRAFT":"INCOMPLETE",
      work_item_id:$("analysisCode").value.trim() || null,
      work_description:$("analysisName").value.trim() || null,
      finished_output_qty:1,
      finished_output_unit:$("outputUnit").value.trim() || null,
      formula:"Σ [resource_consumption_qty × (1 + waste_pct/100) × resource_unit_price_npr]",
      components:components,
      direct_rate_npr_per_finished_unit:direct,
      markups_applied:[],
      canonical_persistence:false,
      measurement_source:"NOT_APPLICABLE — NO CAD QTO",
      notes:"Manual source IDs have not been independently verified by this draft tool."
    };
    $("analysisResult").innerHTML=!hasRows?"Add resource rows to begin. No calculated rate exists yet.":
      !allValid?"<strong>INCOMPLETE — no unit rate calculated.</strong> Enter a work ID, work description and finished unit, and complete every resource row including source/evidence ID, quantity, unit, waste percentage and unit price.":
      "<strong>Draft direct unit rate: NPR "+fmt(direct,4)+" per "+safe($("outputUnit").value.trim())+"</strong><p>"+components.length+" resource lines × visible coefficients and prices. DRAFT / NOT APPROVED. No additional overhead, tax or profit applied.</p>";
  }

  $("addResource").addEventListener("click",addResource);
  ["analysisCode","analysisName","outputUnit"].forEach(id=>$(id).addEventListener("input",calculateDraft));
  $("exportAnalysis").addEventListener("click",()=>{
    calculateDraft();
    const data=JSON.stringify({...exportPayload,exported_at:new Date().toISOString()},null,2);
    const url=URL.createObjectURL(new Blob([data],{type:"application/json"}));
    const a=document.createElement("a");a.href=url;a.download="jp_rate_analysis_draft_v0.5.0.json";a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $("rateSearch").addEventListener("input",renderRates);
  $("rateClass").addEventListener("change",renderRates);
  renderSources();calculateDraft();renderRates();loadCanonical();
  const requestedView=new URLSearchParams(window.location.search).get("view");
  if(["analysis","sources","rates"].includes(requestedView))navigate(requestedView);
})();