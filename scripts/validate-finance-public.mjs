import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(join(root, file), 'utf8');
const snapshot = JSON.parse(read('finance-public-snapshot.json'));
const context = JSON.parse(read('finance-context.json'));
const html = read('finance-dashboard.html');
const script = read('finance-dashboard.js');
const companyPage = read('finance.html');
const companyScript = read('finance.js');
const sum = (rows, key) => rows.reduce((value, row) => value + (row[key] ?? 0), 0);

assert.equal(snapshot.schema, 'jp.finance.public.v1');
assert.equal(context.schema, 'jp.finance.context.v1');
assert.equal(snapshot.company_id, 'REB');
assert.equal(snapshot.project_id, '14_bishal_paija');
assert.equal(snapshot.currency, 'NPR');
assert.equal(snapshot.vendors.length, snapshot.totals.vendor_count);
assert.equal(snapshot.payments.length, snapshot.totals.payment_count);
assert.deepEqual(snapshot.vendors.map(row => row.id), snapshot.vendors.map((_, index) => index + 1));
assert.equal(new Set(snapshot.vendors.map(row => row.name)).size, snapshot.vendors.length);
assert.ok(snapshot.checks.all_payment_ids_unique);
assert.ok(snapshot.checks.all_vendor_totals_match);
assert.ok(snapshot.checks.source_grand_totals_match);
assert.ok(snapshot.checks.internal_ids_excluded_from_public_data);
assert.match(snapshot.source.workbook_url, /^https:\/\/docs\.google\.com\/spreadsheets\/d\//);

for (const key of ['amount_npr', 'qr_npr', 'discount_npr']) {
  assert.equal(sum(snapshot.vendors, key), snapshot.totals[key], 'Vendor ' + key + ' mismatch');
  assert.equal(sum(snapshot.payments, key), snapshot.totals[key], 'Payment ' + key + ' mismatch');
}
const paymentKeys = ['vendor_id', 'vendor', 'source_date', 'date_system', 'paid_time', 'amount_npr', 'qr_npr', 'discount_npr'].sort();
for (const row of snapshot.payments) {
  assert.deepEqual(Object.keys(row).sort(), paymentKeys, 'Unexpected public payment field');
  assert.ok(['AD', 'BS'].includes(row.date_system));
  assert.match(row.source_date, /^\d{4}[-_]\d{2}[-_]\d{2}$/);
  assert.ok(Number.isFinite(row.amount_npr) && row.amount_npr >= 0);
  for (const key of ['qr_npr', 'discount_npr']) {
    assert.ok(row[key] === null || (Number.isFinite(row[key]) && row[key] >= 0));
  }
  const vendor = snapshot.vendors[row.vendor_id - 1];
  assert.ok(vendor && row.vendor === vendor.name);
}
for (const vendor of snapshot.vendors) {
  const entries = snapshot.payments.filter(row => row.vendor_id === vendor.id);
  assert.equal(entries.length, vendor.payment_count);
  for (const key of ['amount_npr', 'qr_npr', 'discount_npr']) {
    assert.equal(sum(entries, key), vendor[key] ?? 0, 'Vendor section ' + vendor.id + ' ' + key);
  }
}
for (const id of ['amountTotal', 'paymentCount', 'vendorCount', 'qrTotal', 'discountTotal',
  'rankChart', 'shareDonut', 'dateChart', 'qrChart', 'discountChart', 'vendorBody', 'paymentBody', 'sourceDescription']) {
  assert.ok(html.includes('id="' + id + '"'), 'Missing dashboard element ' + id);
  assert.ok(script.includes("'" + id + "'"), 'Missing dashboard binding ' + id);
}
assert.ok(companyPage.includes('href="finance-dashboard.html"'));
assert.ok(companyScript.includes("fetch('finance-public-snapshot.json'"));
assert.ok(script.includes("fetch('finance-public-snapshot.json'"));
assert.equal(context.publication.public_snapshot, 'finance-public-snapshot.json');
assert.equal(context.publication.website_page, 'finance-dashboard.html');
assert.equal(context.publication.mode, 'actions_deployment_refresh');
assert.equal(context.rules.no_trigger_install, false);
console.log('Finance publication checks passed:', snapshot.vendors.length, 'vendors,',
  snapshot.payments.length, 'payments, NPR', snapshot.totals.amount_npr);
