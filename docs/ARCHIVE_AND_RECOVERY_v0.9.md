# JP Cost Estimation — Reversible Archive and Recovery v0.9

Recorded: 2026-10-21  
Website publishing branch: `research/open-estimation-engine-v0.1`  
Verified pre-change commit: `5f286ae35cda9d98945ff681d86b8a6e95f1de66`  
Recovery branch: `snapshot/pre-finance-panels-20261021`

## First action completed

A separate recovery branch was created at the exact publishing-branch commit **before** any Finance navigation or source-panel edits. The existing publishing branch and all 27 HTML routes were left unchanged. The `v0.8.0` milestone tag remains an earlier independent recovery point.

## Archive decision register

| Candidate | Decision now | Why |
| --- | --- | --- |
| Current publishing branch, `main`, and `v0.8.0` | KEEP | Publishing, manual fallback and historical recovery have distinct roles |
| All 27 HTML routes | KEEP | No verified incoming-link inventory authorizes removal |
| `mep.html`, `mep-electrical.html`, `mep-mechanical.html`, `mep-plumbing.html` | KEEP redirects | Preserve old bookmarks and links |
| `finance-public-snapshot.json`, `finance-context.json` | KEEP | Published payment display and provenance |
| `finance-summary.json` | KEEP pending dependency review | `scripts/qa_kkg_finance_snapshot_v1.2.mjs` still reads this file |
| `.github/workflows/deploy-research-pages.yml` | KEEP | Automatic verified deployment from the publishing branch |
| Manual `main` Pages workflow | KEEP as recovery fallback | Do not remove a recovery route before a separate approval |
| Payment Dashboard link in global More | MOVE under Finance | Navigation change only; `finance-dashboard.html` URL and data remain |
| Earlier merged `feature/*` branches | REVIEW for archival | Confirm merged commits, open PRs, unique changes and external references first |
| Older `snapshot/*` and `Archive_* ` branches | REVIEW for consolidation | Several recovery refs already exist; do not assume any is redundant |
| Historical financial source workbooks | KEEP in Drive | Google Sheets remain independent editable authorities; no archival or migration authorized |

At inventory time, GitHub branch search returned at least **100 branch refs** on its first page, including **67** `snapshot/*`, **12** `Archive_*`, **13** `feature/*`, and **5** `milestone/*` branches. These are search-page counts, **not** a complete branch inventory or a deletion recommendation.

## Before retiring a branch or route

1. Verify the branch head, PR merge state, unique commits, references and release tags.
2. Confirm no Pages workflow, automation, workbook or live link depends on it.
3. Preserve a tagged recovery commit and document a restore procedure.
4. Present the exact file or branch list to the owner for a separate removal decision.
5. Keep the source Google Sheets and finance snapshot history untouched.

## Restore procedure

To inspect the frozen pre-change website:

```sh
git fetch origin
git switch -c restore-finance-review origin/snapshot/pre-finance-panels-20261021
```

To restore selected site files, create a fresh feature branch and use `git restore --source=origin/snapshot/pre-finance-panels-20261021 -- <file-path>`; run the repository checks and submit a PR. Do not force-update the publishing branch.

**No branch, route, redirect, snapshot, financial record or workflow is deleted by this archive plan.**
