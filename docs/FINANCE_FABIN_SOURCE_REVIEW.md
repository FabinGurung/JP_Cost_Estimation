# Fabin Gurung — Payments to Projects: private intake gate

**Audit date:** 11 November 2026 (Nepal). **Repository:** Cost Estimation / BOQ, no other repository edits.

## Original file chronology

- `SOURCE_ORIGINAL__fabin_gurung_payment_to_project__20260828.xlsx` — 20 Excel worksheet sections; Drive last modified 28 August 2026 (19:52 Nepal time). Retain as evidence and intermediate snapshots.
- `FABIN_GURUNG_PAYMENT_TO_PROJECT_WORKING_v0.7__CROSS_ORG_XLSX__20260905.xlsx` — 7 Excel worksheet sections; Drive last modified 5 September 2026 (07:41 Nepal time). Each of its 7 extracted sections matches an original-file section exactly at the cell-text level, including the cross-project summary. Do not infer approval from the later date.
- One **native** Google Sheets converted copy with the human-facing name `Fabin Gurung — Payments to Projects — Working v0.7` now sits under `01_JP / 02 Website Sheets and Registers / 06 Finance and Purchasing / 01 Working Records`. Its seven worksheet tabs and first-row values have been verified. Original Excel files and IDs remain unchanged.

The whole original `06 Finance and Purchasing` Drive folder was relocated under `01_JP / 02 Website Sheets and Registers` using the same folder ID. It remains a private working/evidence folder, **not** the public website-publishing folder.

## Separate project data to reconcile before publishing

Native tabs: `04_Basketball`, `09_prithivi Mandi`, `14_kharika_poudel`, `13_hari_baral`, `31_sharada_adhikari`, `14_bishal_paija`, `Total`.

The `Total` worksheet summarizes five projects; it does not include `04_Basketball`. Do not add it automatically: its merchant/payment rows overlap with `09_prithivi Mandi`, and it could represent an earlier subset, a separate scope or a mistaken duplicate.

Other outstanding source-level checks:
1. Map each source worksheet to a verified `PRJ-...` identifier and owning organization.
2. Confirm the payment actor, payee, project/work package and transaction date; do not equate financial entry date with the file modified time.
3. Review negative entries, repeated merchant headings, QR/discount fields, blanks, zero rows, duplicate transactions and cross-project transfers.
4. Match original invoices, bank/cash receipts, approved evidence and contractor/vendor role where available.
5. Keep private names and raw transactions in Drive and restricted GitHub Actions contexts. Publish only individually approved public-safe aggregates.
6. Distinguish **paid**, **expense**, **advance**, **reimbursement**, **refund**, **QR fee** and **discount** before calculating sums.
7. Ensure no amount from Fabin is erroneously joined to the KKG, Amrit or another project's payment source.

## Current website representation

The public Cost Estimation Finance and Source Directory pages show the **candidate source status only**, not the private Google Sheet URL, file ID or its transaction-level data. The existing live KKG Finance and Amrit source adapters are unchanged.

### Required admission gate for a future Actions feed

Before wiring a read-only Workload Identity fetch, maintain a private versioned source manifest documenting source ID/owner, tab-to-project mapping, schema, expected row counts, source digest and approved publication scope. The importer must reject missing project IDs, incomplete transaction evidence, ambiguous QR/discount mapping, duplicated payment identifiers and unapproved corrections. Only then expose a new derived public-safe Finance summary, with source version/time and approval status.

The historic 34-Sheet publishing directory and present five-input Operations publisher are separate from this Cost Estimation source. Do not point the Operations dashboard to this private payments workbook as if it were a sixth public map input.

**No fabricated amounts and no automatic paid-status inference.**
