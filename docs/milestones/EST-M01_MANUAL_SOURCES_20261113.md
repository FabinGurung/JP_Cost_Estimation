# Estimation M01 — Manual Google Sheets and Source Governance
**Milestone date:** 13 November 2026 (Asia/Kathmandu)
**Release scope:** First-party Estimation publishing-source baseline and manual-first source governance. This is a **software/source-control milestone**, not an approval of expenditure, measured quantities, BOQs, invoices or payable bills.

## Frozen source and history
- Canonical publishing branch: `research/open-estimation-engine-v0.1`
- Git release tag points to publishing commit `45a6fea641008b1792abf140fea8c193110edf86` (PR #53).
- Default-branch workflow-governance baseline: `0bbd6d90c1260ce07166f4f1a9141a34c653259d` (PR #52).
- A7 central pointer: PR #108 in `FabinGurung/jp-a7-system-registry`.
- PRE/POST snapshot branches from 13 November preserve the prior and updated branch states.

## Delivered
- Estimation-owned Memory Wall `memory-posters.html#google-sheets-fetched`, public-safe data inventory V000005.
- Six controlled working/reference Google Sheets: four authenticated import paths (Amrit rates, Amrit measurements, Krishna Kumar Gupta Finance, Fabin Gurung Finance); two references/template-only sources.
- Read-only fetch-contract map with exact tab names, importer scripts, output artifacts, source role, and approval boundaries; private IDs and raw payment details excluded.
- Two default-branch daily schedule triggers removed; `workflow_dispatch` manual actions preserved. Existing publishing-branch push deploy remains independent of interval-based source refreshes.
- Fabin importer updated to accept the controlled V000004 top-summary revision; original normalized events remain V000001, with no payment approval granted.
- Estimation PR CI successful for the source-map change. A7 validation/browser QA successful for its pointer change.

## Known holds (not release blockers for the source-control baseline)
1. Live GitHub Pages response and a fresh end-to-end authenticated source publication were **not independently certified** at this checkpoint. A successful prior PR CI is not proof of the current deployed website.
2. The Vercel external status reported a build-rate-limit failure; this is independent of GitHub Pages and is **not** represented as a passing Vercel deployment.
3. Basketball/Prithivi overlap: 19 cross-listed Prithivi detail transactions remain awaiting owner allocation and approval.
4. Hari Baral NPR 500 top-summary arithmetic now reconciles after controlled Pabitra Ganesh Suppliers linkage; evidence and payment approvals remain pending.
5. No unattended Google Sheet polling, cadence, new automatic entry system, or fully built step-test template is authorized. Source changes must be manual or explicitly prompted.
6. Broader 34-Sheet cross-repository audit remains deferred and registered under Site Operations issue #36.
7. Vendor Bills / `bill_of_vendor` source inventory, project/vendor allocation and bill-evidence workflow are the next distinct module to assess. Original Excel and legacy native Google Sheet are preserved; do not silently promote historical copies or prototypes into current authority.

## QA and recovery rule
Use original Google Drive files for human truth; GitHub commits for code and public-safe projections; Actions for scoped validators; Pages for read-only presentation. Do not mutate original source data during a milestone tag. Treat the tag as immutable. Future finance/bill work begins a new governed change set with explicit PRE/POST, source lineage and approvals.

## Useful paths
- Estimation Memory Wall: https://fabingurung.github.io/jp-estimating-and-boq/memory-posters.html#google-sheets-fetched
- Estimation source data: https://github.com/FabinGurung/jp-estimating-and-boq/blob/research/open-estimation-engine-v0.1/data/connected-website-sheets.v1.json
- Manual Actions: https://github.com/FabinGurung/jp-estimating-and-boq/actions/workflows/cost-estimation-daily-pages-refresh.yml
- A7 pointer: https://github.com/FabinGurung/jp-a7-system-registry/pull/108
