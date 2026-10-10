(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const money = new Intl.NumberFormat('en-IN',{maximumFractionDigits:2});
  const id = new URLSearchParams(window.location.search).get('id');
  const status = $('specStatus');
  const details = $('specContent');
  function failure(reason){status.textContent=reason;details.hidden=true;}
  Promise.all([
    fetch('data/historical-work-rates-v0.5.3.json').then(r=>{if(!r.ok)throw Error('Catalog HTTP '+r.status);return r.json();}),
    fetch('data/work-rate-labels-v0.5.4.json').then(r=>{if(!r.ok)throw Error('Labels HTTP '+r.status);return r.json();})
  ]).then(([catalog,short])=>{
    if(!Array.isArray(catalog.items)||catalog.items.length!==204||Object.keys(short.labels||{}).length!==204)throw Error('Source records invalid');
    if(!id){failure('Select a work title from the Rate Library to see its full specification.');return;}
    const item=catalog.items.find(x=>x.id===id);
    if(!item||!short.labels[id]){failure('This work item could not be found. Return to the Rate Library to select a valid item.');return;}
    const peers=catalog.items.filter(x=>x.section===item.section&&x.version===item.version);
    const index=peers.findIndex(x=>x.id===item.id);
    const back='rate-library.html?version='+encodeURIComponent(item.version)+'&division='+encodeURIComponent(item.section);
    $('specBackCrumb').href=back;
    $('specHeading').textContent=short.labels[id];
    document.title=short.labels[id]+' | Work Specifications | JP Cost & Rate Intelligence';
    $('specSection').textContent=item.section;
    $('specVersion').textContent=item.version==='visible'?'Visible workbook version':'Hidden historical alternative';
    $('specUnit').textContent=item.unit;
    $('specRate').textContent=money.format(item.rate);
    $('specFullText').textContent=item.description;
    $('specSourceSheet').textContent=item.source_sheet;
    $('specRateCell').textContent=item.source_rate_cell;
    $('specDescriptionCell').textContent=item.source_description_cell;
    $('specId').textContent=item.id;
    const links=$('specNeighbors');links.replaceChildren();
    const home=document.createElement('a');home.href=back;home.textContent='← Back to filtered Rate Library';links.appendChild(home);
    for(const [offset,label] of [[-1,'← Previous work'],[1,'Next work →']]){
      if(!peers[index+offset])continue;
      const a=document.createElement('a');a.href='rate-specifications.html?id='+encodeURIComponent(peers[index+offset].id);
      a.textContent=label;links.appendChild(a);
    }
    status.hidden=true;details.hidden=false;
  }).catch(e=>failure('The specification could not be loaded: '+e.message));
})();
