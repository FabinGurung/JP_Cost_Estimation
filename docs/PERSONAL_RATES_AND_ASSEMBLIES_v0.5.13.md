# JP Cost Intelligence — Composite Assemblies and Personal Working Rates (v0.5.13)

Date: 2026-10-11 · **Design-only / no assembly pricing activated**

## Website simplification
The top-level **Work Specifications** menu entry was redundant. Clicking a work item already provides the original description, Excel cell provenance, source rate and editorial quality guidance. The independent menu/footer link has been removed, while the underlying `rate-specifications.html?id=...` deep links remain valid and unchanged.

## Source classification: JP — My Personal Working Rates
The displayed Rate Library work-rate table is a *user-provided personal Excel estimate-derived reference* associated with JP, not the approved cross-company AEC rate master. The original Excel file remains in Google Drive under its original name with the same Drive ID. Its **102 visible + 102 hidden worksheet** observations are preserved in `data/historical-work-rates-v0.5.3.json`. The hidden set cannot be assumed to be a prior version. Actual year, location, current validity, transport/tax inclusions and approval status are not independently verified. There is no claim that these 204 records are official government rates or reproducible resource-based rate analyses.

The company-wide [AEC_Cost_Rate_Master_v1.0] is kept separately as canonical normalized rate authority. Separate rate-source families should include:
- `JP_PERSONAL_WORKING_RATES`: Excel-derived finished-work observations, draft and unapproved.
- `DUDBC_RATE_ANALYSIS`: authoritative-derived *candidate* coefficients **only after** edition/page/source extraction and checks; currently pending verified structured extraction.
- `KASKI_DISTRICT_RATES`: dated government benchmarks, not the same as user item-rate observations.
- `PROJECT_ACTUALS`, `VENDOR_QUOTATIONS`, `APPROVED_COMPANY_RATES`: later governed sources; no merging by convenience.

## Existing government/source backlog
A file in the connected Drive is named **rate analysis DUDBC.pdf** (11,844,132 bytes). Existence and URL were verified, but its full structured rate-analysis parse was not established; PDF text fetch returned empty. Do not claim complete parsing from the absence of an error.

The existing August 2026 Drive index `OFFICIAL_BASIS_DUDBC_Building_Construction_Specification_Source_Index.md` records a *different* DUDBC Building Construction (Civil) Works Specification official page as verified but original PDF binary pending **as of that index**. An older `OFFICIAL_PDF_BINARY_DOWNLOAD_QUEUE_v0.1.md` lists other government source PDFs pending. Their current state must be rechecked before a new ingestion run; the PDF rate-analysis file is not interchangeable with the building-specification publication.

Source-priority, non-duplication, stable PK/FK, immutability and audit requirements remain subject to the live Drive AEC Cost & Rate Control Tower. No Drive reorganization or renaming was conducted in this change.

## Future customer-friendly composite wall assemblies

The user should be able to ask for a **complete finished wall** without knowing each trade's BOQ component. Define an assembly as a parameterized **recipe** that references atomic work items. Keep individual work prices as standalone rate observations. Do **not** insert a calculated wall package as a competing authoritative observation unless separately quoted and sourced.

Normalized recipe unit = **1 m² net wall elevation**, with clear inputs `A_net`, wall thickness `t`, internal/external face area and electrical point count from CAD/MEP or manually verified constraints. Example transparent quantity rules:
- Brick masonry [m³] = A_net [m²] × t [m] (subject to source measurement and openings).
- Plaster [m²] = sum of separately selected net face areas; often two faces but **not assumed**.
- Punning or putty, primer and paint [m²] = specified finish-face area by face/coats/inclusions.
- Electrical points [point] = verified MEP count, not an invented points/m² density. Conduits, boxes, channels and making-good are only separate layers when not already included in the point or plaster rate.
- Package unit rate [NPR/m²] = Σ (component quantity per 1 m² wall elevation × compatible component source rate [NPR/unit]), **when all scopes, quantities and prices are verified**. Do not sum unlike units without their coefficients.

**Two complementary levels of composition:**

```text
Client-friendly: Complete Finished Wall [assembly]
     ├── Brick masonry [m³]
     ├── Inside plaster [m²] + optional outside plaster [m²]
     ├── Punning / putty / primer / paint [selected finishes, m²]
     ├── Optional electrical points, conduits, devices [layout verified]
     └── Other selected scope (damp proof, trims, skirting) only by approved design
           │
           ▼
Each work item rate analysis [per work unit]
     ├── Materials and wastage
     ├── Skilled/unskilled labour and productivity
     ├── Equipment, hire, fuel and transport
     ├── PPE and safety consumables
     └── Electricity, water, site amenities / explicit allocation
           │
           ▼
Original Drive evidence → stable resource/observation IDs → calculated proposal
```

Avoid double counting: resource-level labour, PPE, equipment, water and electricity already included in a finished work-item rate must **not** also be applied again at assembly level. Overhead/contingency/profit/tax are explicit separate policies, not hidden defaults.

**Three future presets**: (1) bare wall, (2) finished wall, (3) finished wall with selected MEP provisions. Supply **scope breakdown, included/excluded table, technical assumptions, and cost subtotal with source IDs** only when user-confirmed quantities and evidence exist.

## Five evaluated open-source foundations
Historical evaluation names: **GEstimator**, **OpenConstructionERP**, **BinaaCost**, **BuildSuite Core**, **ERPNext**. OpenConstructionERP and BuildSuite Core visibly document BOQ assemblies and component cost rollups. BinaaCost documents parametric cost libraries and composite assemblies. ERPNext has nested BOM with operations but is not itself a complete construction assembly estimator; use as finance/resource accounting pattern. GEstimator suitability requires validation against actual repository functionality. **Evaluation ≠ installed/integrated.** Earlier architecture research also included IfcOpenShell, aec-platform/qto and FreeCAD; those are CAD/BIM and quantity takeoff references, not evidence that five packages are integrated.

## Implementation sequencing (NOT executed)
1. Confirm wall scope, finishes/sides, inclusions, openings and source rate identities.
2. Integrate component resource analysis tables: resource type/material/labour/equipment/PPE/utilities, coefficients, quantity units, waste, productivity and basis.
3. Implement assembly recipes with stable IDs and source references (schema and empty unpriced template included here).
4. Accept verified CAD/FID net wall geometry and MEP points, then compute visible user-selectable package views.
5. Quality-gate totals and version rate/assembly revisions without overwriting source observations.

The schema/template is **draft machine-readable planning material only**. No wall total, rate approval, database migration or quantity takeoff was performed.
