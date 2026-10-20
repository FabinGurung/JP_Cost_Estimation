# JP Cost Estimation — Site Hierarchy and Page Controls v0.8

Verified: 2026-10-20. Machine-readable companion: `site-page-registry.v0.8.json`.

## Milestone and deployment

The v0.8.0 shared presentation and Memory Posters milestone was merged to `research/open-estimation-engine-v0.1` at `4c9928ed02d0c8a193df4e0e4f0d273994b192d3` and deployed through the `main` workflow. At this inventory date, the only Git tags were `v0.5.12` and `v0.5.16`, and the latest formal release was `v0.5.16`. v0.8.0 is not yet a Git tag or GitHub Release. The `package.json` version (`0.2.0-alpha`) and old page titles do not indicate the website's deployed milestone.

The source content branch and deployment owner branch are **different**. The workflow `.github/workflows/deploy-estimation-product.yml` exists on `main`, runs on main pushes, checks out the research branch and deploys that checkout to Pages. Changes to the research branch alone do not trigger a public deployment. The research workflows only validate.

## Levels for precise instructions

| Level | Meaning | Example |
| --- | --- | --- |
| L0 | Whole website | `JP` |
| L1 | Department | `FN` Finance, `RT` Rates, `OV` Overview, `MP` Posters, `SY` System |
| L2 | Page (one HTML file) | `FN-02` = `finance-dashboard.html` |
| L3 | Stable section or DOM anchor | `FN-02.S07` = `#payment-table` |
| L4 | Component inside a section | `FN-02.S07.W01` = payment search widget (logical code) |
| L5 | Data source or public snapshot | `DATA-FN-PAYMENTS` = `finance-public-snapshot.json` |
| OPS | Build, validation, deployment | `OPS-DEPLOY` = main-owned Pages workflow |

L3 codes are registered only for stable existing element IDs; other page headings are not yet assigned stable section IDs. L4 is a prompt convention, not a guaranteed DOM element ID. Data files and deployment workflows are not ordinary webpages.

## Full public HTML tree (27 routes, including 4 legacy redirects)

```text
JP / L0
OV-01 index.html [GLOBAL]
  RT-01 rate-sources.html [GLOBAL]
    RT-02 rate-library.html
      RT-03 rate-comparison.html
      RT-05 rate-specifications.html
      RT-18 mep.html [REDIRECT]
      RT-19 mep-electrical.html [REDIRECT]
      RT-20 mep-mechanical.html [REDIRECT]
      RT-21 mep-plumbing.html [REDIRECT]
    RT-04 known-rates.html
    RT-06 government-rates.html
      RT-07 kaski-district-rates.html
    RT-08 vendor-price-lists.html
      RT-09 electrical-wire-quotation.html
      RT-10 pipes-price-list.html
    RT-11 rate-analysis-references.html
      RT-12 users-rate-analysis.html
      RT-13 dudbc-rate-analysis.html
      RT-14 contractor-rate-analysis.html
        RT-15 contractor-road-work-summary.html
        RT-16 contractor-road-work-analysis.html
        RT-17 contractor-extracted-evidence.html
  FN-01 finance.html [GLOBAL]
    FN-02 finance-dashboard.html [GLOBAL]
    FN-03 field-expense-guide.html
  MP-01 memory-posters.html [GLOBAL]
  SY-01 system-map.html [GLOBAL]
```

Status: all regular HTML files are published in the research branch; `RT-18`–`RT-21` are compatibility redirects to the MEP area of `RT-02`. The six global navigation destinations are `OV-01`, `RT-01`, `FN-01`, `FN-02`, `MP-01` and `SY-01`.

## Key sections with stable anchors

- **OV-01 index.html**: `OV-01.S01` → `#rateLibraryPanel` (Rate Library); `OV-01.S02` → `#rateAnalysisPanel` (Rate Analysis); `OV-01.S03` → `#rateSourcesPanel` (Source and provenance)
- **RT-01 rate-sources.html**: `RT-01.S01` → `#sourceLibraryCards` (Four rate collections)
- **RT-02 rate-library.html**: `RT-02.S01` → `#stageRibbon` (Construction stages); `RT-02.S02` → `#mepStageDetails` (MEP stage); `RT-02.S03` → `#rateTable` (Rate table)
- **RT-03 rate-comparison.html**: `RT-03.S01` → `#comparisonTable` (Rate comparison table)
- **RT-04 known-rates.html**: `RT-04.S01` → `#knownRatesView` (Known rate lookup)
- **RT-05 rate-specifications.html**: `RT-05.S01` → `#specContent` (Work specifications)
- **FN-01 finance.html**: `FN-01.S01` → `#financeContent` (Company finance records)
- **FN-02 finance-dashboard.html**: `FN-02.S01` → `#vendor-ranking` (Vendor ranking); `FN-02.S02` → `#vendor-share` (Vendor share); `FN-02.S03` → `#date-activity` (Payment dates); `FN-02.S04` → `#qr-chart` (QR by vendor); `FN-02.S05` → `#discount-chart` (Discount by vendor); `FN-02.S06` → `#vendor-table` (Vendor table); `FN-02.S07` → `#payment-table` (Payment table); `FN-02.S08` → `#source-status` (Source status)
- **FN-03 field-expense-guide.html**: `FN-03.S01` → `#start` (Start); `FN-03.S02` → `#fields` (Entry fields); `FN-03.S03` → `#example` (Example); `FN-03.S04` → `#receipt` (Receipt); `FN-03.S05` → `#questions` (Questions)
- **MP-01 memory-posters.html**: `MP-01.S01` → `#poster-board` (Poster board); `MP-01.S02` → `#poster-filters` (Category filters); `MP-01.S03` → `#poster-search` (Poster search)
- **SY-01 system-map.html**: `SY-01.S01` → `#branch-table` (Branch table)

## Shared components and data ownership

- **Global shell:** `styles.css`, `site-shell.css`, `site-theme-v0.8.css`, `site-navigation-v0.8.js`, `theme.js`. A change to the shared theme or navigation affects all 27 pages. The site presentation check requires shared imports on every HTML page.
- **Rate content:** `rate-source-skeleton.js/css`, `work-rate-library.js/css`, `work-rate-comparison.js`, `work-specifications.js`, `mep-catalog.js`, contractor modules, `data/source_registry.json`, rate observation JSON and extracted document evidence in `data/`. Rate data stays separate from company payments.
- **Finance content:** `finance.html`, `finance.js`, `finance-dashboard.html/js/css`, `finance-public-snapshot.json`, `finance-context.json`, `finance-summary.json` (legacy). The working Google Sheet remains the payment authority. A published snapshot is not a live write-through connection.
- **Posters:** `memory-posters.html/js/css/json`. Posters are public reference notes; they must not expose private source records. A poster link to a retired page must be updated first.
- **System:** `system-map.html` with `branch-map.js`.
- **Infrastructure:** `api/cr02-rates.js` is a serverless endpoint for an appropriate host, **not** a GitHub Pages executable endpoint. `database/` is SQL and reference material, not webpage routes. `docs/`, `scripts/`, `schemas/`, `releases/` and `.github/workflows/` are project support files.

## Safe page operations

1. **Install page:** Add `new-page.html` and its assets on a new branch from the current research branch. Import the shared shell, add a unique L2 page ID to this registry, decide parent and navigation, and update `site-navigation-v0.8.js` if it belongs in global navigation. Update links, tests and supporting data. Open a PR; merge only after checks.
2. **Hide from navigation:** Remove or conditionally hide links in shared and local navigation; leave the HTML and data intact. This is reversible but **not private**: direct URLs still work. If privacy is the goal, stop and plan a separate access-controlled system; GitHub Pages is public.
3. **Retire a page:** Replace the old page with a clear redirect to the successor and mark its registry status `redirect`. Update internal links, posters, documentation and tests. Keep the redirect until old bookmarks are no longer needed.
4. **Remove a page:** Requires explicit approval. Remove links and dependencies first, update the registry and `scripts/validate-site-theme-v0.8.mjs` baseline, verify no poster or legacy route points to it, and only then remove the HTML. Do not delete underlying finance or rate data as part of webpage removal.
5. **Disable a section:** Use its L3 ID to hide or replace only that section in its parent page, preserving its data unless separately authorized. Ensure no controls depend on its element ID.
6. **Restore:** Revert the specific feature PR or restore files from a tagged commit, rerun the checks, then trigger the main-owned Pages deployment. A Git tag is a fixed reference, not an automatic rollback.

### Release sequence

`feature branch → pull request to research branch → CI checks → merge → research preview validation → main deployment marker → Pages Actions success → public browser verification → optional signed/annotated release tag`.

## Prompt examples

- `TARGET=FN-02.S07; ACTION=improve; SCOPE=payment search and filters; KEEP=payment values, other sections, rates; RELEASE=PR first`.
- `TARGET=RT-09; ACTION=hide-from-navigation; KEEP=URL, source data, redirects; RELEASE=PR first`.
- `TARGET=MP-01; ACTION=add-poster; CATEGORY=Finance; SOURCE=approved public rule; RELEASE=PR first`.
- `TARGET=RT-19; ACTION=check-redirect; DESTINATION=RT-02 MEP Electrical; NO SOURCE DELETION`.
- `TARGET=JP; ACTION=prepare-release; VERSION=v0.8.0; REQUIRE=verified source SHA and successful Actions; DO NOT TAG UNTIL APPROVED`.

## Notes

This registry records the actual deployed HTML filenames, logical ownership, public routing and stable anchor IDs. It does not assert that every possible user-facing control has a permanent ID. If a page gains new sections, update its registry entries and validation before using the new IDs in requests.
