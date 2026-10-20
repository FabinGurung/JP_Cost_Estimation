# JP Cost Estimation — Three-Department Site Map and Page Controls v0.8

Updated: 2026-10-20. Machine-readable map: `site-page-registry.v0.8.json`.

## Site structure

**L0 is the whole website. L1 has exactly three departments:** Rates (`RT`), Finance (`FN`) and Memory Posters (`MP`). Home and System Map are utility pages, **not** departments. The More dropdown is a navigation group, **not** a fourth department.

```text
JP — WHOLE WEBSITE [L0]
│
├── RT — RATES [L1] — primary navigation
│   └── RT-01 rate-sources.html
│       ├── RT-02 rate-library.html
│       │   ├── RT-03 rate-comparison.html
│       │   ├── RT-05 rate-specifications.html
│       │   ├── RT-18 mep.html [redirect]
│       │   ├── RT-19 mep-electrical.html [redirect]
│       │   ├── RT-20 mep-mechanical.html [redirect]
│       │   └── RT-21 mep-plumbing.html [redirect]
│       ├── RT-04 known-rates.html
│       ├── RT-06 government-rates.html
│       │   └── RT-07 kaski-district-rates.html
│       ├── RT-08 vendor-price-lists.html
│       │   ├── RT-09 electrical-wire-quotation.html
│       │   └── RT-10 pipes-price-list.html
│       └── RT-11 rate-analysis-references.html
│           ├── RT-12 users-rate-analysis.html
│           ├── RT-13 dudbc-rate-analysis.html
│           └── RT-14 contractor-rate-analysis.html
│               ├── RT-15 contractor-road-work-summary.html
│               ├── RT-16 contractor-road-work-analysis.html
│               └── RT-17 contractor-extracted-evidence.html
│
├── FN — FINANCE [L1] — primary navigation
│   └── FN-01 finance.html
│       ├── FN-02 finance-dashboard.html [More shortcut]
│       └── FN-03 field-expense-guide.html [More shortcut]
│
├── MP — MEMORY POSTERS [L1] — primary navigation
│   └── MP-01 memory-posters.html
│
└── UTILITY PAGES — not departments
    ├── OV-01 index.html [Home; logo and More]
    └── SY-01 system-map.html [More]
```

The **More** menu contains shortcuts to Home (`OV-01`), Payment Dashboard (`FN-02`), Field Expense Guide (`FN-03`) and System Map (`SY-01`). It does not change the parent department of Finance pages. All 27 HTML routes remain intact; the four older MEP routes still forward to the rate library.

## Prompt addressing

| Level | Meaning | Example |
| --- | --- | --- |
| L0 | Entire website | `JP` |
| L1 | Department (only RT/FN/MP) | `FN` |
| L2 | Page | `FN-02` |
| L3 | Section | `FN-02.S07` |
| L4 | Widget inside a section | `FN-02.S07.W01` |
| L5 | Data source | `DATA-FN-PAYMENTS` |
| OPS | Workflow or release | `OPS-DEPLOY` |

L3 references are assigned only where a stable DOM ID already exists. L4 codes are logical prompt references until a widget ID is explicitly registered.

## Registered section IDs

- **OV-01**: `OV-01.S01` = `#rateLibraryPanel` (Rate Library); `OV-01.S02` = `#rateAnalysisPanel` (Rate Analysis); `OV-01.S03` = `#rateSourcesPanel` (Source and provenance)
- **RT-01**: `RT-01.S01` = `#sourceLibraryCards` (Four rate collections)
- **RT-02**: `RT-02.S01` = `#stageRibbon` (Construction stages); `RT-02.S02` = `#mepStageDetails` (MEP stage); `RT-02.S03` = `#rateTable` (Rate table)
- **RT-03**: `RT-03.S01` = `#comparisonTable` (Rate comparison table)
- **RT-04**: `RT-04.S01` = `#knownRatesView` (Known rate lookup)
- **RT-05**: `RT-05.S01` = `#specContent` (Work specifications)
- **FN-01**: `FN-01.S01` = `#financeContent` (Company finance records)
- **FN-02**: `FN-02.S01` = `#vendor-ranking` (Vendor ranking); `FN-02.S02` = `#vendor-share` (Vendor share); `FN-02.S03` = `#date-activity` (Payment dates); `FN-02.S04` = `#qr-chart` (QR by vendor); `FN-02.S05` = `#discount-chart` (Discount by vendor); `FN-02.S06` = `#vendor-table` (Vendor table); `FN-02.S07` = `#payment-table` (Payment table); `FN-02.S08` = `#source-status` (Source status)
- **FN-03**: `FN-03.S01` = `#start` (Start); `FN-03.S02` = `#fields` (Entry fields); `FN-03.S03` = `#example` (Example); `FN-03.S04` = `#receipt` (Receipt); `FN-03.S05` = `#questions` (Questions)
- **MP-01**: `MP-01.S01` = `#poster-board` (Poster board); `MP-01.S02` = `#poster-filters` (Category filters); `MP-01.S03` = `#poster-search` (Poster search)
- **SY-01**: `SY-01.S01` = `#branch-table` (Branch table)

## Single publishing branch

```text
feature/* (many independent work branches)
    → PR and required checks
    → research/open-estimation-engine-v0.1 (single website publishing branch)
    → .github/workflows/deploy-research-pages.yml
    → verify → upload → GitHub Pages
```

`main` remains the GitHub repository default and preserves existing historical records. It is **not required for routine website deployment** once the research-branch workflow is proven. The previous `main` workflow is retained as a manual fallback rather than deleted. The new workflow runs on research pushes and deploys the exact validated branch commit, so there is no need for a separate main deployment marker each time.

## Milestone

`v0.8.0` is an annotated Git tag and published testing-period GitHub prerelease. It points to frozen deployed source `4c9928ed02d0c8a193df4e0e4f0d273994b192d3`, before this navigation and deployment simplification. Release: https://github.com/FabinGurung/JP_Cost_Estimation/releases/tag/v0.8.0

## Add, hide, retire, remove or restore

- **Install:** Create a feature branch; add the new HTML route and required assets; register its L2 ID and L3 anchors; connect the existing shared theme; add to primary navigation only if it is a new L1 department, otherwise link within its parent page or More; validate and merge.
- **Hide from menu:** Remove only navigation links. The URL remains public and source data stays intact. Hiding is not privacy.
- **Disable section:** Target a registered L3 ID; preserve its source data and other sections.
- **Retire:** Preserve the URL as a redirect and update incoming links; mark registry status `redirect`.
- **Remove:** Only after the user approves a concrete file-by-file proposal, link review and rollback reference. Do not delete the underlying financial or rate records when removing a page.
- **Restore:** Recover the desired files from a verified commit or `v0.8.0` tag, rerun checks and merge to the publishing branch.

**No existing HTML routes, themes, rate data or finance data were removed in this navigation change.** Existing theme colors and visual treatment are preserved; only the shared navigation sizing, three-primary structure and More dropdown are adjusted.

## Examples

`TARGET=FN-02.S07; ACTION=improve; CHANGE=add payment filters; KEEP=source totals and other sections; RELEASE=PR then publish`

`TARGET=RT-19; ACTION=keep redirect; DESTINATION=RT-02 MEP electrical; KEEP=legacy URL`

`TARGET=SY-01; ACTION=keep under More; KEEP=page URL; NO DELETION`

`TARGET=OPS-DEPLOY; ACTION=verify research push deployment; KEEP=main fallback until proven`
