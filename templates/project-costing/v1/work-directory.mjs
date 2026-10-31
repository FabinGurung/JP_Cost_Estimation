/** Client-side filter; work category names are shared with the fixed work catalog. */
const query=document.getElementById('workQuery');
const group=document.getElementById('workGroup');
const count=document.getElementById('workCount');
const none=document.getElementById('workNone');
const cards=[...document.querySelectorAll('[data-work-card]')];
const sections=[...document.querySelectorAll('[data-work-section]')];
export const matchesWork=(workName,workGroup,search,selectedGroup)=>(
 (selectedGroup==='all'||selectedGroup===workGroup)&&
 workName.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
);
export function applyWorkFilters(search,selectedGroup){
 let shown=0;
 for(const card of cards){
  const visible=matchesWork(card.dataset.search||'',card.dataset.workGroup||'',search,selectedGroup);
  card.hidden=!visible;if(visible)shown++;
 }
 for(const section of sections)section.hidden=!section.querySelector('[data-work-card]:not([hidden])');
 if(count)count.textContent=shown+' of '+cards.length+' work methods';
 if(none)none.hidden=shown!==0;
 return shown;
}
if(query&&group){
 const update=()=>applyWorkFilters(query.value,group.value);
 query.addEventListener('input',update);
 group.addEventListener('change',update);
 update();
}
