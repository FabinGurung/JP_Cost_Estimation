# JP Cost & Rate Intelligence — Milestone M01
## Rate Library, Construction Journey & Inline MEP · v0.5.12

**Release classification:** Functional **pre-release** milestone (not certified rates or production-approved estimating software).  
**Scope freeze:** 2026-10-11 (Nepal local date).  
**Source commit:** [`726d60538b390e2a944f87d3a389be4bf30e93c8`](https://github.com/FabinGurung/JP_Cost_Estimation/commit/726d60538b390e2a944f87d3a389be4bf30e93c8)  
**Website:** https://fabingurung.github.io/JP_Cost_Estimation/  
**Rate Library:** https://fabingurung.github.io/JP_Cost_Estimation/rate-library.html  
**MEP stage:** https://fabingurung.github.io/JP_Cost_Estimation/rate-library.html?stage=mep

### What this milestone freezes

- A human-readable **Description of Work | Unit | Rate (NPR)** catalog; concise, emoji-supported item labels with an original-description drilldown.
- An illustrative, filterable construction sequence from **site preparation / excavation → soling → PCC → reinforcement / formwork → RCC → masonry / openings → MEP → finishes**. It is navigation, not a project-specific construction schedule.
- **MEP is a child of the Rate Library**. Mechanical, Electrical and Plumbing are **in-page switches**, never separate user-facing workspaces; clicking a trade filters the existing rate table without leaving the page. Stable deep links: `?stage=mep&trade=mechanical`, `?stage=mep&trade=electrical`, `?stage=mep&trade=plumbing`.
- The selected MEP work-item groups contain **3 Mechanical, 37 Electrical and 22 Plumbing/Sanitary entries per Excel worksheet set** (62 distinct MEP entries per set). Exhaust fan appears under Mechanical for navigation but retains its original Electrical worksheet identity.
- Search uses both concise names and full source text, including `cut piece` → `CUTPIECE` normalization; mobile column wrapping/legible prices, sorting, pagination, category filters and SI/Imperial converted rate-per-unit display.
- A separate Work Specifications detail page shows **exact source wording and Excel provenance**, distinct from **educational** workmanship/quality prompts. SI/Imperial display is mathematically derived from original **NPR**, without currency exchange.
- Existing standalone `mep.html` and trade URLs redirect to the equivalent in-page views; source IDs and older Git branches remain retrievable.
- Existing Rate Analysis and Rohini Finance remain separate and preserved.

### How the project reached this milestone

| Development checkpoint | Capability or correction |
|---|---|
| v0.5.1–v0.5.3 | Sunlit valley Rate Portal and extracted three-column workbook price index |
| v0.5.4 | Short titles and complete original-work-description pages |
| v0.5.5 | Editorial work taxonomy and visible/hidden worksheet rate comparison |
| v0.5.6 | Improved rate alignment, normalized searching and SI/Imperial calculations |
| v0.5.7–v0.5.8 | Emoji construction journey, quality-guidance separation and truthful Excel worksheet terminology |
| v0.5.9–v0.5.10 | MEP grouping, deep-link context and automated regression coverage |
| v0.5.11 | MEP relocated under Rate Library construction journey |
| **v0.5.12 — M01** | **Mechanical, Electrical and Plumbing switch in the same Rate Library table; old routes redirect** |

Earlier version numbers are descriptive development checkpoints, **not fabricated prior GitHub Releases**.

### Provenance and limitations

- **204** unchanged historical estimate-rate observations: **102 visible-worksheet** + **102 hidden-worksheet** alternatives, housed in the *same Excel workbook*; their revision chronology is unknown. The alternative sets differ on four item rates.
- **Source year, region and approval status are unverified**. These are *not* government schedules, current supplier quotations, contractual/approved rates, or measured CAD/FID quantities.
- The source Excel workbook and financial authorities reside separately; the website only projects a public-safe derived subset. Public source records do not assert client identity or expose bill quantities.
- No migration or mutation of master rates, Rohini financial records, CAD geometry/quantity takeoff, blocked BOQ readiness, source PKs, or source prices was part of the release.
- **Outstanding:** real tablet/mobile visual acceptance, rate-source verification, engineering approval, live financial synchronization, BOQ/QTO population, and production-hardening.

### Evidence and rollback

- **Estimation CI:** [successful run 38093014816](https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/38093014816).
- **Research Preview QA:** [successful run 38093014818](https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/38093014818).
- **GitHub Pages deployment:** [successful run 38093060021](https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/38093060021). Deployment ran from main but checked out the pinned research-source branch at the source commit above.
- **Regression:** `scripts/qa_mep_site_v0.5.10.mjs` on the pinned source.
- **PRE rollback:** `snapshot/pre-inline-mep-tabs-v0.5.12-20261011` (prior candidate).
- **POST rollback:** `snapshot/post-inline-mep-tabs-v0.5.12-20261011` (this frozen source).
- **Tag:** `v0.5.12`, an annotated Git tag **pointing to the source commit, not the later release-metadata or Pages trigger commits**. The GitHub Release is a **pre-release**, not a certified engineering release.

This is a **milestone freeze**. Future modifications require a new version and another audited release rather than changing this tag.
