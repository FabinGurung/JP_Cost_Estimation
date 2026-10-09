# JP Cost & Rate Intelligence — Sunlit Valley rate-first portal v0.5.1-alpha

Date: 2026-10-09 NPT

## Approved product boundary
- Rate Library: government Kaski source observations (RO-*), user-known references (KR-*), and future governed vendor actual quotations, with source labels.
- Rate Analysis: visible resources / quantities per finished unit / wastes / observed prices / line calculations and exported JSON draft. No silently injected recipe or default markup.
- Finance & Project Payments: the Rohini publication remains separate; do **not** delete \`finance.html\`, \`finance.js\`, \`finance-summary.json\`. Source sheet authority and last reconciled 26 entries remain as recorded in the earlier v0.4 release. No automatic finance-to-rate conversion.
- System Lifecycle: maintain \`system-map.html\`, \`branch-map.js\`, all branch snapshots and deployment history.
- CAD owns geometrical quantities, measurement FIDs and takeoff. A blank \`boq-template.json\` stays locked pending validated CAD export.

## Public rate snapshot
Source: bounded production Neon \`jp_estimation.cr02.rate_observations\` SELECT, source \`SRC-0005\` only.
Source identity: Kaski District Rate FY 2083/84, source date 2083-03-30 BS, source link https://dcckaski.gov.np/detail/53.
Publication snapshot: \`public-kaski-rates-v0.5.1.json\` dated 2026-10-09, nine rows with \`RO-*\` IDs.
Uncertainty is retained: unknown transport/tax stays \`Unknown\`; a source observation is not automatically selected or approved for a job.
API priority: the read-only \`/api/cr02-rates\` endpoint when genuinely available, otherwise a clearly dated **static** snapshot.
Private/internal Neon rate analysis rows (\`visibility='Internal'\`) are **not** republished in the public JSON.

## Visual specification
- Brand: morning in a Nepali valley.
- Light pastel sky + white open clouds, green rolling hills, sunlit amber accents.
- Sunny hero and four clear portal cards; calm green header remains.
- Responsive two-column/tablet and compact mobile cards; keyboard focus ring and reduced-motion support.
- No dramatic dark theme or dark-screen-first mode. An opt-in dark theme remains functional.

## Release controls and known limitations
- Original main homeowner estimator is retained as archival project baseline.
- The Rohini 26-row finance snapshot is historically verified; this release does **not** refresh it from Google Sheet.
- The public Kaski snapshot is historically dated; this release does **not** provide continuous live refresh.
- Rate Analysis's manual source IDs are user-entered references, not provider-verified evidence links.
- Browser runtime QA and API availability must be checked independently after publication.
- No current CAD/FID integration or populated BOQ is implemented.
- A9 Main/Local registries need independent governed sync, not inferred from Git commit status.
