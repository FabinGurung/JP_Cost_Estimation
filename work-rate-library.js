(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const price = new Intl.NumberFormat('en-IN', {maximumFractionDigits:2});
  const PAGE_SIZE = 25;
  let records = [], names = {}, page=0, loaded=false;
  const query=$('workSearch'), division=$('workDivision'), version=$('workVersion'), sort=$('workSort');
  const status=$('workStatus'), tbody=$('workRateRows'), pageSummary=$('workPageSummary');
  const previous=$('workPrev'), next=$('workNext');

  function filtered(){
    const term=query.value.trim().toLocaleLowerCase();
    const subset=records.filter(r => r.version===version.value &&
      (division.value==='all'||r.section===division.value) &&
      (!term||[names[r.id],r.description,r.unit,r.section].join(' ').toLocaleLowerCase().includes(term)));
    if(sort.value==='price-low')subset.sort((a,b)=>a.rate-b.rate);
    if(sort.value==='price-high')subset.sort((a,b)=>b.rate-a.rate);
    if(sort.value==='name')subset.sort((a,b)=>names[a.id].localeCompare(names[b.id]));
    return subset;
  }
  function update(){
    if(!loaded)return;
    const matching=filtered(), maxPage=Math.max(0,Math.ceil(matching.length/PAGE_SIZE)-1);
    page=Math.max(0,Math.min(page,maxPage));
    const start=page*PAGE_SIZE,shown=matching.slice(start,start+PAGE_SIZE);
    const fragment=document.createDocumentFragment();
    for(const item of shown){
      const tr=document.createElement('tr');
      const work=document.createElement('td');work.className='work-description-cell';
      const a=document.createElement('a');a.className='work-name-link';
      a.href='rate-specifications.html?id='+encodeURIComponent(item.id);
      a.textContent=names[item.id];a.title='Read full original specification';
      work.appendChild(a);
      const hint=document.createElement('span');hint.className='work-item-hint';hint.textContent='Full specification ↗';
      hint.setAttribute('aria-hidden','true');work.appendChild(hint);
      const unit=document.createElement('td');unit.className='work-unit-cell';unit.textContent=item.unit;
      const amount=document.createElement('td');amount.className='work-price-cell';amount.textContent=price.format(item.rate);
      tr.append(work,unit,amount);fragment.appendChild(tr);
    }
    if(!shown.length){
      const tr=document.createElement('tr'),td=document.createElement('td');
      td.className='work-empty';td.colSpan=3;td.textContent='No matching work items. Try another work name or division.';
      tr.appendChild(td);fragment.appendChild(tr);
    }
    tbody.replaceChildren(fragment);
    status.textContent=matching.length+' '+(version.value==='visible'?'visible-sheet':'hidden alternative')+' rates found';
    pageSummary.textContent=matching.length ? (start+1)+'–'+Math.min(start+PAGE_SIZE,matching.length)+' of '+matching.length+' · Page '+(page+1)+' of '+(maxPage+1) : '0 results';
    previous.disabled=page===0;
    next.disabled=matching.length===0||page===maxPage;
  }
  function fail(message){
    status.textContent=message;const row=document.createElement('tr'),td=document.createElement('td');
    td.className='work-empty';td.colSpan=3;td.textContent=message;row.appendChild(td);tbody.replaceChildren(row);
    pageSummary.textContent='No rates available';previous.disabled=true;next.disabled=true;
  }
  for(const control of [query,division,version,sort])
    control.addEventListener(control===query?'input':'change',()=>{page=0;update();});
  $('workClear').addEventListener('click',()=>{query.value='';division.value='all';version.value='visible';sort.value='source';page=0;update();query.focus();});
  previous.addEventListener('click',()=>{if(page>0){page--;update();}});
  next.addEventListener('click',()=>{if((page+1)*PAGE_SIZE<filtered().length){page++;update();}});

  const params=new URLSearchParams(window.location.search);
  if(['visible','hidden'].includes(params.get('version'))) version.value=params.get('version');
  if(['Building Works','Other Structures','Electrical Works','Sanitary Works'].includes(params.get('division')))division.value=params.get('division');

  Promise.all([
    fetch('data/historical-work-rates-v0.5.3.json').then(res=>{if(!res.ok)throw Error('Catalog HTTP '+res.status);return res.json();}),
    fetch('data/work-rate-labels-v0.5.4.json').then(res=>{if(!res.ok)throw Error('Labels HTTP '+res.status);return res.json();})
  ]).then(([payload,short])=>{
    if(payload.schema!=='jp-cres.historical_work_rates.public_three_column_projection.v0.5.3'||
      short.schema!=='jp-cres.curated_short_labels.v0.5.4'||
      !Array.isArray(payload.items)||payload.items.length!==204||
      payload.items.filter(r=>r.version==='visible').length!==102||
      payload.items.filter(r=>r.version==='hidden').length!==102||
      Object.keys(short.labels).length!==204||
      payload.items.some(r=>!r.description||!r.unit||!Number.isFinite(r.rate)||!short.labels[r.id]))throw Error('Catalog/short-label validation failed');
    records=payload.items;names=short.labels;
    $('visibleCount').textContent=payload.count_visible;
    $('hiddenCount').textContent=payload.count_hidden_alternative;
    loaded=true;update();
  }).catch(error=>fail('Could not load the work-rate catalog: '+error.message));
})();
