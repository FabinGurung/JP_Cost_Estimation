(() => {
 'use strict';
 const $=id=>document.getElementById(id),units=window.JPRateUnits,guide=window.JPConstructionGuide;
 const context=new URLSearchParams(window.location.search);
 const id=context.get('id');
 const status=$('specStatus'),content=$('specContent');
 function failure(reason){status.textContent=reason;content.hidden=true;}
 Promise.all([
  fetch('data/historical-work-rates-v0.5.3.json').then(r=>{if(!r.ok)throw Error('Rate catalog HTTP '+r.status);return r.json();}),
  fetch('data/work-rate-labels-v0.5.4.json').then(r=>{if(!r.ok)throw Error('Titles HTTP '+r.status);return r.json();}),
  fetch('data/work-rate-taxonomy-v0.5.5.json').then(r=>{if(!r.ok)throw Error('Categories HTTP '+r.status);return r.json();})
 ]).then(([catalog,short,tax])=>{
  if(!Array.isArray(catalog.items)||catalog.items.length!==204||Object.keys(short.labels||{}).length!==204||Object.keys(tax.records||{}).length!==204)throw Error('Source records invalid');
  if(!id){failure('Select a work title from the Rate Library to read the original Excel description and general quality guidance.');return;}
  const item=catalog.items.find(x=>x.id===id);
  if(!item||!short.labels[id]||!tax.records[id]){failure('This item could not be found. Return to the Rate Library.');return;}
  const category=tax.records[id];
  const selectedTrade=context.get('trade');
  const route=window.JPMep;
  const trade=(route&&route.trades[selectedTrade]&&route.tradeOf(item,category)===selectedTrade)?selectedTrade:null;
  let peers=catalog.items.filter(x=>x.version===item.version &&
    (trade?route.tradeOf(x,tax.records[x.id])===trade:x.section===item.section));
  if(trade){
   const requestedCategory=context.get('category')||'all', q=context.get('q')||'';
   const narrowed=peers.filter(x=>{
    const t=tax.records[x.id], kind=route.displayCategory(x,t,trade);
    return (requestedCategory==='all'||kind===requestedCategory)&&
      units.match([short.labels[x.id],x.description,kind,x.unit,t.family,t.variant,x.section].join(' '),q);
   });
   if(narrowed.some(x=>x.id===item.id))peers=narrowed;
   const sort=['trade','source','title','low','high'].includes(context.get('sort'))?context.get('sort'):'trade';
   if(sort==='trade')peers.sort((a,b)=>route.phaseOf(a,tax.records[a.id],trade)-route.phaseOf(b,tax.records[b.id],trade)||catalog.items.indexOf(a)-catalog.items.indexOf(b));
   if(sort==='title')peers.sort((a,b)=>short.labels[a.id].localeCompare(short.labels[b.id]));
   const measurement=['si','imperial'].includes(context.get('units'))?context.get('units'):units.preferred();
   if(sort==='low')peers.sort((a,b)=>units.convert(a.rate,a.unit,measurement).rate-units.convert(b.rate,b.unit,measurement).rate);
   if(sort==='high')peers.sort((a,b)=>units.convert(b.rate,b.unit,measurement).rate-units.convert(a.rate,a.unit,measurement).rate);
  }else{
   peers.sort((a,b)=>{
    const sa=guide.sequence(a,tax.records[a.id]),sb=guide.sequence(b,tax.records[b.id]);
    return sa.stage.order-sb.stage.order||sa.priority-sb.priority||
      catalog.items.indexOf(a)-catalog.items.indexOf(b);
   });
  }
  const ix=peers.findIndex(x=>x.id===item.id);
  const stage=guide.sequence(item,category);
  const back=trade?
    route.trades[trade].file+'?'+new URLSearchParams({
      units:context.get('units')||units.preferred(),version:item.version,
      category:context.get('category')||'all',q:context.get('q')||'',
      sort:context.get('sort')||'trade'
    }).toString():
    'rate-library.html?units='+encodeURIComponent(units.preferred())+'&version='+encodeURIComponent(item.version)+'&division='+encodeURIComponent(item.section)+'&family='+encodeURIComponent(category.family)+'&type='+encodeURIComponent(category.work_type)+'&stage='+encodeURIComponent(stage.stage_id);
  $('specBackCrumb').href=back;
  $('specBackCrumb').textContent=trade?route.trades[trade].name+' Works':'Rate Library';
  $('specHeroBack').href=back;
  $('specHeroBack').textContent=trade?'← Back to '+route.trades[trade].name+' Works':'← Back to Rate Library';
  $('specHeading').textContent=short.labels[id];
  document.title=short.labels[id]+' | Work Specifications';
  $('specSection').textContent=item.section;
  $('specVersion').textContent=item.version==='visible'?'Visible Excel worksheets':'Hidden Excel worksheets';
  $('specFamily').textContent=category.family;
  $('specType').textContent=category.work_type;
  $('specVariant').textContent=category.variant;
  $('specStageEmoji').textContent=stage.emoji;
  $('specStageName').textContent=stage.stage.label;
  const qualityList=$('specQualityList');qualityList.replaceChildren();
  for(const text of guide.checks(item,category)){
   const li=document.createElement('li');li.textContent=text;qualityList.appendChild(li);
  }
  const system=$('specUnitSystem');system.value=units.preferred();
  const display=()=>{
   const v=units.rateText(item.rate,item.unit,system.value),base=units.rateText(item.rate,item.unit,'si'),imp=units.rateText(item.rate,item.unit,'imperial');
   $('specUnit').textContent=v.unit;$('specRate').textContent=v.formatted;
   $('specRateLabel').textContent=v.derived?'converted Imperial':'original source SI';
   $('specConversionNote').textContent=v.derived?
    'Original workbook: NPR '+base.formatted+'/'+item.unit+'. '+v.formula+'. This is a mathematical equivalent, not a separately quoted price.':
    'Original workbook: NPR '+base.formatted+'/'+item.unit+'. Imperial equivalent: NPR '+imp.formatted+'/'+imp.unit+'. Unit conversion does not change the project scope.';
  };
  system.addEventListener('change',()=>{units.save(system.value);display();});display();
  $('specFullText').textContent=item.description;
  $('specSourceSheet').textContent=item.source_sheet;
  $('specRateCell').textContent=item.source_rate_cell;
  $('specDescriptionCell').textContent=item.source_description_cell;
  $('specId').textContent=item.id;
  $('specYear').textContent='Not recorded in verified source metadata';
  $('specLocation').textContent='Not verified';
  const links=$('specNeighbors');links.replaceChildren();
  const home=document.createElement('a');home.href=back;home.textContent=trade?'← Back to '+route.trades[trade].name+' works':'← Back to filtered Rate Library';links.appendChild(home);
  for(const [delta,label] of [[-1,'← Previous work'],[1,'Next work →']]){
   if(!peers[ix+delta])continue;
   const a=document.createElement('a'),nextContext=new URLSearchParams(context);
   nextContext.set('id',peers[ix+delta].id);
   a.href='rate-specifications.html?'+nextContext.toString();
   a.textContent=label;links.appendChild(a);
  }
  const linkbox=$('specComparisonLink');const comparison=document.createElement('a');
  comparison.href='rate-comparison.html?id='+encodeURIComponent(id);
  comparison.textContent='Compare this work item across Excel worksheet sets ↗';linkbox.replaceChildren(comparison);
  status.hidden=true;content.hidden=false;
 }).catch(error=>failure('The specification could not be loaded: '+error.message));
})();
