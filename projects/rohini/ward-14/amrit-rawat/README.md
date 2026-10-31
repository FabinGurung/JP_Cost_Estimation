# Rohini · Pokhara Ward 14 · Amrit Rawat rate reference

This is a **client-scoped indicative source-derived rate view** and NOT a signed client quotation, a government-approved schedule, an engineering approval or an executable tender BOQ.

## Ownership and identity

- Client: **Amrit Rawat**. Do not confuse this new entity with existing **14_Amrit_Hardware**.
- One editable and stable native Google Sheet ID is held privately in **A9 / 01_JP / Rohini Engineering / Projects / Residential / Pokhara / Ward_14 / 14_Amrit_Rawat**.
- This public repository contains no native Sheet ID, private Google Drive path, source sharing/permission map, credentials or payment information.
- **03_JP_Cost_Estimation** is a separate portfolio/repository workspace. The original client Sheet stays in Rohini's owning project folder, not duplicated or silently moved.
- The Google Sheet tabs are `00_READ_ME`, `01_PLINTH_RATES`, `02_TRADE_RATES`, `03_DAILY_WAGES`, `90_VERSION_HISTORY`.

## Pages artifact

- Route: `projects/rohini/ward-14/amrit-rawat/index.html`.
- Rendered rates: `rates.public.json`. The first V000001 snapshot was captured through a direct connector readback of 14+12+6 native Sheet rows on 2026-10-31.
- Read-only public display; client/private finance, Google Sheet ID and permissions are not rendered.
- `publication-history.jsonl` is append-only. Git commits preserve the publication code and derived JSON history. Drive owns the actual editing and PRE/POST version archive.

## Future changes

1. User updates the **same live Sheet** after preserving a numbered PRE snapshot in its dedicated owning Drive version archive.
2. Update the Sheet's `90_VERSION_HISTORY` with sequential new `V000002`, `V000003`, etc. and the explicit `POST_VALIDATED` status and restoration evidence.
3. Save a numbered POST of the validated sheet. Do not rename the permanent live sheet, switch IDs or overwrite originals.
4. An authenticated, read-only Google Sheets Actions job reads all three rate tabs; it validates identity, numerical rates, row IDs and version. It fails closed on mismatch. All data shown on Pages is **derived**.
5. A new validated source version changes `rates.public.json` and appends one JSONL publication event; a research-branch push triggers existing `deploy-research-pages.yml`.

## Credential setup (operator action required)

Repository-level Actions secrets:

- `AMRIT_RAWAT_SHEET_ID` — native source Sheet ID; private.
- `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON` — restricted read-only Google service-account JSON. The service account must have Viewer permission on the source Sheet.

**Never commit either secret** and never enable general public Google Sheet link sharing. For the unattended daily schedule, GitHub's workflow file must be registered on the **default branch (`main`)**; the research-branch companion runs only for manually dispatched checks and branch deployment. If secrets are unavailable, the existing static snapshot remains and no live sync is claimed.

## Pricing safeguards

All supplied ranges remain `USER_SUPPLIED_UNVERIFIED`. Rates per sq.ft built-up plinth are NOT rates per sq.ft actual painted or tiled surface. Daily wages are per worker-day. Material-plus-labour is an alternative to labour-only. Turnkey and grey construction packages may overlap with other trades; require a specific scope matrix before any summation. Painting area factor of 3.5 is approximate only; bathroom fixtures are extra in the user-supplied schedule.


## Unified costing LIVE workbook (V000001, 2026-10-31)

- Reusable native master: https://docs.google.com/spreadsheets/d/1TSBHMSjOGuWcVkEnKsjFHpEYi191RMwdp5bfCqBkzCY/edit . Held under A9 03_JP_Cost_Estimation / 02_HUMAN_WORKING_SHEETS.
- Project source LIVE (PERMANENT ID): https://docs.google.com/spreadsheets/d/1QfVM08Zvd_mv7EXcTxT9WMYPHzTAUHOTmL10ULo4oIA/edit . Held in original Rohini / Ward 14 / 14_Amrit_Rawat.
- New project-only archive folder: `90_VERSION_HISTORY__AMRIT_RAWAT_COSTING`; V000001 POST saved after native sheet / parent / header readback.
- Project worksheet IDs link the same single LIVE workbook for measurement, selected rates, derived BOQ, AOC, RA and vendor bills. **No verified measurements, bills, invoices or actual project payments were found/admitted.**
- The published JSON is currently still an empty projection; there has been no source-authenticated GitHub Action read from this new Sheet. Do not infer live freshness from Pages deployment.
