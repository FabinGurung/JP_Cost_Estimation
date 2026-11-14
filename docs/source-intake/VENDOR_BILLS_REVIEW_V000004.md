# Vendor Bills — V000004 full-source QA and human-first working-register layout

**Recorded:** 14 November 2026 (Asia/Kathmandu)  
**Owning repository:** `FabinGurung/jp-estimating-and-boq`  
**Publishing branch:** `research/open-estimation-engine-v0.1`  
**Live human source:** `Vendor Bills — Working Register — LIVE`, native Google Sheets in `03_JP_Cost_Estimation/02_HUMAN_WORKING_SHEETS/Cost Estimation — Working Google Sheets`.  
**Version boundary:** Control V000004, normalized data V000001 unchanged. Original 35 source-tab names/IDs preserved; total 46 tabs.  
**A7:** Complete native PRE and POST copies verified, tracked privately in Google Drive; the same existing Google Doc `Vendor Bills — QA, Audit & Version History — LIVE` was moved into the working folder and retains the full financial-source QA and change history.

## Human-first original workbook order (no source deletion)

1. `VB_START_HERE`: quick links and manual editing rules.
2. **Three original project tabs**: `13_hari_baral`, `14_kharika_Poudel`, `31_Sharada_Adhikari`.
3. **Thirty supplier source tabs**: alphabetical, original spellings preserved.
4. `ooo`, `Discord_3_Layers`: unassigned/historical source views, preserved rather than guessed or deleted.
5. **Eight derived and review tabs**: `VB_BILL_RECORDS`, `VB_DETAIL_ROWS`, `VB_SOURCE_SUMMARIES`, `VB_RECONCILIATION`, `VB_REVIEW_QUEUE`, `VB_PROJECT_CROSSWALK`, `VB_VENDOR_CROSSWALK`, `VB_SOURCE_INDEX`.
6. `00_MANIFEST`, `01_VERSION_HISTORY`: controls.

The guide is restyled, links point to the same original sheet IDs, project tabs are visually distinguished, and derived table filters and selected widths improve navigation. Project/source original formulas and amounts were **not modified**. The public site does not expose private Sheet IDs, invoice details or row-level financial information.

## QA results / exact normalization grain

- All **35/35 original source tabs** scanned and compared to source-index counts: **1,895/1,895 indexed populated rows** accounted for. No displayed spreadsheet error tokens detected in the scanned original source ranges.
- **259 bill-record IDs** unique and source-index matched. **930 detail-row IDs** unique and source-index matched. **Zero source-tab/range pointer mismatches** and **zero orphaned linked bill IDs**.
- Of 930 details, 365 carry candidate bill links and 565 have none; missing links are **not automatically an invalid invoice**.
- Of 259 bill records, 89 have no invoice number, 148 lack a normalized AD ISO date, 28 lack recorded numeric amount, 7 lack candidate project mapping. All bill records remain `REVIEW_REQUIRED`.
- Of 930 detail rows, 199 lack invoice number, 132 lack source date, 40 lack numeric recorded amount, 11 lack candidate project, 17 lack supplier key. 26 have quantity/rate variance flags.
- `VB_PROJECT_CROSSWALK`: 29 source labels mapped as **CANDIDATE**, 3 remain **UNRESOLVED**. Candidate IDs are not approved project assignments.
- `VB_RECONCILIATION`: 46 comparisons = 28 `MATCH`, 15 `ONE_VIEW_ONLY`, 2 `MISMATCH`, 1 `MULTIPLE_ROWS`. All mismatches remain unresolved; matching two source views is not payment proof.
- `VB_REVIEW_QUEUE`: 509 `OPEN` findings referring to 462 unique source records. 45 underlying source records legitimately carry multiple flags (47 additional references). There are **zero orphan review links**; do not delete or deduplicate review rows merely by repeated Record ID.
- No bill approval or new invoice-to-payment link was created. Original Excel evidence, earlier copies, source-row references and A7 PRE/POST history are preserved.

**Limits:** Structural/index and normalized-link consistency is much stronger than proof of each private invoice's truth. Supplier identity, bill/receipt authenticity, conflicting project allocations, missing invoice evidence, unit-rate meaning and payment proofs remain for future manual verification. Existing Hari Baral summary differences are preserved in the private `VB_REVIEW_QUEUE` and the corresponding audit Google Doc, without public amounts or names.

## Exact Drive → GitHub → Actions → Pages contract

| Layer | Canonical role | Verified or pending |
| --- | --- | --- |
| Private Google Sheets | One permanent human-owned `Vendor Bills — Working Register — LIVE` containing all original tabs and derived review views | **Verified** control V000004 / data V000001 |
| Restricted Google Doc | Same original QA/change log file, now next to the working Sheet | **Verified** full QA, PRE/POST links, history and rollback |
| GitHub repository | `FabinGurung/jp-estimating-and-boq` | **Verified** owning code repository |
| Source adapter | `scripts/build_vendor_bills_public.py` reads `00_MANIFEST`, `VB_SOURCE_INDEX`, `VB_BILL_RECORDS`, `VB_DETAIL_ROWS`, `VB_RECONCILIATION`, `VB_REVIEW_QUEUE` on manual invocation | **Configured; Vendor Bills authenticated source-read not yet verified** |
| GitHub Actions | `.github/workflows/deploy-research-pages.yml` on the publishing branch | **Manual** `workflow_dispatch` optional authenticated Vendor Bills read; user-authorized push can deploy a checked snapshot |
| Public aggregate data | `data/vendor-bills-status.v1.json` | **VERIFIED_SNAPSHOT V000004** (not a successful source-authenticated fetch) |
| Website | `memory-posters.html#vendor-bills-intake` and `source-sheets.html` | **Public-safe aggregate and source/consumer status** only |
| A7 Registry | Global Memory Wall pointer to Estimation-owned source memory, not a second editable register | **Pointer only** |

The optional private secret `JP_VENDOR_BILLS_SHEET_ID` and publisher Google identity's private read access must both be confirmed. A Pages push deployment has **no Vendor Bills authenticated read** and must not be labeled `MANUAL_AUTHENTICATED_READ`. The exact evidence required for that claim is a successful explicitly dispatched workflow with the Vendor Bills read step and live page displaying `Manual source read · V000004`. No cron/scheduled intervals authorized.

## Next manual evidence work
1. Trace source invoice, legal supplier, purchase order/material receipt and correct project for the two existing source-summary discrepancies.
2. Review missing bill identifiers, ambiguous dates and unlinked detail rows by tracing source tab and original A1 range.
3. Update the same human-authoritative LIVE workbook only under fresh A7 PRE → edit → QA → POST, without changing original evidence, approving invoices automatically or duplicating editable sources.

**EST-M01 tag is immutable and unchanged.** The V000003 note and the original V000002 working-normalization explanation remain as historical checkpoints. Only aggregate source status and control version should be published; full amounts and protected links stay in Drive.
