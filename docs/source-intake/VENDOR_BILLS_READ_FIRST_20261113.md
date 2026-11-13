# Vendor Bills — source intake and normalization gate (post EST-M01)

**Recorded:** 13 November 2026 (NPT)  
**Status:** DISCOVERED / READ-ONLY / SOURCE AUTHORITY NOT ASSIGNED  
**Milestone boundary:** EST-M01 was tagged before this intake. This page is subsequent work, not a retroactive edit to that release.

## Grounded custody discovery
- An original Excel workbook representing project/vendor bills exists under the existing **Finance and Purchasing — Original Records and Evidence / 02 Original Bills and Records** folder, itself already within JP Cost Estimation custody. Preserve the Excel original.
- A legacy native Google Sheets conversion exists in **03 Earlier Imports**. It has 35 source worksheets plus a control manifest and a version-history tab. Its manifest records **CONSUMING_REPOSITORY = UNMAPPED** and **SOURCE_DATA_TABS = REVIEW_REQUIRED**. This conversion is not an approved LIVE Estimation source and should not be treated as another configured authenticated publisher input.
- Other source-candidate Excel workbooks and a Fishtail supplier/procurement prototype exist. No file is to be promoted to primary authority merely by filename, date, or Excel/Sheets format.
- A separate attached Excel workbook from a historical project communication is also present; it may be related data, but does not supersede the original source.
- Existing vendor-bill evidence must not be confused with the separate Fabin **payments-to-projects** source. Bills, orders, receipts, expenses and actual disbursements represent distinct fact classes.

## Observed structure (read-only)
- Original Excel: **35 worksheets**. One communication/navigation tab, project-level summary/working tabs, and approximately 30 supplier-labelled tabs; a tab title does not certify the supplier's legal identity.
- Legacy native copy: the same **35 source sheets plus 00_MANIFEST and 01_VERSION_HISTORY** (37 total).
- Supplier tabs contain variable-layout invoice/date rows, sometimes with blank or literal 'NULL' invoice numbers and mixed date forms. Multiple rows bearing an invoice number may represent line items and must not be deduplicated merely by invoice number.
- Project-level summaries and supplier-level summaries may describe the same amounts from different perspectives. Never sum the two views together.
- An apparent cross-view supplier/project amount mismatch was observed during read-only inspection; source evidence and scope must determine whether it reflects a copied, mislabelled, or genuinely distinct set of bills.

## Manual-first next work (no scheduled interval)
1. **Freeze evidence and choose authority:** determine the editable bill register owner/consumer and supplier/project identity mapping. Do not edit source originals, copy them to multiple active registers or invent invoice approvals.
2. **Define normalized bill/line schema:** Bill_ID; Original_Source_ID; Original_Tab; Original_A1_Range; Organization_ID; Project_ID; Supplier_ID; Invoice_No; Invoice_Date_Raw; Date_System; Invoice_Date_Parsed_If_Verified; Bill_Line_ID; Item; Unit; Qty; Unit_Price; Amount_As_Recorded; Tax; Discount; Document_Evidence_ID; Source_Version; Review_Status; Approval_By; Linked_Purchase_Order; Linked_Material_Receipt; Linked_Payment_ID (separate approval).
3. **Manual test sample first:** reconcile one bill's photo/PDF, supplier statement, original workbook row and project membership. Do not hardcode unsupported conversions or treat an invoice as proof of payment.
4. **Controlled PRE/POST version:** once explicitly authorized, create or update ONE owned human working register with reviewed input and immutable original references. Generate public-safe statistics only after reconciliation.
5. **No automatic refresh:** manual prompting or user-invoked Actions only. No cron, watch task or new template/step-test engine is authorized yet.

## Gate and privacy
- Current Estimation V000005 catalogue remains **six** existing Sheets, **four** configured authenticated feeds and **two** reference/template sources. Vendor Bills is **NOT A FIFTH FEED** yet.
- Source folder URLs, original Drive file IDs, invoice-row values, person/vendor transaction data and permission metadata remain restricted to Drive and human review; do not publish them in the public Pages projection.
- This note records data custody and a reproducible path to a later module, **not** verified procurement totals, supplier balances, bill certification, payment authorization or a deployed Vendor Bills page.

## Related
- EST-M01 release: https://github.com/FabinGurung/jp-estimating-and-boq/releases/tag/est-m01-manual-sheet-governance-20261113
- Current Estimation source Memory Wall: memory-posters.html#google-sheets-fetched
- A7 overall source/consumer boundary: https://github.com/FabinGurung/jp-a7-system-registry/pull/108
