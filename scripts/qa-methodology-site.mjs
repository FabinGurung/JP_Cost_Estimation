import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {matchesWork} from '../templates/project-costing/v1/work-directory.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const get=p=>readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(get(p));
const registry=json('site-page-registry.v0.8.json');
const references=json('data/methodology-literature-v1.json');
const catalog=json('templates/project-costing/v1/work-catalog.json');
const template=json('templates/calculation-notes/v1/manifest.schema.json');
const directory='projects/rohini/ward-14/amrit-rawat/measurements/index.html';
const workHtml=get(directory),study=get('literature-review.html'),notes=get('calculation-workspace.html'),nav=get('site-navigation-v0.8.js'),style=get('department-pages.css');
assert.equal(references.schema,'jp.methods.literature-review.v1');
assert.equal(references.references.length,10);
assert.equal(new Set(references.references.map(x=>x.id)).size,10);
assert.deepEqual(references.references.map(x=>x.rank),[1,2,3,4,5,6,7,8,9,10]);
for(const item of references.references){
 assert(/^https:\/\//.test(item.url),'Reference URL must be HTTPS: '+item.id);
 assert(item.title.length>=15 && item.publisher.length>=5 && item.appliesTo.length>=15 && item.boundary.length>=15,'Incomplete reference: '+item.id);
 assert(study.includes(item.url)&&study.includes(item.id),'Citation not visible on website: '+item.id);
}
assert(study.includes('not a scored systematic literature review'),'Do not misrepresent targeted review as exhaustive');
assert(study.includes('Nepal'),'Jurisdiction boundary missing');
assert.equal(registry.pages.length,68);
assert.equal(registry.version,'1.2.0');
assert.equal(registry.pages.find(p=>p.id==='RF-02').path,'literature-review.html');
assert.equal(registry.pages.find(p=>p.id==='BQ-02').path,'calculation-workspace.html');
assert(registry.dataAssets.some(a=>a.path==='data/methodology-literature-v1.json'));
assert(nav.includes("'literature-review.html'") && nav.includes("'calculation-workspace.html'"));
assert(notes.includes('Controlled Google Drive')&&notes.includes('Quarto or Jupyter')&&notes.includes('Pages'));
assert(notes.includes('Missing quantity remains')&&notes.includes('null'));
assert.equal(template.properties.status.enum.length,6);
assert.deepEqual(template.properties.review.properties.decision.enum,['PENDING','ACCEPTED','REJECTED']);
assert.equal(template.properties.quantity.type[1],'null');
assert(template.required.includes('sourceEvidenceId')&&template.required.includes('sourceRevision'));
const qmd=get('templates/calculation-notes/v1/field-calculation.qmd');
assert(qmd.includes('WORKING_DRAFT — NOT VERIFIED')&&qmd.includes('PENDING')&&!qmd.includes('https://docs.google.com/spreadsheets/d/1QfVM08Z'),'No client data should enter public notebook template');
assert(catalog.works.length===26);
assert.equal(new Set(catalog.works.map(x=>x.slug)).size,26);
assert(catalog.workGroups.length===6);
const classifications=new Set(catalog.workGroups.map(g=>g.id));
for(const work of catalog.works){
 assert(classifications.has(work.workGroup),'Unknown work group: '+work.slug);
 assert(workHtml.includes('href="'+work.slug+'.html"'),'Missing trade link '+work.slug);
 assert(workHtml.includes('data-work-group="'+work.workGroup+'"'),'Missing filter category '+work.slug);
}
for(const g of catalog.workGroups)assert(workHtml.includes('data-work-section="'+g.id+'"'),'Missing work group '+g.id);
assert.equal((workHtml.match(/data-work-card/g)||[]).length,26);
assert(workHtml.includes('for="workQuery"')&&workHtml.includes('for="workGroup"')&&workHtml.includes('aria-live="polite"'));
assert.equal(matchesWork('RCC Footing m³','foundation','footing','all'),true);
assert.equal(matchesWork('RCC Footing m³','foundation','tile','all'),false);
assert.equal(matchesWork('Tile works m²','finishes','tile','foundation'),false);
assert.equal(matchesWork('Tile works m²','finishes','TILE','finishes'),true);
assert(style.includes('@media(max-width:620px)') && style.includes('.jp-work-filter'));
assert(get('measurements-boq.html').includes('calculation-workspace.html'));
assert(get('reference.html').includes('literature-review.html'));
const inspected=['literature-review.html','calculation-workspace.html','measurements-boq.html','reference.html','projects.html','governance.html',directory];
for(const htmlPath of inspected){
 const html=get(htmlPath);
 assert(html.includes('name="viewport"'),'Responsive viewport missing '+htmlPath);
 assert(html.includes('site-navigation-v0.8.js')&&html.includes('site-theme-v0.8.css'),'Shared navigation missing '+htmlPath);
 assert(/<main\b/.test(html),'Missing main landmark '+htmlPath);
 for(const [,value] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const target=value.split(/[?#]/)[0];
  if(!target||/^(https?:|mailto:|tel:|data:)/i.test(target))continue;
  const absolute=path.resolve(root,path.dirname(htmlPath),target);
  assert(absolute.startsWith(root+path.sep),'Local link escapes project '+htmlPath+': '+target);
  assert(existsSync(absolute),'Broken local source link '+htmlPath+': '+target);
 }
}
const projection=json('projects/rohini/ward-14/amrit-rawat/project-costing.json');
assert.equal(projection.measurementRows.length,0);
assert.equal(projection.boqRows.length,0);
assert.equal(projection.contractorRunningBills.length,0);
assert.equal(projection.vendorInvoices.length,0);
assert.equal(projection.paymentAllocations.length,0);
assert.equal(projection.aoc.grandTotalNpr,null);
assert.equal(projection.publicSnapshot.authenticatedSourceFetch,false);
console.log('METHODS / PAGE QA PASS: ten cited primary sources, six search groups / 26 work types, 68 routes, seven local-link audits, pending source and responsive constraints.');

if(process.argv[2]==='--staged'){
 const site=path.resolve(process.argv[3]||'_site');
 assert(existsSync(site),'Missing staging directory');
 function walk(dir){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
   const full=path.join(dir,entry.name);
   if(entry.isDirectory())walk(full);
   else{
    assert(!/\.(?:qmd|ipynb|pem|key)$/i.test(entry.name),'Unpublished or secret source leaked to Pages: '+full);
    assert(!/^\.env/.test(entry.name),'Environment file in Pages: '+full);
   }
  }
 }
 walk(site);
 for(const f of ['literature-review.html','calculation-workspace.html','data/methodology-literature-v1.json','templates/calculation-notes/v1/manifest.schema.json',directory]){
   assert(existsSync(path.join(site,f)),'Required public artefact not staged: '+f);
 }
 console.log('PAGES STAGING PASS: no draft computation notebooks or key-like files; literature, calculation and work pages included.');
}
