# A9 Drive workspace — repository root custody and migration gates (2026-10-30)

**Status:** `NEW_ROOT_VERIFIED / FINANCE_SOURCES_HELD_IN_ORIGINAL_CUSTODY`  
**Scope:** `FabinGurung/JP_Cost_Estimation` only.  
**Storage:** Google Drive, directly under the existing A9 parent as a sibling to `01_JP`.  
**Privacy:** This public file deliberately contains no private Drive file IDs, financial transactions, personnel details, ownership email addresses or provider credentials. The private A9 registrars own that mapping.

## Verified new Drive workspace

An additive Drive folder named `JP_Cost_Estimation` was created in the A9 root and read back with the intended parent and the same A9 root permission set. These eight empty child folders were individually created and their names/IDs were verified by parent listing:

```text
JP_Cost_Estimation/
├── 00_CONTROL_AND_MANIFESTS/
├── 01_SOURCE_ORIGINALS/
├── 02_HUMAN_WORKING_SHEETS/
├── 03_PROJECT_PAYMENT_REGISTERS/
├── 04_COST_RATE_REFERENCES/
├── 05_PUBLICATION_SNAPSHOTS/
├── 90_VERSION_HISTORY/
└── 98_UNADMITTED_SOURCE_POINTERS/
```

Folder creation is **not** source admission. No money, worker or canonical rate file was moved, converted, renamed, deleted, shared or copied during this phase.

## Migration disposition / holds

1. The three finance-/payroll-related intake folders are physically under the existing governed A9 intake root. They include payment workbook copies, historical versions, native conversion outputs and worker workbooks, but **the intake register does not automatically admit them**. Their registered status and exact original-source lineage must be resolved before any parent changes. Do not relocate the entire intake root or unrelated engineering/media/academic items.
2. The working Rohini project payment Google Sheet currently resides in the separate `01_JP` company/personnel authority. The live Sheet has additional reader permissions, including a Pages publisher account. Its stable identity, existing viewers, source-to-publication mapping and owning company access must be preserved. Keep the Sheet in its source parent until a permission-equivalent move is proven and the owning finance registrar records PRE and intended new custody.
3. The canonical AEC Rate Master remains under its AEC Cost/Rate Intelligence authority. Treat the new repository workspace as a reference/navigation layer rather than silently moving a shared canonical rate master.
4. Wage/payroll sources may be cross-company/personnel authority rather than repository-owned. The repository should link to governed sources rather than duplicate financial truth.
5. No source data or public finance figures should change merely because a folder hierarchy was created.

## GitHub Actions / Pages contract

- `research/open-estimation-engine-v0.1` holds the active static research website.
- `.github/workflows/estimation-ci.yml` validates the research application.
- `.github/workflows/deploy-research-pages.yml` publishes the research branch to Pages on push, after its `verify` job.
- The `main` fallback deployment workflow checks out the research branch. Do not overwrite `main`'s legacy estimator.
- The finance page consumes committed date-stamped JSON (including `finance-public-snapshot.json`); this is **not a browser-time Google Sheets sync**. The human-edited Sheet remains the finance authority.
- Historical work rates use source-derived committed JSON. Keep their evidence and validation status separate from approved rate observations, live mirrors and tender BOQ.
- A Drive folder move does not by itself require a code change when stable Sheet IDs and URLs are unchanged. Trigger or claim a new Pages release only if actual deployed source changes.

## Required gated follow-up

Before moving a source: register it in the owning A9 intake/Local registrar; inspect originals, content parity, historical versions, parent permissions and every dependent input; save enumerated PRE; verify the destination's security and ownership; move using Drive `addParents/removeParents` on the existing ID; read back ID, parent, access and file bytes where feasible; append old-to-new parent mapping and rollback notes; save POST; update bounded Main ArtifactRegistry/Edges/LegacyPaths and ACK.

A named `INTAKE_COPY`, a static published snapshot, and a LIVE Google Sheet are **three different artifact classes** and must not be merged by filename.

**Milestone evidence:** The new root and its eight subfolders are verified. Source moves, intake registrar writes, Main/Local ACKs and Pages deployment for this phase are not yet claimed complete. This document is a public-safe repository handoff; it is not the private migration ledger.
