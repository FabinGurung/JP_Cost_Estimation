/* Estimation-owned public-safe source map. Google Drive remains the editable authority.
 * Only user-invoked workflows and user-approved commits perform source reads.
 */
(() => {
  'use strict';
  const root=document.getElementById('estimationSourceCards');
  const count=document.getElementById('estimationSourceCount');
  if(!root)return;
  const make=(tag,cls,txt)=>{
    const x=document.createElement(tag);
    if(cls)x.className=cls;
    if(txt!==undefined)x.textContent=String(txt);
    return x;
  };
  fetch('data/connected-website-sheets.v1.json',{cache:'no-store'})
    .then(response=>{if(!response.ok)throw new Error('Source map unavailable');return response.json()})
    .then(data=>{
      if(data.schema!=='jp.website.connected-source-sheets.v1'||
         !Array.isArray(data.records)||data.records.length!==6||
         data.operatorPolicy?.mode!=='MANUAL_FIRST_NO_CRON')throw new Error('Source map contract mismatch');
      const feeds=data.records.filter(r=>r.fetchContract?.mode?.startsWith('AUTHENTICATED'));
      if(feeds.length!==4)throw new Error('Unexpected number of source feeds');
      count.textContent='4 manually invoked feed paths · 2 reference/template sources · no scheduled interval · catalogue '+data.version;
      root.replaceChildren();
      for(const r of data.records){
        const fc=r.fetchContract;
        const active=fc.mode.startsWith('AUTHENTICATED');
        const card=make('article','jp-source-item '+(active?'is-active':'is-reference'));
        const top=make('div','jp-source-item-head');
        const tag=make('span','jp-source-item-tag',active?'FETCH CONFIGURED':'NOT A LIVE FETCH');
        const ref=make('code','jp-source-item-ref',r.ref);
        top.append(tag,ref);
        const title=make('h3','',r.title);
        const role=make('p','jp-source-item-role',r.authority);
        const output=make('p','jp-source-item-output','Output: '+fc.output);
        const source=make('p','jp-source-item-outcome','Status: '+r.publicationStatus);
        card.append(top,title,role,output,source);
        if(active){
          const detail=make('details','jp-source-item-detail');
          const summary=make('summary','',fc.readTabs.length+' exact tabs read · '+fc.importer);
          const ul=make('ul','jp-source-tabs');
          for(const name of fc.readTabs)ul.append(make('li','',name));
          detail.append(summary,ul);
          card.append(detail);
        }else{
          card.append(make('p','jp-source-item-detail-text','This workbook is a reference/template. No live Google Sheets importer is configured.'));
        }
        const lower=make('p','jp-source-item-caution','Approval: '+fc.approval);
        const link=make('a','jp-source-item-open','Open related Estimation page');
        link.href=r.usagePage;
        card.append(lower,link);
        root.append(card);
      }
    }).catch(()=>{
      if(count)count.textContent='Source catalogue is unavailable; follow the existing directory.';
      const fallback=make('p','jp-source-error','Could not load current source details. The working source directory remains available.');
      root.replaceChildren(fallback);
    });
})();