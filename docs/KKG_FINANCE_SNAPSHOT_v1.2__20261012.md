# Krishna Kumar Gupta Finance Snapshot v1.2 — v0.5.16

Date: 2026-10-12. Public website snapshot is derived only from the current `14_bishal_paija` human working Google Sheet; it is not the original source document.

## Verified pre-publication controls
- 27 sequential vendor/purpose IDs, including newly added Thapasthali (ID 27, NPR 790).
- 74 payment transactions with 74 unique transaction IDs; existing Chauthe ID kept, copied Thapasthali ID rekeyed.
- Summary, vendor sections and full individual-payment ledger reconcile to **NPR 268,798**; the QR sum is **NPR 160** and recorded discounts **NPR 2,400**.
- Two identical payment-signature pairs in Ration and tip remain candidate duplicates for owner review; distinct stable IDs mean no payment removed.
- The user's newly entered Amrit NPR 2,000 and Formwork NPR 19,000 and Thapasthali NPR 790 are included. QR +NPR 30 for the three Formwork entries is included.
- Thapasthali native Google Sheets table `KKG_Thapasthali_27`, separate index row and QR/Amount total formula tested.
- The original payment dates, times and numerical amounts were not altered by the controlled Sheet repair.

## Backups, source and scope
Pre-repair Google Sheet snapshot: https://docs.google.com/spreadsheets/d/1VJGzQ_JNSzFZ9B-PU3rnPcwy-eywbtT03I5p2M0cVT8/edit
Working Google Sheet: https://docs.google.com/spreadsheets/d/1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE/edit
The in-workbook `00_ENTRY_GUIDE` explains how to insert into native vendor tables safely; the retained legacy mixed-table layout still requires a controlled Add Vendor operation for any NEW vendor until the planned normalized append-only transaction ledger is introduced.

No other company's finances, CAD/IFC FID takeoff, rate library observations, rate-analysis PDF extraction, BOQ data or immutable M01 tag are modified.
Snapshot is not live synchronization: further human Sheet edits require a new verified static JSON revision or a controlled Actions-generated refresh.

## Technical QA
`finance-summary.json`: ordered source rows, source A6:E34 and separately reconciled amount/QR/discount totals. `finance.js`: variable number of sequential summary rows with duplicate-ID, finite-number, nonnegative-amount and total checks; no hard-coded 26-vendor limit. Data presented using DOM text nodes and the established company ownership segregation.
