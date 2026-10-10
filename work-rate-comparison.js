(() => {
 'use strict';
 const $=id=>document.getElementById(id), fmt=new Intl.NumberFormat('en-IN',{maximumFractionDigits:2});
 const search=$('compareSearch'),division=$('compareDivision'),family=$('compareFamily'),show=$('compareDifferences'),status=$('compareStatus'),rows=$('compareRows');
 let joined=[];
 function families(){
  const old=family.value;
  while(family.options.length>1)family.remove(1);
  const types=[...new Set(joined.filter(p=>division.value==='all'||p.section===division.value).map(p=>p.family))].sort();
  for(const type of types){const op=document.createElement('option');op.value=type;op.textContent=type;family.appendChild(op);}
  family.value=types.includes(old)?old:'all';
 }
 function render(){
  const q=search.value.trim().toLocaleLowerCase();
  const filtered=joined.filter(p=>
   (division.value==='all'||p.section===division.value)&&
   (family.value==='all'||p.family===family.value)&&
   (show.value==='all'||(show.value==='changed'&&!p.equal)||(show.value==='same'&&p.equal))&&
   (!q||[p.title,p.section,p.family,p.work_type,p.variant,p.visible.description].join(' ').toLocaleLowerCase().includes(q))
  );
  const fragment=document.createDocumentFragment();
  for(const p of filtered){
   const row=document.createElement('tr');
   const td=document.createElement('td');const a=document.createElement('a');a.href='rate-specifications.html?id='+encodeURIComponent(p.visible.id);a.textContent=p.title;td.appendChild(a);row.appendChild(td);
   for(const value of [p.visible.unit==='running m'?'r.m.':p.visible.unit,fmt.format(p.visible.rate),fmt.format(p.hidden.rate),p.equal?'Same':(p.delta>0?'+':'')+fmt.format(p.delta)]){
    const cell=document.createElement('td');cell.textContent=String(value);row.appendChild(cell);
   }
   row.lastElementChild.className=p.equal?'unchanged':'changed';fragment.appendChild(row);
  }
  if(!filtered.length){const row=document.createElement('tr'),cell=document.createElement('td');cell.colSpan=5;cell.textContent='No rate pairs match these filters.';row.appendChild(cell);fragment.appendChild(row);}
  rows.replaceChildren(fragment);
  status.textContent=filtered.length+' matched work items shown · '+filtered.filter(p=>!p.equal).length+' rate differences';
 }
 search.addEventListener('input',render);
 for(const el of [show,family])el.addEventListener('change',render);
 division.addEventListener('change',()=>{families();render();});
 const requested=new URLSearchParams(location.search);
 Promise.all([
  fetch('data/historical-work-rates-v0.5.3.json').then(r=>{if(!r.ok)throw Error('Rates HTTP '+r.status);return r.json();}),
  fetch('data/work-rate-labels-v0.5.4.json').then(r=>{if(!r.ok)throw Error('Titles HTTP '+r.status);return r.json();}),
  fetch('data/work-rate-taxonomy-v0.5.5.json').then(r=>{if(!r.ok)throw Error('Categories HTTP '+r.status);return r.json();})
 ]).then(([data,labels,tax])=>{
  if(data.items.length!==204||tax.pairs.length!==102||tax.summary.different_rates!==4)throw Error('Pair registry incomplete');
  const index=new Map(data.items.map(r=>[r.id,r]));
  joined=tax.pairs.map(pair=>{
   const visible=index.get(pair.visible_id),hidden=index.get(pair.hidden_id);
   if(!visible||!hidden||visible.description!==hidden.description||visible.unit!==hidden.unit||visible.version!=='visible'||hidden.version!=='hidden'||visible.section!==hidden.section)throw Error('Source pair mismatch');
   const delta=Math.round((visible.rate-hidden.rate)*100)/100;
   return {...pair,visible,hidden,delta,equal:Math.abs(delta)<.005,title:labels.labels[visible.id]};
  });
  if(joined.filter(p=>!p.equal).length!==4)throw Error('Unverified changed-rate count');
  $('compareCount').textContent=joined.length;$('compareChanged').textContent=joined.filter(p=>!p.equal).length;
  $('compareSame').textContent=joined.filter(p=>p.equal).length;
  families();
  const focus=requested.get('id');
  if(focus&&joined.some(p=>p.visible.id===focus||p.hidden.id===focus)){
   const target=joined.find(p=>p.visible.id===focus||p.hidden.id===focus);
   search.value=target.title;show.value='all';
  }
  if(['all','changed','same'].includes(requested.get('show')))show.value=requested.get('show');
  render();
 }).catch(err=>{status.textContent='Comparison unavailable: '+err.message;rows.replaceChildren();});
})();
