#!/usr/bin/env node
/**
 * Rohini / Pokhara Ward 14 / Amrit Rawat
 * Google Sheets (one private live ID) -> public-safe derived JSON.
 *
 * Read-only credentials MUST be GitHub Actions secrets, never repository data.
 * The source Google Sheet, including 90_VERSION_HISTORY, owns rate changes.
 */
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,appendFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const relative='projects/rohini/ward-14/amrit-rawat';
const output=path.join(repo,relative,'rates.public.json');
const historyFile=path.join(repo,relative,'publication-history.jsonl');
const sha=x=>createHash('sha256').update(x).digest('hex');

function verify(doc){
  assert.equal(doc.schema,'jp.client-rate-snapshot.v1');
  assert.equal(doc.recordId,'RE-RATE-AMRIT-RAWAT-001');
  assert(/^V\d{6}$/.test(doc.version),'Missing numbered source version');
  assert.equal(doc.effectiveStatus,'USER_SUPPLIED_INDICATIVE_NOT_APPROVED');
  assert.equal(doc.client,'Amrit Rawat');
  assert.equal(doc.currency,'NPR');
  assert(Array.isArray(doc.rates)&&doc.rates.length===32,'Expected 32 rates');
  assert.deepEqual(['plinth','trade','daily_wage'].map(g=>doc.rates.filter(r=>r.category===g).length),[14,12,6]);
  const ids=new Set();
  for(const row of doc.rates){
    assert(/^((PL|TR|WG)-\d{3})$/.test(row.id),'Bad rate ID');
    assert(!ids.has(row.id),'Duplicate rate ID '+row.id);ids.add(row.id);
    assert(typeof row.work==='string'&&row.work.trim(),'Missing work');
    assert(typeof row.unit==='string'&&row.unit.trim(),'Missing unit');
    assert(typeof row.basis==='string'&&row.basis.trim(),'Missing rate basis');
    assert(Number.isFinite(row.minNpr)&&Number.isFinite(row.maxNpr)&&row.minNpr>0&&row.minNpr<=row.maxNpr,'Bad range');
    assert.equal(row.status,'USER_SUPPLIED_UNVERIFIED','Approval status incorrectly changed');
  }
  assert(!JSON.stringify(doc).includes('private_key'),'Secret leak');
}
const existing=JSON.parse(readFileSync(output,'utf8'));
verify(existing);
if(process.argv.includes('--validate-current')){
  console.log('AMRIT RATE SNAPSHOT PASS: 14 plinth, 12 trade, 6 wage; private credentials not embedded.');
  process.exit(0);
}
const sheetId=process.env.AMRIT_RAWAT_SHEET_ID;
if(!sheetId)throw Error('MISSING_PRIVATE_SOURCE_ID: no authenticated source fetch performed.');
// Keyless default: google-github-actions/auth establishes ADC using the authorized
// repository workload identity provider. Python google-auth exchanges the identity.
const {execFileSync}=await import('node:child_process');
const python=`import google.auth
from google.auth.transport.requests import Request
creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"])
creds.refresh(Request())
assert creds.token, "Missing Google access token"
print(creds.token)`;
let token;
try{token=execFileSync('python3',['-c',python],{encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:30000}).trim();}
catch(e){throw Error('KEYLESS_GOOGLE_AUTH_FAILED: no source snapshot changed. Check workload identity and Viewer access.');}
if(!token)throw Error('Missing source read-only access token');
async function read(tab,range){
  const full="'"+tab+"'!"+range;
  const url='https://sheets.googleapis.com/v4/spreadsheets/'+encodeURIComponent(sheetId)+'/values/'+encodeURIComponent(full)+'?valueRenderOption=UNFORMATTED_VALUE';
  const response=await fetch(url,{headers:{Authorization:'Bearer '+token}});
  if(!response.ok)throw Error('Sheets read failed for '+tab+' ('+response.status+')');
  const json=await response.json();
  return json.values||[];
}
const [p,t,w,h]=await Promise.all([
  read('01_PLINTH_RATES','A1:K100'),
  read('02_TRADE_RATES','A1:K100'),
  read('03_DAILY_WAGES','A1:I100'),
  read('90_VERSION_HISTORY','A1:H100')
]);
function normalize(cat,a){
  if(cat==='plinth')return {id:String(a[0]),category:cat,sourceSerial:Number(a[1]),work:String(a[2]),basis:String(a[3]),minNpr:Number(a[4]),maxNpr:Number(a[5]),unit:String(a[7]),scope:String(a[8]),notes:String(a[9]),status:String(a[10])};
  if(cat==='trade')return {id:String(a[0]),category:cat,sourceSerial:Number(a[1]),work:String(a[2]),item:String(a[3]),basis:String(a[4]),minNpr:Number(a[5]),maxNpr:Number(a[6]),unit:String(a[7]),measurement:String(a[8]),notes:String(a[9]),status:String(a[10])};
  return {id:String(a[0]),category:cat,work:String(a[1]),skill:String(a[2]),basis:'Daily wage',minNpr:Number(a[3]),maxNpr:Number(a[4]),unit:String(a[6]),notes:String(a[7]),status:String(a[8])};
}
const rates=[['plinth',p],['trade',t],['daily_wage',w]].flatMap(([cat,rows])=>rows.slice(1).filter(a=>a[0]).map(a=>normalize(cat,a)));
const events=h.slice(1).filter(row=>/^V\d{6}$/.test(String(row[0]||'')));
if(!events.length)throw Error('No numbered history version in live Sheet');
const latest=events.at(-1);
const version=String(latest[0]);
const publicationDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kathmandu',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const proposed={...existing,version,recordedDateNpt:publicationDate,rates};
verify(proposed);
if(JSON.stringify(proposed)===JSON.stringify(existing)){
  console.log('SOURCE_PARITY: no change; keeping the existing Git commit and page snapshot.');
  process.exit(0);
}
if(version===existing.version)throw Error('Rates changed without a NEW source version; requires PRE/POST and append-only history.');
if(!(/^POST_VALIDATED$/.test(String(latest[2]))&&String(latest[7]||'').trim().length>5)){
  throw Error('New source version lacks POST_VALIDATED operation or PRE/POST restoration evidence; publication held.');
}
if(Number(version.slice(1))!==Number(existing.version.slice(1))+1)throw Error('Nonsequential Sheet version update; publication held.');
const beforeHash=sha(JSON.stringify(existing.rates));
const afterHash=sha(JSON.stringify(proposed.rates));
writeFileSync(output,JSON.stringify(proposed,null,2)+'\n');
appendFileSync(historyFile,JSON.stringify({version,kind:'POST_DERIVED_PUBLICATION',recordedAtUtc:new Date().toISOString(),previousVersion:existing.version,previousRatesSha256:beforeHash,newRatesSha256:afterHash,status:'DERIVED_FROM_VERIFIED_SHEET_VERSION_NO_DRIVE_ID_EXPOSED'})+'\n');
console.log('WROTE: '+version+' derived rate snapshot from live Sheet. No private ID written.');
