# A9 / Amrit Rawat — LIVE measurement-to-BOQ intake contract

## What is implemented

- Original authority remains the existing nine-tab `14_Amrit_Rawat — Measurements, BOQ, AOC & Bills — LIVE` Google Sheet. The stable LIVE Sheet ID is never replaced and GitHub Actions is **read-only**.
- During the GitHub Pages deployment, `scripts/build_amrit_project_from_google_sheets.py` fetches the original Google Sheet using the already-authorized keyless Google identity. It writes only a derived, public-safe `_site/projects/rohini/ward-14/amrit-rawat/project-costing.json` inside the transient Pages artifact.
- The already deployed `templates/project-costing/v1/project-view.mjs` and `costing-pipeline.mjs` read this projection. No human maintains a second JSON data authority.
- A missing or malformed source, unexpected header, cross-project row, duplicate verified measurement ID, missing drawing revision/evidence, or incomplete approved rate **fails closed**. Unverified source rows remain unadmitted, not zero.
- Finance payments remain owned by their own original Google Sheet; there is no automatic attribution to Amrit.

## Verified engineering handoff fields

Use the existing `01_MEASUREMENTS` Sheet tab. Each intended admitted row must contain all of:

| Field | Rule |
|---|---|
| Measurement_ID | Unique permanent row reference |
| Project_ID | `RE-AMRIT-RAWAT-W14`, exact |
| Organization_ID | `ROHINI`, exact |
| Work_ID | One of the 26 recognized work IDs from `templates/project-costing/v1/work-catalog.json` |
| Work_Item_ID | Stable payable work item reference; used to join BOQ rates |
| Location_Grid | Specific footing/beam/column/grid, zone or measured scope |
| Measurement_Method | Clear source-backed takeoff method |
| Drawing_Revision | Independently verifiable drawing/CAD export revision |
| Evidence_ID | Source drawing/CAD/FID/measurement evidence reference |
| Dimensions_or_BBS | Human review note; used as supporting context, not an independent calculated quantity |
| Quantity | Positive finite verified measured quantity, not a rate or placeholder |
| Unit | Consistent engineering measurement unit (m³, m², kg, etc.) |
| Measured_Date | Recorded measurement date |
| Verification_Status | Exactly `VERIFIED` for admission; all other rows remain unadmitted |
| Approved_By | Reviewer/approver reference |
| Source_Link | Authenticated source link for human verification; excluded from public projection |

Only source references and measured quantities meeting the full acceptance rule flow into the projection. The importer checks the evidence **references and sign-off declarations**; it does **not** independently verify structural design, CAD geometry or the contents of an external drawing. That engineering review remains separate.

Use `02_RATE_SELECTIONS` for matching prices, not the client's indicative range register alone. Required `APPROVED` rows need `Work_Item_ID`, `Unit`, `Rate_ID`, `Rate_Source_ID`, finite nonnegative `Unit_Rate_NPR`, `Rate_Version`, `Scope_Family`, `Pricing_Option`, `Approved_By` and `Source_Link`.

The shared JS engine groups matching work items and units, prevents inconsistent or overlapping package alternatives, and computes a **draft** BOQ only when valid measurement and rate selections exist. AOC still requires separately approved BOQ rows, allowances and taxes. No project total or payable claim may be invented.

## Current actual source check — 9 November 2026

Direct bounded Google Sheet reads of `01_MEASUREMENTS`, `02_RATE_SELECTIONS`, `03_BOQ`, `04_AOC`, `05_CONTRACTOR_RA`, `06_VENDOR_INVOICES`, and `07_PAYMENT_ALLOCATIONS` found **zero** populated data rows (headers exist). The current CAD repository `FabinGurung/JP_Computer-Aided-Drawings` also had no Amrit-specific export in its main-branch tree.

Therefore the imported website view must stay `NOT MEASURED / PENDING`, with no derived BOQ, no AOC amount and no project bill. Quantities from unrelated projects must never be borrowed.

## How to supply the next real input

1. Finish and independently verify Amrit's drawing revision and element-specific quantity evidence in the responsible CAD/source system, or another authoritative signed measurement record.
2. Enter those **same** verified quantities, line-level source references, work/grid IDs and reviewer approval into the permanent Amrit LIVE Google Sheet's `01_MEASUREMENTS` tab. Keep its LIVE ID unchanged and maintain the governed version history/PRE–POST archival practice.
3. In the same LIVE workbook's `02_RATE_SELECTIONS`, approve compatible item rates only after confirming correct units and scope and choosing between labour-only/turnkey/trade alternatives.
4. Run the Pages workflow (or its approved scheduler). Confirm `AMRIT LIVE PROJECT SHEET READ PASS` in Actions logs and inspect the rendered Project → Measurements → BOQ pages.
5. Keep BOQ and AOC approval gates separate; do not treat an automatically derived draft as a certified claim.

### Known boundary

The generic calculator and the source-verified Google Sheet intake are implemented. There is not yet an authenticated Amrit-specific CAD geometry export to validate and populate the LIVE workbook. No previous snapshot, source-data ledger or historical Git commit is discarded.
