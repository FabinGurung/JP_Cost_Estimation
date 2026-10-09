# Repository topology and branch policy — 2026-10-09

**Repository:** `FabinGurung/JP_Cost_Estimation` (GitHub provider ID `1312661427`); old name `jp-building-cost-estimator` redirects here.

## What the sites are

- `main`: original v0.1 homeowner/demo estimator, A7 module manifest and GitHub Pages workflow owner.
- `research/open-estimation-engine-v0.1`: v0.2.0-alpha workbench, Rate Library, read-only CR-02 Vercel API, Known Rates, draft PR #1.
- GitHub Pages workflow on `main` explicitly checks out the research branch; Pages is static and cannot execute Vercel serverless `/api/cr02-rates`.
- Vercel Production historically tracked `main`; Vercel Preview tracked the research branch. Vercel provider returned 403 during this audit, so current deployment/runtime health is not independently certified here.
- Known Rates is a separate static `KR-*` lookup: `KR-0001` stone cladding NPR 2,300/m², including labour, materials, equipment but excluding electricity and water. Unspecified date/location/tax/transport remain unspecified.

## Authority graph

```text
A7 registry (REPO-000008 / MOD-COST-001 / OWN-MOD-COST-001)
  -> GitHub repository (code/version control)
A9 Drive control -> immutable sources -> canonical Rate Master
  -> governed bounded mirror -> Neon jp_estimation.cr02
  -> SELECT-only Vercel GET /api/cr02-rates -> read-only rate UI

Legacy demo seed -> benchmark quantity/BOQ calculations (separate)
KR-* human reference -> Known Rates subpage (separate)
```

A7 metadata routes repository/module ownership; it does not own rate facts. A9 Drive owns canonical source, control and lineage. Neon is a normalized mirror, and public webpages are presentation/calculation layers.

**A9 artifact edges are not database foreign keys.** For example:
- `EDGE-AEC-CR02-002`: `ART-AEC-COSTRATE-MASTER-001` REFERENCES `ART-AEC-COSTRATE-CONTROL-001`.
- `EDGE-AEC-CR02-004`: `ART-AEC-SRC0005-PAGEMAP-001` DERIVED_FROM immutable `ART-AEC-SRC0005-001`.
- `EDGE-AEC-CR02-025`: Seq9 POST DERIVED_FROM Seq9 PRE; `...026`: Seq9 POST REFERENCES Rate Master.
- `EDGE-AEC-CR02-028`: Seq10A POST DERIVED_FROM Seq10A PRE; `...029`: Seq10A POST REFERENCES Rate Master.

**Domain rate links:** `SRC-0005` is the Kaski source, `RO-*` are dated observations, `MAT-*` materials, `LOC-*` locations, `RA-*` analyses and `RAC-*` component rows. `RO-1508` links M20 ready mix to `MAT-RMC-M20`, `LOC-0002`, `SRC-0005`, NPR 12,500/m³. No exact `RO-*` is proven for `MAT-GETTI-10-16`; wider 4.75–25 mm rate `RO-1486` must not be substituted automatically.

## Original six branch names and 2026-10-09 treatment

| Original | Decision |
| --- | --- |
| `main` | Keep active: baseline and Pages workflow |
| `research/open-estimation-engine-v0.1` | Keep active: PR #1, A7 and Pages depend on it |
| `feature/a7-seq-000007-module-manifest` | Alias `Archive_feature/a7-seq-000007-module-manifest` |
| `snapshot/pre-a7-seq-000007-module-manifest` | Alias `Archive_snapshot/pre-a7-seq-000007-module-manifest` |
| `snapshot/post-a7-seq-000007-module-manifest` | Alias `Archive_snapshot/post-a7-seq-000007-module-manifest` |
| `snapshot/pre-pages-policy-research-20261005` | Alias `Archive_snapshot/pre-pages-policy-research-20261005` |

Archive aliases are **identical commit refs** (ahead/behind 0). This is **not a true rename**: old refs are preserved for audit since the connector cannot perform a branch rename. PRE snapshot refs `Archive_PRE_20261009_main_readme_refresh` and `Archive_PRE_20261009_research_estimator_docs_refresh` preserve the code before this documentation change.

Milestone ref: `milestone/CR02-SEQ10A-readonly-rate-library-v0.2.0-alpha` is for a frozen research milestone after documentation validation. PR #1 is not merged.

## Confirmed rate-data state and remaining work

Neon production (2026-10-09 read): **1 source / 10 materials / 9 observations**. The canonical Drive source last counted **973 SRC-0005 observations**, so **964 remain outside the bounded mirror**. Rate-analysis slice: 2 headers/5 components. Demo BOQ inputs are not canonical pricing. Next: Seq10B M15/M25 additions (M20 preserved); source-family ingestion; rate resolver; DUDBC recipes; QTO/BIM; Primavera; procurement/actuals; release QA.

Never put private Drive IDs, project finance or connection credentials in this public repository. Full protected A9 lineage remains in Local/Main Drive catalogs.
