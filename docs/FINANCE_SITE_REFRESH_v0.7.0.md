# JP Finance — Website Refresh Playbook v0.7.0

## Purpose

Keep one editable Google Sheet as the payment authority and a static GitHub Pages website as the readable presentation. The workflow is **manual on request**. No Apps Script installation, background synchronization or new payment-entry software is required for this release.

**Refresh request:** “Refresh the JP finance website from the current Google Sheet.”

## Read-first context

1. Read `00_SITE_CONTEXT` in the canonical [Google Sheet](https://docs.google.com/spreadsheets/d/1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE/edit).
2. Read `finance-context.json` from this repository.
3. Inspect the current published files on `research/open-estimation-engine-v0.1` and the main-owned Pages workflow.
4. Re-read the live source; do not rely on previously published totals.

## Source and structure

- Company: Rohini Engineering and Builders Pvt. Ltd. (`REB`)
- Project: `14_bishal_paija`
- Register: Krishna Kumar Gupta — Payment to Project
- Vendor summary: `14_bishal_paija!A6:E...`, ending at the actual Total row
- Detailed payments: all vendor sections below the summary, each with a vendor heading, Date/Amount/Paid Time/QR/Discount header, payment rows and Total row
- Secondary control: `KKG_VENDOR_SUMMARY_AUTO`
- Other companies, archived records and test workbooks are never combined into these totals

Read enough rows to locate **every** active section, including new vendors beyond historical row 190. Preserve the exact displayed source dates and paid times. Gregorian and Nepali BS dates must remain separate until a verified conversion is available.

## Reconciliation before publication

- Every active vendor section maps to exactly one sequential vendor ID and summary line.
- Every payment has a nonempty unique internal entry ID; verify uniqueness without publishing those IDs.
- Each vendor's payment amounts and QR values equal that section's Total row.
- Each vendor's payment amounts, QR figures and discounts equal the source vendor summary.
- All vendor and payment totals equal the source grand total for Amount and QR.
- The discount aggregate comes from populated cells; a blank means not recorded, not a recorded zero.
- Do not subtract QR or discounts from recorded Amount.
- If a check fails, stop and report the exact discrepancy. Do not publish partial or guessed values.

At the 2026-10-20 source read, 27 vendors and 74 payment entries reconciled to NPR 268,798 Amount, NPR 160 QR and NPR 2,400 recorded discounts. These are **reference values**, not fixed expectations for the next refresh.

## Public snapshot

Update `finance-public-snapshot.json` with the current verified data. Keep the same stable schema and preserve explicit `null` values for unrecorded QR and discounts. Publish only company, project, vendor name, source date, date system, paid time, amount, QR, discount and aggregate figures.

Never publish internal entry IDs, edit timestamps, hidden system tabs, account details, personal contact information or private test entries. Do not copy the original workbook into the repository.

The existing `finance.html` company page and `finance-dashboard.html` detail page both read the same public snapshot. The earlier `finance-summary.json` is retained for historical compatibility, not as a second active source.

## Fixed website views

| No. | View | Source and interpretation |
| --- | --- | --- |
| 01 | Vendor amount ranking | Descending horizontal bars of recorded Amount |
| 02 | Vendor share | Top vendors and Other as percentages of the same Amount total |
| 03 | Payment date activity | Recorded amount and entry count by exact source date, with separate AD and BS controls |
| 04 | QR by vendor | Positive recorded QR figures; not a payment-method breakdown |
| 05 | Discount by vendor | Recorded discounts; no inferred net amount |
| 06 | Vendor table | Searchable vendor names, count, Amount, share, QR and discount |
| 07 | Payment table | Searchable vendor, date, paid time, Amount, QR and discount |
| 08 | Source status | Verified date, source link, count and reconciliation status |

Use a calm green, mobile-friendly visual style, accessible labels, responsive tables and no invented values. The public-facing interface must avoid the user's prohibited terminology.

## Refresh and release procedure

1. Read and reconcile the live Google Sheet.
2. Generate one updated `finance-public-snapshot.json`.
3. Keep `finance-context.json` and `00_SITE_CONTEXT` synchronized when the agreed rules change.
4. Update website code only when the fixed view contract changes or a display defect is found.
5. Create a new review branch from `research/open-estimation-engine-v0.1`, not from the minimal `main` application.
6. Run syntax and reconciliation checks, inspect the changed files, and open a pull request against the research branch.
7. After owner review, merge the verified change to the research branch. The main-owned `.github/workflows/deploy-estimation-product.yml` checks out that research branch for Pages.
8. Run or confirm the main-owned Pages workflow, then verify the actual published site and figures. A successful code commit alone is not proof of publication.

## Preservation and rollback

Keep the original Sheet, formulas, vendor sections, source records and other project workstreams unchanged. Do not install the prepared native vendor feature or test trigger. A previous published research-branch commit provides a Git rollback path; Google Sheet revision history protects its own native content. No cross-company consolidation is authorized by this workflow.
