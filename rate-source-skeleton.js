/* M02 source-separated derived explorer v0.5.15. */
(() => {
'use strict';
const collection=document.body.dataset.sourceCollection,sourceId=document.body.dataset.sourceDocument;
const routes={'SRC-GOV-001':'kaski-district-rates.html','SRC-VEN-001':'pipes-price-list.html','SRC-VEN-002':'electrical-wire-quotation.html','SRC-RA-001':'contractor-rate-analysis.html','SRC-RA-002':'users-rate-analysis.html','SRC-RA-003':'dudbc-rate-analysis.html'};
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e;};
async function json(path){const r=await fetch(path);if(!r.ok)throw Error('Could not load '+path+' ('+r.status+')');if(path.endsWith('.gz')){if(typeof DecompressionStream==='undefined')throw Error('Please use a current browser to read compressed source data');const bytes=await r.arrayBuffer();const sig=new Uint8Array(bytes);if(sig[0]!==31||sig[1]!==139)return JSON.parse(new TextDecoder().decode(bytes));return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).json();}return r.json();}
function card(title,href,icon,description,status){const a=el('a','source-card');a.href=href;a.append(el('span','source-card-icon',icon),el('strong',null,title),el('p',null,description),el('small',null,status),el('span','source-card-arrow','Explore →'));return a;}
json('data/rate-source-derived.v0.5.15.json').then(async m=>{
 if(m.sources.length!==6||m.schema!=='jp-cres.source_derivations.v0.5.15')throw Error('Source catalogue mismatch');
 if(collection==='hub')for(const g of m.groups)document.getElementById('sourceLibraryCards').append(card(g.name,g.href,g.icon,g.tagline,g.id==='personal'?'204 personal workbook observations':g.entries.length+' independent documents · extracted views'));
 else if(collection){const g=m.groups.find(x=>x.id===collection);document.getElementById('sourceCategoryCount').textContent=g.entries.length;for(const id of g.entries){const s=m.sources.find(x=>x.id===id);document.getElementById('sourceDocumentCards').append(card(s.label,routes[id],g.icon,s.source_scope,s.page_count+' pages · '+(s.entry_count||s.candidate_count).toLocaleString()+' extracted entries'+(s.private_fields_withheld?' · private prices withheld':'')));}}
 if(!sourceId)return;
 const s=m.sources.find(x=>x.id===sourceId);if(!s)throw Error('Unknown source');
 document.getElementById('documentDescription').textContent=s.source_scope+'. '+s.edition_claim;
 document.getElementById('parseState').textContent='Raw extraction complete';
 document.getElementById('verifiedObs').textContent=(s.entry_count||s.candidate_count).toLocaleString();
 document.querySelector('.source-metrics>div:first-child span').textContent='PDF pages extracted';document.querySelector('.source-metrics>div:first-child strong').textContent=s.page_count;
 document.getElementById('documentNotes').textContent=s.notes;
 const panel=document.querySelector('.source-preview'),body=document.getElementById('sourcePreviewRows');
 const tools=el('div','source-tools'),search=el('input');search.type='search';search.placeholder='Search this source…';search.setAttribute('aria-label','Search extracted descriptions or page text');
 const mode=el('select');mode.setAttribute('aria-label','Source view');
 if(s.entry_count)mode.add(new Option(s.private_fields_withheld?'Product descriptions':'Source observations','entries'));
 if(s.candidate_count)mode.add(new Option('Machine numeric candidates','candidates'));
 if(s.transcript_count)mode.add(new Option('Page transcripts','pages'));
 const page=el('select');page.setAttribute('aria-label','Filter source PDF page');page.add(new Option('All PDF pages',''));for(let i=1;i<=s.page_count;i++)page.add(new Option('PDF page '+i,i));
 const reset=el('button',null,'Reset');reset.type='button';tools.append(search,mode,page,reset);panel.querySelector('.source-preview-title').after(tools);
 const status=el('p','source-results');status.setAttribute('role','status');tools.after(status);
 const transcripts=el('div','source-transcripts');panel.querySelector('.source-table-scroll').after(transcripts);
 const pager=el('div','source-pager'),prev=el('button',null,'← Previous'),next=el('button',null,'Next →'),position=el('span');prev.type=next.type='button';pager.append(prev,position,next);transcripts.after(pager);
 const cache={},size=50;let offset=0,filtered=[],generation=0;
 function persist(){const q=new URLSearchParams(location.search);q.set('view',mode.value);search.value?q.set('q',search.value):q.delete('q');page.value?q.set('page',page.value):q.delete('page');history.replaceState(null,'','?'+q.toString());}
 function render(){const isText=mode.value==='pages';panel.querySelector('.source-table-scroll').hidden=isText;transcripts.hidden=!isText;body.replaceChildren();transcripts.replaceChildren();
 const visible=filtered.slice(offset,offset+size);
 if(isText){for(const r of visible){const d=el('details','source-transcript');d.append(el('summary',null,'PDF page '+r.page+' · '+r.method+' · unverified transcript'),el('pre',null,r.text||'No text recovered on this page.'));transcripts.append(d);}}
 else for(const r of visible){const tr=el('tr'),desc=el('td');desc.append(el('strong',null,r.description),el('small','source-entry-kind',r.part||r.basis));const value=el('td');
 value.append(el('strong',null,s.private_fields_withheld?'Private':r.value===null?'Unresolved':String(r.value)),el('small','source-entry-kind',r.basis||'Source observation'));
 if(r.raw_value!==null&&r.raw_value!==undefined&&String(r.raw_value)!==String(r.value))value.append(el('small','source-entry-kind','Source text: '+r.raw_value));
 const evidence=el('td'),detail=el('details');detail.append(el('summary',null,(r.page===null?'Page unresolved':'PDF p. '+r.page)+(r.row?' · row '+r.row:'')));
 const facts=[r.status,r.method,r.unit?'Source unit: '+r.unit:'Unit not recovered',r.tax?'Tax: '+r.tax:'',r.transport?'Transport: '+r.transport:'',r.bbox?'PDF bbox: '+r.bbox.join(', '):'',r.confidence!==undefined&&r.confidence!==null?'OCR confidence: '+Math.round(r.confidence*100)+'%':''].filter(Boolean);detail.append(el('p',null,facts.join(' · ')));evidence.append(detail);
 tr.append(desc,el('td',null,r.unit||'—'),value,evidence);body.append(tr);}
 if(!visible.length){if(isText)transcripts.append(el('p',null,'No matching pages.'));else {const tr=el('tr'),td=el('td',null,'No matching entries. Try clearing the search or page filter.');td.colSpan=4;tr.append(td);body.append(tr);}}
 status.textContent=filtered.length.toLocaleString()+' matches · '+(s.private_fields_withheld?'private prices withheld':isText?'machine text, may contain OCR errors':mode.value==='candidates'?'numbers have unverified roles; do not treat every number as a price':'source-specific references; no cross-source merging');
 position.textContent=filtered.length?(offset+1)+'–'+Math.min(offset+size,filtered.length)+' of '+filtered.length:'0 entries';prev.disabled=offset===0;next.disabled=offset+size>=filtered.length;}
 async function refresh(){const token=++generation;status.textContent='Loading source entries…';try {const key=mode.value;if(!cache[key]){const chunks=[];for(let i=0;i<s[key].length;i+=6)chunks.push(...await Promise.all(s[key].slice(i,i+6).map(json)));cache[key]=chunks.flat();}if(token!==generation)return;const needle=search.value.trim().toLocaleLowerCase();filtered=cache[key].filter(r=>(!page.value||r.page===Number(page.value))&&(!needle||[r.description,r.text,r.part,r.raw_value,r.unit].filter(x=>x!==undefined&&x!==null).join(' ').toLocaleLowerCase().includes(needle)));offset=0;persist();render();}catch(e){if(token===generation)status.textContent=e.message+' — reload to retry.';}}
 const q=new URLSearchParams(location.search);if([...mode.options].some(x=>x.value===q.get('view')))mode.value=q.get('view');search.value=q.get('q')||'';if(Number(q.get('page'))>0&&Number(q.get('page'))<=s.page_count)page.value=q.get('page');
 let timer;search.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(refresh,200);});mode.addEventListener('change',refresh);page.addEventListener('change',refresh);reset.addEventListener('click',()=>{search.value='';page.value='';refresh();});prev.addEventListener('click',()=>{offset=Math.max(0,offset-size);render();});next.addEventListener('click',()=>{offset+=size;render();});await refresh();
}).catch(e=>{const p=document.querySelector('.source-intro p:last-child');if(p)p.textContent='Unable to load extracted source: '+e.message;});
})();
