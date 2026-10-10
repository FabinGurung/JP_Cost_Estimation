/* v0.5.12 legacy MEP URLs: keep bookmarks, redirect to the inline Rate Library MEP stage. */
(() => {
  const page=document.body.dataset.legacyMepTrade||'all';
  const target=new URL('rate-library.html',window.location.href);
  const from=new URLSearchParams(window.location.search);
  target.searchParams.set('stage','mep');
  if(['mechanical','electrical','plumbing'].includes(page))target.searchParams.set('trade',page);
  for(const key of ['version','units','q']){
    const v=from.get(key);if(v)target.searchParams.set(key,v);
  }
  const aliases={trade:'construction',title:'name',low:'price-low',high:'price-high'};
  const sort=from.get('sort');if(sort)target.searchParams.set('sort',aliases[sort]||sort);
  const link=document.getElementById('mepInlineDestination');
  if(link)link.href=target.href;
  window.location.replace(target.href);
})();