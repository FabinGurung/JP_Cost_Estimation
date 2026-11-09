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
['literature','Research & Standards','literature-review.html'],
['system','System & Governance','governance.html'],
['posters','Memory Wall','memory-posters.html'],
['field','Site Expense Guide','field-expense-guide.html']
];
const url=href=>new URL(href,root).href;
function department(){
if(path==='index.html')return 'home';
if(path==='rate-workbench.html')return 'rates';
if(path.startsWith('projects/')||path==='projects.html')return 'projects';
if(path==='measurements-boq.html'||path==='calculation-workspace.html')return 'measurements';
if(path==='finance.html'||path==='finance-dashboard.html'||path==='field-expense-guide.html')return 'finance';
if(path==='reference.html'||path==='memory-posters.html'||path==='literature-review.html')return 'reference';
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
/* CSS is appended at runtime after the legacy per-page styles, preserving
   all 71 historical routes without editing each page's <head>. */
if(!document.getElementById('jp-cardinal-theme')){
 const style=document.createElement('link');
 style.rel='stylesheet';style.id='jp-cardinal-theme';style.href=url('site-cardinal-v1.css');
 document.head.append(style);
}
document.body.classList.add('jp-cardinal-enabled');

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
/* Four-point navigation: N global strip, W departments, E page context, S source ribbon. */
const axis=(text,label)=>{const span=document.createElement('span');span.className='jp-'+label;span.textContent=text;return span;};
const north=document.createElement('div');
north.id='jp-north-ribbon';north.setAttribute('role','group');
north.setAttribute('aria-label','North navigation ribbon: current page and source directory');
north.append(axis('N / PAGE','direction'));
const pageTitle=document.querySelector('main h1')?.textContent?.trim()||document.title||'JP Cost Estimation';
const current=document.createElement('span');current.className='jp-ribbon-title';current.textContent=pageTitle;
north.append(current);
const sourceShortcut=document.createElement('a');sourceShortcut.className='jp-north-source';
sourceShortcut.href=url('source-sheets.html');sourceShortcut.textContent='Source directory';
north.append(sourceShortcut);
const northAnchor=document.querySelector('.jp-functional-tabs')||header;
northAnchor.insertAdjacentElement('afterend',north);
const west=document.createElement('aside');west.id='jp-west-rail';
west.className='jp-west-rail';west.setAttribute('aria-label','West: department navigation');
west.append(axis('W / SECTIONS','rail-heading'));
const westNav=document.createElement('nav');westNav.className='jp-rail-links';
westNav.setAttribute('aria-label','Department shortcuts');
const departments=[
 ['home','00','Overview','index.html'],
 ['rates','01','Rates','rate-sources.html'],
 ['projects','02','Projects','projects.html'],
 ['measurements','03','QTO / BOQ','measurements-boq.html'],
 ['finance','04','Finance','finance.html'],
 ['reference','05','References','reference.html'],
 ['system','06','Governance','governance.html']
];
for(const [id,num,label,href] of departments){
 const a=document.createElement('a');a.href=url(href);
 const n=axis(num,'rail-num');a.append(n,document.createTextNode(label));
 if(dep===id)a.setAttribute('aria-current',path===href?'page':'location');
 westNav.append(a);
}
west.append(westNav,axis('Routes are organized by responsibility, not by file history.','rail-micro'));
north.insertAdjacentElement('afterend',west);
const east=document.createElement('aside');east.id='jp-east-rail';
east.className='jp-east-rail';east.setAttribute('aria-label','East: on-page quick navigation and sources');
east.append(axis('E / ON THIS PAGE','rail-heading'));
const jumpNav=document.createElement('nav');jumpNav.className='jp-rail-links';
jumpNav.setAttribute('aria-label','Jump to page sections');
let jumps=0;
if(main){
 const seen=new Set();
 for(const section of main.querySelectorAll('section[id],article[id]')){
  if(jumps>=6)break;
  const id=section.id;
  if(!id||seen.has(id))continue;
  const heading=section.querySelector('h2,h3');
  if(!heading)continue;
  seen.add(id);
  const a=document.createElement('a');
  a.className='jp-onpage';a.href='#'+encodeURIComponent(id);
  const label=heading.textContent.trim().replace(/\s+/g,' ');
  a.textContent=label.length>38?label.slice(0,36)+'…':label;
  jumpNav.append(a);jumps++;
 }
}
if(jumps===0){
 const local=dep==='projects'?[
 ['Project overview','projects/rohini/ward-14/amrit-rawat/index.html'],
 ['Measurements','projects/rohini/ward-14/amrit-rawat/measurements/index.html'],
 ['BOQ','projects/rohini/ward-14/amrit-rawat/boq.html']]:
 dep==='finance'?[['Finance overview','finance.html'],['Payments','finance-dashboard.html']]:
 [['All pages','site-map.html'],['Projects','projects.html']];
 for(const [label,href] of local){
  const a=document.createElement('a');a.className='jp-onpage';a.href=url(href);
  a.textContent=label;jumpNav.append(a);
 }
}
east.append(jumpNav);
const sourceNav=document.createElement('nav');sourceNav.className='jp-rail-links';
sourceNav.setAttribute('aria-label','Source and page index');
for(const [label,href] of [['Original Sheets','source-sheets.html'],['All 71 pages','site-map.html']]){
 const a=document.createElement('a');a.className='jp-onpage';a.href=url(href);a.textContent=label;sourceNav.append(a);
}
east.append(sourceNav,axis('Original Google Sheets and CAD files own evidence. Pages is read-only.','rail-micro'));
west.insertAdjacentElement('afterend',east);
const footer=document.createElement('footer');footer.id='jp-site-footer';
footer.setAttribute('aria-label','South: source provenance navigation ribbon');
const footerIdentity=document.createElement('div');footerIdentity.className='jp-south-identity';
footerIdentity.append(axis('S / SOURCES','jp-south-axis'.replace(/^jp-/,'')));
const footerText=document.createElement('span');
const footerStrong=document.createElement('strong');footerStrong.textContent='JP Cost Estimation';
const footerSmall=document.createElement('small');footerSmall.textContent='Google Sheets → Actions → Pages · source-backed, read-only';
footerText.append(footerStrong,footerSmall);footerIdentity.append(footerText);
const footerNav=document.createElement('nav');footerNav.className='jp-south-links';
footerNav.setAttribute('aria-label','Source custody, governance and page navigation');
for(const [label,href] of [
 ['Original Sheets','source-sheets.html'],
 ['Governance','governance.html'],
 ['Page map','site-map.html'],
 ['Back to north','#jp-site-masthead']
]){
 const a=document.createElement('a');
 a.href=href.startsWith('#')?href:url(href);
 a.textContent=label;footerNav.append(a);
}
footer.append(footerIdentity,footerNav);document.body.append(footer);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
