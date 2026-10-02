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
The initial estimation schema was successfully prepared and tested on a temporary Neon branch.

Temporary test branch:
- br-hidden-tooth-b39d1dvz

Production schema application was approved by the user but blocked by the connected-action safety layer.
Production remained empty at last readback; no partial migration occurred.

## Canonical migration SQL
See:
`database/001_initial_estimation_schema.sql`

## Rule
Never store Neon passwords, connection strings, API keys, or other credentials in this repository.
