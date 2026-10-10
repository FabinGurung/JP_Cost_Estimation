# Rate Library classification and comparison · v0.5.5
Release candidate: 2026-10-10 · Repository: FabinGurung/JP_Cost_Estimation

## Active surfaces
- `rate-library.html`: exactly **three displayed columns** (Description of Work, Unit, Rate NPR). Work family/type selectors in filter section, a classification breadcrumb inside the description cell, and a compact unit column with wrap. Table notation `r.m.` is a visual alias for source `running m`; source unit and complete specification remain unchanged and visible on details.
- `rate-specifications.html?id=<stable-id>`: original source specification, class hierarchy (editorial), unit, source rate, source workbook cell, and source metadata (year not recorded, location not verified, approval unverified). One-click link to matching rate comparison.
- `rate-comparison.html`: independent historical price comparison for 102 verified exact-description-and-unit pairs. Displays only four differing pairs by default; all matching or equal pairs can be shown. Difference is **visible-minus-hidden-alternative**, not an inflation or trend claim.

## Data governance
- Immutable public source file `data/historical-work-rates-v0.5.3.json` has 204 entries (102 visible, 102 hidden alternative); remains untouched.
- Immutable editorial short-title file `data/work-rate-labels-v0.5.4.json` has 204 labels; remains untouched.
- New `data/work-rate-taxonomy-v0.5.5.json`: 204 editorial browse classifications and 102 matching pairs; no rate replacement, project quantity, name, address, client identifier, or finance ledger. Exactly matching source descriptions and units were required to pair rows.
- Workbook rate year: **not recorded in verified source metadata** (null, not assumed from extraction or release date).
- Workbook source location: **not verified** (null; do not infer from disputed project identity).
- Approval: **unverified historical project estimate**, NOT a current government rate, supplier quote, or approved job unit price.
- Hidden workbook version chronology is unknown. Never assume hidden is older than visible or treat both as additive costs.
- Canonical AEC rate master, Neon data, private Google Drive original, CAD/FID takeoff, Finance & Project Payments, Rate Analysis, and blank BOQ are outside this release and unchanged.

## Classification method
- Source-order per division, reviewed item by item against 102 curated short titles. `family → work_type → variant` (e.g. `Concrete → PCC → 1:3:6`).
- Every visible record and its verified matching hidden alternative share one class and a stable pair ID.
- Navigation-only classifications are not an official construction code or a new vetted Rate Library tariff.

## Source comparison numerical checks
102 matching pairs: 98 identical rates, 4 different:

| Work | Unit | Visible NPR | Hidden alt. NPR | Visible − alt. NPR |
|---|---|---:|---:|---:|
| PCC 1:3:6 | m³ | 11,200 | 10,800 | +400 |
| First-class brick masonry (1:4) | m³ | 16,000 | 16,250 | −250 |
| Stone masonry (1:6) | m³ | 9,500 | 10,600 | −1,100 |
| Weatherproof painting — other structures | m² | 1,600 | 399.30 | +1,200.70 |

## QA
- Chromium browser checks at 320, 360, 375, 390, 430, 768, 1024 and 1280 CSS pixels: all main three table cells non-overlapping, no page-level horizontal overflow, unit column 9–12% of table (previous mobile up to 16–18%), white-space normal/wrapping.
- Filters: Building Works → Concrete → PCC returns 1 rate; switching visible-to-hidden returns 1 alternative. Clear restores all 102 visible entries.
- Rate comparison: 4 changed by default; All shows exactly 102; Electrical Works shows 40.
- Detail page: exact original description, source year/location uncertainty, link to comparison, stable ID and source cell preserved.
- Source counts, classifications, pair integrity and non-promotion constraints are tested before publication.

## Rollback
Before write: create `snapshot/pre-rate-library-taxonomy-comparison-v0.5.5-20261010` pinned to last published research branch. After successful write: create post snapshot. GitHub Pages checkout remains `research/open-estimation-engine-v0.1` triggered by documentation-only commit to `main`; create PRE/POST main trigger snapshots. No force pushes or deleting original data.
