# A9 — Cost Estimation source custody and payment reconciliation | 12 Nov 2026

**Scope:** Cost Estimation / BOQ publisher and its original Drive sources only. This note documents verified file-parent moves; GitHub repository name and six permanent Sheet IDs stay unchanged. No original invoice or transaction has been overwritten.

## Current single-owner source folder

Cost Estimation / `02_HUMAN_WORKING_SHEETS / Cost Estimation — Working Google Sheets` contains exactly six original/working source Sheets:
- Construction Rate and Cost References (reference)
- Amrit Rawat — Site Construction Rates (Indicative) (authenticated, unapproved)
- Amrit Rawat — Measurements, BOQ, Cost Summary and Bills (authenticated, verified-only admissions)
- Construction Costing — Reusable Workbook Template (reference)
- Krishna Kumar Gupta — Project Payment Register (authenticated original, 27 vendor sections / 74 payment rows)
- Fabin Gurung — Payments to Projects — Working v0.7 (authenticated, 439 normalized source-linked entries, 6 source project tabs, 5 publicly source-reported aggregates, all NOT VERIFIED)

**Permanent Google Sheet IDs and existing publisher WIF read permissions are preserved.** Google Sheets remains the human source; GitHub owns importer, schema, tested transformations and public-safe projections.

## Original evidence folder relocation

The preexisting `06 Finance and Purchasing` folder was moved with its original folder ID from `01_JP / 02 Website Sheets and Registers` to `03_JP_Cost_Estimation / 03_PROJECT_PAYMENT_REGISTERS`, and renamed for human semantics to **Finance and Purchasing — Original Records and Evidence**. It contains old Excel originals, vendor bills and images, conversion/prototype workbooks, local library, checkpoints and finance documentation. Its numbered subfolders are historical filing categories, not additional website source Sheets. The *one* Fabin native LIVE Sheet was relocated from that folder's `01 Working Records` into the six-Sheet Cost Estimation working folder.

The restricted `09 Restricted Workforce Source Registers — Not for Public Pages` folder and original Fishtail Worker Money & Goods were moved **separately**, preserving original IDs, to `01_JP / 03 Fishtail Builders / Manpower`. It is *not* Cost Estimation payroll and is not a public Pages feed.

PRE/POST V000001 and V000002 Fabin backups and V000002/V000003 KKG backups retain their own original dedicated A7 subject history folders under `01_JP / 99 Archive Gallery`. Physical source moves are recorded here, not represented as new financial entries or a source revision. A future cross-repo data registry can resolve these live IDs without duplicating editable sources.

## Krishna Kumar Gupta owner: already corrected

The LIVE KKG `00_MANIFEST` currently records `CONTROL_VERSION=V000003`, `CONSUMING_REPOSITORY=FabinGurung/jp-estimating-and-boq`, and a V000003 PRE/POST pair. No new duplicate KKG edit or version increment is necessary. A separate `PUBLISHING_MASTER_ID` is retained as historic joined-table provenance.

## Verified source-level anomalies (no automatic financial corrections)

**Hari Baral:** `13_hari_baral` source heading A256 `Pabitra Ganesh suppliers`; A257:C257 has time `4:45:00 PM`, date `8/1/2025` and amount NPR 500. The top original vendor summary excludes this party, so 439 original rows reconcile to NPR 500 more than the reported five-project total. In the local normalized review queue this is `PARTY_MISSING_IN_SUMMARY` and `PROJECT_TOTAL_CONFLICT`. Do not change the primary summary until independently corroborated invoice/cash/bank or authorized allocation evidence is available.

**Basketball vs Prithivi Mandi:** every one of the 19 Prithivi normalized source transactions is repeated in the Basketball source worksheet with the same party, date, time and amount, summing to NPR 112,080. This proves duplicate *source records*; it does not prove a duplicate real-world payment. The five-project reported total excludes the Basketball tab. Basketball has additional entries; retain them for independent classification, not blanket deletion.

**Project identities:** the separate authoritative Projects and Locations register provides candidate project mappings:
- `14_bishal_paija` → `PRJ-000001` (organization `ORG-000002`; contractor verification marked VERIFIED, **not** financial approval).
- `13_hari_baral` → `PRJ-000003` (`ORG-000001`; project contractor verification marked VERIFIED).
- `31_sharada_adhikari` → `PRJ-000006` (`ORG-000001`; project contractor verification marked VERIFIED).
- `04_Basketball` → `PRJ-000008` (`ORG-000001`; contractor verification UNVERIFIED).
- `09_prithivi Mandi` → `PRJ-000018` (`ORG-000001`; contractor verification UNVERIFIED; name spelling differs).
- `14_kharika_poudel` → `PRJ-000020` (`ORG-000001`; contractor verification UNVERIFIED; name spelling differs).

These are *identity candidates from the current authoritative project register*, not authorization to silently fill `Approved_Project_ID` on unreviewed transaction rows.

## Recommended evidence-backed approval workflow

1. Use original source event ID, source-tab/row, payer/payee and project to find matching original invoice, cash receipt, bank transfer, QR statement or approved voucher.
2. Log `Original_Evidence_ID`, document link, voucher date, payment date and currency; never infer these from Sheet modification date.
3. Match source project to registered `PRJ-...` and `ORG-...` through authorized review. Keep `sourceProject` name unmodified for lineage and record crosswalk separately.
4. Classify event `PAYMENT/ADVANCE/EXPENSE/REFUND/TRANSFER/DISCOUNT/QR_FEE/UNKNOWN` and review duplicate fingerprints before project allocation.
5. Recompute vendor and project totals, retain adjustments and explain any difference; do not overwrite raw history.
6. Separate `DRAFT → EVIDENCE_ATTACHED → VERIFIED → APPROVED` statuses with reviewer/date and recorded A7 PRE/POST version.
7. Only after approval, expand the GitHub Actions importer with the reviewed schema/ID mapping. The current `SOURCE_REPORTED_NOT_VERIFIED` public aggregate must not masquerade as certified actual spending.

## The old 34-Sheet directory is not a 34-feed live publisher

The `01_JP / 02 Website Sheets and Registers / 02 Website Publishing / Website Publishing and Source Directory` Google Sheet has **34 source-ownership entries** and a number of formerly joined tables. This is a cross-topic historical directory, not 34 current authenticated Operations or Cost Estimation reads. The current Site Operations publisher reads five designated sources; Field & Desk reads Project Resources; Cost Estimation reads its own four authenticated data sources. The user’s proposed future cross-repo verification must join **stable original Sheet IDs + owning repository + current workflow + last verified successful read + publication status**, not stale directory language alone.

Do not delete the 34-Sheet directory or silently reclassify old rows as live. Its old KKG V000002 label and former Drive location are historical information needing a separate A7-controlled directory reconciliation when changing that original publishing Sheet.

**Publisher regression gate:** validate six physical Cost Estimation source entries, the original four authenticated inputs, a 71-route page registry and no raw Fabin/KKG IDs or payment rows in public site metadata. GitHub Actions must still fail closed if an original financial source row is missing from normalized events.
