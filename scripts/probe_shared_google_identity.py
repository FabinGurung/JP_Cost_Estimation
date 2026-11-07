#!/usr/bin/env python3
"""Nonpublishing identity/access probe: no source rows or secrets in logs."""
import os
from google.auth import default
from google.auth.transport.requests import AuthorizedSession

SOURCES = {
    "Amrit rate register": "13uIoX0_urXfSEMLYRK01Pt9FWwYj5SfiLOxHhbr9HPE",
    "Amrit project costing": "1QfVM08Zvd_mv7EXcTxT9WMYPHzTAUHOTmL10ULo4oIA",
    "Rohini KKG finance": "1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE",
    "AEC rate master": "1yJX1Dep0_2ZDvRftu3u-Bb6ZbDqtQWKDChQQlYCWYXY",
    "JP reusable costing template": "1TSBHMSjOGuWcVkEnKsjFHpEYi191RMwdp5bfCqBkzCY",
}
credentials, project = default(scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"])
session = AuthorizedSession(credentials)
for source_name, spreadsheet_id in SOURCES.items():
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}"
    response = session.get(url, params={"fields": "spreadsheetId,properties(title),sheets(properties(title))"}, timeout=30)
    response.raise_for_status()
    data = response.json()
    assert data.get("spreadsheetId") == spreadsheet_id, "Source identity mismatch"
    tabs = [s["properties"]["title"] for s in data.get("sheets", [])]
    assert tabs, "No available source tabs"
    print(f"READ_ONLY_SOURCE_PASS: {source_name}; sheets={len(tabs)}; source_id_matched=true")
print(f"EXISTING_JP_IDENTITY_PASS: {len(SOURCES)} original Sheets independently readable")
