# JP Github → Google: public-repository federation, restricted data identities

## Source verification (2026-11-07)

- Existing Google Cloud project `just-a-project-5007`, project number `247425973072`, pool `jp-pages-github`, provider `github`.
- Existing provider condition (admin readback): `assertion.repository_id == '1312147922' && assertion.repository_owner_id == '143244575' && assertion.ref == 'refs/heads/feature/daily-ops-current-work'`.
- Verified mapped claims: `attribute.repository_id`, `attribute.repository_owner_id`, and `google.subject='repo:'+repository_id`.
- Existing publisher service-account policy (admin readback): only the principal set for GitHub repo ID `1312147922` has `roles/iam.workloadIdentityUser`. It is **not** owner-wide.
- Existing identity: `jp-pages-publisher@just-a-project-5007.iam.gserviceaccount.com`, previously granted read access on five Cost Estimation source Sheets.
- Verified Cost Estimation GitHub repo ID: `1312661427`; GitHub owner ID: `143244575`. Cost test run `41315501661` failed `unauthorized_client` due to provider's attribute condition, before reading Sheets.

## User-authorized approach

Retain existing provider, preserve the whole current Communication & Web rule, and **append**:
1. All `public` GitHub repositories owned by numeric owner ID `143244575` on `refs/heads/main` for `push`, `workflow_dispatch`, `schedule`.
2. Cost Estimation's exact numeric repo ID on `research/open-estimation-engine-v0.1` and temporary `feature/a9-reuse-shared-google-identity-20261101` for the same events.

Never broaden `jp-pages-publisher` impersonation to the whole owner. Instead:
- Add only the Cost Estimation numeric repository principal set to its existing `roles/iam.workloadIdentityUser` policy. Keep the Communication & Web binding unchanged; this service account can read restricted finance sources.
- Create `jp-public-pages-reader@just-a-project-5007.iam.gserviceaccount.com` as a **distinct, new, low-privilege** service identity. Permit the owner-ID principal set to impersonate it; do not grant it project roles or any private Google Sheets.
- Future public repositories can use the same WIF provider and new public-only service account without editing the provider. New approved source Sheets still need explicit, resource-level read access. Repos with non-`main` branches need an additional narrowly scoped branch exception, unless they change their workflows to publish from `main`.

## Execution / test

The audited script is `scripts/repair_existing_google_wif_trust.sh`. Default is review-first:

```bash
bash scripts/repair_existing_google_wif_trust.sh --plan
bash scripts/repair_existing_google_wif_trust.sh --apply
```

`--plan` checks the existing condition, mapped IDs and sensitive SA policy and prints the exact existing/proposed conditions without changing Google Cloud. `--apply` grants the restricted Cost repository binding, creates the new public-only SA, grants it owner-ID impersonation, then updates and reads back the existing WIF provider. It refuses to grant owner-wide impersonation to an unexpectedly preexisting public-only SA without an explicit review.

**No Google IAM change is made from ChatGPT or GitHub alone.** Google Cloud Shell must execute `--apply` as a permitted project administrator. If it fails, preserve logs, avoid creating a new provider or credential, and repair the precise denied permission.

After successful IAM readback: rerun `Verify existing JP Google keyless identity for Cost Estimation` on the diagnostic branch, require five readable original source IDs, then merge only after repository CI passes. Trigger the existing source refresh and publishing workflows and validate **actual authenticated readbacks**, not merely a green static Pages deployment. Historic snapshot remains authoritative until live-source refresh succeeds.

Existing read-only source directory: https://drive.google.com/drive/folders/1v0yTowZ8mbTtT7euPgrPeEndFKPPH0IU .
Git restoration point: `snapshot/pre-shared-google-wif-reuse-20261101`.
