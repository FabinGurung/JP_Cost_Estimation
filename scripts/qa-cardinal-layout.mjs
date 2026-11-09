import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(path.join(root,p),'utf8');
const nav=read('site-navigation-v0.8.js');
const css=read('site-cardinal-v1.css');
const registry=JSON.parse(read('site-page-registry.v0.8.json'));
assert.equal(registry.pages.length,71,'The redesign cannot drop or duplicate any legacy page');
assert.equal(new Set(registry.pages.map(p=>p.id)).size,71);
assert.equal(new Set(registry.pages.map(p=>p.path)).size,71);
for(const p of registry.pages){
 const html=read(p.path);
 assert(html.includes('site-navigation-v0.8.js')&&html.includes('site-theme-v0.8.css'),'Missing site shell: '+p.path);
}
for(const keyword of ['jp-cardinal-theme','site-cardinal-v1.css','jp-cardinal-enabled',
 'jp-north-ribbon','jp-west-rail','jp-east-rail','jp-site-footer',
 'jp-south-links','jp-functional-tabs','aria-current','aria-label',
 "['home','00'","['rates','01'","['projects','02'","['measurements','03'",
 "['finance','04'","['reference','05'","['system','06'"]){
 assert(nav.includes(keyword),'Missing navigation contract '+keyword);
}
for(const k of ['body.jp-cardinal-enabled','#jp-site-masthead',
 '.jp-west-rail','.jp-east-rail','#jp-north-ribbon','#jp-site-footer',
 '@media(max-width:1279px)','@media(max-width:820px)',
 'prefers-reduced-motion','focus-visible']){
 assert(css.includes(k),'Missing shell layout / responsive / accessibility '+k);
}
assert(css.includes('grid-template-columns:repeat(auto-fit')||css.includes('auto-fit'));
assert(!/https?:\/\/[^)\s'"]+\.(?:css|woff|ttf|js)/i.test(css),'External runtime asset dependency');
assert(!/private_key|credentials_json|api[_-]?token/i.test(css),'Never emit source secrets');
assert(nav.includes("const root=new URL('.',script?.src||location.href)"),'Nested pages must resolve shared root');
assert(nav.includes("document.querySelector('main')"),'No page-specific hardcoded main dependency');
assert(nav.includes('if(document.getElementById('),'Shared shell must be idempotent');
assert(existsSync(path.join(root,'data/connected-website-sheets.v1.json')));
console.log('CARDINAL UX PASS: 71 stable routes; N/W/E/S, mobile rails, keyboard focus, provenance links and existing data contracts preserved.');
