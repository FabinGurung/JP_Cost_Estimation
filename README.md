# JP Construction Estimation System (JP-CES) v0.1

## Purpose
A civilian-facing building cost estimator. The homeowner answers simple questions; the backend translates them into engineering quantities and BOQ items.

## How to run
1. Keep `index.html`, `styles.css`, `data.js`, and `app.js` in the same folder.
2. Double-click `index.html`.
3. No server, installation, or internet connection is required.

## What is working in v0.1
- 8-step homeowner questionnaire
- Kumari Gurung example preset
- Built-up area calculation
- Benchmark engineering quantity engine
- Activated BOQ line items
- Cost-by-category summary
- Simple and Engineer BOQ views
- Engineer/Admin rate editor
- Export project estimate to JSON
- Print / Save as PDF from browser

## Important
The rates in `data.js` are DEMO values only. They are intentionally separated from the calculation engine so an engineer/admin can replace them with dated, approved local rates without changing the front-end questions.

The structural quantities are benchmark-based. This is a planning estimator, not a structural design or tender BOQ.

## Recommended next versions
### v0.2
- Replace demo rates with a Pokhara rate library with source/date/vendor metadata
- Add exact 35-question schema with conditional branching
- Add room-by-room area editor
- Add opening schedule
- Add wall-length estimator
- Add rate profiles by finish grade

### v0.3
- Architectural plan upload/extraction workflow
- Structural drawing input
- BBS engine
- MEP quantities
- Quantity traceability to source drawing

### v1.0
- Project accounts
- Saved projects
- Vendor quotations
- Procurement
- Progress billing
- Variation orders
- Client PDF report
- Engineer audit trail

---

## Current repository topology and deployment contract (2026-10-09)

Repository canonical name: **[FabinGurung/JP_Cost_Estimation](https://github.com/FabinGurung/JP_Cost_Estimation)**. The old `jp-building-cost-estimator` URL is a GitHub redirect, not a second repository.

### Roles of the active branches

| Ref | Role | Rule |
| --- | --- | --- |
| `main` | Preserved v0.1 homeowner estimator and A7 routing manifest; GitHub Pages workflow owner | Do not overwrite the old estimator with unreviewed research code |
| `research/open-estimation-engine-v0.1` | Active v0.2.0-alpha research workbench, read-only CR-02 API, searchable Known Rates | Open draft PR #1; do not merge automatically |
| `milestone/CR02-SEQ10A-readonly-rate-library-v0.2.0-alpha` | Named immutable-by-policy milestone checkpoint of the research engine after documentation/label correction | Preserve this release candidate; continue development on `research/...` |

Historical feature and snapshot branches are preserved through `Archive_`-prefixed *commit-identical alias refs*. **This is not a server-side rename or deletion**: original refs remain for A9 history, old PR references, and audit. See `docs/REPOSITORY_TOPOLOGY_AND_BRANCH_POLICY_20261009.md`.

### Why the two publicly served pages may differ

- **GitHub Pages**: `main` owns `.github/workflows/deploy-estimation-product.yml`, which explicitly checks out the research branch to publish static files. The default branch's actual application files are still v0.1. GitHub Pages cannot execute Vercel's `/api/cr02-rates` serverless backend; treat its read-only CR-02 panel as unavailable unless separately proxied.
- **Vercel Production**: its configured production branch is `main`, historically serving v0.1 demo/calculator behavior. This is not evidence that canonical CR-02 rates are driving estimate amounts.
- **Vercel Preview**: the research branch contains `api/cr02-rates.js`; it uses the server-side `CR02_DATABASE_URL` (never store the secret in Git). Previous runtime QA confirmed the read-only API, but current Vercel dashboard permissions must be reverified before claiming a present-day live deployment.
- **Known Rates**: `known-rates.html` is a separate searchable user-reference subpage. `KR-0001` stone cladding is NPR 2,300/m² for labour+materials+equipment, excluding water and electricity; no location/date/tax/transport is implied. `KR-*` values are **not official `RO-*` observations**.

### Authority and graph boundaries

- **A7** maps this code module via `A7_MODULE.json`: `REPO-000008`, `MOD-COST-001`, `OWN-MOD-COST-001`. It is *routing metadata*, not a rate authority.
- **A9 Drive** holds the governed AEC cost/rate control, original/source documents, canonical normalized Sheet, history and artifact edges. Owning project documents remain authoritative for their project-specific evidence.
- **Neon `jp_estimation.cr02`** is a normalized operational **mirror**, not an independent authority. The Vercel API uses a restricted `cr02_api_reader` SELECT-only role.
- **`RO-*`** records are dated rates tied to material/work, source, location, unit and context. `RA-*` / `RAC-*` are rate-analysis headers/components. **`ART-*` / `EDGE-*`** are A9 document-lineage nodes and edges, not SQL foreign keys.
- **`public` database schema** has the separate estimation-engine project/BOQ/quantity/recipe model; `cr02` is the source-rate warehouse mirror. Both need explicit integration before real canonical BOQ computation.

### Verified scope vs remaining work

The last live Neon read in this audit found **9 canonical CR-02 observations**, **10 materials**, and **1 source**. The last A9 source count was **973 `SRC-0005` observations**, **964 not yet mirrored**. The initial bounded rate-analysis set has 2 headers/5 components. `MAT-GETTI-10-16` has no exact resolved rate and must not silently inherit the wider crushed 4.75–25 mm rate.

The current estimator's BOQ totals still use **demo/benchmark inputs** and are **not tender-ready**. Do not represent CR-02 lookup rates as already applied to those totals. Next phase: **Seq10B**, verified insert-only completion of the RMC M15/M25 family, preserving M20; then source-family expansion, compatible rate selection, DUDBC recipes, QTO/IFC, Primavera 4D/5D and procurement/actuals.

See `docs/REPOSITORY_TOPOLOGY_AND_BRANCH_POLICY_20261009.md` for branch history, system topology, and publication/security caveats.

---

## Pages publication — company finance navigation (2026-10-09)

**Publisher:** `main` (default branch; retains original v0.1 estimator and its unchanged application code).
**Published static-content checkout:** `research/open-estimation-engine-v0.1`, as defined by `.github/workflows/deploy-estimation-product.yml`.

This documentation-only `main` commit requests the normal GitHub Pages publishing workflow to pick up the updated research site:

- `finance.html`: new company-scoped Finance & Project Payments navigation; Rohini project route exists, Fishtail and other companies are separate unconnected lanes.
- `system-map.html`: all 18 audited Git refs with explicit MAIN / ACTIVE RESEARCH / MILESTONE / SNAPSHOT / ARCHIVED ALIAS classifications.
- `theme.js` and additive CSS: soft light-green default with optional dark mode on all existing and new pages.
- The original Dashboard, Takeoff, BOQ, Rate Analysis, Rate Library, Source Registry, Provenance, and Known Rates remain intact.

**Privacy:** No private payment-sheet URL, Google Drive ID, vendor data, totals, or edit log is checked into this public repository. An authorized user may paste their own private Google Sheets URL at runtime; Google Drive permissions still govern access. The static Pages site does not become a finance backend, and the estimator still uses demo BOQ pricing.

**A9 branch preservation:** `snapshot/pre-main-pages-finance-v0.3.0-20261009` and its matching `Archive_snapshot/...` alias capture the main PRE state. The research site has its own PRE snapshot and the milestone `milestone/FINANCE-COMPANY-PORTAL-v0.3.0-alpha-20261009`. Original historic refs are preserved; none have been deleted or force-renamed. Draft research PR #1 remains unmerged.

---

## GitHub Pages publication trigger — Green Landscape + source-verified finance (2026-10-09)

This **documentation-only `main` update** requests the existing Pages Actions workflow to publish the new `research/open-estimation-engine-v0.1` static website. The original `main` v0.1 estimator files and `.github/workflows/deploy-estimation-product.yml` remain unchanged.

- Horizontal top-navigation site header instead of the former left-side document-like pane.
- Local illustrated green mountains, open meadow, oak/pine trees and existing opt-in dark mode.
- The original seven estimator modules, Known Rates, CR-02 lookup separation, and branch system map all preserved.
- Rohini → `14_Bishal_Paija` → Krishna Kumar Gupta Payment to Project now links directly to the underlying Google Sheet.
- **Explicitly approved public summary**, read and reconciled from native Google Sheets `A6:E33`: 26 named entries, **NPR 2,47,008** amount total, **NPR 130** QR column total, **NPR 2,400** recorded discount aggregate (discount total not specified in sheet Total row).
- `finance-summary.json` is a **dated 2026-10-09 snapshot**, not an automatically synchronized live feed; no invented net amount, discount netting or QR-fee classification.
- Separate Fishtail and Rohini company navigation; no implicit merging of records or application of payments to demo BOQ rates.

**Refs:** `snapshot/pre-landscape-header-finance-summary-v0.4.0-20261009`, `snapshot/post-landscape-header-finance-summary-v0.4.0-20261009`, matching `Archive_` aliases, and `milestone/GREEN-LANDSCAPE-FINANCE-SUMMARY-v0.4.0-alpha-20261009`. Before this trigger, `snapshot/pre-main-landscape-release-v0.4.0-20261009` and its Archive_ alias preserved main's prior commit.

**Source and QA:** `research/open-estimation-engine-v0.1/docs/LANDSCAPE_SITE_FINANCE_SUMMARY_v0.4.0_20261009.md`. The source sheet remains the editorial authority. All private source originals and existing estimate calculations are untouched.

---

## v0.5.1-alpha publishing checkpoint — 2026-10-09

The GitHub Pages source remains `research/open-estimation-engine-v0.1`, now at commit `fc52c65c7bb311e9c4ebc57372aefa428205484a`.
Its active public UI focuses on **Rate Library, transparent Rate Analysis, Sources/Provenance** while retaining **Rohini Finance & Project Payments** and the **System Lifecycle/Branch Map**.
The light visual design uses open white clouds, green valleys and warm yellow sunlight. The previous site and finance records remain preserved.
The separately governed public Kaski rate snapshot is clearly dated, and the `boq-template.json` stays empty until verified CAD FIDs/measurements are imported.
This documentation update is the intentional `main`-branch Pages deployment trigger. The original v0.1 main estimator files remain preserved.

---

## v0.5.2 cleanup trigger — 2026-10-10

The GitHub Pages source branch `research/open-estimation-engine-v0.1` now points to `3373925e399d9d65abfcdf9b6ea9cabade966a3d`. Its old area-factor building demonstration seed is retired from the newest public source, recoverable intact through `snapshot/pre-legacy-kumari-seed-retirement-v0.5.2-20261010`, earlier site snapshot or the original `main` tree. The rate-only user interface, separate Rohini finance snapshot and system lifecycle remain unchanged. This main documentation-only commit triggers the existing GitHub Pages publish workflow.

---

## Publish v0.5.3: Three-column historical work-rate library (2026-10-10)

The Pages workflow publishes research source at `2c3579ce06cc9649fdb8825bad524951ed4f1449`, adding `rate-library.html`: the human-readable **Description of Work | Unit | Rate (NPR)** table. It includes 102 visible-source-sheet unit-rate observations with separately selectable 102 hidden-sheet alternatives, described as historical unverified rates; no project/client identifying details or quantities are published. Rate Analysis, finance, original `main` baseline and system lifecycle are preserved. This documentation-only commit triggers existing Pages deployment.

---

## Pages deployment v0.5.4 · mobile Rate Library and Work Specifications (2026-10-10)

The published research source is now `041e84971d9042f2ccbe674484a2fffa18d574ad`. The Rate Library uses short human-readable work titles and a fixed 3-column responsive table; a per-item `rate-specifications.html?id=...` page holds the complete original work descriptions. All 204 source records, historical version separation, rate observations, source identity restrictions, finance summaries, original baseline and rollback snapshots remain unchanged. Documentation-only change to trigger GitHub Pages from the existing workflow.

---

## Publish v0.5.5 · category navigation, rate comparison and narrow Unit column (2026-10-10)

The Pages checkout branch `research/open-estimation-engine-v0.1` has source SHA `85cdca3d775173951a6147efef087d2dec0b1514`: new category/type filters, rate comparison for 102 matched pairs (4 differing unit rates), narrower wrapped Unit column, complete specification page metadata and explicit unresolved source year/location/approval. Original 204 rates, rate analysis, finance, BOQ template and histories are preserved. This documentation-only commit triggers the existing Pages workflow. PRE snapshot: `snapshot/pre-main-rate-taxonomy-v0.5.5-20261010`.

---
## Deploy v0.5.6 · rate price alignment, search aliases, SI/Imperial (2026-10-10)

GitHub Pages checkout source `research/open-estimation-engine-v0.1` now points to `53eef3f788903f2e986fe8f0eab472ee63d65f99`. The three-column rate index shows left-anchored NPR prices; normalized search matches `cut piece`, `cut-piece` and `CUTPIECE`. SI/Imperial controls convert historical rate-per-unit denominators throughout Rate Library, Work Specifications and Rate Comparison using exact meter/foot/kilogram/pound factors. Source rates, classified rate references, finance, original engineering takeoff ownership and history remain unchanged. This main README-only commit triggers the existing Pages workflow.

---

## Deploy v0.5.7 — Work emoji + foundation-to-finish journey + editorial workmanship guidance (2026-10-10)

GitHub Pages serves the research branch source at `10b9ac1379680fcd494f6ccb9806b5dc6a4548d0`. A three-column, emoji-accompanied Rate Library has a user-friendly stage ribbon and **illustrative construction-order sort** (excavation → soling → PCC → steel/formwork → RCC → masonry → building services → finishes), with the original workbook order still available. The pre-existing Work Specifications detail page now includes separately identified, general quality-check prompts without inventing source contract requirements. All 204 source rates, two workbook versions, finance data, SI/Imperial conversion, blank BOQ, CAD/FID ownership and historical rollback snapshots remain untouched. This documentation-only change triggers the established Pages deploy workflow.

---
## Deploy v0.5.8 — worksheet terminology, construction sequence, source/guidance boundary (2026-10-10)

Published Pages source branch `research/open-estimation-engine-v0.1` now points to commit `5d07e0d77e7e3471740f9ec979e7d18b6b28ea66`. Excel **visible/hidden tab sets** no longer imply a dated workbook version or a definitive approval state; a concise explanatory disclosure is part of the rate-library controls. Illustrative building stage sort now places site clearance before excavation and foundation backfill after relevant foundation concrete but before wall masonry. Detail pages label original source Excel wording separately from editorial, educational workmanship notes, and comparisons refer to visible/hidden tabs (not older/newer versions). The original 204 rates, FID/CAD quantity ownership, BOQ template, Rate Analysis, finance, theme and earlier Git snapshots are preserved. Main README-only commit triggers existing GitHub Pages deployment.
