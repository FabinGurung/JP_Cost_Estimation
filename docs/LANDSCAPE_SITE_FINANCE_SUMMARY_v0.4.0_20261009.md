# Landscape website & source-derived finance summary — v0.4.0-alpha

**Date:** 2026-10-09 (NPT)  
**Authority:** Rohini project-specific Google Sheets register `14_bishal_paija!A6:E33`.  
**Source link (owner-approved public reference):** https://docs.google.com/spreadsheets/d/1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE/edit

## User decision and release scope

The owner approved an **open-source display of the true Google Sheets summary** and a **direct link to its editable source**, replacing the v0.3 placeholder paste-your-own-link workflow. This does **not** itself change Google Drive sharing permissions and is not permissionless write access. Fishtail and Rohini remain distinct legal/company scopes; a person-specific payment register is not a whole-company ledger.

The new website uses a **sticky horizontal top header** instead of the old fixed left pane. All old estimator view buttons and functions remain in the DOM, plus Known Rates and system navigation. The site uses `assets/green-landscape.svg` to illustrate open green meadows, mountains and trees, and `site-shell.css` to implement a forest palette, natural light-green default and existing optional dark mode across the four site pages.

## Live source → immutable GitHub publication snapshot

| Field | Source A6:E33 | Published snapshot |
|---|---|---|
| Named rows | 26 | 26 |
| Amount (NPR) | 247,008 | 247,008 |
| QR column (NPR) | 130 | 130 |
| Discount (NPR) | No Total-row aggregate | 2,400, sum of populated source cells |

Publication artifact `finance-summary.json` captures the **exact 26 current vendor names/amounts/QR/discount fields** from Google Sheets, and labels blank optional columns as null. The UI in `finance.js` validates row count and sums before rendering. It displays four metric cards, the full 26-row searchable table, source-provenance link, and a seven-row visual comparison. The last four descriptions do **not** infer net paid amount, discount treatment, or the meaning of QR as a fee. The Source Total remains authoritative. The source sheet's original payment rows/timestamps/formulas are unchanged.

**Freshness:** the GitHub JSON is a dated source snapshot as of **2026-10-09**, not an automatically synchronized view. When the Sheet changes, it requires a governed read/reconcile/publish cycle. The UI must never label static GitHub summary data live.

## Paths and untouched modules

- `index.html`: all original Dashboard / Quantity Takeoff / BOQ / Rate Analysis / Rate Library / Source Registry / Provenance. New landscape home hero.
- `known-rates.html`: the separate original reference lookup. New landscaped subpage hero.
- `finance.html`: organization/project navigation and direct Google Sheet link. `finance.js` renders the source-derived summary.
- `system-map.html`: release/branch map, now backed by `branch-map.js` fetching public GitHub branch refs and retaining the previous static snapshot if GitHub API is unavailable.
- `site-shell.css`: **additive** horizontal-header, meadow hero, finance data presentation and responsive layouts. Existing `styles.css` retained.
- `theme.js`: existing light/dark preference preserved.
- `assets/green-landscape.svg`: local original SVG; no external image host required.
- `finance-summary.json`: static source snapshot, no API/database credentials.

## Deployment boundaries

`main` owns the GitHub Pages workflow but its action checks out `research/open-estimation-engine-v0.1` for static site content. This preserves the old v0.1 `main` estimator. GitHub Pages cannot execute the Vercel-only CR-02 endpoint; the finance dashboard is static client-rendered JSON and not an authenticated data API. No merge of draft PR #1.

## Gates / QA

1. PRE research and MAIN branch refs, with Archive_ aliases, exist before material writes.
2. All six JavaScript scripts parse; all existing route buttons and Known Rates source scripts remain.
3. All four web pages reference site-shell.css and landscape hero SVG; both default and dark theme can be selected.
4. All 26 finance rows exactly match the latest native Sheet A6:E33 read.
5. Source `Total` Amount and QR match summed rows exactly; no double-counting Discount.
6. Finance static, JS and JSON source URL identity matches the full Google Sheets ID.
7. Post-change named milestone and snapshot frozen; Pages trigger on `main` as docs-only commit.
8. GitHub Actions publish/CI readback verified before the site is called published.

## Unfinished future work

- Live automated Sheets→GitHub summary publishing with immutable change audits, if subsequently authorized.
- User-level visual/browserside acceptance of the new open green landscape site.
- A9 Local/Main registry POST/ACK debt from prior CR02 sequences remains separate, not silently cleared here.
