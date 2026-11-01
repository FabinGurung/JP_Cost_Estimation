/* Read-only sourced from site-page-registry.v0.8.json, not an invented URL list. */
const byId=id=>document.getElementById(id);
const results=byId('pageResults'),legacy=byId('legacyRoutes'),search=byId('pageSearch'),select=byId('pageDepartment'),count=byId('pageCount');
try{
 const resp=await fetch(new URL('./site-page-registry.v0.8.json',import.meta.url),{cache:'no-store'});
 if(!resp.ok)throw Error('Page registry not available');
 const registry=await resp.json();
 if(registry.schema!=='jp.site.page-registry.v1'||!Array.isArray(registry.pages))throw Error('Unexpected page registry format');
 const departments=new Map([['OV','Overview'],...(registry.departments||[]).map(x=>[x.id,x.name])]);
 for(const [id,name] of departments){const option=document.createElement('option');option.value=id;option.textContent=name;select.append(option);}
 const pages=registry.pages;
 const render=()=>{
  const q=search.value.trim().toLocaleLowerCase(),dept=select.value;
  const filtered=pages.filter(p=>{const type=p.department||'OV';return (!dept||dept===type)&&[p.id,p.path,p.title].join(' ').toLocaleLowerCase().includes(q);});
  count.textContent=filtered.length+' of '+pages.length+' registered pages';
  results.replaceChildren();
  if(!filtered.length){const p=document.createElement('p');p.textContent='No matching pages. Change the search or department.';results.append(p);return;}
  const groups=new Map();for(const p of filtered){const d=p.department||'OV';if(!groups.has(d))groups.set(d,[]);groups.get(d).push(p);}
  for(const [id,items]of groups){
   const section=document.createElement('section');section.className='jp-sitemap-group';
   const h=document.createElement('h3');h.textContent=departments.get(id)||id;section.append(h);
   const list=document.createElement('ul');list.className='jp-sitemap-list';
   for(const p of items){
    const item=document.createElement('li'),a=document.createElement('a'),code=document.createElement('code');
    a.href=new URL(p.path,location.href).href;a.textContent=p.title;code.textContent=p.id+' · '+p.path;
    item.append(a,code);list.append(item);
   }
   section.append(list);results.append(section);
  }
 };
 search.addEventListener('input',render);select.addEventListener('change',render);render();
 legacy.replaceChildren();
 const note=document.createElement('p');note.textContent='Historical IDs are preserved as aliases/redirects. They are not active generic rate pages.';legacy.append(note);
 const list=document.createElement('ul');
 for(const a of registry.legacyAliases||[]){const item=document.createElement('li');item.textContent=a.legacyPageId+' → '+a.currentPageId+' · '+a.originalUrl+' · '+a.policy;list.append(item);}
 legacy.append(list);
}catch(err){count.textContent='Registry unavailable';results.textContent='Could not load the page registry. The canonical project and rate links remain available from the Home navigation.';legacy.textContent='Legacy history unavailable';}
