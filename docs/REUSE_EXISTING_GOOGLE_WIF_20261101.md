# A9 — Reuse existing Communication & Web WIF: verified diagnosis and bounded repair

Date: 2026-11-01 Asia/Kathmandu. No new Google Cloud project, service account, JSON key, token, Colab setup or source workbook should be created.

## Evidence

- Communication & Web repo: `FabinGurung/JP_Communication-Command-Centre-and-Resource-Hub`, workflow `.github/workflows/daily-ops-branch-preview.yml` on `feature/daily-ops-current-work`.
- Successful source-authenticated Actions run: https://github.com/FabinGurung/JP_Communication-Command-Centre-and-Resource-Hub/actions/runs/41141619917 (2026-10-30).
- The communication job log proves `google-github-actions/auth@v3` authenticated with Workload Identity Federation and successfully assembled/read back the publishing Sheet.
- Verified existing provider: `projects/247425973072/locations/global/workloadIdentityPools/jp-pages-github/providers/github`
- Verified existing service identity: `jp-pages-publisher@just-a-project-5007.iam.gserviceaccount.com`.
- Cost Estimation identity probe: https://github.com/FabinGurung/JP_Cost_Estimation/actions/runs/41315501661 (2026-11-01).
- Cost verification job used **the same provider and service account** but failed before fetching Sheets:
  `unauthorized_client: The given credential is rejected by the attribute condition.`
- All five source Sheets in the existing single source folder already grant the same service account the **reader** role (Drive metadata readback verified). No public sharing was added.

## Root cause / precise fix

The existing Google WIF provider has an attribute condition that allows Communication & Web but rejects claims from `FabinGurung/JP_Cost_Estimation`. Cross-repo user authorization does not by itself modify Google IAM.

A bounded repair requires an administrator of the **existing** `just-a-project-5007` cloud project to extend the **existing** provider condition for the Cost Estimation GitHub repository and the appropriate branch refs, and give the existing service account the exact repo's workloadIdentityUser membership.

Use `scripts/repair_existing_google_wif_trust.sh` in Google Cloud Shell. The script reads the CURRENT provider condition, **retains it unmodified**, adds only an exact repo + branch condition, checks the mapped repository attribute, and adds a repo-scoped service account binding. It is not run by this public GitHub workflow (the denied identity is intentionally unable to self-grant IAM privileges). Do not replace the original provider condition, make the pool public, or grant IAM permissions to all GitHub repositories.

Note: the exact current live provider expression was not accessible to the GitHub/Drive connectors; the script reads it at execution time, guarding against overwriting. The Cloud Shell user must have Google IAM provider and service-account binding permissions.

## After GCP trust repair

1. Run the feature-branch `Verify existing JP Google keyless identity for Cost Estimation` GitHub Action.
2. Require all five originals to return a read-only spreadsheet-ID match; no private data or tokens logged.
3. Only then merge the feature PR, which has the already verified provider/service identity as non-secret fallbacks. Existing repo variables can override them; the Amrit source ID is already source-linked and stable.
4. Trigger and verify the Amrit source refresh from the default-branch scheduler, and the sole Pages deployment. Check actual authenticated Google read and finance parser success, not just deployment green.
5. If a live source schema differs from the approved publication subset, fail closed, preserve the last verified JSON, and repair the source adapter without inventing values.

## Files / restoration

Original source IDs and Google Sheets remain unchanged. Source folder: https://drive.google.com/drive/folders/1v0yTowZ8mbTtT7euPgrPeEndFKPPH0IU .
Git pre-repair checkpoint: `snapshot/pre-shared-google-wif-reuse-20261101`.
Production Pages must not be merged with failing repository trust. The feature-only test workflow is intentionally diagnostic.
