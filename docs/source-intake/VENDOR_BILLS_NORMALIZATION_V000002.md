# Vendor Bills working register V000002

The Cost Estimation module owns the Vendor Bills working register. Its permanent native Google Sheet ID and original source tabs are preserved in Drive. The restricted audit log records the source inventory, reconciliation findings, whole-workbook PRE and POST copies, and restoration path.

The register has separate bill records, item and delivery details, project and supplier summaries, candidate crosswalks, and a review queue. Multiple source views are retained for comparison. Reviewers should establish invoice and payment evidence before approving amounts or linking them to payments.

GitHub Pages serves a read-back-verified aggregate snapshot. The Pages build checks its schema and renders counts on the Cost Estimation Memory Wall. Private workbook links, names, source amounts, invoice records and review details remain in Drive.

On an operator-invoked deployment, the existing read-only Google identity can refresh those counts if the repository secret `JP_VENDOR_BILLS_SHEET_ID` is configured and the identity has read access to the source. The existing deployment uses the committed verified snapshot whenever the optional secret is absent or the build is triggered by a push. The four established Estimation source contracts remain in the existing source catalogue. Vendor Bills status has its own projection contract. There is no interval-based trigger.

For a new data revision, re-read the existing source, create a numbered PRE archive, update the same Sheet, verify the tab counts and reconciliation, and archive the matching POST copy. The dated intake document describes the historical discovery state.
