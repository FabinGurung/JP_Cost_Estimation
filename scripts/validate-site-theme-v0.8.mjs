import { readdirSync, readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const root = new URL('../',import.meta.url);
const read = path => readFileSync(new URL(path,root),'utf8');
const html = readdirSync(root).filter(name => name.endsWith('.html'));
assert(html.length >= 27,'Expected all existing pages plus the reference wall');
for (const name of html) {
  const source = read(name);
  assert(source.includes('site-theme-v0.8.css'),name + ' missing shared style');
  assert(source.includes('site-navigation-v0.8.js'),name + ' missing shared navigation');
  assert.equal((source.match(/site-theme-v0\.8\.css/g) || []).length,1,name + ' repeated style import');
  assert.equal((source.match(/site-navigation-v0\.8\.js/g) || []).length,1,name + ' repeated navigation import');
  assert(/<\/head>/i.test(source) && /<main\b/i.test(source),name + ' lacks page structure');
}
const source = JSON.parse(read('memory-posters.json'));
assert.equal(source.schema,'jp.site.memory-posters.v1');
assert(source.posters.length >= 10,'Expected a useful reference board');
const ids = new Set();
const categories = new Set();
for (const poster of source.posters) {
  assert(/^[a-z0-9-]+$/.test(poster.id),'Invalid poster ID');
  assert(!ids.has(poster.id),'Duplicate poster ID ' + poster.id);
  ids.add(poster.id);
  assert(typeof poster.title === 'string' && poster.title.length > 3);
  assert(typeof poster.takeaway === 'string' && poster.takeaway.length > 5);
  assert(typeof poster.detail === 'string' && poster.detail.length > 15);
  assert(/^[a-z0-9-]+\.html$/.test(poster.href),'Unsafe poster URL');
  assert(existsSync(new URL(poster.href,root)),'Missing target ' + poster.href);
  categories.add(poster.category);
}
for (const category of ['Finance','Payments','Rates','Operations','System']) assert(categories.has(category),'Missing category ' + category);
assert(!/docs\.google\.com|transaction_id|spreadsheet_id|private.key|access.token/i.test(JSON.stringify(source)),'Reference wall must not contain source credentials or private IDs');
const nav = read('site-navigation-v0.8.js');
for (const path of ['index.html','rate-sources.html','finance.html','finance-dashboard.html','memory-posters.html','system-map.html']) assert(nav.includes(path),'Missing shared route ' + path);
for (const file of ['site-navigation-v0.8.js','memory-posters.js','site-theme-v0.8.css','memory-posters.css']) assert(existsSync(new URL(file,root)),file + ' missing');
console.log('SITE PRESENTATION PASS: ' + html.length + ' pages, ' + source.posters.length + ' posters, ' + categories.size + ' categories');
