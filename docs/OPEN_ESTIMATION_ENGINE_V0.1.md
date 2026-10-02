# JP-CES Open Estimation Engine v0.1 — Research Branch

## Baseline
This branch was created from `main` commit `98b09c4d035bdde2964c356a4326c3a33fd529ee` (JP-CES v0.1).
The baseline remains the comparison/control implementation. Do not delete or rewrite it blindly.

## Research rule
Ancestor-first:
1. reproduce/understand mature open and authoritative systems;
2. map their schemas and workflows;
3. clash them against JP-CES;
4. preserve JP-CES strengths;
5. identify gaps;
6. implement only evidence-backed improvements.

## Five upstream/source families

### 1. OpenConstructionERP
Use for architecture and workflow study:
- hierarchical BOQ
- resource/cost assemblies
- cost databases
- takeoff workflow
- tendering/procurement
- progress billing
- change orders
- estimate-to-actual lifecycle

License gate: AGPL-3.0. Study and integrate only with explicit license review.

### 2. IfcOpenShell / IFC5D / buildingSMART IFC
Use for openBIM interoperability:
- IFC quantities
- IfcCostItem / IfcCostSchedule concepts
- 5D cost links
- model-to-quantity provenance
- future CAD/BIM integration

### 3. aec-platform/qto
Use for transparent quantity-takeoff architecture:
- IFC quantity extraction
- unit normalization
- classification mapping
- no-invention/gap reporting
- custom national mappings

Target concept: Nepal/DUDBC mappings should be data/configuration where possible, not hidden calculation code.

### 4. Nepal DUDBC norms/specifications
Use as Nepal technical/rate-analysis authority:
- work definitions
- resource coefficients
- labour/material/equipment composition
- technical specification references
- measurement/rate-analysis basis

### 5. Kaski District Rate
Use as dated local rate authority:
- labour rates
- material rates
- equipment/transport rates where published
- fiscal-year/version provenance

Never overwrite historical rate books. Version by source, fiscal year, publication date, and jurisdiction.

## Target data pipeline

```text
CAD / IFC / MANUAL INPUT
          |
          v
QUANTITY RECORDS
          |
          v
WORK / BOQ CLASSIFICATION
          |
          v
DUDBC RATE-ANALYSIS RECIPE
          |
          v
RESOURCE QUANTITIES
          |
          +---- KASKI OFFICIAL RATE
          +---- VENDOR QUOTATION
          +---- APPROVED COMPANY RATE
          |
          v
UNIT RATE
          |
          v
BOQ / ESTIMATE VERSION
          |
          +---- schedule / WBS / Primavera
          +---- procurement
          +---- progress billing
          +---- variation orders
          +---- actual cost
```

## Planned web surfaces

### 1. Project / Estimate Dashboard
- project identity
- estimate version
- estimate class/readiness
- source coverage
- total and cost/m2 / cost/ft2
- quantity provenance summary
- rate-book status
- open gaps/warnings

### 2. New Estimate / Inputs
- homeowner/simple input
- engineer input
- drawing/model import hooks
- scope/exclusions
- estimate basis

### 3. Quantity Takeoff
- quantities by work item/storey/location/source
- manual, drawing, IFC, BBS, MEP sources
- source trace
- confidence / verification
- unclassified/unmeasured gaps

### 4. BOQ / Cost Plan
- hierarchical BOQ
- quantity
- unit
- unit rate
- amount
- WBS/work links
- source links
- revisions

### 5. Rate Analysis
- work item recipe
- labour/material/equipment coefficients
- waste
- productivity
- derived unit rate
- DUDBC/norm provenance
- override trail

### 6. Rate Library
- Kaski official rate books
- vendor quotations
- company-approved rates
- validity dates
- source document
- rate comparisons

### 7. BIM / IFC Takeoff
- IFC import
- quantity-property inspection
- classification mapping
- mapping coverage
- missing quantity report
- cost-item links

### 8. Estimate Versions / Compare
- baseline vs revision
- quantity delta
- rate delta
- scope delta
- total delta
- reason/change record

### 9. Procurement / Actual Cost (later)
- RFQ/vendor quote
- purchase
- actual paid/committed cost
- estimate vs actual
- variation/change order

### 10. Integration / Provenance
- CAD/BIM link
- Primavera/WBS link
- source documents
- rate book
- calculation version
- audit trail

## Proposed Postgres/Neon core entities

- projects
- estimate_versions
- work_items
- boq_items
- quantity_records
- quantity_sources
- classifications
- rate_books
- rate_items
- resources
- rate_analysis_recipes
- rate_analysis_components
- vendor_quotes
- estimate_adjustments
- source_documents
- provenance_edges
- integration_links

All mutable business records should preserve stable IDs and revision/audit history.

## Immediate proof-of-concept
Do not rebuild the whole product.

First prove:
1. one project;
2. one small BOQ hierarchy;
3. 3-5 work items;
4. one DUDBC-style resource recipe per work item;
5. one dated Kaski rate book;
6. quantity × derived rate = traceable estimate;
7. every number can show its source and calculation path;
8. old JP-CES result remains available for side-by-side comparison.

## Non-goals for the first branch
- no deletion of v0.1
- no production merge
- no unsupported tender claim
- no pretending demo/market rates are official
- no blind copy of AGPL/GPL code
- no model quantity invention when source data is absent
