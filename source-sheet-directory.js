/* Controlled source roles are public. No credentials, Google tokens or private rows here. */
(()=>{'use strict';
const container=document.getElementById('sheetInventoryRows');
if(!container)return;
fetch('data/connected-website-sheets.v1.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Missing inventory');return r.json();}).then(d=>{
if(d.schema!=='jp.website.connected-source-sheets.v1'||!Array.isArray(d.records))throw Error('Schema mismatch');
container.replaceChildren();
for(const r of d.records){
const card=document.createElement('article');card.className='tile';
const heading=document.createElement('h3');heading.textContent=r.title;
const type=document.createElement('p');const b=document.createElement('strong');b.textContent='Source role: ';type.append(b,document.createTextNode(r.authority));
const status=document.createElement('p');const s=document.createElement('strong');s.textContent='Publication status: ';status.append(s,document.createTextNode(r.publicationStatus.replaceAll('_',' ')));
const link=document.createElement('a');link.href=r.usagePage;link.textContent='Open relevant website view →';
const warning=document.createElement('p');warning.className='muted';warning.textContent='Does not imply: '+r.doesNotImply;
card.append(heading,type,status,warning,link);container.append(card);
}
}).catch(()=>{container.textContent='Source-role inventory unavailable. Open the original Drive folder above to find the controlled LIVE Sheets.'});
})();