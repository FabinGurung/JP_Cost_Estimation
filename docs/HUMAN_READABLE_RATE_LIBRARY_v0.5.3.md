# Human-readable Work-Item Rate Library v0.5.3

Date: 2026-10-10. Target: `FabinGurung/JP_Cost_Estimation` / GitHub Pages `rate-library.html`.

## Exact scope

- Show **Description of Work | Unit | Rate (NPR)** in a readable, searchable table.
- **102 visible-sheet BOQ rate records**, default; **102 hidden-sheet alternatives**, separately selectable, never mixed.
- Source records normalized from `work_items_and_rates_FULL_v0.2.csv` under the previously verified private Drive extraction folder ID `1m4yzj5Vsz2SHlI2_VJIDtbB4ddHe6N52`.
- Each publicly displayed description keeps source wording with whitespace-only normalization. Unit labels normalized (Cum→m³, Sqm→m², Rm/R Mtr→running m). Values retain two decimal digit display precision without changing the source stored values.
- Data in `data/historical-work-rates-v0.5.3.json` is a static, **user-authorized public-safe projection**; no client name, original project title, invoice, amount, quantity or confidential source Drive link.
- `id`, `source_sheet`, `source_rate_cell`, `source_description_cell` preserved in payload for rate provenance and QA; the visible page has only three columns.

## Safeguards

- All 204 records are `UNVERIFIED_HISTORICAL_PROJECT_ESTIMATE`, not canonical current Kaski/DUDBC prices, procurement quotes, CAD-measured quantities or approved rates.
- Source workbook project identity conflict remains unresolved. Website must **not** assign these rates to Narayani, Pushpa, or any company.
- Do not write observations to AEC Rate Master/Neon without source/date/identity/scope review.
- Do not fill BOQ here; CAD repository remains measurement authority.
- `finance.html`, `finance.js`, `finance-summary.json`, `system-map.html` and branch history untouched except additive navigation links in HTML.
- `index.html` retains source-rate and calculation controls; new Rate Library is an actual separate subpage.
- Search/filter/pagination work fully offline apart from fetching the static JSON from the same origin. UI uses `textContent` instead of interpolating user-source descriptions into HTML.

## Verification

1. Exact 204 records, 102 each from visible and hidden versions.
2. Three table column headings as specified.
3. All descriptions, rates and units nonempty and numeric where appropriate.
4. No personally identifying source labels included in the public projection.
5. App source compiled and GitHub Pages deployment succeeds.
6. Source workbook and machine readable private extraction remain unchanged.
