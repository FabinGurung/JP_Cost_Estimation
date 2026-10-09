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
