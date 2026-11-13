# Vendor Bills — V000003 controlled evidence-review checkpoint

**Recorded:** 13 November 2026, Asia/Kathmandu  
**Owning repository:** `FabinGurung/jp-estimating-and-boq`  
**Human source authority:** Existing Vendor Bills LIVE Google Sheet, within Cost Estimation — Working Google Sheets. Stable live file ID preserved; owner-governed A7 PRE/POST archives preserved in the dedicated Drive version folder.  
**Control revision:** V000003. **Normalized data revision:** V000001 (unchanged).  
**Public publication mode:** `VERIFIED_SNAPSHOT`, **not** a new authenticated Vendor Bills source read.

## What was completed
- Manual evidence-based review of the two existing Hari Baral supplier-versus-project summary discrepancies. Both remain **OPEN** and must not be auto-reconciled.
- Found one formula/identity conflict where a supplier label on the project side references another supplier's table; no source formula, source amount, vendor assignment or payment status was changed.
- Reviewed twelve source bill rows and supplementary human review/evidence entries; examined two historical receipt attachments, neither substantiating the disputed supplier/project totals.
- Annotated exactly two pre-existing review entries in the same working Sheet; no new review flags.
- A7 controlled whole-workbook PRE and POST created and verified; 46 tabs intact.
- Google Doc finance audit updated with source ranges, restricted amounts, sampled image descriptions, identities, rollback path, and evidence/permission uncertainties. **Those details stay in restricted Google Drive**, not GitHub Pages.

## Aggregate QA — safe to publish

| Measure | V000003 verified value |
| --- | ---: |
| Original source tabs | 35 |
| Total working workbook tabs | 46 |
| Indexed source rows | 1,895 |
| Bill records | 259 |
| Detail rows | 930 |
| Summary comparisons | 46 |
| Open review flags | 509 |
| Financial approvals granted in this checkpoint | 0 |
| Normalized data revision changed | No |

The public `data/vendor-bills-status.v1.json` projection stays the same six-field aggregate contract, with `sourceMode: VERIFIED_SNAPSHOT` and `revision: V000003`. This is a manually read-back-verified snapshot of unchanged counts plus a new source control revision. Never claim it is `MANUAL_AUTHENTICATED_READ` without a successful authenticated workflow.

## Manual authentication and publication gate
- Default operating mode remains manual-first; no cron or unattended import schedule authorized.
- Existing research Pages workflow supports `workflow_dispatch`. The optional `JP_VENDOR_BILLS_SHEET_ID` secret and the Google publisher identity's private Sheet read access must be confirmed independently.
- Previous successful research Pages run published a V000002 verified snapshot; its Vendor Bills manual step was skipped.
- This revision adds an explicit fail-fast gate if an operator selects `require_live_sheets: true` but the Vendor Bills Sheet ID secret is absent. If the ID is present but the publishing identity cannot read the private Sheet, the authenticated importer must fail rather than silently mark the fallback as live.
- The live page may display **Verified snapshot · V000003** after the repository push/Pages deploy, and should display **Manual source read · V000003** only after the separate authenticated workflow succeeds.

## Next evidence gate (not completed)
Verify original supplier invoice identities and project allocation from private source images, supplier statement, project crosswalk, purchase orders, delivery/material receipts and separately approved payments. Do not infer an invoice was paid from a bill or a payment from a supplier balance. Do not edit source amounts or mark review statuses closed without independent, linked evidence.

## Version governance
This documentation is **post-M01**. The immutable `est-m01-manual-sheet-governance-20261113` tag and release remain unchanged. Existing original Excel and all source-view tabs remain under their Drive custodian; they are not duplicated as new editable authority. A7 central wall links to Estimation; this specialist source memory lives in Estimation. The older V000002 normalization document remains as a historical checkpoint.

## Reference pages
- [Vendor Bills Memory Wall](../../memory-posters.html#vendor-bills-intake)
- [Existing six-source import registry](../../data/connected-website-sheets.v1.json)
- [Manual GitHub Pages workflow](../../.github/workflows/deploy-research-pages.yml)
- [Preserved M01 release](https://github.com/FabinGurung/jp-estimating-and-boq/releases/tag/est-m01-manual-sheet-governance-20261113)
