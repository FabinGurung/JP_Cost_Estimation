/* A9 functional navigation: Home | Rates | Projects | Measurements & BOQ | Finance | More.
   Resolve from the shared script URL so root and nested project pages use identical links. */
(()=>{
'use strict';
const script=document.currentScript||document.querySelector('script[src$="site-navigation-v0.8.js"]');
const root=new URL('.',script?.src||location.href);
const relative=location.href.startsWith(root.href)?location.href.slice(root.href.length).split(/[?#]/)[0]:(location.pathname.split('/').pop()||'index.html');
const path=relative||'index.html';
const links=[
['home','Home','index.html'],
['rates','Rates','rate-sources.html'],
['projects','Projects','projects.html'],
['measurements','Measurements & BOQ','measurements-boq.html'],
['finance','Finance','finance.html']
];
const extras=[
['reference','References & Docs','reference.html'],
['system','System & Governance','governance.html'],
['posters','Memory Posters','memory-posters.html'],
['field','Site Expense Guide','field-expense-guide.html']
];
const url=href=>new URL(href,root).href;
function department(){
if(path==='index.html')return 'home';
if(path.startsWith('projects/')||path==='projects.html')return 'projects';
if(path==='measurements-boq.html')return 'measurements';
if(path==='finance.html'||path==='finance-dashboard.html'||path==='field-expense-guide.html')return 'finance';
if(path==='reference.html'||path==='memory-posters.html')return 'reference';
if(path==='governance.html'||path==='system-map.html'||path.startsWith('custody/'))return 'system';
return 'rates';
}
function makeLink([id,label,href],d){
const a=document.createElement('a');a.href=url(href);a.textContent=label;
if(path===href)a.setAttribute('aria-current','page');
else if(d===id)a.setAttribute('aria-current','location');
return a;
}
function install(){
if(document.getElementById('jp-site-masthead'))return;
const dep=department();
const main=document.querySelector('main');
if(main&&!main.id)main.id='jp-main-content';
const header=document.createElement('header');header.id='jp-site-masthead';
const identity=document.createElement('a');identity.href=url('index.html');identity.className='jp-identity';identity.setAttribute('aria-label','JP Cost Estimation home');
const mark=document.createElement('span');mark.className='jp-seal';mark.textContent='JP';
const title=document.createElement('span'),strong=document.createElement('strong'),small=document.createElement('small');
strong.textContent='JP COST ESTIMATION';small.textContent='Rates · Projects · BOQ · Finance';title.append(strong,small);identity.append(mark,title);
const nav=document.createElement('nav');nav.className='jp-global-nav';nav.setAttribute('aria-label','JP functional departments');
for(const item of links)nav.append(makeLink(item,dep));
const more=document.createElement('details');more.className='jp-more';
const toggle=document.createElement('summary');toggle.className='jp-more-toggle';toggle.textContent='More';toggle.setAttribute('aria-label','More: references, system and field guide');
if(['reference','system'].includes(dep))toggle.setAttribute('aria-current','location');
const panel=document.createElement('div');panel.className='jp-more-panel';panel.setAttribute('role','group');panel.setAttribute('aria-label','Reference and system pages');
for(const item of extras)panel.append(makeLink(item,dep));
more.append(toggle,panel);nav.append(more);
document.addEventListener('click',e=>{if(more.open&&!more.contains(e.target))more.open=false});
document.addEventListener('keydown',e=>{if(more.open&&e.key==='Escape'){more.open=false;toggle.focus()}});
header.append(identity,nav);
const skip=document.createElement('a');skip.className='jp-skip';skip.href='#'+(main?main.id:'jp-site-footer');skip.textContent='Skip to content';
document.body.insertBefore(header,document.body.firstChild);document.body.insertBefore(skip,header);
if(dep==='finance'||(dep==='projects'&&path.startsWith('projects/'))){
 const subnav=document.createElement('nav');subnav.className='jp-functional-tabs';subnav.setAttribute('aria-label',dep==='finance'?'Finance pages':'Amrit Rawat project pages');
 const rows=dep==='finance'?
 [['Overview','finance.html'],['Payments','finance-dashboard.html'],['Source Panels','finance.html#finance-sources'],['Site Expenses','field-expense-guide.html']]:
 [['Overview','projects/rohini/ward-14/amrit-rawat/index.html'],['Rate Assumptions','projects/rohini/ward-14/amrit-rawat/cost-planning.html'],['Measurements','projects/rohini/ward-14/amrit-rawat/measurements/index.html'],['BOQ','projects/rohini/ward-14/amrit-rawat/boq.html'],['AOC','projects/rohini/ward-14/amrit-rawat/aoc.html'],['Bills / Invoices','projects/rohini/ward-14/amrit-rawat/bills/index.html']];
 for(const [label,href]of rows){const a=document.createElement('a');a.href=url(href);a.textContent=label;if(path===href)a.setAttribute('aria-current','page');subnav.append(a)}
 document.body.insertBefore(subnav,header.nextSibling);
}
const footer=document.createElement('footer');footer.id='jp-site-footer';const left=document.createElement('strong');left.textContent='JP COST ESTIMATION';
const right=document.createElement('span');right.textContent='Rates ≠ project assumptions ≠ measured quantities ≠ actual payments · ';
const link=document.createElement('a');link.href=url('governance.html');link.textContent='Source governance';right.append(link);footer.append(left,right);document.body.append(footer);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
