# MEP review corrections and automated regression — v0.5.10
Release date: 2026-10-10. Scope: website behavior and prevention of regressions; no source-rate verification.

## Corrections
1. **Mechanical ventilation prompts:** the exhaust fan stays Mechanical for navigation, while preserving its original Electrical/Ventilation workbook category and cell provenance. It now receives a general ventilation/airflow/mounting/operation checklist that includes qualified electrical safety inspection, rather than purely generic electrical equipment prompts.
2. **Contextual detail navigation:** hero link and breadcrumb return to the correct trade when navigating from Mechanical, Electrical or Plumbing. Previous/next links respect MEP trade grouping and the selected sort/filter state.
3. **Persistent browse controls:** search query, selected worksheet set, SI/Imperial display, work category and sort order are carried to the detail view and restored on back.
4. **Mixed-unit price ranking caution:** sorting different units by numeric rate cannot establish affordability. An explicit warning now appears when users select numeric-price sorting.
5. **Automated QA:** research CI and preview previously syntax-checked only old estimator files. They now validate MEP modules and run dependency-free scripts/qa_mep_site_v0.5.10.mjs against the exact 204 JSON records, testing 3/37/22 MEP distribution for both worksheet sets, unique PKs, original fan provenance, source links, quality guidance and exact SI/Imperial conversions.

## Unchanged source authority
The original Excel workbook, data/historical-work-rates-v0.5.3.json, curated work labels, editorial source taxonomy, finance and payments, Rate Analysis, CAD/FID-owned quantity takeoff, original source provenance and blocked BOQ remain unchanged. Site values are still unverified archival estimate observations, not approved current market prices.

## Rollback and validation
PRE branch: snapshot/pre-mep-regression-navigation-fixes-v0.5.10-20261010.
POST branch: snapshot/post-mep-regression-navigation-fixes-v0.5.10-20261010.
GitHub Actions must pass before claiming completion. Browser visual QA remains a separate step where direct browsing is unavailable.
