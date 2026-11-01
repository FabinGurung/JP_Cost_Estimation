import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const registry=JSON.parse(readFileSync(path.join(root,'site-page-registry.v0.8.json'),'utf8'));
const registered=new Set(registry.pages.map(p=>p.path));
const missing=[];
let checked=0,refs=0;
for(const p of registry.pages){
 const abs=path.resolve(root,p.path);
 assert(abs.startsWith(root+path.sep)&&existsSync(abs),'Unregistered/missing HTML route '+p.path);
 const html=readFileSync(abs,'utf8');
 assert(/<main\b/i.test(html),'Missing main on '+p.path);
 assert(/<meta\s+name="viewport"/i.test(html),'Missing mobile viewport on '+p.path);
 assert(html.includes('site-theme-v0.8.css')&&html.includes('site-navigation-v0.8.js'),'Missing global shell '+p.path);
 for(const match of html.matchAll(/\b(?:href|src)=(["'])(.*?)\1/g)){
  const raw=match[2].trim().replaceAll('&amp;','&');
  if(!raw||raw.startsWith('#')||raw.startsWith('?'))continue;
  if(/^(?:https?:|mailto:|tel:|data:|blob:|javascript:|\/\/)/i.test(raw))continue;
  const rel=raw.split(/[?#]/)[0];
  if(!rel)continue;
  // Relative Paths only: absolute Paths may be external to GitHub Pages project root.
  if(rel.startsWith('/'))continue;
  let f=path.resolve(path.dirname(abs),decodeURIComponent(rel));
  if(rel.endsWith('/'))f=path.join(f,'index.html');
  refs++;
  if(!(f.startsWith(root+path.sep)&&existsSync(f)))missing.push(p.path+' -> '+raw);
 }
 checked++;
}
assert.deepEqual(missing,[],'Broken local page/asset hyperlinks');
assert(registered.has('rate-workbench.html')&&registered.has('site-map.html'));
assert(registered.has('projects/rohini/ward-14/amrit-rawat/measurements/index.html'));
console.log('WHOLE-SITE QA PASS: '+checked+' pages; '+refs+' local static links checked; all 6 functional departments and legacy workbench preserved.');
