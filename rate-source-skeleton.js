/* JP v0.5.14 public-safe page loader. No Drive IDs or raw PDF content here. */
(() => {
'use strict';
const hub=document.body.dataset.sourceCollection, source=document.body.dataset.sourceDocument;
const documentRoutes={"SRC-GOV-001":"kaski-district-rates.html","SRC-VEN-001":"pipes-price-list.html","SRC-VEN-002":"electrical-wire-quotation.html","SRC-RA-001":"contractor-rate-analysis.html","SRC-RA-002":"users-rate-analysis.html","SRC-RA-003":"dudbc-rate-analysis.html"};
const make=(name,className,text)=>{const e=document.createElement(name);if(className)e.className=className;if(text!==undefined)e.textContent=String(text);return e;};
function card(title,href,icon,description,small){
 const a=make('a','source-card');a.href=href;
 const symbol=make('span','source-card-icon',icon);symbol.setAttribute('aria-hidden','true');
 const h=make('strong',null,title),p=make('p',null,description),status=make('small',null,small),arrow=make('span','source-card-arrow','Explore →');
 a.append(symbol,h,p,status,arrow);return a;
}
fetch('data/rate-source-public-skeleton.v0.5.14.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Source manifest '+r.status);return r.json()}).then(m=>{
 if(m.schema!=='jp-cres.rate_source_public_skeleton.v0.5.14'||m.sources?.length!==6||m.groups?.length!==4||m.rate_observation_count!==0||m.extraction_complete!==false)throw Error('Source manifest integrity check failed');
 if(hub==='hub'){
   const target=document.getElementById('sourceLibraryCards');
   for(const group of m.groups)target.appendChild(card(group.name,group.href,group.icon,group.tagline,group.id==='personal'?'204 historical workbook observations; unverified':group.entries.length+' source PDFs · extraction pending'));
 }else if(hub){
   const group=m.groups.find(g=>g.id===hub),target=document.getElementById('sourceDocumentCards');
   if(!group||!target)throw Error('Unknown source group');
   document.getElementById('sourceCategoryCount').textContent=group.entries.length;
   for(const key of group.entries){
    const source=m.sources.find(s=>s.id===key);
    if(!source||!documentRoutes[key])throw Error('Missing source identity');
    target.appendChild(card(source.label,documentRoutes[key],group.icon,source.source_scope,'Metadata inventoried · '+source.parse_status.replaceAll('_',' ').toLowerCase()));
   }
 }
 if(source){
   const item=m.sources.find(s=>s.id===source);
   if(!item)throw Error('Unknown document');
   document.getElementById('documentDescription').textContent=item.source_scope+'. '+item.edition_claim+'. No rate rows have passed source QA.';
   document.getElementById('parseState').textContent=item.parse_status.replaceAll('_',' ').toLowerCase();
   document.getElementById('verifiedObs').textContent='Pending';
   document.getElementById('documentNotes').textContent=item.notes+' No source PDF, private customer data, quotation value or original Drive ID is distributed through this public page.';
 }
}).catch(e=>{
 const p=document.querySelector('.source-intro p:last-child');
 if(p)p.textContent='Unable to load source manifest: '+e.message;
});
})();