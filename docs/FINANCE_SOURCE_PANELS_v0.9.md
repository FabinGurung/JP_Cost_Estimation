# JP Finance — Source Panels and Page Controls v0.9

Updated: 2026-10-21. Website parent: `FN-01` (`finance.html`). The detailed payment view is child `FN-02` (`finance-dashboard.html`); the field guide is child `FN-03` (`field-expense-guide.html`).

## Site editing addresses

| Short ID | Section | Website target |
| --- | --- | --- |
| FN-01.S01 | Company finance and source-reconciled summary | `finance.html#financeContent` |
| FN-01.S02 | Three company Google Sheet panels | `finance.html#finance-sources` |
| FN-01.S03 | Worker money and goods directory | `finance.html#worker-records` |
| FN-01.S04 | Site evidence and capture candidates | `finance.html#site-capture` |
| FN-01.S05 | Permission-aware private Google Sheet preview | `finance.html#sheet-viewer` |
| FN-01.S06 | Native FN-S01 workbook views inside Finance header | `finance.html#fnS01Native` |
| FN-02.S01–S08 | Payment dashboard charts, tables and status | `finance-dashboard.html` |
| FN-03.S01–S05 | Site expense guide sections | `field-expense-guide.html` |

Example prompt: `TARGET=FN-01.S03; CHANGE=improve worker code selector; KEEP=original 21 sources and private links; RELEASE=review PR`.

## Source codes and authority boundaries

| Group | Codes | Count | Public presentation |
| --- | --- | ---: | --- |
| Rohini approved payment register | FN-S01 | 1 Sheet | Native searchable header tabs; original source link retained |
| Rohini Site Operations | FN-S02 | 1 Sheet | Title and code only; access-controlled URL |
| Fishtail spending ledger | FN-S03 | 1 Sheet | Separate company; access-controlled URL |
| Original worker money and goods | W01–W21 | 21 Sheets | Code only; no names, source URLs or transactions |
| W01 separate v2 prototype | W01-V2 | 1 Sheet | Not production; no source URL |
| Site capture and historical intake | FN-C01–FN-C02 | 2 Sheets | Candidate evidence; no source URLs |
| Site evidence form | FN-C03 | 1 Form | Not counted as a Sheet; not finance authority |

**Total: 27 known Google Sheets and one Google Form.** This is a handover inventory, not a live confirmation of owner, permission, freshness, completeness or finance authority. The worker codes map to the private source inventory held by the owner. Rohini and Fishtail remain independent.

## Preview operation

1. Open `FN-01.S02`, `FN-01.S03` or `FN-01.S04`; choose the source code.
2. FN-S01 opens natively in the Finance header (`FN-01.S06`) without an external frame. For other codes, paste the private Google Sheets URL from the owner's authorized Drive account into `FN-01.S05`.
3. For private workbooks only, press **Preview selected Sheet**. Google enforces its own access. If the private frame does not open, use **Open in Google Sheets**.
4. Press **Clear preview** to unload the iframe and clear the input. This static page has no backend, source synchronization or URL persistence.

Do not publish a private workbook link in a public source file, embed a source with broader permissions, promote capture submissions into Finance, or treat the W01 v2 prototype as production without a separate verified decision. No financial workbook is modified by this website feature.

## Checks and recovery

- `node --check finance-source-panels-v0.9.js`
- `node scripts/validate-finance-panels-v0.9.mjs`
- `node scripts/validate-site-page-registry.mjs`
- `node scripts/validate-finance-public.mjs`
- `node --check finance-register-header-v1.0.js`
- `node scripts/validate-finance-register-header-v1.0.mjs`

Both CI and the publishing-branch deployment workflow run the new Finance checks. For a rollback, use the frozen `snapshot/pre-finance-panels-20261021` branch, then submit a tested restoration PR. No routes or financial data were removed.

## FN-S01 native Finance header — 2026-10-21

The approved Google Sheet ID `1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE` is displayed and copyable **inside the Finance page header**, with a default-open native HTML table workspace. This is not an external embedded Sheet frame. Tabs: `14_bishal_paija` (all 74 published payment rows), `KKG_VENDOR_SUMMARY_AUTO` (all 27 vendors and derived totals), `00_ENTRY_GUIDE` (public guidance), `00_SITE_CONTEXT` (approved public source context), and `_SYSTEM_ENUM` (public date/amount definitions). Search, vendor and AD/BS filters, pagination, show-all and keyboard tab navigation are supported.

The four hidden operational tabs and private fields are **not published** because the source workbook's `00_SITE_CONTEXT` explicitly excludes them. The last verified source snapshot is dated 2026-10-20; this is **not** a live Sheet connection. Existing `finance-public-snapshot.json` is reused without changing the underlying 27 vendors, 74 payment rows or amounts. No Google Sheet or Apps Script changes were made.

Recovery point for this change: `snapshot/pre-fn-s01-native-header-20261021` at commit `9c87642068a7594d73f829716a4a2bafc86f2e83`.
