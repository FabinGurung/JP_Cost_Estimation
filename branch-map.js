(() => {
'use strict';
const table = document.getElementById('branch-table');
if (!table) return;
const status = document.getElementById('branchRefreshStatus');
const body = table.querySelector('tbody');
function classify(name) {
 if(name==='main') return ['DEFAULT • PAGES PUBLISHER','Retains original v0.1 app; triggers GitHub Pages workflow checking out research content.'];
 if(name==='research/open-estimation-engine-v0.1') return ['ACTIVE • RESEARCH WEBSITE','Publishes rate-first research website, Kaski static snapshot, Known Rates, source-verified finance, system lifecycle and CR-02 API source.'];
 if(name.startsWith('milestone/')) return ['MILESTONE • RELEASE CHECKPOINT','Frozen named checkpoint; not automatically the currently published website.'];
 if(name.startsWith('Archive_')) return ['ARCHIVED NAME • RETAINED','Archive-prefixed historical branch name; other original refs may remain for lineage.'];
 if(name.startsWith('snapshot/pre-')) return ['PRE SNAPSHOT • RETAINED','Repository state immediately before an identified governed update.'];
 if(name.startsWith('snapshot/post-')) return ['POST SNAPSHOT • RETAINED','Repository state immediately after an identified governed update.'];
 if(name.startsWith('feature/')) return ['HISTORICAL FEATURE','Feature branch retained for traceability; check associated PR before reuse.'];
 return ['OTHER GIT REF • INSPECT','Branch remains available; classify its function from its commit and provenance.'];
}
function populate(names){
 const frag=document.createDocumentFragment();
 names.forEach(name=>{
  const [cls,detail]=classify(name);
  const tr=document.createElement('tr');const n=document.createElement('td');
  const anchor=document.createElement('a');
  anchor.href='https://github.com/FabinGurung/JP_Cost_Estimation/tree/'+name;
  anchor.target='_blank';anchor.rel='noopener noreferrer';
  const code=document.createElement('code');code.textContent=name;anchor.appendChild(code);n.appendChild(anchor);
  const c=document.createElement('td');const pill=document.createElement('span');pill.className='status-pill';pill.textContent=cls;c.appendChild(pill);
  const d=document.createElement('td');d.textContent=detail;
  tr.append(n,c,d);frag.appendChild(tr);
 });
 body.replaceChildren(frag);
}
fetch('https://api.github.com/repos/FabinGurung/JP_Cost_Estimation/branches?per_page=100',
 {headers:{Accept:'application/vnd.github+json'}})
.then(res=>{if(!res.ok)throw new Error('GitHub API unavailable');return res.json()})
.then(json=>{
 if(!Array.isArray(json)||!json.length)throw new Error('No branch metadata');
 const names=json.map(x=>x.name).filter(x=>typeof x==='string');
 populate(names);
 if(status)status.textContent='Live GitHub branch inventory • '+names.length+' branches • refreshed on page load.';
}).catch(()=>{
 if(status)status.textContent='Showing source-verified historical branch snapshot. Live GitHub branch refresh was unavailable.';
});
})();