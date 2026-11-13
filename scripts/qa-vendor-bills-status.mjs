import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const page = read('memory-posters.html');
const status = JSON.parse(read('data/vendor-bills-status.v1.json'));
const workflow = read('.github/workflows/deploy-research-pages.yml');
assert.match(page, /id="vendor-bills-intake"/);
assert.match(page, /src="vendor-bills-status\.js"/);
assert.match(page, /id="vendor-bills-status"/);
assert.ok(!page.match(/docs\.google\.com\/spreadsheets\/d\//));
assert.equal(status.schema, 'jp.vendor-bills-status.v1');
assert.equal(status.sourceMode, 'VERIFIED_SNAPSHOT');
assert.equal(status.revision, 'V000002');
assert.match(workflow, /secrets\.JP_VENDOR_BILLS_SHEET_ID/);
assert.match(workflow, /github\.event_name == 'workflow_dispatch'/);
assert.doesNotMatch(workflow, /^\s*schedule:/m);
