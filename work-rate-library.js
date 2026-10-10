(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const formatter = new Intl.NumberFormat('en-IN', {maximumFractionDigits:2});
  const PAGE_SIZE = 25;
  let records = [], page=0, loaded=false;
  const query=$('workSearch'), division=$('workDivision'), version=$('workVersion'), sort=$('workSort');
  const status=$('workStatus'), tbody=$('workRateRows'), pageSummary=$('workPageSummary');
  const previous=$('workPrev'), next=$('workNext');
  function filtered(){
    const term=query.value.trim().toLocaleLowerCase();
    const subset=records.filter(r=>r.version===version.value &&
      (division.value==='all'||r.section===division.value) &&
      (!term||[r.description,r.unit,r.section].join(' ').toLocaleLowerCase().includes(term)));
    if(sort.value==='price-low')subset.sort((a,b)=>a.rate-b.rate);
    if(sort.value==='price-high')subset.sort((a,b)=>b.rate-a.rate);
    if(sort.value==='name')subset.sort((a,b)=>a.description.localeCompare(b.description));
    return subset;
  }
  function update(){
    if(!loaded)return;
    const matching=filtered();const maxPage=Math.max(0,Math.ceil(matching.length/PAGE_SIZE)-1);
    page=Math.max(0,Math.min(page,maxPage));
    const start=page*PAGE_SIZE,shown=matching.slice(start,start+PAGE_SIZE);
    const fragment=document.createDocumentFragment();
    for(const item of shown){
      const row=document.createElement('tr');
      for(const value of [item.description,item.unit,formatter.format(item.rate)]){
        const td=document.createElement('td');td.textContent=String(value);row.appendChild(td);
      }
      fragment.appendChild(row);
    }
    if(!shown.length){
      const row=document.createElement('tr'),td=document.createElement('td');
      td.className='work-empty';td.colSpan=3;td.textContent='No matching work items. Try another description or division.';
      row.appendChild(td);fragment.appendChild(row);
    }
    tbody.replaceChildren(fragment);
    status.textContent=matching.length+' '+(version.value==='visible'?'visible-sheet':'hidden alternative')+' work rates found';
    pageSummary.textContent=matching.length ? (start+1)+'–'+Math.min(start+PAGE_SIZE,matching.length)+' of '+matching.length+' · Page '+(page+1)+' of '+(maxPage+1) : '0 results';
    previous.disabled=page===0;
    next.disabled=matching.length===0||page===maxPage;
  }
  function fail(message){
    status.textContent=message;const row=document.createElement('tr'),td=document.createElement('td');
    td.className='work-empty';td.colSpan=3;td.textContent=message;row.appendChild(td);tbody.replaceChildren(row);
    pageSummary.textContent='No rates available';previous.disabled=true;next.disabled=true;
  }
  for(const input of [query,division,version,sort])input.addEventListener(input===query?'input':'change',()=>{page=0;update();});
  $('workClear').addEventListener('click',()=>{query.value='';division.value='all';version.value='visible';sort.value='source';page=0;update();query.focus();});
  previous.addEventListener('click',()=>{if(page>0){page--;update();}});
  next.addEventListener('click',()=>{if((page+1)*PAGE_SIZE<filtered().length){page++;update();}});
  fetch('data/historical-work-rates-v0.5.3.json',{cache:'no-store'})
    .then(response=>{if(!response.ok)throw Error('HTTP '+response.status);return response.json();})
    .then(payload=>{
      if(payload.schema!=='jp-cres.historical_work_rates.public_three_column_projection.v0.5.3'||
        !Array.isArray(payload.items)||payload.items.length!==204||
        payload.items.filter(r=>r.version==='visible').length!==102||
        payload.items.filter(r=>r.version==='hidden').length!==102||
        payload.items.some(r=>!r.description||!r.unit||!Number.isFinite(r.rate)))throw Error('Catalog validation failed');
      records=payload.items;$('visibleCount').textContent=payload.count_visible;
      $('hiddenCount').textContent=payload.count_hidden_alternative;
      loaded=true;update();
    })
    .catch(error=>fail('Could not load the work-rate catalog: '+error.message));
})();
