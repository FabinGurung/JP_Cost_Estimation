(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const units=window.JPRateUnits, guide=window.JPConstructionGuide;
  const PAGE_SIZE = 25;
  let records=[], names={}, taxonomy={}, page=0, loaded=false, activeStage='all';
  const query=$('workSearch'),division=$('workDivision'),family=$('workFamily'),type=$('workType'),version=$('workVersion'),sort=$('workSort');
  const status=$('workStatus'), tbody=$('workRateRows'),pageSummary=$('workPageSummary');
  const previous=$('workPrev'),next=$('workNext'),system=$('unitSystem'),ribbon=$('stageRibbon');
  system.value=units.preferred();
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
  function stageOf(item){return guide.sequence(item,taxonomy[item.id]);}
  function renderRibbon(){
    if(!loaded)return;
    const subset=records.filter(r=>r.version===version.value&&(division.value==='all'||r.section===division.value)&&(family.value==='all'||taxonomy[r.id].family===family.value)&&(type.value==='all'||taxonomy[r.id].work_type===type.value));
    const stages=[{id:'all',emoji:'🌄',short:'All stages',label:'Every stage'},...guide.stages];
    const fragment=document.createDocumentFragment();
    for(const stage of stages){
      const count=stage.id==='all'?subset.length:subset.filter(r=>stageOf(r).stage_id===stage.id).length;
      if(!count)continue;
      const b=document.createElement('button');b.type='button';b.className='stage-ribbon-button';
      b.setAttribute('aria-pressed',String(stage.id===activeStage));b.setAttribute('aria-label',stage.label+'; '+count+' work items');
      const emoji=document.createElement('span');emoji.className='stage-emoji';emoji.textContent=stage.emoji;emoji.setAttribute('aria-hidden','true');
      const label=document.createElement('span');label.textContent=stage.short;
      const small=document.createElement('small');small.textContent=count+' works';
      b.append(emoji,label,small);
      b.addEventListener('click',()=>{activeStage=stage.id;page=0;renderRibbon();update();});
      fragment.appendChild(b);
    }
    ribbon.replaceChildren(fragment);
  }
  function filtered(){
    const q=query.value.trim().toLocaleLowerCase();
    const result=records.filter(r=>{
      const t=taxonomy[r.id];
      return r.version===version.value&&(division.value==='all'||r.section===division.value)&&
       (family.value==='all'||t.family===family.value)&&(type.value==='all'||t.work_type===type.value)&&(activeStage==='all'||stageOf(r).stage_id===activeStage)&&
       (!q||units.match([names[r.id],r.description,r.unit,r.section,t.family,t.work_type,t.variant,stageOf(r).stage.label].join(' '),q));
    });
    if(sort.value==='construction')result.sort((a,b)=>{
      const sa=stageOf(a),sb=stageOf(b);
      return sa.stage.order-sb.stage.order||sa.priority-sb.priority||
        (a.section==='Building Works'?0:a.section==='Other Structures'?1:2)-
        (b.section==='Building Works'?0:b.section==='Other Structures'?1:2)||
        records.indexOf(a)-records.indexOf(b);
    });
    if(sort.value==='price-low')result.sort((a,b)=>units.convert(a.rate,a.unit,system.value).rate-units.convert(b.rate,b.unit,system.value).rate);
    if(sort.value==='price-high')result.sort((a,b)=>units.convert(b.rate,b.unit,system.value).rate-units.convert(a.rate,a.unit,system.value).rate);
    if(sort.value==='name')result.sort((a,b)=>names[a.id].localeCompare(names[b.id]));
    return result;
  }
  function update(){
    if(!loaded)return;
    const matches=filtered(),maxPage=Math.max(0,Math.ceil(matches.length/PAGE_SIZE)-1);
    page=Math.min(Math.max(0,page),maxPage);
    const start=page*PAGE_SIZE,shown=matches.slice(start,start+PAGE_SIZE),fragment=document.createDocumentFragment();
    let lastStage=null;
    for(const item of shown){
      const seq=stageOf(item);
      if(sort.value==='construction'&&seq.stage_id!==lastStage){
        const hr=document.createElement('tr');hr.className='work-stage-row';
        const heading=document.createElement('td');heading.colSpan=3;
        const em=document.createElement('span');em.className='stage-heading-emoji';em.textContent=seq.stage.emoji;em.setAttribute('aria-hidden','true');
        const label=document.createElement('span');label.textContent=seq.stage.label;
        heading.append(em,label);
        if(activeStage==='all'){
          const hint=document.createElement('span');hint.className='stage-heading-hint';hint.textContent='Typical building-work sequence';heading.appendChild(hint);
        }
        hr.appendChild(heading);fragment.appendChild(hr);
        lastStage=seq.stage_id;
      }
      const tr=document.createElement('tr');
      const work=document.createElement('td');work.className='work-description-cell';
      const category=document.createElement('span');category.className='work-class-tag';
      category.textContent=taxonomy[item.id].family+' › '+taxonomy[item.id].work_type;
      work.appendChild(category);
      const inline=document.createElement('div');inline.className='work-name-row';
      const pict=document.createElement('span');pict.className='work-item-emoji';pict.textContent=seq.emoji;pict.setAttribute('aria-hidden','true');
      const a=document.createElement('a');a.className='work-name-link';a.href='rate-specifications.html?id='+encodeURIComponent(item.id);
      a.textContent=names[item.id];a.title='Read the original Excel work description and separate general workmanship guidance';inline.append(pict,a);work.appendChild(inline);
      const displayed=units.rateText(item.rate,item.unit,system.value);
      const u=document.createElement('td');u.className='work-unit-cell';u.textContent=displayed.unit;
      u.title=displayed.derived?'Converted unit from '+item.unit:'Source unit: '+item.unit;u.setAttribute('aria-label','Unit: '+displayed.unit);
      const amount=document.createElement('td');amount.className='work-price-cell';
      const value=document.createElement('span');value.className='work-price-number';value.textContent=displayed.formatted;amount.appendChild(value);
      amount.title=displayed.derived?'Calculated from original NPR '+units.rateText(item.rate,item.unit,'si').formatted+'/'+item.unit:'Source workbook NPR per '+item.unit;
      tr.append(work,u,amount);fragment.appendChild(tr);
    }
    if(!shown.length){const tr=document.createElement('tr'),td=document.createElement('td');td.className='work-empty';td.colSpan=3;td.textContent='No matching work items. Try a different category or search.';tr.appendChild(td);fragment.appendChild(tr);}
    tbody.replaceChildren(fragment);
    status.textContent=matches.length+' '+(version.value==='visible'?'visible-worksheet':'hidden-worksheet')+' rates found · '+(system.value==='imperial'?'Imperial equivalents':'Source SI rates')+' · Archived estimate / unverified year';
    $('unitConversionNote').textContent=system.value==='imperial'?'Imperial values are calculated from the original SI rate (not independent quotations): NPR/ft² = NPR/m² × 0.09290304; NPR/ft³ = NPR/m³ × 0.028316846592; NPR/ft = NPR/m × 0.3048; NPR/lb = NPR/kg × 0.45359237. Item/set/job/point rates remain unchanged.':'SI units and original NPR prices are shown. Select Imperial to see equivalent per-foot, per-square-foot, per-cubic-foot and per-pound rates. Stored source values remain unchanged.';
    pageSummary.textContent=matches.length?(start+1)+'–'+Math.min(start+PAGE_SIZE,matches.length)+' of '+matches.length+' · Page '+(page+1)+' of '+(maxPage+1):'0 results';
    previous.disabled=page===0;next.disabled=matches.length===0||page===maxPage;
  }
  function fail(message){
    status.textContent=message;const tr=document.createElement('tr'),td=document.createElement('td');td.className='work-empty';td.colSpan=3;td.textContent=message;tr.appendChild(td);tbody.replaceChildren(tr);pageSummary.textContent='No rates available';previous.disabled=true;next.disabled=true;
  }
  query.addEventListener('input',()=>{page=0;update();});
  sort.addEventListener('change',()=>{page=0;update();});
  system.addEventListener('change',()=>{units.save(system.value);page=0;update();});
  for(const control of [division,version,family])control.addEventListener('change',()=>{page=0;activeStage='all';updateChoices();renderRibbon();update();});
  type.addEventListener('change',()=>{page=0;activeStage='all';renderRibbon();update();});
  $('workClear').addEventListener('click',()=>{query.value='';division.value='all';family.value='all';type.value='all';version.value='visible';sort.value='construction';activeStage='all';page=0;updateChoices();renderRibbon();update();query.focus();});
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
    if(params.get('stage')&&['all',...guide.stages.map(x=>x.id)].includes(params.get('stage')))activeStage=params.get('stage');
    renderRibbon();update();
  }).catch(error=>fail('Could not load rate library: '+error.message));
})();
