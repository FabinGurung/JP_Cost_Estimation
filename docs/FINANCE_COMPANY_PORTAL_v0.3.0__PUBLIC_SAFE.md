# Company Finance & Project Payments — UI / publishing contract

**Release line:** v0.3.0-alpha • 2026-10-09 • public-safe navigation only.

## New site surfaces

- `index.html`: untouched original Dashboard, Takeoff, BOQ, Rate Analysis, Rate Library, Source Registry and Provenance controls; added Company Finance and System Map navigation.
- `known-rates.html`: original `KR-*` content remains and gains links to Finance and System Map.
- `finance.html` + `finance.js`: company-scoped navigation. Rohini / 14_Bishal_Paija has a Payment to Project entry; Fishtail and future companies retain separate unconnected lanes.
- `system-map.html`: provider-audited branch listing and distinction between main (publisher), research (static site content), snapshots, milestones and `Archive_` commit aliases.
- `theme.js`: sitewide soft-green/light default and opt-in dark mode. Appearance is remembered locally in the browser (no finance data is saved).
- `styles.css`: additive CSS that preserves existing rate/estimation styles.

## Protected finance boundary

**This public GitHub repository does not include the payment workbook URL, Drive file ID, vendor names/amounts, cell-level edits, timestamps, payment ledger export, access tokens or finance API.**

The Finance page is a navigation-only entry. An already authorized user can paste their private Google Sheets URL at runtime. The browser validates the Google Sheets URL and opens that exact link in a separate tab. The URL is not saved, logged, embedded in the page source or transmitted by the new JS code. Permission enforcement comes from Google Drive, not this page.

Treat this as a **UI placeholder for an authorized future finance workspace**, not an authentication gateway. It must not be used as a public financial dashboard or as proof that finance totals are integrated with `cr02` rates or the demo BOQ.

## Authority and identity

- A7 `REPO-000008 / MOD-COST-001` owns the cost-estimation module routing, not financial transactions.
- Rohini's owning Drive scope has the Krishna payment register. Neither the payer's name nor the company/project relationship justifies cross-company ledger consolidation.
- Fishtail and other organizations must use distinct verified ownership records and permissions.
- Do **not** treat the finance register as Kaski `SRC-0005`, `RO-*`, `RA-*` or `RAC-*` rate evidence.
- The existing research estimator's BOQ calculation still uses demo/benchmark prices.

## Deployment rule

The repository's default `main` contains the original v0.1 app and the GitHub Pages publisher workflow `.github/workflows/deploy-estimation-product.yml`. That workflow checks out `research/open-estimation-engine-v0.1` and publishes its static files. Pages therefore provides UI but **cannot run Vercel /api/cr02-rates**. The Vercel Preview may run that API if team access/environment is valid.

Do not move existing routes, delete old blocks, merge draft PR #1, or publish internal Drive links without a deliberate separate authorization milestone.

## QA release requirements

- All old index navigation handlers and menu entries remain.
- Known Rates still reads its own data file without finance merges.
- `finance.html`, `finance.js`, `system-map.html`, `theme.js` resolve from research.
- Finance company selector changes content and cannot accidentally attach a Rohini register to Fishtail.
- Private Sheets URL must be pasted by the user and must use docs.google.com/spreadsheets/d/...
- Dark-mode choice affects all three existing/new page types without any payment data persistence.
- Main Pages publication job must be rerun by main workflow after the new research files are committed.
