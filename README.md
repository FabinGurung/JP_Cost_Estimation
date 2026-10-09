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

## Company finance navigation and release map — v0.3.0-alpha (2026-10-09)

The research website now **adds** (without replacing any older app blocks):

- [Company Finance & Project Payments](finance.html): originally company-first navigation without figures in v0.3.0-alpha. **Superseded for user-approved Krishna summary by v0.4.0-alpha below.** Rohini and Fishtail remain separate; no company-wide consolidation is implied.
- [System Map & Branches](system-map.html): readable, provider-audited publishing/branch map, including the default `main`, the active research branch, milestones, pre/post snapshots, archived aliases and preserved legacy refs.
- A shared **soft light-green** UI with optional **dark mode** (`theme.js`); old Dashboard, Takeoff, BOQ, Rate Analysis, Rate Library, Source Registry, Provenance and Known Rates remain.
- The Krishna payment v1.1 Google Sheet has its **own Rohini Drive authority** and edit-history mechanism. Its amounts are neither public website data nor Kaski/DUDBC `RO-*` source rates.

**Publishing:** the default `main` triggers the Pages workflow but that workflow explicitly checks out `research/open-estimation-engine-v0.1`. Therefore Pages content is the research site, not the v0.1 `main` HTML. GitHub Pages does not execute `api/cr02-rates.js`; Vercel research Preview is a separate serverless deployment. Do not merge draft PR #1 as part of finance navigation.

**Branch governance:** the existing `Archive_` branches are commit-identical aliases; their historical original refs have not been deleted. The finance navigation has a PRE snapshot and a separate named milestone. See [the website branch map](system-map.html) and [publishing contract](docs/FINANCE_COMPANY_PORTAL_v0.3.0__PUBLIC_SAFE.md).

---

## v0.4.0-alpha — landscape website and verified Rohini project-payment summary (2026-10-09)

**Owner approval:** this public/open-source repository may show the actual Krishna Kumar Gupta → Rohini → 14_Bishal_Paija **payment summary** and the direct editable Google Sheets source link. This supersedes the older v0.3 UI rule that required pasting a private URL. The published summary contains 26 names and amounts from the sheet's source summary `14_bishal_paija!A6:E33`.

**Verified source report (Google Sheets, 2026-10-09):**
- Reported Amount total = **NPR 2,47,008** across 26 rows, exact agreement with the sheet's `Total` row.
- Reported QR total = **NPR 130**, exact agreement with the sheet's `Total` row.
- Nonblank Discount entries = **NPR 2,400**, derived sum; source Total row contains **no discount total**.
- Amount, QR and Discount are separate reported columns. No new netting/deduction is assumed.
- The authoritative live Google Sheet is directly linked in `finance.html` and `finance-summary.json`. Access to the editable sheet continues to be governed by Google Drive.
- `finance-summary.json` is a **verified 2026-10-09 publication snapshot**, **not** a live synchronized feed. Future Sheet edits require a new source read, reconciliation and publication commit.

**Website changes:** the former fixed left navigation pane is restyled as a horizontal sticky top header on all four site pages by the new additive `site-shell.css`. Original SVG landscape `assets/green-landscape.svg` shows trees, open meadows and mountain greenery. `index.html`, `known-rates.html`, `finance.html` and `system-map.html` have landscaped hero regions and retain all existing estimation blocks. The soft light-green default and optional dark mode remain. `branch-map.js` refreshes the public branch inventory from GitHub's API with the previous static list as fallback.

**Data governance:** publishing this approved project-specific summary does not imply Rohini payments are official `RO-*` Kaski rates or that the demo BOQ uses actual expenditure. Fishtail remains a separate organization. The private A9 source original and Google Sheets formulas are untouched by the website refresh.

**Release boundary:** the default `main` still owns Pages publication and original v0.1 files; `research/open-estimation-engine-v0.1` supplies the current website. Preserve snapshot/milestone refs and keep PR #1 unmerged until its independent research gate passes.
