# KKG finance — controlled Add Vendor / Add Payment pilot v0.6.0 (2026-10-12)

**Status:** TEST-ONLY PROTOTYPE; installation and end-to-end Apps Script trigger behavior NOT yet verified. No production rollout or migration is authorized.

## Verified authority (12 Oct 2026)
- Company: Rohini Engineering and Builders Pvt Ltd; project: 14_bishal_paija.
- Google Sheet 14_bishal_paija: 27 vendor sections, 74 payment rows, 74 unique transaction IDs, zero duplicate transaction IDs.
- Detail and summary reconcile to NPR 268,798 amount, NPR 160 QR, NPR 2,400 recorded discounts.
- Live Chauthe/Thapasthali ID correction, vendor native table, audit log and guide left untouched.
- Public finance snapshot is static as of 2026-10-12, not an automatic private Google Sheet feed.
- Existing v1.1 Apps Script documentation says installation pending. Presence of onEdit-shaped rows in the audit log does NOT prove an installable trigger is currently active. Its actual project/trigger permissions remain unverified.

## What was created
A restricted private **copy** of the working Sheet. Its legacy worksheet and historical archive are preserved.
Six new tabs in the copy only:

| Tab | Function |
|---|---|
| `00_V2_ENTRY_TEST` | Test-only form with B6 Add Vendor and B18 Add Payment action cells |
| `_KKG_V2_CONTROL` | Exact bound spreadsheet ID, TEST_ONLY / REB / 14_bishal_paija guards |
| `_KKG_V2_VENDORS` | Stable vendor IDs, native Google Sheets table |
| `_KKG_V2_PAYMENTS` | Append-only test ledger, native Google Sheets table |
| `_KKG_V2_AUDIT` | Test events, native Google Sheets table |
| `KKG_V2_SUMMARY_TEST` | Formula-derived, independent test totals and live baseline reference |

A **synthetic fixture** was written through Google Sheets API, not through Apps Script:
- test vendor ID `KKG-V-0028` (`TEST_ONLY__Sample_vendor_NOT_REAL`);
- transaction ID `KKG-TX-TEST-20261012-0001`;
- 2026-10-12 test payment NPR 100, QR NPR 5, discount NPR 0;
- two explicit test audit events.

Read-back in the private copy: **1 test vendor / 1 test payment / NPR 100 / NPR 5 QR / zero discount**, with derived summary agreement. The copy's untouched legacy summary still reports NPR 268,798 and NPR 160 QR. **Neither amount is merged with the other.**

This proves the test sheet layout, separate source isolation, native table creation and formula reconciliation. It **does not** yet prove the Apps Script runs successfully on a human edit.

## Install script in COPY ONLY (not live)
1. Open the **private test copy**, shared separately. Confirm `_KKG_V2_CONTROL` B2 is `TEST_ONLY`, B5 matches the current copied workbook ID, B9 is `TRUE`, B10 is `TEST_COPY_NO_PRODUCTION_WRITES`.
2. Open **Extensions → Apps Script**, paste `scripts/kkg_v2_entry_test_v0.6.0.js` into a bound `Code.gs`. **Do not replace a working production onEdit handler in the original workbook.**
3. In Apps Script **Services**, enable the **Google Sheets API** advanced service, granting the required permissions for native table range updates.
4. Run `kkgV2InstallTestTrigger` manually from the Apps Script editor once; authorize the trigger. This installs `kkgV2OnEdit` for the test copy only. It does NOT create or activate an Apps Script project from GitHub automatically.
5. On `00_V2_ENTRY_TEST`, enter a NEW synthetic vendor name in B4, then choose `ADD_VENDOR` at B6. The status in B20 must confirm a new ID, and B9 will show the new vendor ID.
6. Fill B9:B17: vendor ID, AD date `YYYY-MM-DD`, paid time `HH:MM` (24-hour), amount, QR (optional), discount (optional), method, description and evidence reference. Choose `ADD_PAYMENT` in B18. The status in B20 must show SUCCESS.
7. Use `KKG TEST Payment Tools → Check test reconciliation` (desktop Sheets), or inspect `KKG_V2_SUMMARY_TEST` plus the audit and ledger tabs. Check IDs, row counts, totals and Table metadata. Verify no one edited the legacy register. Mobile edit-trigger behavior requires a real device test before acceptance.

**Never use the exact seeded test vendor name as a new submission.** Duplicate names are explicitly rejected, including names already in the original copied 27-vendor summary.

## Safety boundaries
- `_KKG_V2_CONTROL` identifies an exact copied spreadsheet and requires TEST_ONLY. This controller **cannot write to the original** without deliberate code and authorization changes.
- No live payment records are copied into the test normalized transaction table. This is a new isolated ledger, not migration.
- All payment IDs are immutable UUID-derived IDs; existing IDs are screened within the test table. Vendor numbers start after the highest original + test vendor number.
- Numeric amounts, QR and discounts remain separate. No netting policy is inferred.
- The script uses document locks for simultaneous edits and explicit errors, but multiple Apps Script/Sheets API calls **are not atomic transactions**. A failure after a partial append must be reconciled from the audit and ledger before retry. Never blindly rerun a partial write.
- The test code deliberately does not implement any LIVE mode. Do not copy it into production as a substitute for an approved rollout.
- No credentials, transactions, payment evidence or copy access URL are stored in the public code branch.
- Existing rate PDFs, rate library, CAD quantities, frozen M01 tag, original finance workbooks and snapshot branches untouched.

## QA and next gate
- Offline synthetic regression: `node --check scripts/kkg_v2_entry_test_v0.6.0.js && node scripts/qa_kkg_v2_entry_v0.6.0.mjs`
- Existing public snapshot regression: `node scripts/qa_kkg_finance_snapshot_v1.2.mjs`
- Dedicated GitHub test workflow on the isolated branch, NOT a Pages deployment.
- Next gate: live human-edit trial in the private copy, including duplicate submission, bad dates/amounts, missing vendor, two concurrent submissions, accurate source/audit read-back and test native table expansion.
- After pilot acceptance: design legacy-compatible write path or explicitly approved parallel-ledger cutover; no implicit production migration.
- Future website refresh: private authenticated read-only exporter -> unique-ID/count/sum QA -> approved public-safe dated JSON -> Actions promotion, keeping last valid snapshot on failed QA. No private Sheets credentials in GitHub Pages.

## Rollback
The live workbook, archived original, pre-repair backup, frozen historical branches and public website are unchanged by this pilot. To abandon the pilot, leave the branch unmerged and stop using the separate test copy. Do not delete originals.
