# Manual Neon Production Migration — Fallback Only

Use this only because the connected Neon production-write action was blocked after explicit approval.

## Preconditions
1. Confirm project: `jp-estimation-engine`
2. Confirm project ID: `square-bar-32494210`
3. Confirm database: `jp_estimation`
4. Confirm branch: `production`
5. Confirm production tables are still empty before applying.

## Steps
1. Open Neon Console.
2. Open project `jp-estimation-engine`.
3. Select branch `production`.
4. Open SQL Editor.
5. Open the GitHub file:
   `database/001_initial_estimation_schema.sql`
6. Copy the full SQL exactly.
7. Paste it into Neon SQL Editor.
8. Run it once.
9. Do not run it a second time.
10. After it succeeds, return to ChatGPT and say:
   `NEON PRODUCTION SCHEMA APPLIED`

ChatGPT will then read back the production database, verify tables/views, and continue with seed/source ingestion.

## Do not
- paste passwords or connection strings into chat;
- edit the SQL manually;
- run DROP statements;
- create a second database;
- delete the tested temporary branch manually unless instructed after verification.
