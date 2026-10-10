#!/usr/bin/env node
/* Read-only regression guard for JP-CRES MEP v0.5.12.
 * Assert that the three MEP trades are inline projections of the immutable
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
const rateLibrary=read('rate-library.html'),rateApp=read('work-rate-library.js');
assert(rateLibrary.includes('id="stageRibbon"'),'Rate Library preserves construction-stage journey');
assert(rateLibrary.includes('id="mepStageDetails"'),'MEP is a child of the construction journey');
assert(rateLibrary.includes('id="mepTradeTabs"'),'inline MEP trade buttons exist');
assert(rateLibrary.includes('id="workRateRows"'),'same Rate Library table remains the display surface');
assert(rateLibrary.includes('id="mepShowAll"'),'all MEP reset stays in-page');
assert(rateLibrary.includes('mep-catalog.js'),'shared source taxonomy required for tab filtering');
for(const trade of eachTrade){
 assert(rateLibrary.includes('data-mep-trade="'+trade+'"'),'in-page trade button: '+trade);
 assert(rateLibrary.includes('data-mep-trade="'+trade+'" aria-pressed="false"'),'accessible pressed state: '+trade);
 assert(!rateLibrary.includes('href="mep-'+trade+'.html"'),'no navigation to stand-alone trade page: '+trade);
 const legacy=read('mep-'+trade+'.html');
 assert(legacy.includes('data-legacy-mep-trade="'+trade+'"'),'old trade URL remains supported: '+trade);
 assert(legacy.includes('mep-legacy-redirect.js'),'old trade URL redirects to inline stage: '+trade);
 assert(!legacy.includes('id="mepRows"'),'old trade page no longer duplicates a rate table: '+trade);
}
assert(read('mep.html').includes('mep-legacy-redirect.js'),'old MEP overview redirects');
assert(read('mep.html').includes('data-legacy-mep-trade="all"'),'overview target is all MEP');
assert(read('mep-legacy-redirect.js').includes("target.searchParams.set('stage','mep')"),'legacy redirect targets MEP stage');
assert(read('mep-legacy-redirect.js').includes("window.location.replace(target.href)"),'legacy URL replaced without new tab/page lane');
assert(rateApp.includes("mep.tradeOf(r,t)===activeTrade"),'same-table filter uses existing MEP source taxonomy');
assert(rateApp.includes("button.addEventListener('click'"),'MEP buttons update in-page');
assert(rateApp.includes("mepChildren.hidden=activeStage!=='mep'"),'MEP controls shown only while MEP stage selected');
assert(rateApp.includes("syncJourneyUrl()"),'in-page state updates shareable URL');
assert(rateApp.includes("dest.set('trade',activeTrade)"),'specification deep links preserve selected trade');
assert(!/<a class="nav-item" href="mep\.html">/.test(rateLibrary),'MEP not sibling in Rate Library navigation');
assert(!/<a class="nav-item" href="mep\.html">/.test(read('index.html')),'MEP not sibling on homepage');
assert(read('index.html').includes('href="rate-library.html?stage=mep"'),'homepage links to MEP inside journey');
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
assert(rateLibrary.includes('data-mep-trade="electrical"'),'Electrical inline filter present');
assert(rateLibrary.includes('Description of Work</th>')&&rateLibrary.includes('Unit</th>')&&rateLibrary.includes('Rate (NPR)</th>'),'original three-column rate table preserved');
const specific=read('rate-specifications.html');
assert(specific.includes('id="specHeroBack"')&&specific.includes('id="specBackCrumb"'),'contextual breadcrumbs');
const details=read('work-specifications.js');
assert(rateApp.includes('dest.set(\'q\',query.value)')&&rateApp.includes('dest.set(\'sort\',sort.value)'),'inline list passes search and sort to details');
assert(details.includes("context.get('q')")&&details.includes("context.get('sort')"),'drilldown state read back');
assert(details.includes("route.phaseOf("),'detail previous/next follows the MEP workflow');
assert(details.includes("'rate-library.html?'+new URLSearchParams("),'detail return remains in Rate Library rather than a separate MEP page');
assert(details.includes("stage:'mep',trade:trade"),'detail back link carries stage and trade');
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
console.log('PASS inline MEP switching regression: 204 immutable source rows, 62 unique trades per worksheet set (3/37/22), routing, source history, SI/Imperial, search, quality guide, protected modules.');
