# Fishtail Site Engineer Expense Unification — v0.2
Task ID: `FBL-FIELD-EXPENSE-UNIFY-v0.2-20261018`

Corrective release following the original standalone expense tutorial v0.1. **The two new standalone expense workbooks were a redundant design**, created despite existing single-engineer attendance workbooks. Both had zero expenses at read-back and were explicitly marked **ARCHIVE__SUPERSEDED_NO_ENTRY**. Original attendance file IDs remain fixed and retain every previous tab/data record. The new Expenses, Expense Summary, and protected hidden relations were added to those exact existing file IDs, with PRE readback copies made before writes.

## Private Drive holds original identifiers
Owner-only file references, PRE copies, archived old v0.1 files, direct recipient emails, and provider message IDs are recorded in updated site-engineer READ_FIRST docs and the restricted delivery control log. Do not put private file IDs, employee emails, or photo links in this public repository.
- Existing README READ_FIRST for Shiv renamed *in place* from v1.16 to v1.17; same Drive doc ID.
- Existing README READ_FIRST for Paras renamed *in place* from v1.7 to v1.8; same Drive doc ID.
- Employee input tabs are **Attendance** and **Expenses**. Calendar, Summary, and Expense Summary remain derived/review interfaces; no need for a second expense calendar.
- Expense IDs reserved for 300 rows, source row retained with generated backward link, person/org/project FKs, supplier and evidence FKs when available. No made-up transactions.
- Audit timestamps and truly immutable event logging are NOT installed; do not claim full transactional 6NF enforcement from formulas alone.

## Archive access caveat
The old standalone expense tabs are locked with owner-only Google Sheets sheet protection and files are renamed ARCHIVE__SUPERSEDED_NO_ENTRY. File-level employee **WRITER sharing may still remain**, because the available Drive connector cannot revoke existing permissions; editor-to-reader attempts did not change the read-back roles. Owner must remove employee permission using Drive **Share > Manage access > Remove access**. Do not assert that mere archive/rename revoked visibility.

## GitHub release routing
- This branch is based on source SHA `1349835d44b0f54d6ee164a22b65a00c391e453e`.
- Publish only `field-expense-guide.html` v0.2 plus this manifest/docs in a PR targeting `research/open-estimation-engine-v0.1`.
- Main owns a separate deployment-trigger commit and deploys **research**. Do not merge all source into main.
- Version `v0.1` remains in commit history; don't overwrite previous frozen PR #4 or its source commit.
- Trigger/send corrected emails and private Slack DMs only after live release is verified. Corrected messages must explicitly supersede previous standalone links and contain each person's *original attendance workbook link only*.
- Keep recipient/channel dedupe receipts owner-only and append to previous delivery log.

## Exclusions
No modifications to historical attendance, calendar, cement, shared materials, Rohini finance, Krishna Kumar Gupta or PDF-rate extraction. No personal financial data on GitHub Pages. No deleted original records.
