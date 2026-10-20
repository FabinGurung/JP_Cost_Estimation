import {readdirSync,readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const manifest=JSON.parse(read('site-page-registry.v0.8.json'));
assert.equal(manifest.schema,'jp.site.page-registry.v1');
assert.equal(manifest.version,'0.8.0');
const pages=manifest.pages;
const actual=readdirSync(root).filter(x=>x.endsWith('.html')).sort();
const declared=pages.map(p=>p.path).sort();
assert.deepEqual(declared,actual,'Registry must enumerate every root HTML page exactly once');
const ids=new Set(pages.map(p=>p.id));
assert.equal(ids.size,pages.length,'Duplicate page ID');
assert.equal(pages.length,27,'Current milestone page count changed; update baseline deliberately');
const departmentIds=new Set(manifest.departments.map(d=>d.id));
assert.deepEqual([...departmentIds].sort(),['FN','MP','RT'],'Exactly three L1 departments');
assert.deepEqual(manifest.navigation.primary,['RT-01','FN-01','MP-01']);
assert.deepEqual(manifest.navigation.more,['OV-01','FN-02','FN-03','SY-01']);
for(const p of pages){
  assert(departmentIds.has(p.department)||((p.id==='OV-01'||p.id==='SY-01')&&p.department===null),p.id+' unknown department');
  assert(/^[A-Z]{2}-\d\d$/.test(p.id),p.id+' invalid ID');
  assert(p.parent===null||ids.has(p.parent),p.id+' unknown parent');
  assert(['published','redirect'].includes(p.status),p.id+' unknown status');
  const source=read(p.path);
  assert(source.includes('site-theme-v0.8.css')&&source.includes('site-navigation-v0.8.js'),p.id+' shared shell missing');
  if(p.status==='redirect')assert(source.includes('mep-legacy-redirect.js'),p.id+' redirect handler missing');
  for(const s of p.sections){
    assert(s.id.startsWith(p.id+'.S'),s.id+' section prefix mismatch');
    assert(source.includes('id="'+s.domId+'"')||source.includes("id='"+s.domId+"'"),s.id+' anchor missing');
  }
  for(const dependency of p.keyDependencies)assert(existsSync(new URL(dependency,root)),p.id+' missing dependency '+dependency);
}
const nav=read('site-navigation-v0.8.js');
for(const p of pages.filter(p=>p.navigation==='primary'||p.navigation==='more'))assert(nav.includes("'"+p.path+"'"),p.id+' missing shared navigation');
assert(nav.includes('primarySections')&&nav.includes('moreSections'),'Missing primary/More split');
assert.equal(pages.filter(p=>p.navigation==='primary').length,3,'Only three primary navigation pages');
assert.equal(pages.filter(p=>p.navigation==='more').length,4,'Unexpected More menu');
for(const p of pages){const seen=new Set();let node=p;while(node.parent){assert(!seen.has(node.id),'Parent cycle '+p.id);seen.add(node.id);node=pages.find(q=>q.id===node.parent);assert(node,'Broken parent '+p.id)}}
for(const p of manifest.sharedAssets)assert(existsSync(new URL(p,root)),'Missing shared asset '+p);
for(const d of manifest.dataAssets)assert(existsSync(new URL(d.path,root)),'Missing data '+d.path);
console.log('SITE REGISTRY PASS: '+pages.length+' pages, '+pages.filter(p=>p.status==='redirect').length+' redirects, '+manifest.departments.length+' departments');
