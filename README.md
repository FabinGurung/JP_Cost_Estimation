# JP Cost Estimation · Functional Architecture v1.0 (2026-10-31)

**Current authority:** A9 source-preserving architecture. **Public website:** https://fabingurung.github.io/JP_Cost_Estimation/ . **Publishing branch:** `research/open-estimation-engine-v0.1`. Original `main` homeowner estimator and historical releases are retained.

## Functional site departments

| Department | Owner subject | Public route |
| --- | --- | --- |
| Home | Overview, navigation, legacy rate-analysis workbench | `index.html` |
| Rates | Reusable rates, market observations, government sources, specifications and rate analysis | `rate-sources.html` |
| Projects | Organization and client-specific scope, rate assumptions, QTO readiness, BOQ, AOC and comparisons | `projects.html` |
| Measurements & BOQ | Measurement methods, blocked CAD/FID handoff template and BOQ/AOC directory | `measurements-boq.html` |
| Finance | Recorded source-Sheet payments, site expense and finance dashboards | `finance.html` |
| References | Technical references, provenance and memory posters | `reference.html` |
| System | Source directory, GitHub Actions, release, routes and custody | `governance.html` |

The `site-page-registry.v0.8.json` **filename remains for backward-compatible machine consumers**; its schema is `jp.site.page-registry.v1` and its current functional map version is `1.0.0`.

### Client example: Amrit Rawat / Pokhara Ward 14

`projects/rohini/ward-14/amrit-rawat/index.html` is now the **project overview**. The old rate display is preserved verbatim in functional terms under `cost-planning.html`, still referencing the original 32 rate alternatives (14 plinth, 12 site trade, 6 wage) in `rates.public.json`. The old registry identity `RT-22` is a historic alias to `PJ-02`, never reallocated. No public route was deleted.

The original Rohini Google Sheet has one permanent LIVE ID. Source prices remain `USER_SUPPLIED_UNVERIFIED`. The site reports missing measured quantities as `NOT_MEASURED_PENDING`, BOQ as blocked, AOC as blocked and actual-finance crosswalk as not verified. No speculative cost totals are generated.

### Calculation and source safety

- CAD repository or verified measurement source owns geometry, drawing revision, source FIDs and quantities. `boq-template.json` stays `BLOCKED_PENDING_VERIFIED_CAD_FID_DATA`.
- This repository owns unit-cost calculation rules, schema validation, domain restrictions and derived public snapshots.
- `project-cost-engine.mjs` rejects missing/unverified quantities, unapproved rate selection, mismatched units, incompatible package overlap, labour-only vs material-and-labour combinations and missing approved allowances.
- Project rate assumptions are NOT reusable government or district rate standards, measured BOQ, or actual financial transactions.
- Finance retains separately authorized original Google Sheets (Rohini/Fishtail are not merged); the current Pages deployment can perform a finance source refresh if Google authentication is available. A Pages success alone does not prove an authenticated Sheets refresh.
- A separate reusable Amrit source sync, invoked from `main` on schedule, uses keyless Workload Identity and short-lived Google read-only credentials. Without private source ID secret/WIF permissions, it holds the previous dated snapshot. No service-account key must be committed or exposed.

### Restoration, QA and status

Pre-change restoration ref: `snapshot/pre-functional-ia-a9-20261031`. Run `node scripts/validate-site-page-registry.mjs` and `node scripts/validate-functional-domains.mjs` in addition to existing finance and rates regressions. `research-preview-pages.yml` is now a **manual-only historical QA** workflow (automatic duplication retired). Only `deploy-research-pages.yml` owns active Pages deployment.

## Historical preserved documentation follows

---

# JP Cost & Rate Intelligence — v0.5.0-alpha (scoped research)

**Current scope:** a transparent Nepal-oriented **Rate Library** and **Rate Analysis** engine.

## Ownership

- **CAD repository owns** source drawings, model element IDs/FIDs, engineering geometry, measurement and all quantity takeoff.
- **This repository owns** resource definitions, dated/located rate observations, technical specification-linked resource recipes, per-unit rate analysis and source provenance.
- **BOQ is not active here.** The only BOQ-related current file is the unpopulated, explicitly blocked \`boq-template.json\`. No quantities or totals are populated before verified CAD-FID export and compatible approved rate analysis.

See [scope and CAD FID handoff](docs/SCOPE_CAD_FID_HANDOFF_v0.5.0.md).

## How to run

Open \`index.html\` in a browser for the static shell, user-known rate search and manual draft rate analysis. A connected server-side read-only API, \`/api/cr02-rates\`, is required for live canonical CR-02 observations; static GitHub Pages does not provide it. An unavailable API must appear as unavailable.

## Current surfaces

- **Rate Library**: \`KR-*\` user-known references, separately labelled \`RO-*\` governed observations when API reachable. No made-up fallback figures.
- **Rate Analysis**: enter each material/labour/equipment/transport/other resource, its quantity per output unit, waste %, unit price and evidence ID. Formula and each extended amount are visible. JSON export is unapproved draft, not a database write.
- **Sources & Provenance**: lists rate authorities and evidence. Sources must be verified before approval.
- **Blank BOQ template**: a static schema and readiness gate; not an estimator.

Other historical pages such as the separate finance summary, Known Rates detail and system map remain preserved, but are not the estimating engine.

## What is *not* implemented

- No CAD connection, FID import, IFC takeoff, geometry calculation, BBS, unit-quantity generation or project BOQ.
- No automatic rate selection for a project, production DB write, verified government resource recipe ingestion or approval workflow.
- The user-entered source ID in a rate-analysis draft is a **claim**, not proof of verified source authority.

## Version / preservation

This change is developed in \`feature/rate-intelligence-only-v0.5.0-20261009\`; earlier v0.4 files and all formula methods remain in immutable-by-policy \`snapshot/pre-rate-intelligence-scope-v0.5.0-20261009\` and Git history. Default \`main\` retains the original homeowner v0.1 baseline. No historical data or branch is deleted, and this is not automatically merged or publicly deployed.

See the historical [original estimation research document](docs/OPEN_ESTIMATION_ENGINE_V0.1.md) as **historical architecture only**, not current responsibility.

Source authority: [AEC Cost/Rate Master](https://docs.google.com/spreadsheets/d/1yJX1Dep0_2ZDvRftu3u-Bb6ZbDqtQWKDChQQlYCWYXY/edit). Project finance remains separate.


## v0.5.1-alpha — Sunlit Valley rate-first portal (2026-10-09)

- Green valley + white-cloud morning sky + gentle amber-yellow sunlight. Light theme by default; high-contrast readable type and reduced-motion handling.
- Top-level portal: **Rate Library**, **Rate Analysis**, **Finance & Payments** (preserved Rohini), **System Lifecycle** (preserved branch map).
- A dated nine-observation Kaski public-source JSON snapshot is available on static GitHub Pages when the secure read-only CR-02 API is unavailable. It is explicitly labelled static; live refresh is not implied.
- The original \`finance.html\`, \`finance.js\` and \`finance-summary.json\` are preserved; source-verified 26-row Rohini publication remains an independent snapshot and **not** a rate book.
- Quantity takeoff is CAD-owned. Only the blocked, empty \`boq-template.json\` exists here.
- All changes are additive or navigational and preserve the legacy v0.1 main branch and 2026-10-09 v0.4 release snapshots.
- Page and connector verification gates are described in [release notes](docs/RATE_PORTAL_RELEASE_v0.5.1.md).

## v0.5.2 — Retired legacy project demonstration seed (2026-10-10)

`data/research_seed.json` is a nonfunctional, project-free placeholder in the active research release. The original file remains in `snapshot/pre-legacy-kumari-seed-retirement-v0.5.2-20261010` and original `main` for rollback. No engineering project data has been deleted from its independent Drive authority. Rate Library, Analysis, Rohini Finance and System Lifecycle remain unchanged.

## v0.5.5 — Work-rate classification & comparison (2026-10-10)

The [Rate Library](rate-library.html) stays a **three-column** compact table with a narrower **wrapped Unit** column, an editorial **work family → type → variant** browsing hierarchy, and explicit source year/location/approval uncertainty. [Rate Comparison](rate-comparison.html) pairs 102 exactly matching visible/hidden alternative work items and surfaces **four differing unit prices** (no chronology inferred). Complete original descriptions, provenance, and paired values are available via the [Work Specifications](rate-specifications.html) page. The canonical AEC rate master, finance ledger, source workbook, QTO and original 204 rate observations are unchanged. See [v0.5.5 release notes](docs/RATE_LIBRARY_TAXONOMY_COMPARISON_v0.5.5.md).

## v0.5.6 — price readability, search normalization and SI/Imperial display (2026-10-10)

The [Rate Library](rate-library.html) still has exactly three columns, but displays left-anchored NPR prices rather than far-right values. Search now indexes a normalized version of the full source specification so `cut piece`, `cut-piece` and `CUTPIECE` find the same source item. An SI/Imperial switch is available on Rate Library, [Work Specifications](rate-specifications.html) and [Rate Comparison](rate-comparison.html). Derived unit prices use exact conversion denominators and **never overwrite the 204 source rates**. Unknown rate year/location/approval are unchanged; Rohini Finance, existing AEC source library, Rate Analysis, CAD-owned takeoff, and rollback history remain preserved.

See [conversion design and QA](docs/RATE_LIBRARY_SEARCH_IMPERIAL_v0.5.6.md).

## v0.5.7 — Emoji construction sequence + detailed workmanship guide

The [Rate Library](rate-library.html) now defaults to an **illustrative substructure-to-superstructure-to-finishes sequence**, with work-type emojis, filterable construction-stage chips and original-workbook-order sort as an alternative. The existing [Work Specifications](rate-specifications.html) detail page preserves verbatim source descriptions and now adds clearly labelled general workmanship/quality-review prompts **separate from** unverified source requirements. No source rate, normalized taxonomy, CAD takeoff, finance module, project record or BOQ has been modified. See [scope and QA](docs/RATE_LIBRARY_CONSTRUCTION_JOURNEY_v0.5.7.md).

## v0.5.8 — Archive and worksheet terminology clarified

The Rate Library now calls Excel's visible and hidden tabs **worksheet sets** instead of implying two chronologically ordered file versions. The archived estimate is unverified and its rate year is unknown; the hidden worksheet set is not claimed to be older or newer. The visual construction journey displays illustrative site clearance before excavation, and foundation backfill before above-ground masonry. The Work Specifications page distinguishes exact Excel work-description text from general quality prompts, rather than describing all source snippets as full contractual specifications. 204 rates, company finance, rate analysis, CAD/QTO ownership, website theme and SI/Imperial conversions remain unchanged. See [v0.5.8 corrections](docs/RATE_LIBRARY_LANGUAGE_FLOW_CORRECTIONS_v0.5.8.md).

## v0.5.9 — Dedicated MEP trade pages (2026-10-10)

The [MEP overview](mep.html) links separate [Mechanical](mep-mechanical.html), [Electrical](mep-electrical.html), and [Plumbing](mep-plumbing.html) rate and work-specification navigation. Each visible/hidden worksheet set has exactly 3 mechanical, 37 electrical, and 22 plumbing/sanitary priced items. A ventilation fan is placed under Mechanical for browsing while retaining its original Electrical source identity. All three pages use the existing source rate catalog, normalized searches, SI/Imperial conversion, and existing detailed specification pages with contextual back navigation. No new rate, finance entry, CAD measurement or BOQ was made. See [scope](docs/MEP_TRADE_SUBPAGES_v0.5.9.md).

## v0.5.10 — MEP navigation and regression hardening (2026-10-10)

Fixed the Mechanical ventilation fan's educational guidance, contextual specifications hero/breadcrumb navigation, and persistent MEP search/worksheet/units/category/sort controls on drilldown. Previous/next now follows the selected trade view. Price sorting warns about unlike rate units. Both CI and preview workflows run a 204-record MEP regression test and check new JavaScript modules. Original source rates, labels, taxonomy, finance and CAD/QTO boundaries are untouched. See [v0.5.10 notes](docs/MEP_NAVIGATION_REGRESSION_v0.5.10.md).

## v0.5.11 — MEP inside the construction journey

MEP is no longer a sibling to Rate Library. The construction journey now presents a single 🏢 MEP stage, between openings and plaster, with Mechanical/Electrical/Plumbing drilldown inside the stage. All original 62 MEP records per Excel worksheet set and 40 non-MEP works remain visible in the parent Rate Library. Trade-page breadcrumbs/sidebar are nested under Rate Library and all existing URL bookmarks remain valid. Source data, rates, finance, quantity takeoff and BOQ are preserved. See [navigation fix](docs/MEP_NESTED_IN_CONSTRUCTION_JOURNEY_v0.5.11.md).

## v0.5.12 — MEP now switches inside Rate Library (2026-10-11)

The Rate Library's 🏢 MEP construction-stage child choices are now **interactive in-page filters**, not links to another full website page. Mechanical, Electrical and Plumbing reuse the same Description | Unit | Rate table, with 3/37/22 items per worksheet set and a 62-item all-MEP option. Selected state is reflected in the shareable `?stage=mep&trade=...` query; the worksheet choice and SI/Imperial display persist. Existing /mep.html and /mep-{mechanical,electrical,plumbing}.html URLs redirect to the corresponding in-page views and are not deleted. Work Specifications still have separate full-description pages and return to the selected in-page category. The original 204 rates and all Finance, CAD and BOQ boundaries are unchanged. See [release notes](docs/INLINE_MEP_RATE_LIBRARY_v0.5.12.md).

## v0.5.13 — Personal working-rate identity, simplified navigation, future wall assemblies (2026-10-11)

The 204 Excel-derived work price observations now appear as **JP — My Personal Working Rates**, a user-entered estimate-reference collection explicitly separate from government schedules, vendors, approved company rates and the canonical AEC Cost Rate Master. Original private workbook name, file, Drive identity and source extraction are not changed or projected. The redundant top-level **Work Specifications** navigation entry and footer shortcut have been removed; the per-item specification route `rate-specifications.html?id=...`, full Excel wording, metadata and editorial workmanship/quality guidance remain functional.

A **design-only, unpriced** Wall Assembly recipe and JSON Schema now describe how to combine wall masonry, internal/external plaster, punning/putty, paint and optional MEP point quantities in future **without double counting**. Future analysis includes materials, labour, equipment, PPE and water/electricity site amenities; project quantity/FID sources remain CAD-owned. No finished-wall totals or rates were invented, no source PDF was claimed parsed and no migration or finance change was made. Details: [JP personal rates + wall assembly design](docs/PERSONAL_RATES_AND_ASSEMBLIES_v0.5.13.md).

Government backlog: the Drive binary titled `rate analysis DUDBC.pdf` exists but a complete normalized parse/read-back was **not verified**; a separate DUDBC civil works technical-specification index historically reports PDF acquisition pending. Neither source is silently merged with personal rates.

M01 `v0.5.12` tag and pre-release remain immutable; this is a new development revision, not retroactive modification of that milestone.

## v0.5.14 — Four peer rate libraries and evidence-source skeletons (2026-10-11)

Introduced independent [rate-source collections](rate-sources.html) beside JP Personal Working Rates: [Government District Rates](government-rates.html), [Vendor Prices & Quotations](vendor-price-lists.html), and [Rate Analysis References](rate-analysis-references.html). These three new libraries show six document-specific, public-safe empty preview pages without inventing any observations. Five PDFs are in the Drive 01_Source_Documents hierarchy; one DUDBC-titled PDF is elsewhere in Drive and linked only through private control data. A machine-readable six-source private inventory is stored inside authenticated Drive 02_Normalized_AI_Data; public `SRC-GOV-001` etc. are staging/projection aliases only. [Extraction and QA handoff](docs/RATE_SOURCE_FAMILIES_AND_EXTRACTION_v0.5.14.md). Original 204 personal rates, legacy government public snapshot, Rohini Finance, Rate Analysis, CAD/FID ownership and M01 tag remain unchanged.

## v0.5.16 — Krishna Kumar Gupta Finance source refresh (2026-10-12)

Updated only the Rohini / 14_Bishal_Paija finance dashboard from the live editable Google Sheet. The prior 26-row/247,008/130 snapshot was replaced by 27 summary rows, NPR **268,798** recorded amounts, NPR **160** QR and NPR **2,400** discounts, with a source-date and audit controls. The new Thapasthali entry is No. 27 and its originally duplicated transaction ID was repaired in the working Sheet (not the published summary). The website no longer hard-codes 26 vendor rows; it checks ordered unique IDs, source totals and finite nonnegative figures. See [governance notes](docs/KKG_FINANCE_SNAPSHOT_v1.2__20261012.md). Original payments and unrelated companies/rate-source extraction remain unchanged.
