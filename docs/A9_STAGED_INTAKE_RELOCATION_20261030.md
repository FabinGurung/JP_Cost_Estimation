# A9 Cost Estimation — staged intake relocation receipt (2026-10-30)

**Current status:** THREE_FOLDER_MOVES_VERIFIED; STILL_NOT_ADMITTED.
**Supersedes the earlier location statements** in `A9_DRIVE_ROOT_SOURCE_CUSTODY_20261030.md`. Preserve that document as the historical pre-migration boundary explanation.

## Drive structure

The existing A9 sibling folder was renamed in place from `JP_Cost_Estimation` to `03_JP_Cost_Estimation`, preserving its stable Drive folder ID.

A new `97_STAGED_INTAKE_NOT_ADMITTED` child contains three moved, unchanged-ID folders:
- Krishna Kumar Gupta payment-source intake archive (historical copies, originals and working-template candidates)
- Fabin Gurung payment-source intake archive (historical source and working-copy candidates)
- Wage List conversion/cleaning archive (wage, attendance, payment, work and individual worker sheet candidates)

The three folder parent updates were verified; their root and representative child permissions retained the same four-person A9 set. The LIVE Rohini project-payment Sheet has separate reader access and **was not moved**. The AEC Cost Rate Master stays under its existing AEC authority.

## Controlled evidence and authority boundaries

- The original A9 IntakeRegister now has 3 new entries, IDs `INTAKE-20261030-014` through `016`, at `IntakeRegister!A15:M17`.
- The append-only `MoveLedger__20261019!A28:L30` includes three `PASS_READBACK` stable-ID parent movement records.
- New repository-root `90_VERSION_HISTORY` contains `V000001` PRE and POST copies of the intake registrar.
- Source items are `RELOCATED_STAGED_NOT_ADMITTED`. Physical move is **not** authority admission, duplicate reconciliation, approval, or content-level parity certification.
- Old parent: A9 `98_INTAKE_STAGING`; new parent: `03_JP_Cost_Estimation/97_STAGED_INTAKE_NOT_ADMITTED`. Exact private folder IDs, file IDs and rollback edges remain in the authorized A9 Google Sheets registry, not this public repository.
- All unrelated academic, engineering, media and other intake remains in original intake lanes.
- Existing LIVE Sheet IDs and source links are unchanged; financial figures and published JSON snapshots were not modified.

## Remaining gated work

1. Verify every historical copy versus its original LIVE source at content level, including original workbook formulas, validations, sheets, and dates.
2. Establish exact Rohini/Fishtail payroll custody and source access before admitting or further moving any live Sheet.
3. Update owning Local and Main A9 library ArtifactRegistry, ArtifactEdges and LegacyPaths with PRE/POST/ACK; do not represent this bounded intake-register update as full A9 Main ACK.
4. Keep GitHub Pages static snapshot publication separate from genuinely executed live Google Sheets fetches.

Rollback of the three folder moves, if required, is a Drive parent update from the destination staged folder to the original A9 intake root using the same stable IDs. Confirm access and child identity after restoration.

**Publication:** This receipt is public-safe documentation only; it does not contain private finance or personnel records, keys or Drive IDs.
