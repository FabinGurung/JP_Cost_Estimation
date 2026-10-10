#!/usr/bin/env node
/* Read-only regression guard for JP-CRES MEP v0.5.11.
 * Assert that the 3 trade pages are navigable projections of the immutable
 * rate catalog, not new project, source or financial records. Node built-ins only.
 */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
const json = path => JSON.parse(read(path));
const catalog=json('data/historical-work-rates-v0.5.3.json');
const labels=json('data/work-rate-labels-v0.5.4.json').labels;
const taxonomy=json('data/work-rate-taxonomy-v0.5.5.json').records;
assert.equal(catalog.items.length,204,'204 source work rates preserved');
assert.equal(Object.keys(labels).length,204,'204 short names preserved');
assert.equal(Object.keys(taxonomy).length,204,'204 editorial categories preserved');

const testWindow={};
runInNewContext(read('mep-catalog.js'),{window:testWindow,globalThis:testWindow});
const mep=testWindow.JPMep;
const counts=mep.check(catalog.items,taxonomy);
for (const version of ['visible','hidden']){
  assert.deepEqual({...counts[version]}, {mechanical:3,electrical:37,plumbing:22},'MEP item counts');
  const groups=mep.partition(catalog.items,taxonomy,version);
  const ids=Object.values(groups).flat().map(x=>x.id);
  assert.equal(new Set(ids).size,62,'no duplicate MEP records');
  const fan=groups.mechanical.find(x=>taxonomy[x.id].work_type==='Ventilation');
  assert(fan,'mechanical view includes exhaust fan');
  assert.equal(taxonomy[fan.id].family,'Electrical','original family preserved');
  assert.match(fan.source_sheet,/Electrical/i,'original source worksheet preserved');
  assert.equal(groups.plumbing.filter(x=>taxonomy[x.id].family==='Sanitary').length,11);
  assert.equal(groups.plumbing.filter(x=>taxonomy[x.id].family==='Plumbing').length,11);
  for(const [name,items] of Object.entries(groups)){
    for(const item of items)assert.equal(mep.tradeOf(item,taxonomy[item.id]),name);
  }
}
const eachTrade=['mechanical','electrical','plumbing'];
for(const name of eachTrade){
  const path='mep-'+name+'.html', page=read(path);
  assert(page.startsWith('<!doctype html>'),'valid document type '+path);
  assert(page.includes('data-mep-trade="'+name+'"'),'trade mode declared '+path);
  assert(page.includes('mep-catalog.js')&&page.includes('mep-app.js')&&page.includes('work-rate-units.js'),'scripts loaded '+path);
  assert(page.includes('id="mepSearch"')&&page.includes('id="mepWorksheet"')&&page.includes('id="mepUnits"'),'filters exist '+path);
  assert(page.includes('id="mepCategory"')&&page.includes('id="mepSort"'),'category sorting '+path);
  assert(page.includes('Description of Work</th>')&&page.includes('Unit</th>')&&page.includes('Rate (NPR)</th>'),'three-column table '+path);
  assert(page.includes('rate-library.html')&&page.includes('mep.html'),'breadcrumbs '+path);
}
// MEP is not a sibling of Rate Library: it is a journey stage with 3 nested trade pages.
assert(read('rate-library.html').includes('id="stageRibbon"'),'Rate Library has construction-stage journey');
assert(read('rate-library.html').includes('id="mepStageDetails"'),'MEP child branch lives inside journey');
assert(read('rate-library.html').includes('class="stage-mep-children"'),'MEP sub-branch styled with other stages');
assert(read('rate-library.html').includes('href="mep.html"'),'journey child links MEP overview');
assert(!/<a class="nav-item" href="mep\.html">/.test(read('rate-library.html')),'MEP removed as top-level Rate Library sidebar peer');
assert(!/<a class="nav-item" href="mep\.html">/.test(read('index.html')),'MEP removed as top-level homepage sidebar peer');
assert(read('index.html').includes('href="rate-library.html?stage=mep"'),'homepage directs visitors to journey stage');
const constructionWindow={};
runInNewContext(read('work-construction-guide.js'),{window:constructionWindow,globalThis:constructionWindow});
const construction=constructionWindow.JPConstructionGuide;
const mepStage=construction.stages.filter(stage=>stage.id==='mep');
assert.equal(mepStage.length,1,'MEP exists as exactly one journey stage');
assert.equal(construction.stages.filter(stage=>stage.id==='roughin'||stage.id==='fixtures').length,0,'old split MEP stages removed');
assert(construction.stages.find(stage=>stage.id==='openings').order<mepStage[0].order,'MEP follows openings');
assert(mepStage[0].order<construction.stages.find(stage=>stage.id==='substrates').order,'MEP precedes plaster and finishes');
for(const version of ['visible','hidden']){
 const subset=catalog.items.filter(item=>item.version===version);
 assert.equal(subset.length,102);
 const mepRows=subset.filter(item=>construction.sequence(item,taxonomy[item.id]).stage_id==='mep');
 assert.equal(mepRows.length,62,'62 MEP items in one construction journey stage');
 assert.equal(subset.filter(item=>construction.sequence(item,taxonomy[item.id]).stage_id!=='mep').length,40,'40 nonMEP works unchanged');
 for(const row of mepRows)assert(mep.tradeOf(row,taxonomy[row.id]),'journey MEP must have trade drilldown');
}
for(const html of ['mep.html','mep-mechanical.html','mep-electrical.html','mep-plumbing.html']){
 assert(read(html).includes('class="nav-subtree"'),'nested trade navigation '+html);
 assert(read(html).includes('href="rate-library.html?stage=mep"'),'stage breadcrumb '+html);
}
assert(read('rate-library.html').includes('mep-mechanical.html')&&read('rate-library.html').includes('mep-electrical.html')&&read('rate-library.html').includes('mep-plumbing.html'),'all three MEP child destinations');

const specific=read('rate-specifications.html');
assert(specific.includes('id="specHeroBack"')&&specific.includes('id="specBackCrumb"'),'contextual breadcrumbs');
const tradeApp=read('mep-app.js'),details=read('work-specifications.js');
assert(tradeApp.includes('q:search.value')&&tradeApp.includes('sort:sort.value')&&tradeApp.includes('category:category.value'),'search filters carried to details');
assert(details.includes("context.get('q')")&&details.includes("context.get('sort')"),'drilldown state read back');
assert(details.includes("route.phaseOf("),'trade previous/next follows the MEP workflow');
assert(details.includes("nextContext.set('id'"),'previous and next preserve trade context');
assert(details.includes("'specHeroBack'"),'hero return link contextual');
const qualityWindow={};
runInNewContext(read('work-construction-guide.js'),{window:qualityWindow,globalThis:qualityWindow});
const ventilation=catalog.items.find(x=>x.version==='visible'&&taxonomy[x.id].work_type==='Ventilation');
const prompts=qualityWindow.JPConstructionGuide.checks(ventilation,taxonomy[ventilation.id]);
assert(prompts.some(x=>/airflow/i.test(x)),'mechanical ventilation includes airflow checks');
assert(prompts.some(x=>/electrical safety/i.test(x)),'fan still includes electrical safety');
const unitWindow={};
runInNewContext(read('work-rate-units.js'),{window:unitWindow,globalThis:unitWindow});
const units=unitWindow.JPRateUnits;
assert.equal(Math.round(units.convert(2500,'m²','imperial').rate*100)/100,232.26,'m² to ft²');
assert.equal(Math.round(units.convert(16000,'m³','imperial').rate*100)/100,453.07,'m³ to ft³');
assert(units.match('STONE CLADDING/ CUTPIECE STONE','cut piece'),'legacy cut-piece alias');
for(const name of ['mep-app.js','mep-catalog.js','work-construction-guide.js','work-specifications.js','work-rate-units.js']){
 assert(read(name).length>100);
}
for(const path of ['finance.html','finance.js','finance-summary.json','boq-template.json','rate-comparison.html']){
 assert(existsSync(new URL('../'+path,import.meta.url)),'protected module exists: '+path);
}
console.log('PASS MEP journey regression: 204 immutable source rows, 62 unique trades per worksheet set (3/37/22), routing, source history, SI/Imperial, search, quality guide, protected modules.');
