import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {decideAmritSnapshot} from './amrit-snapshot-decision.mjs';
const current=JSON.parse(readFileSync(new URL('../projects/rohini/ward-14/amrit-rawat/rates.public.json',import.meta.url),'utf8'));
assert.equal(current.version,'V000001');
assert.equal(current.rates.length,32);
const same={...current,recordedDateNpt:'2099-01-01'}; // a later scheduled check must not fabricate version changes
assert.equal(decideAmritSnapshot(current,same,['V000001']).action,'KEEP_CURRENT_SNAPSHOT');
const changed=structuredClone(current);changed.rates[0].minNpr+=1;
assert.throws(()=>decideAmritSnapshot(current,changed,['V000001']),/RATES_CHANGED_WITHOUT_NEW_SOURCE_VERSION/);
const versioned={...changed,version:'V000002'};
assert.throws(()=>decideAmritSnapshot(current,versioned,['V000002','','PENDING','','','','','']),/NEW_VERSION_LACKS_VALIDATED_PRE_POST_HISTORY/);
assert.throws(()=>decideAmritSnapshot(current,{...versioned,version:'V000003'},['V000003','','POST_VALIDATED','','','','','V000001 PRE']),/NONSEQUENTIAL_SOURCE_VERSION/);
assert.equal(decideAmritSnapshot(current,versioned,['V000002','','POST_VALIDATED','','','','','V000001 PRE; V000002 POST restored into permanent LIVE ID']).action,'PUBLISH_NEW_SOURCE_VERSION');
assert.equal(current.rates[0].minNpr,3600,'Test may never mutate actual indicative rate snapshot');
console.log('AMRIT SOURCE VERSION QA PASS: same version + changed date stays untouched; changing rates needs sequential validated PRE/POST, credentials not required for offline QA.');
