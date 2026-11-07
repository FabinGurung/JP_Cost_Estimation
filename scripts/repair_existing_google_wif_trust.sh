#!/usr/bin/env bash
# A9 existing WIF: all public FabinGurung repos on main, plus exact Cost publishing branches.
# Safe by default: --plan changes nothing; --apply changes only the scoped IAM described.
set -euo pipefail
MODE="$1"
[[ "$MODE" == "--plan" || "$MODE" == "--apply" ]] || { echo "Usage: bash $0 --plan|--apply"; exit 2; }
PROJECT=just-a-project-5007
POOL=jp-pages-github
PROVIDER=github
OWNER=143244575
COST=1312661427
SA=jp-pages-publisher@just-a-project-5007.iam.gserviceaccount.com
PUBLIC_SA=jp-public-pages-reader@just-a-project-5007.iam.gserviceaccount.com
OLD="$(gcloud iam workload-identity-pools providers describe "$PROVIDER" --project="$PROJECT" --workload-identity-pool="$POOL" --location=global --format='value(attributeCondition)')"
POLICY="$(gcloud iam service-accounts get-iam-policy "$SA" --project="$PROJECT" --format=json)"
MAPPING="$(gcloud iam workload-identity-pools providers describe "$PROVIDER" --project="$PROJECT" --workload-identity-pool="$POOL" --location=global --format='json(attributeMapping)')"
export POLICY MAPPING
[[ "$OLD" == *"1312147922"* && "$OLD" == *"$OWNER"* ]] || { echo "STOP: original Communication & Web provider changed"; exit 3; }
python3 - <<'PY'
import json,os
m=json.loads(os.environ["MAPPING"])["attributeMapping"]
assert m["attribute.repository_owner_id"]=="assertion.repository_owner_id"
assert m["attribute.repository_id"]=="assertion.repository_id"
p=json.loads(os.environ["POLICY"])
w=[x for b in p.get("bindings",[]) if b["role"]=="roles/iam.workloadIdentityUser" for x in b["members"]]
assert w and any(s.endswith("/attribute.repository_id/1312147922") for s in w)
assert not any("/attribute.repository_owner_id/" in s or s.endswith("/jp-pages-github/*") for s in w)
print("PASS: existing identity mappings and financial-service-account isolation.")
PY
PUBLIC="assertion.repository_owner_id == '143244575' && assertion.repository_visibility == 'public' && assertion.ref == 'refs/heads/main' && assertion.event_name in ['push','workflow_dispatch','schedule']"
EXCEPTION="assertion.repository_owner_id == '143244575' && assertion.repository_id == '1312661427' && assertion.repository_visibility == 'public' && assertion.ref in ['refs/heads/research/open-estimation-engine-v0.1','refs/heads/feature/a9-reuse-shared-google-identity-20261101'] && assertion.event_name in ['push','workflow_dispatch','schedule']"
if [[ "$OLD" == *"assertion.repository_visibility == 'public'"* && "$OLD" == *"$COST"* ]]; then
  NEW="$OLD"
else
  NEW="($OLD) || ($PUBLIC) || ($EXCEPTION)"
fi
[[ $(printf %s "$NEW" | wc -c) -le 4096 ]] || { echo "STOP: Google CEL size limit"; exit 3; }
printf '%s\n' "$OLD" > /tmp/jp-wif-condition-before.txt
printf '%s\n' "$NEW" > /tmp/jp-wif-condition-proposed.txt
echo "CURRENT:"; cat /tmp/jp-wif-condition-before.txt
echo "PROPOSED:"; cat /tmp/jp-wif-condition-proposed.txt
if [[ "$MODE" == "--plan" ]]; then
  echo "PLAN ONLY — no changes. To accept, run bash $0 --apply."
  exit 0
fi
BASE="principalSet://iam.googleapis.com/projects/247425973072/locations/global/workloadIdentityPools/$POOL"
gcloud iam service-accounts add-iam-policy-binding "$SA" --project="$PROJECT" --role=roles/iam.workloadIdentityUser --member="$BASE/attribute.repository_id/$COST" --quiet >/dev/null
if gcloud iam service-accounts describe "$PUBLIC_SA" --project="$PROJECT" >/dev/null 2>&1; then
  echo "STOP: public-only service account already exists; inspect its existing resource access before granting owner-wide impersonation." >&2
  exit 4
fi
gcloud iam service-accounts create jp-public-pages-reader --project="$PROJECT" --display-name="JP Public Github Pages Reader" --quiet >/dev/null
gcloud iam service-accounts add-iam-policy-binding "$PUBLIC_SA" --project="$PROJECT" --role=roles/iam.workloadIdentityUser --member="$BASE/attribute.repository_owner_id/$OWNER" --quiet >/dev/null
if [[ "$OLD" != "$NEW" ]]; then
  gcloud iam workload-identity-pools providers update-oidc "$PROVIDER" --project="$PROJECT" --location=global --workload-identity-pool="$POOL" --attribute-condition="$NEW" --quiet >/dev/null
fi
ACTUAL="$(gcloud iam workload-identity-pools providers describe "$PROVIDER" --project="$PROJECT" --location=global --workload-identity-pool="$POOL" --format='value(attributeCondition)')"
[[ "$ACTUAL" == "$NEW" ]] || { echo "ERROR: provider readback mismatch" >&2; exit 4; }
echo "SUCCESS: old Communication & Web condition preserved; owner-wide public/main trusted."
echo "SUCCESS: Cost Estimation research and test branch authorized with existing restricted publisher."
echo "SUCCESS: separate public-only SA enabled for all public/main GitHub repos (no Google data roles granted)."
