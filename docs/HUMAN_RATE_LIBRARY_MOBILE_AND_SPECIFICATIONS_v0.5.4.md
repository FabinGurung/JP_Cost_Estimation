# Human-readable Rate Library — mobile repair and specifications drilldown v0.5.4

Date: 2026-10-10.

## User-facing experience

1. The primary `/rate-library.html` lists only **Description of Work | Unit | Rate (NPR)**, with 204 records split 102 visible and 102 hidden versions (not mixed).
2. Long source descriptions are replaced in this view by 102 reviewed, human-friendly short work-item labels; 204 item-to-label IDs preserve every workbook version, with a separate JSON sidecar. The original full text remains unchanged in the v0.5.3 data snapshot.
3. Every label links to `/rate-specifications.html?id=<record-id>`, showing full original technical wording, section, unit, source rate, workbook sheet and cell locators, record ID, reference disclaimer and next/previous work-item navigation.
4. Fix mobile text collisions: the shared stylesheet's `th,td{white-space:nowrap}` was causing source descriptions to overlap the Unit/Rate columns. The scoped CSS now overrides the inherited nowrap on descriptions, uses an explicit fixed 3-column layout, and provides compact 320px–720px typography. Labels wrap normally; unit and rates remain aligned.
5. Search matches both editorial short labels and original full descriptions. Category, source version, sort and 25-row pagination remain available.
6. Preserve sunlit open-green-valley theme, optional dark-mode styling, keyboard focus, accessible links.

## Source and governance

- Original XLSX is preserved on Google Drive. Its project identity is conflicted; no client names or project quantities are displayed.
- Canonical estimate raw data remains `data/historical-work-rates-v0.5.3.json`, byte-unchanged; no rate values, units, IDs, or source references have been altered.
- Short-title sidecar is `data/work-rate-labels-v0.5.4.json`. Titles are editorial navigation aids **not** substitutes for governing specification and may require engineering review before approval. The detail page displays the recorded text without invented inclusions/exclusions.
- No new canonical Rate Master data is inserted. No Neon migrations, CAD quantity takeoff, BOQ population, financial register changes or document deletions.
- Previous v0.5.3 website recoverable from PRE Git snapshot; POST snapshot preserves the release.

## QA gates

- 204 records mapped 1:1 to labels, 102 per revision, with no missing mapping.
- All links are deterministic and encode existing IDs; DOM text is rendered with `textContent` (untrusted data cannot inject HTML).
- Chromium local DOM/CSS layout checks at 320, 375, 390, 768, 1280px: no horizontal overflow or row-cell overlaps.
- Search, visible/hidden selector, divisions and sorting operate on 204 records; 25-row pagination retained.
- Live deployment must additionally pass GitHub Actions CI, research preview validator and Pages workflow.
