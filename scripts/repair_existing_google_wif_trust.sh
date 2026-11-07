#!/usr/bin/env bash
# A9 — SINGLE EXISTING GCP WORKLOAD TRUST REPAIR. NOT A NEW PROVIDER.
# Execute only as the already-authorized Google Cloud project IAM administrator.
# Preserve original condition, only add exact repo and three required branch claims.
set -euo pipefail
PROJECT="just-a-project-5007"
PROJECT_NUMBER="247425973072"
POOL="jp-pages-github"
PROVIDER="github"
SERVICE_ACCOUNT="jp-pages-publisher@just-a-project-5007.iam.gserviceaccount.com"
REPO="FabinGurung/JP_Cost_Estimation"
OWNER_ID="143244575"
REPO_ID="1312661427"
# GitHub API readback: communication repo=1312147922, Cost Estimation=1312661427.
CURRENT="$(gcloud iam workload-identity-pools providers describe "$PROVIDER" --workload-identity-pool="$POOL" --location=global --project="$PROJECT" --format='value(attributeCondition)')"
if [[ -z "$CURRENT" ]]; then
  echo "STOP: existing provider has no condition; investigate current Google policy before editing" >&2
  exit 2
fi
MAPPING="$(gcloud iam workload-identity-pools providers describe "$PROVIDER" --workload-identity-pool="$POOL" --location=global --project="$PROJECT" --format='json(attributeMapping)')"
export MAPPING
python3 - <<'PY'
import json, os
mapping=json.loads(os.environ["MAPPING"]).get("attributeMapping",{})
if "attribute.repository" not in mapping:
    raise SystemExit("STOP: existing provider has no mapped attribute.repository; audit IAM before granting service account access")
print("Mapped repo attribute confirmed")
PY
ADDED="assertion.repository_owner_id == '$OWNER_ID' && assertion.repository_id == '$REPO_ID' && (assertion.ref == 'refs/heads/research/open-estimation-engine-v0.1' || assertion.ref == 'refs/heads/main' || assertion.ref == 'refs/heads/feature/a9-reuse-shared-google-identity-20261101')"
if [[ "$CURRENT" == *"assertion.repository_id == '$REPO_ID'"* ]]; then
  echo "Existing condition already references numeric Cost Estimation repository ID. Inspect/verify before making changes."
else
  UPDATED="($CURRENT) || ($ADDED)"
  if (( ${#UPDATED} > 4096 )); then echo "STOP: Google CEL condition would exceed 4096 characters" >&2; exit 3; fi
  printf '%s\n' "$CURRENT" > /tmp/jp-pages-github-original-condition.txt
  echo "Pre-change condition saved to /tmp/jp-pages-github-original-condition.txt"
  gcloud iam workload-identity-pools providers update-oidc "$PROVIDER" \
    --workload-identity-pool="$POOL" --location=global --project="$PROJECT" \
    --attribute-condition="$UPDATED"
  echo "Extended the EXISTING condition for exactly the Cost Estimation repository and approved branches."
fi
MEMBER="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL/attribute.repository/$REPO"
gcloud iam service-accounts add-iam-policy-binding "$SERVICE_ACCOUNT" \
  --project="$PROJECT" --role=roles/iam.workloadIdentityUser \
  --member="$MEMBER" --quiet >/dev/null
echo "Added/confirmed repo-specific IAM workloadIdentityUser binding on existing service account."
echo "No credentials created. No Drive permissions or source IDs changed."
echo "NEXT: rerun GitHub workflow 'Verify existing JP Google keyless identity for Cost Estimation' on feature/a9-reuse-shared-google-identity-20261101."
