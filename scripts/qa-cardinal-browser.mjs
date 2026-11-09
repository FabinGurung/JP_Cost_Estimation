/** Playwright browser QA for the published Cardinal Studio site layout.
 * This is real Chromium desktop/mobile viewport rendering, not CSS text inspection.
 * The Pages build is static and source-projected: do not exercise private Google Sheets.
 */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const base = new URL(process.env.JP_QA_BASE_URL || 'http://127.0.0.1:8765/');
const output = process.env.JP_QA_OUT || 'qa-cardinal-browser-evidence';
const mode = process.env.JP_QA_MODE || 'local';
const targets = [
  ['home','index.html'],
  ['rates','rate-sources.html'],
  ['projects','projects.html'],
  ['measurements','measurements-boq.html'],
  ['finance','finance.html'],
  ['payments','finance-dashboard.html'],
  ['sheets','source-sheets.html'],
  ['amrit','projects/rohini/ward-14/amrit-rawat/index.html'],
  ['amrit-boq','projects/rohini/ward-14/amrit-rawat/boq.html'],
];
const variants = [
 {name:'desktop-1440', viewport:{width:1440,height:900}, isMobile:false, hasTouch:false},
 {name:'mobile-390', viewport:{width:390,height:844}, isMobile:true, hasTouch:true},
 {name:'tablet-820', viewport:{width:820,height:1180}, isMobile:true, hasTouch:true}
];
mkdirSync(output,{recursive:true});
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const evidence=[];
let failures=0;
try {
 for (const variant of variants) {
  const context=await browser.newContext({viewport:variant.viewport, isMobile:variant.isMobile, hasTouch:variant.hasTouch, deviceScaleFactor:1});
  for(const [name,route] of targets) {
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   try {
    const location=new URL(route,base).href;
    const response=await page.goto(location,{waitUntil:'domcontentloaded',timeout:45000});
    assert(response && response.status()===200, route+': HTTP '+response?.status());
    await page.locator('#jp-site-masthead').waitFor({state:'attached',timeout:15000});
    await page.locator('#jp-site-footer').waitFor({state:'attached',timeout:15000});
    await page.locator('#jp-cardinal-theme').waitFor({state:'attached',timeout:5000});
    await page.waitForFunction(()=>document.querySelector('#jp-cardinal-theme')?.sheet?.cssRules?.length>0,{timeout:8000}).catch(()=>{});
    const metrics=await page.evaluate(()=>{
     const box=id=>{
      const el=document.getElementById(id);
      if(!el)return null;
      const r=el.getBoundingClientRect(),style=getComputedStyle(el);
      return {x:r.x,y:r.y,w:r.width,h:r.height,visible:style.display!=='none'&&style.visibility!=='hidden',position:style.position}
     };
     return {
      innerWidth:innerWidth, pageWidth:document.documentElement.scrollWidth,
      shell:document.body.classList.contains('jp-cardinal-enabled'),
      cardinalCss:!!document.getElementById('jp-cardinal-theme')?.sheet,
      main:!!document.querySelector('main'),title:document.title,
      masthead:box('jp-site-masthead'), north:box('jp-north-ribbon'),
      west:box('jp-west-rail'),east:box('jp-east-rail'),south:box('jp-site-footer'),
      westLinks:document.querySelectorAll('#jp-west-rail nav a').length,
      sourceUrl:document.querySelector('#jp-site-footer a[href*="source-sheets.html"]')?.href||null,
      navScrollable:(()=>{const n=document.querySelector('#jp-site-masthead .jp-global-nav');return n?{scrollWidth:n.scrollWidth,clientWidth:n.clientWidth}:null;})()
     };
    });
    assert(metrics.shell && metrics.cardinalCss,route+': Cardinal layout/theme missing');
    assert(metrics.main && metrics.masthead && metrics.north && metrics.west && metrics.east && metrics.south,route+': cardinal shell missing');
    assert(metrics.westLinks===7,route+': missing department waypoints');
    assert(metrics.sourceUrl?.includes('/source-sheets.html'),route+': original Sheet custody shortcut missing');
    assert(metrics.masthead.h > 20 && metrics.masthead.h < (variant.name==='desktop-1440'?85:180),
      route+': masthead not slim or not visible, height='+metrics.masthead.h);
    assert(metrics.north.visible && metrics.west.visible && metrics.south.visible,route+': north/west/south hidden');
    if(variant.name==='desktop-1440'){
      assert(metrics.east.visible,route+': east rail missing on desktop');
      assert(metrics.west.position==='fixed'&&metrics.east.position==='fixed',route+': desktop rails not fixed');
    }else{
      assert(!metrics.east.visible,route+': east rail should collapse on smaller screens');
      assert(metrics.west.position!=='fixed',route+': west ribbon must be in normal flow on mobile/tablet');
    }
    // Allow separately scrollable wide finance/engineering tables. The global shell
    // itself must never extend beyond the mobile/desktop viewport.
    assert(metrics.masthead.x>=-1 && metrics.masthead.x+metrics.masthead.w<=metrics.innerWidth+2,
      route+': masthead clipped horizontally');
    assert(metrics.north.x>=-1&&metrics.north.x+metrics.north.w<=metrics.innerWidth+2,
      route+': north breadcrumb clipped horizontally');
    assert(metrics.pageWidth<=metrics.innerWidth+18,
      route+': page-level horizontal overflow by '+(metrics.pageWidth-metrics.innerWidth)+'px');
    assert(errors.length===0,route+': page script error: '+errors.join(' | '));
    const shot=output+'/'+variant.name+'--'+name+'.png';
    await page.screenshot({path:shot,fullPage:true,animations:'disabled'});
    console.log('BROWSER QA PASS '+mode+' '+variant.name+' '+name+' ('+metrics.pageWidth+'px, header '+Math.round(metrics.masthead.h)+'px)');
    evidence.push({variant:variant.name,page:route,title:metrics.title,result:'PASS',viewport:variant.viewport,metrics,screenshot:shot});
   }catch(e){
    failures++;
    const shot=output+'/'+variant.name+'--'+name+'--FAILED.png';
    try{await page.screenshot({path:shot,fullPage:true,animations:'disabled'});}catch{}
    console.error('BROWSER QA FAIL '+mode+' '+variant.name+' '+name+': '+e.message);
    evidence.push({variant:variant.name,page:route,result:'FAIL',message:e.message,screenshot:shot});
   }finally{await page.close()}
  }
  await context.close();
 }
}finally{await browser.close()}
writeFileSync(output+'/report.json',JSON.stringify({mode,base:base.href,checked:evidence.length,failures,evidence},null,2)+'\n');
console.log('BROWSER QA SUMMARY '+evidence.length+' viewport/page checks; failures='+failures+'; screenshots in '+output);
if(failures)process.exitCode=1;
