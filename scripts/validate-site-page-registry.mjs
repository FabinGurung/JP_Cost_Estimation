import {readdirSync,readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const registry=JSON.parse(read('site-page-registry.v0.8.json'));
assert.equal(registry.schema,'jp.site.page-registry.v1');
assert.equal(registry.version,'1.0.0');
const pages=registry.pages,ids=new Set(pages.map(p=>p.id));
assert.equal(ids.size,pages.length,'Duplicate stable page ID');
assert.equal(pages.length,35,'Functional navigation baseline changed; update intentionally');
assert.deepEqual(registry.departments.map(d=>d.id).sort(),['BQ','FN','PJ','RF','RT','SY']);
assert.deepEqual(registry.navigation.primary,['OV-01','RT-01','PJ-01','BQ-01','FN-01']);
assert.deepEqual(registry.navigation.more,['RF-01','SY-02','MP-01','FN-03']);
const top=readdirSync(root).filter(x=>x.endsWith('.html'));
const nested=pages.filter(p=>p.path.includes('/')&&p.path.endsWith('.html')).map(p=>p.path);
assert.deepEqual(pages.map(p=>p.path).sort(),[...top,...nested].sort(),'Every root and registered nested HTML page must be included once');
const departments=new Set(registry.departments.map(d=>d.id));
for(const p of pages){
 assert(departments.has(p.department)||(p.id==='OV-01'&&p.department===null),'Unknown department '+p.id);
 assert(/^[A-Z]{2}-\d\d$/.test(p.id),'Invalid stable page ID '+p.id);
 assert(p.parent===null||ids.has(p.parent),'Broken page parent '+p.id);
 assert(['published','redirect'].includes(p.status),'Unknown lifecycle state '+p.id);
 const html=read(p.path);
 assert(html.includes('site-theme-v0.8.css')&&html.includes('site-navigation-v0.8.js'),'Missing shared shell '+p.path);
 assert(html.includes('<main'),'Missing accessible main '+p.path);
 for(const s of p.sections){
  assert(s.id.startsWith(p.id+'.S'),'Section ID mismatch '+s.id);
  assert(html.includes('id="'+s.domId+'"')||html.includes("id='"+s.domId+"'"),'Missing section anchor '+s.domId+' in '+p.path);
 }
 for(const f of p.keyDependencies)assert(existsSync(new URL(f,root)),'Missing data/asset '+f);
 const seen=new Set();let cur=p;
 while(cur.parent){assert(!seen.has(cur.id),'Parent cycle');seen.add(cur.id);cur=pages.find(x=>x.id===cur.parent);assert(cur,'Broken hierarchy');}
}
for(const asset of registry.dataAssets)assert(existsSync(new URL(asset.path,root)),'Missing data '+asset.id);
assert.equal(registry.pages.find(p=>p.id==='PJ-02').path,'projects/rohini/ward-14/amrit-rawat/index.html');
assert(!ids.has('RT-22'),'Client rate page cannot remain in generic Rates');
assert(registry.legacyAliases.some(x=>x.legacyPageId==='RT-22'&&x.currentPageId==='PJ-02'),'Missing historical alias');
const nav=read('site-navigation-v0.8.js');
for(const dest of ['index.html','rate-sources.html','projects.html','measurements-boq.html','finance.html','governance.html'])assert(nav.includes("'"+dest+"'"),'Missing global route '+dest);
for(const f of ['site-theme-v0.8.css','site-navigation-v0.8.js','department-pages.css'])assert(existsSync(new URL(f,root)));
console.log('FUNCTIONAL PAGE REGISTRY PASS: '+pages.length+' routes, 6 departments, legacy RT-22 retained as alias.');
