# Cost Estimation — Responsibilities and Google Sheets entry guide

**Effective:** 9 November 2026 · **Scope:** `FabinGurung/JP_Cost_Estimation` only.

## The three repository ownership boundaries

**Cost Estimation (this repository)** owns reusable pricing references, engineering measurement intake/validation, project cost assumptions, source-linked quantity takeoff, BOQ, AOC, cost summaries, project-specific bills and *approved actual finance projections*.

**Field and Desk Resource Library (separate repository, not edited here)** is the intended owner for field/desk resources, labour and attendance references, worker money and goods, equipment, templates and site-capture procedures. The original Fishtail LIVE payroll and worker Sheets **do not move** and their stable IDs remain authoritative.

**Communication, Maps and Progress (separate repository, not edited here)** is the intended owner for project location maps, daily site reporting dashboards, and approved derived summaries from Slack, Discord, Drive and other operations sources. It is not the payroll or estimate database.

**Scheduling** may consume validated resource/attendance projections; it is not permitted to silently create another editable payroll ledger.

These are boundary decisions for future handover; this change does **not** rename, update, move or deploy either of the other repositories.

## How the five original Google Sheets are named today

The Drive folder has the human name **Cost Estimation — Working Google Sheets**, retains its permanent ID, and still holds the **same five original spreadsheets**.

| Visible file name | Responsibility | Current ingestion status |
| --- | --- | --- |
| Construction Rate and Cost References | Reusable market/resource rate references with sources, effective date, scope and units | Linked reference; no authenticated scheduled import |
| Amrit Rawat — Site Construction Rates (Indicative) | Client-specific assumptions; source has 32 entries, unapproved | Authenticated rate synchronization |
| Amrit Rawat — Measurements, BOQ, Cost Summary and Bills | Original project measurement register and selected rates; source for BOQ/AOC/bills | Authenticated in Pages builds; zero verified quantity/rate-selection admissions at 9 November check |
| Construction Costing — Reusable Workbook Template | Generic template for future project workbooks | Template; *not* production data |
| Krishna Kumar Gupta — Project Payment Register | Actual Rohini project financial source | Authenticated Finance fetch during Pages builds |

Renaming changes **file/folder display titles only**, not `spreadsheetId`, sheet tab names or sheet `gid` IDs, header contracts, formulas, access control or source permissions. No copies or competing authorities were created. The version and PRE/POST archival principles still apply to meaningful source changes. Keep historic versions out of this five-source working folder.

## How to fill the Amrit Rawat costing workbook

1. Read its existing `00_READ_ME` tab and inspect the current first-row headers; do not overwrite/delete them.
2. In `01_MEASUREMENTS`, enter a distinct `Measurement_ID`, project ID `RE-AMRIT-RAWAT-W14`, organization `ROHINI`, valid catalog `Work_ID`, stable `Work_Item_ID`, location/grid, measurement method, drawing revision, evidence ID, dimensions/BBS, positive quantity, unit, date, status, reviewer and source link. Only an independently reviewed row marked `VERIFIED` with complete source identity can be admitted. Creating a row or changing a dropdown does not independently verify geometry.
3. In `02_RATE_SELECTIONS`, choose a compatible work item and unit, versioned source/rate ID, positive or nonnegative approved rate and scope/pricing family. Only `APPROVED` selections with source and approver join verified quantities. Do not add turnkey and labour-only alternatives together.
4. `03_BOQ` and `04_AOC` have different review gates: the website can derive draft quantities and line values but does not certify project or AOC totals.
5. `05_CONTRACTOR_RA`, `06_VENDOR_INVOICES`, `07_PAYMENT_ALLOCATIONS` are for substantiated certificates/invoices/transactions; never infer payment from a draft BOQ.
6. Update `90_VERSION_HISTORY` on a governed source revision. Preserve original permanent workbook identity and create PRE/POST historical copies in the archive, not as new primary Sheets.

**Costing formula:** independently verified *quantity × compatible approved rate = draft line amount*. Certified or paid status requires separate evidence and approval.

## Finance and external operational sources

- **Finance** may display recorded contractor/supplier payments only from the correct original owning-company register. For now, the verified KKG/Bishal Paija finance source is separate from Amrit.
- Worker-level attendance, wages, advances, Money and Goods, Fishtail payroll books and site capture **stay with original custodians**. This website provides a link to the external owner and consumes only source-verified, project-mapped aggregates when authorized.
- Daily progress and location maps belong to the Communication/Progress workstream; messages and attachments are not payable finance records.

## What GitHub Actions does

- Rates: compare the original Amrit rate Sheet to the latest approved version, commit an unchanged/no-op or a governed new derived snapshot.
- Pages: read actual KKG Finance and Amrit project measurement Sheets through keyless Google WIF, validate and stage public-safe derivatives for website publication.
- Site source code/JSON/JS owns schema and commercial calculations, **not** the original human Sheet facts.
- Do not publish raw private data or credentials, and do not enable broad PAT permissions: GitHub's scoped Actions token handles workflow dispatch; Google WIF handles short-lived source access.

## Remaining engineering hold

As of the verified 9 November 2026 Google Sheet reads: Amrit measurement, approved rate-selection, BOQ, AOC, running-bill and payment-allocation tabs had **zero** populated project records. No Amrit actual totals are approved, and independent drawing registration/source-quantity QA is still outstanding. The website must communicate this state rather than invent quantities.
