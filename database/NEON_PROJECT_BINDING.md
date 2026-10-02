# Neon Project Binding — JP Estimation Engine

Verified from connected Neon integration.

- Account/workspace owner: fabingurung@gmail.com
- Neon project: jp-estimation-engine
- Project ID: square-bar-32494210
- Region: aws-ap-southeast-1 (Singapore)
- PostgreSQL: 18
- Primary branch: production
- Primary branch ID: br-purple-wave-b39wlrsp
- Database: jp_estimation
- Database owner: jp_estimation_owner

## Status
The initial estimation schema was:
1. prepared and tested on temporary branch `br-hidden-tooth-b39d1dvz`;
2. explicitly approved by the user;
3. manually applied in Neon SQL Editor to production because connected production writes were safety-blocked;
4. provider-read back successfully from production.

Production currently contains the canonical tables/views but no seed/business rows yet.

## Canonical migration SQL
See:
`database/001_initial_estimation_schema.sql`

## Rule
Never store Neon passwords, connection strings, API keys, or other credentials in this repository.
