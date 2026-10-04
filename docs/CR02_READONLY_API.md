# CR-02 read-only Vercel API

## Purpose
Expose the verified bounded production `cr02` mirror to the research frontend without giving the browser a database credential and without adding any write path.

Flow:

`browser -> /api/cr02-rates -> Vercel serverless -> Neon cr02`

## Database role
Use only the dedicated role:

`cr02_api_reader`

Verified permissions:
- CONNECT on `jp_estimation`: yes
- USAGE on schema `cr02`: yes
- SELECT on `cr02` tables/views: yes
- CREATE on `cr02`: no
- INSERT/UPDATE/DELETE on `cr02.rate_observations`: no
- superuser / createdb / createrole / replication / bypassrls: no
- inherited memberships: none

## Secret
Vercel environment variable:

`CR02_DATABASE_URL`

Do not commit the value to GitHub, Drive, HTML, JavaScript, screenshots, or documentation.

## Endpoint
`GET /api/cr02-rates`

The API returns only client-safe normalized fields for:
- sources
- canonical rate observations
- rate-analysis headers
- rate-analysis components

It intentionally omits private Drive links, credentials, project-payment evidence, margins, vendor-confidential data and internal database metadata.

## Frontend behavior
The Rate Library keeps the legacy demo table separate and adds a canonical backend panel.

The canonical backend panel:
- reads from `/api/cr02-rates`;
- displays the four verified `RO-*` rows when configured;
- displays a controlled configuration/error state otherwise;
- does not replace demo estimate calculations in this POC.

## A9 boundary
This API wiring phase does not bulk-ingest the remaining SRC-0005 rows and does not invent a rate for `MAT-GETTI-10-16`.
