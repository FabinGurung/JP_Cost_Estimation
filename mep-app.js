/* v0.5.9 Mechanical, Electrical & Plumbing pages. Read-only derived projection from source JSON. */
(() => {
 "use strict";
 const $=id=>document.getElementById(id);
 const route=window.JPMep,units=window.JPRateUnits,mode=document.body.dataset.mepTrade;
 if(!route||!units||!route.trades[mode]&&mode!=="hub")return;
 const state={rows:[],labels:{},tax:{},page:0,counts:null};
 const PAGE=20;
 function error(message){const status=$("mepStatus");if(status)status.textContent=message;const tbody=$("mepRows");if(tbody){const tr=document.createElement("tr"),td=document.createElement("td");td.colSpan=3;td.className="work-empty";td.textContent=message;tr.appendChild(td);tbody.replaceChildren(tr);}}
 function load(path){return fetch(path,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error(path+" HTTP "+r.status);return r.json();});}
 Promise.all([
  load("data/historical-work-rates-v0.5.3.json"),
  load("data/work-rate-labels-v0.5.4.json"),
  load("data/work-rate-taxonomy-v0.5.5.json")
 ]).then(([catalog,short,tax])=>{
  if(catalog.schema!=="jp-cres.historical_work_rates.public_three_column_projection.v0.5.3"||
    short.schema!=="jp-cres.curated_short_labels.v0.5.4"||
    tax.schema!=="jp-cres.editorial_taxonomy_comparison.v0.5.5"||
    Object.keys(short.labels||{}).length!==204||Object.keys(tax.records||{}).length!==204||
    catalog.items?.length!==204)throw Error("Source integrity checks failed");
  state.counts=route.check(catalog.items,tax.records);
  state.rows=catalog.items;state.labels=short.labels;state.tax=tax.records;
  if(mode==="hub"){
   for(const trade of Object.keys(route.trades)){
    const n=document.querySelector('[data-mep-count="'+trade+'"]');
    if(n)n.textContent=state.counts.visible[trade];
   }
   $("mepTotal").textContent=Object.values(state.counts.visible).reduce((a,b)=>a+b,0);
   return;
  }
  setup();
 }).catch(err=>{if(mode==="hub"){const s=$("mepTotal");if(s)s.textContent="Unavailable";}error("MEP source records could not be loaded: "+err.message);});
 function setup(){
  const search=$("mepSearch"),category=$("mepCategory"),version=$("mepWorksheet"),measurement=$("mepUnits"),sort=$("mepSort");
  const status=$("mepStatus"),body=$("mepRows"),summary=$("mepPageSummary"),prev=$("mepPrev"),next=$("mepNext");
  const params=new URLSearchParams(window.location.search);
  version.value=["visible","hidden"].includes(params.get("version"))?params.get("version"):"visible";
  measurement.value=["si","imperial"].includes(params.get("units"))?params.get("units"):units.preferred();
  const all=()=>route.partition(state.rows,state.tax,version.value)[mode];
  function fillCategories(){
   const keep=category.value;
   while(category.options.length>1)category.remove(1);
   const categories=[...new Set(all().map(row=>route.displayCategory(row,state.tax[row.id],mode)))];
   categories.sort((a,b)=>a.localeCompare(b));
   for(const title of categories){
    const opt=document.createElement("option");opt.value=title;opt.textContent=title;category.appendChild(opt);
   }
   category.value=categories.includes(keep)?keep:"all";
  }
  function filtered(){
   const q=search.value.trim();
   const out=all().filter(row=>{
    const t=state.tax[row.id],kind=route.displayCategory(row,t,mode);
    return (category.value==="all"||kind===category.value)&&
      units.match([state.labels[row.id],row.description,kind,row.unit,t.family,t.variant,row.section].join(" "),q);
   });
   if(sort.value==="trade")out.sort((a,b)=>route.phaseOf(a,state.tax[a.id],mode)-route.phaseOf(b,state.tax[b.id],mode)||state.rows.indexOf(a)-state.rows.indexOf(b));
   if(sort.value==="title")out.sort((a,b)=>state.labels[a.id].localeCompare(state.labels[b.id]));
   if(sort.value==="low")out.sort((a,b)=>units.convert(a.rate,a.unit,measurement.value).rate-units.convert(b.rate,b.unit,measurement.value).rate);
   if(sort.value==="high")out.sort((a,b)=>units.convert(b.rate,b.unit,measurement.value).rate-units.convert(a.rate,a.unit,measurement.value).rate);
   return out;
  }
  function render(){
   const found=filtered(),lastPage=Math.max(0,Math.ceil(found.length/PAGE)-1);
   state.page=Math.max(0,Math.min(state.page,lastPage));
   const start=state.page*PAGE,shown=found.slice(start,start+PAGE),fragment=document.createDocumentFragment();
   let lastCategory=null;
   for(const row of shown){
    const t=state.tax[row.id],kind=route.displayCategory(row,t,mode);
    if(sort.value==="trade"&&kind!==lastCategory){
     const tr=document.createElement("tr");tr.className="mep-group-row";
     const td=document.createElement("td");td.colSpan=3;
     const emoji=document.createElement("span");emoji.textContent=route.iconFor(row,t,mode);emoji.setAttribute("aria-hidden","true");
     const label=document.createElement("span");label.textContent=kind;
     td.append(emoji,label);tr.appendChild(td);fragment.appendChild(tr);lastCategory=kind;
    }
    const tr=document.createElement("tr");
    const work=document.createElement("td");work.className="work-description-cell";
    const kicker=document.createElement("small");kicker.className="mep-category-kicker";kicker.textContent=kind;
    const inner=document.createElement("div");inner.className="mep-row-inner";
    const icon=document.createElement("span");icon.className="mep-item-emoji";icon.textContent=route.iconFor(row,t,mode);icon.setAttribute("aria-hidden","true");
    const link=document.createElement("a");link.className="work-name-link";
    link.href="rate-specifications.html?id="+encodeURIComponent(row.id)+"&trade="+encodeURIComponent(mode);
    link.textContent=state.labels[row.id];
    link.title="Read original Excel work description and general quality guidance";
    inner.append(icon,link);work.append(kicker,inner);
    const converted=units.rateText(row.rate,row.unit,measurement.value);
    const u=document.createElement("td");u.className="work-unit-cell";u.textContent=converted.unit;u.title=converted.derived?"Converted from "+row.unit:"Original workbook unit: "+row.unit;
    const price=document.createElement("td");price.className="work-price-cell";
    const number=document.createElement("span");number.className="mep-rate-pill";number.textContent=converted.formatted;
    price.title=converted.derived?"Calculated equivalent of NPR "+units.rateText(row.rate,row.unit,"si").formatted+" per "+row.unit:"Source workbook rate";
    price.appendChild(number);tr.append(work,u,price);fragment.appendChild(tr);
   }
   if(!shown.length){const tr=document.createElement("tr"),td=document.createElement("td");td.colSpan=3;td.className="work-empty";td.textContent="No matching work items. Try changing your search or category.";tr.appendChild(td);fragment.appendChild(tr);}
   body.replaceChildren(fragment);
   $("mepTradeCount").textContent=all().length;
   $("mepDisplayMode").textContent=measurement.value==="si"?"SI":"Imperial";
   $("mepSourceName").textContent=version.value==="visible"?"Visible tabs":"Hidden tabs";
   status.textContent=found.length+" "+route.trades[mode].name.toLowerCase()+" work items · "+(version.value==="visible"?"Visible":"Hidden")+" Excel worksheets · Unverified reference rates";
   summary.textContent=found.length?(start+1)+"–"+Math.min(start+PAGE,found.length)+" of "+found.length+" · Page "+(state.page+1)+" of "+(lastPage+1):"0 items";
   prev.disabled=state.page===0;
   next.disabled=state.page>=lastPage||found.length===0;
   $("mepConversionInfo").textContent=measurement.value==="imperial"?
     "Imperial rates are calculated from original SI unit rates (e.g. NPR/ft² = NPR/m² × 0.09290304; NPR/ft³ = NPR/m³ × 0.028316846592; NPR/ft = NPR/m × 0.3048). Item, set, job and point rates are unchanged. These are not separate price quotations.":
     "Rates are displayed in the workbook's original metric/SI units. You may switch to Imperial for mathematically equivalent prices per foot, square foot or cubic foot. The underlying source values never change.";
  }
  function changed(){state.page=0;render();}
  search.addEventListener("input",changed);category.addEventListener("change",changed);
  version.addEventListener("change",()=>{fillCategories();changed();});
  measurement.addEventListener("change",()=>{units.save(measurement.value);changed();});
  sort.addEventListener("change",changed);
  $("mepClear").addEventListener("click",()=>{search.value="";category.value="all";version.value="visible";measurement.value="si";sort.value="trade";fillCategories();changed();search.focus();});
  prev.addEventListener("click",()=>{if(state.page>0){state.page--;render();}});
  next.addEventListener("click",()=>{if((state.page+1)*PAGE<filtered().length){state.page++;render();}});
  fillCategories();
  const paramCategory=params.get("category");
  if(paramCategory&&[...category.options].some(o=>o.value===paramCategory))category.value=paramCategory;
  render();
 }
})();