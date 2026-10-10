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
