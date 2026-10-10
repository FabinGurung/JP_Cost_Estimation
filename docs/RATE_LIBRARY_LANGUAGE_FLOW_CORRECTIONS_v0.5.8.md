# v0.5.8 — Worksheet terminology and construction-sequence correction

Date: 2026-10-10
Class: public-site explanatory UI and editorial training order only; does not verify rates.

## Corrections
1. **Excel visibility is not chronology.** A single original `.xlsx` contains 5 visible worksheets and 5 hidden worksheets. The 102 visible and 102 hidden rate references are **worksheet sets**, not proven workbook revisions. The hidden set's date, approval and precedence remain UNKNOWN. A concise explanatory disclosure is added beside the worksheet selector.
2. **Historical/archived means reference usage, not established age.** Display uses "archived estimate reference · date unknown" and does not imply the rates were approved or current. "Approval pending" was also misleading: there is no confirmed approval workflow in progress.
3. **Construction sequence correction.** Illustrative site clearance is ordered before excavation. Backfilling is shown after the relevant foundation RCC work and before wall/masonry stage, with explicit warning that sequencing depends on project design, inspection and site activities. The generic chronological labels never claim to be the actual project schedule. Excel rate records are not reordered in the source.
4. **Evidence vs editorial guidance.** The technical detail page's source section is accurately named **Original Excel work description** because some entries contain only a work name, not full design/contract specifications. A separately labeled general quality/workmanship checklist is NOT extracted from the Excel workbook and cannot be used in place of approved project drawings, specifications or applicable standards.
5. **Public comparators** use "Visible tabs" / "Hidden tabs" and avoid "earlier/later" or "approval pending". The comparison still covers 102 paired records and 4 differing rates, with SI/Imperial conversions unchanged.

## Data governance
- Original customer workbook on Google Drive: READ-ONLY, identity mismatch unresolved.
- `data/historical-work-rates-v0.5.3.json`: 204 source observations; no edits.
- `data/work-rate-labels-v0.5.4.json`: 204 editorial labels; no edits.
- `data/work-rate-taxonomy-v0.5.5.json`: 102 matched pairs and classification; no edits.
- Rohini Finance/Payments, CAD-owned FID and QTO, blocked BOQ schema, rate analysis and original drawings: no edits.
- Other historical GitHub source snapshots remain available. Exact pre- and post- upgrade branches are held for rollback.

## Technical QA expectations
- All links remain unchanged: `rate-library.html`, `rate-specifications.html?id=...`, `rate-comparison.html`.
- Selector values still `visible` and `hidden`, so URLs and saved references remain valid; only UI labels change.
- An accessible `<details>` disclosure explains the labels without crowding the primary table.
- Construction stage map preserves all 204 PK-based observations; the source rows and prices are unchanged.
- No added measurements, bill quantities, approved engineering specifications or financial adjustments.
