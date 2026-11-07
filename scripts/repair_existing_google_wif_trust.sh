#!/usr/bin/env bash
# Historical single-repository repair procedure retired (fail closed).
# The user requested an owner-wide PUBLIC repository federation policy.
# The previous repair expected attribute.repository, which does NOT exist:
# Actual mappings: attribute.repository_id, attribute.repository_owner_id,
# google.subject. Do not run a stale single-repo updater.
set -euo pipefail
echo 'STOP: This single-repository script is superseded by the user-authorized owner-wide public repository architecture.' >&2
echo 'Before broadening federation, inspect the existing sensitive publisher IAM policy with:' >&2
echo 'gcloud iam service-accounts get-iam-policy jp-pages-publisher@just-a-project-5007.iam.gserviceaccount.com --project=just-a-project-5007 --format=yaml(bindings)' >&2
echo 'Keep the restricted publisher repo-scoped; a new public-only identity must be used for owner-wide access.' >&2
exit 2
