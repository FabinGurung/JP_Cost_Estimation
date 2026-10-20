# JP Cost Estimation — Shared Website Presentation v0.8

## Working boundary
One website with common global navigation, typography, palette and reference wall. Rate and finance data remain independent. Google Sheets remain the editable finance source; GitHub Pages serves verified public snapshots.

## Ownership and conflict prevention
- Shared: site-theme-v0.8.css, site-navigation-v0.8.js, memory-posters.* and this document. Change these in a single coordinated pull request.
- Rates: rate-specific HTML, CSS, JavaScript and data. Do not import finance snapshots into rate records.
- Finance: finance.html, finance-dashboard.*, finance-public-snapshot.json and finance-context.json. Do not change payment values through website styling.
- Begin changes from the latest research/open-estimation-engine-v0.1. Use a feature branch and a pull request to the research source branch. Avoid simultaneous edits to shared files from separate threads.
- Publishing is owned by main. After a successful research source merge and validation, a main-only deployment marker triggers Pages. Never force-update an older milestone.

## Public navigation
Overview → Rates → Finance → Payment Dashboard → Memory Posters → System Map.

Existing local navigation remains in place. The shared bar is separate so rate calculators, source selectors and payment filters keep working.

## Reference wall
memory-posters.json is the editable collection. Each poster needs a unique ID, category, title, takeaway, explanation and local page link. Never include private worker transactions, unpublished evidence, passwords or source credentials.

## Release checks
Run node --check site-navigation-v0.8.js, node --check memory-posters.js, node scripts/validate-site-theme-v0.8.mjs, node scripts/validate-finance-public.mjs, and node scripts/qa_kkg_finance_snapshot_v1.2.mjs. GitHub Actions runs these checks again.

## Future finance refresh
Read the current Google Sheet and its 00_SITE_CONTEXT worksheet. Preserve vendor sections, distinguish BS/AD dates, keep Amount/QR/Discount separate, reconcile all counts and totals, and publish only approved fields. Do not migrate the human working sheet or install a script as part of a website release.
