(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const price = new Intl.NumberFormat('en-IN',{maximumFractionDigits:2});
  const PAGE_SIZE = 25;
  let records=[], names={}, taxonomy={}, page=0, loaded=false;
  const query=$('workSearch'),division=$('workDivision'),family=$('workFamily'),type=$('workType'),version=$('workVersion'),sort=$('workSort');
  const status=$('workStatus'), tbody=$('workRateRows'),pageSummary=$('workPageSummary');
  const previous=$('workPrev'),next=$('workNext');
  const unitLabel=u=>u==='running m'?'r.m.':u;
  function fillSelect(node,values,preserve){
    const current=preserve?node.value:'all';
    while(node.options.length>1)node.remove(1);
    for(const v of values){const option=document.createElement('option');option.value=v;option.textContent=v;node.appendChild(option);}
    if([...node.options].some(x=>x.value===current))node.value=current;
    else node.value='all';
  }
  function updateChoices(){
    const families=[...new Set(records.filter(r=>r.version===version.value&&(division.value==='all'||r.section===division.value)).map(r=>taxonomy[r.id].family))].sort();
    fillSelect(family,families,true);
    const kinds=[...new Set(records.filter(r=>r.version===version.value&&(division.value==='all'||r.section===division.value)&&(family.value==='all'||taxonomy[r.id].family===family.value)).map(r=>taxonomy[r.id].work_type))].sort();
    fillSelect(type,kinds,true);
  }
  function filtered(){
    const q=query.value.trim().toLocaleLowerCase();
    const result=records.filter(r=>{
      const t=taxonomy[r.id];
      return r.version===version.value&&(division.value==='all'||r.section===division.value)&&
       (family.value==='all'||t.family===family.value)&&(type.value==='all'||t.work_type===type.value)&&
       (!q||[names[r.id],r.description,r.unit,r.section,t.family,t.work_type,t.variant].join(' ').toLocaleLowerCase().includes(q));
    });
    if(sort.value==='price-low')result.sort((a,b)=>a.rate-b.rate);
    if(sort.value==='price-high')result.sort((a,b)=>b.rate-a.rate);
    if(sort.value==='name')result.sort((a,b)=>names[a.id].localeCompare(names[b.id]));
    return result;
  }
  function update(){
    if(!loaded)return;
    const matches=filtered(),maxPage=Math.max(0,Math.ceil(matches.length/PAGE_SIZE)-1);
    page=Math.min(Math.max(0,page),maxPage);
    const start=page*PAGE_SIZE,shown=matches.slice(start,start+PAGE_SIZE),fragment=document.createDocumentFragment();
    for(const item of shown){
      const tr=document.createElement('tr');
      const work=document.createElement('td');work.className='work-description-cell';
      const category=document.createElement('span');category.className='work-class-tag';
      category.textContent=taxonomy[item.id].family+' › '+taxonomy[item.id].work_type;
      work.appendChild(category);
      const a=document.createElement('a');a.className='work-name-link';a.href='rate-specifications.html?id='+encodeURIComponent(item.id);
      a.textContent=names[item.id];a.title='Read the complete source specification';work.appendChild(a);
      const u=document.createElement('td');u.className='work-unit-cell';u.textContent=unitLabel(item.unit);
      u.title=item.unit;u.setAttribute('aria-label','Unit: '+item.unit);
      const amount=document.createElement('td');amount.className='work-price-cell';amount.textContent=price.format(item.rate);
      tr.append(work,u,amount);fragment.appendChild(tr);
    }
    if(!shown.length){const tr=document.createElement('tr'),td=document.createElement('td');td.className='work-empty';td.colSpan=3;td.textContent='No matching work items. Try a different category or search.';tr.appendChild(td);fragment.appendChild(tr);}
    tbody.replaceChildren(fragment);
    status.textContent=matches.length+' '+(version.value==='visible'?'visible-sheet':'hidden alternative')+' rates found · Historical and unverified';
    pageSummary.textContent=matches.length?(start+1)+'–'+Math.min(start+PAGE_SIZE,matches.length)+' of '+matches.length+' · Page '+(page+1)+' of '+(maxPage+1):'0 results';
    previous.disabled=page===0;next.disabled=matches.length===0||page===maxPage;
  }
  function fail(message){
    status.textContent=message;const tr=document.createElement('tr'),td=document.createElement('td');td.className='work-empty';td.colSpan=3;td.textContent=message;tr.appendChild(td);tbody.replaceChildren(tr);pageSummary.textContent='No rates available';previous.disabled=true;next.disabled=true;
  }
  query.addEventListener('input',()=>{page=0;update();});
  sort.addEventListener('change',()=>{page=0;update();});
  for(const control of [division,version,family])control.addEventListener('change',()=>{page=0;updateChoices();update();});
  type.addEventListener('change',()=>{page=0;update();});
  $('workClear').addEventListener('click',()=>{query.value='';division.value='all';family.value='all';type.value='all';version.value='visible';sort.value='source';page=0;updateChoices();update();query.focus();});
  previous.addEventListener('click',()=>{if(page>0){page--;update();}});
  next.addEventListener('click',()=>{if((page+1)*PAGE_SIZE<filtered().length){page++;update();}});
  const params=new URLSearchParams(window.location.search);
  if(['visible','hidden'].includes(params.get('version')))version.value=params.get('version');
  if(['Building Works','Other Structures','Electrical Works','Sanitary Works'].includes(params.get('division')))division.value=params.get('division');
  Promise.all([
    fetch('data/historical-work-rates-v0.5.3.json').then(r=>{if(!r.ok)throw Error('Catalog HTTP '+r.status);return r.json();}),
    fetch('data/work-rate-labels-v0.5.4.json').then(r=>{if(!r.ok)throw Error('Titles HTTP '+r.status);return r.json();}),
    fetch('data/work-rate-taxonomy-v0.5.5.json').then(r=>{if(!r.ok)throw Error('Category HTTP '+r.status);return r.json();})
  ]).then(([catalog,short,tax])=>{
    if(catalog.schema!=='jp-cres.historical_work_rates.public_three_column_projection.v0.5.3'||short.schema!=='jp-cres.curated_short_labels.v0.5.4'||tax.schema!=='jp-cres.editorial_taxonomy_comparison.v0.5.5'||
      !Array.isArray(catalog.items)||catalog.items.length!==204||Object.keys(short.labels).length!==204||Object.keys(tax.records).length!==204||tax.pairs.length!==102||
      catalog.items.filter(x=>x.version==='visible').length!==102||catalog.items.filter(x=>x.version==='hidden').length!==102||
      catalog.items.some(r=>!short.labels[r.id]||!tax.records[r.id]||!Number.isFinite(r.rate)))throw Error('Rate dataset validation failed');
    records=catalog.items;names=short.labels;taxonomy=tax.records;
    $('visibleCount').textContent=catalog.count_visible;$('hiddenCount').textContent=catalog.count_hidden_alternative;
    loaded=true;updateChoices();
    if(params.get('family')&&[...family.options].some(x=>x.value===params.get('family')))family.value=params.get('family');
    updateChoices();
    if(params.get('type')&&[...type.options].some(x=>x.value===params.get('type')))type.value=params.get('type');
    update();
  }).catch(error=>fail('Could not load rate library: '+error.message));
})();
