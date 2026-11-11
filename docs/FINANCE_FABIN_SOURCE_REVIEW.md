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

## 11 November 2026 · Native workbook normalized and authenticated reader added

The original native working file ID is unchanged. The seven imported historical tabs remain untouched. A numbered PRE snapshot was taken before normalization and POST snapshot after it, both stored under the Finance folder's `90 Instructions and Changes` archive.

Nine additional source-control tabs are present:

| Human purpose | Working native tab |
| --- | --- |
| Instructions and admission rules | `00_START_HERE` |
| Source authority, file lineage, version and status | `00_MANIFEST` |
| Six source tab/project identities and provisional owner organization | `01_PROJECTS` |
| 177 party source sections and header references | `02_PARTY_REGISTER` |
| 439 event rows with immutable source-tab and source-row trace | `03_PAYMENT_EVENTS` |
| Source reported vs normalized event sums (dynamic formulas) | `04_RECONCILIATION` |
| Five reportable source project totals + excluded Basketball scope | `05_PROJECT_SUMMARY` |
| Ten source-custody and discrepancy issues | `06_REVIEW_QUEUE` |
| Numbered PRE/POST archive and revision ledger | `90_VERSION_HISTORY` |

### Non-negotiable source exceptions
- `13_hari_baral`: the additional **Pabitra Ganesh suppliers** section has NPR 500 in the original payment detail, but no corresponding source top-summary party. The original project's five-project summary excludes the NPR 500. **Do not silently add it, subtract it or call the project reconciled.**
- `04_Basketball`: a provisional separate sheet overlapping transactions in `09_prithivi Mandi`; not present in the five-project `Total` worksheet. Do not double count it.
- `31_sharada_adhikari` and `14_bishal_paija` have negative entries requiring refund/reversal classification. A source entry with an unrecorded date is also in Sharada.
- All official organization and project IDs, supporting invoices, payer/payment classification, QR values, discounts and business approvals remain pending.

### Authenticated, read-only Actions data flow

```text
PRIVATE GOOGLE SHEET — SAME ORIGINAL NATIVE ID
  ├── 00_MANIFEST → exact version and source identity
  ├── 01_PROJECTS → provisional identity and inclusion
  ├── 02_PARTY_REGISTER → party cross-check (private only)
  ├── 03_PAYMENT_EVENTS → validate every original source row (private only)
  ├── 04_RECONCILIATION → numeric cross-check
  ├── 05_PROJECT_SUMMARY → source amount vs event amount
  ├── 06_REVIEW_QUEUE → intentional unresolved issues
  ├── 90_VERSION_HISTORY → append-only history
  └── 6 SOURCE TABS + Total → independent original cross-check
       │ existing Google WIF (Sheets read-only)
       ▼
  scripts/build_fabin_finance_from_google_sheets.py
       │ validates identity, 439 source row references,
       │ five project total and review/approval status
       ▼
  _site/fabin-payments-public.json
       │ FIVE SOURCE-REPORTED AGGREGATES ONLY
       │ no vendor, employee, raw payment or private Sheet ID
       ▼
  finance.html#fabin-finance-review
       · "SOURCE REPORTED — NOT VERIFIED", never certified paid
```

The publisher must fail closed on raw-versus-normalized drift rather than report stale or inferred payments. Workbook updates need a new controlled normalization revision and run. Google Sheets read permission has been granted to the existing `jp-pages-publisher` service account at **reader** level for this file only; no token, PAT or key was generated.

**This importer is separate from KKG's already verified Finance source.** Source-reported Fabin aggregates must not become KKG payments or Amrit project approved bills. No individual payment can be certified by the dashboard.

Source and browser CI run evidence must be recorded after release.

## 12 November 2026 — A7 memory-wall version-controlled human view restructure

The **original live Google Sheet IDs are preserved**. Both records received a numbered PRE copy **before** adding linked navigation views, and a numbered POST copy after formula and source-event readback. Each subject's copies now live in its own dedicated folder under `01_JP / 99 Archive Gallery / 02 Sheets Previous Versions`. Earlier Fabin PRE/POST V000001 copies were moved from the Finance instruction directory to the dedicated per-Sheet history without changing their IDs.

**Fabin Gurung:** control revision `V000002`, while the existing original source transactions and 439 normalized events intentionally remain data revision `V000001`. Added `00_PAYMENT_SUMMARY` and `07_PARTY_DETAIL_VIEW` (six-source-project selector and optional party name filter); no underlying transaction was changed. The original five-source-project total remains NPR 6,412,454.782, normalized event sum NPR 6,412,954.782; the NPR 500 Hari Baral discrepancy and possible Basketball/Prithivi overlap remain **NOT APPROVED**. Existing authenticated importer accepts both V000001 and V000002 control revisions but checks the original V000001 payment-event lineage and fails on drift.

**Krishna Kumar Gupta:** control revision `V000003`. Added `00_PAYMENT_SUMMARY`, `01_VENDOR_REGISTER`, `02_PAYMENT_EVENTS` and `03_VENDOR_DETAIL_VIEW`. The view filters by any of 27 original vendor sections and links to 74 source entry IDs; source amount NPR 268,798 and amount reconciliation zero. Original `14_bishal_paija` and `KKG_VENDOR_SUMMARY_AUTO` were not overwritten, so existing authenticated Actions ingest stays compatible. The manifest's outdated communication-repository consumer label was corrected to `FabinGurung/jp-estimating-and-boq`; older historical publishing-master reference remains for provenance.

**Why we did not create one tab per vendor:** 27 vendor tabs for KKG and 177 party sections for Fabin would create duplicated maintenance and hinder human navigation. The normalized ledger is one verified source-linked table; a single vendor/party-filtered detail worksheet provides the same drill-down without proliferating tabs. For day-to-day entry, keep editing the original human source tabs until a separately reviewed cutover of the Actions importer and user editing workflow is adopted. A linked view is not a new independent editable financial database.

**Source freshness:** Google Sheet modified timestamps and Actions live source read must be independently verified. A successful release of frontend layout alone is not evidence that a daily scheduler succeeded. The finance entry page now includes twelve-section in-page navigation; the original 71 registered website routes remain intact.
