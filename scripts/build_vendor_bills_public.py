#!/usr/bin/env python3
"""Validate or derive an aggregate-only Vendor Bills status for public Pages."""

import argparse
import json
import os
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "data/vendor-bills-status.v1.json"
COUNT_TABS = {
    "sourceRows": ("VB_SOURCE_INDEX", "A:F", "Classification"),
    "billRows": ("VB_BILL_RECORDS", "A:U", "Bill Record ID"),
    "detailRows": ("VB_DETAIL_ROWS", "A:X", "Detail ID"),
    "comparisonRows": ("VB_RECONCILIATION", "A:J", "Comparison"),
    "reviewFlags": ("VB_REVIEW_QUEUE", "A:F", "Status"),
}
FIELDS = {"schema", "sourceMode", "revision", "sourceTabs", *COUNT_TABS}


def validate(payload):
    if set(payload) != FIELDS or payload["schema"] != "jp.vendor-bills-status.v1":
        raise ValueError("PUBLIC_SCHEMA")
    if payload["sourceMode"] not in ("VERIFIED_SNAPSHOT", "MANUAL_AUTHENTICATED_READ"):
        raise ValueError("SOURCE_MODE")
    if not isinstance(payload["revision"], str) or not re.fullmatch(r"V[0-9]{6}", payload["revision"]):
        raise ValueError("SOURCE_REVISION")
    for key in {"sourceTabs", *COUNT_TABS}:
        if type(payload[key]) is not int or payload[key] < 0:
            raise ValueError("PUBLIC_COUNT")
    if not (0 < payload["billRows"] + payload["detailRows"] <= payload["sourceRows"] and payload["sourceTabs"] > 0):
        raise ValueError("ROW_RECONCILIATION")
    return payload


def derive(sheets):
    manifest = dict(row[:2] for row in sheets["00_MANIFEST"][1:] if len(row) >= 2)
    if manifest.get("REFRESH_MODE") != "MANUAL_ONLY":
        raise ValueError("SOURCE_CONTROL")
    source_tabs = {row[0] for row in sheets["VB_SOURCE_INDEX"][1:] if row and row[0]}
    result = {
        "schema": "jp.vendor-bills-status.v1",
        "sourceMode": "MANUAL_AUTHENTICATED_READ",
        "revision": manifest.get("CONTROL_VERSION"),
        "sourceTabs": len(source_tabs),
    }
    for key, (tab, _, header) in COUNT_TABS.items():
        rows = sheets[tab]
        if not rows or header not in rows[0]:
            raise ValueError("SOURCE_HEADER")
        data = [row for row in rows[1:] if row and row[0]]
        if key in ("billRows", "detailRows") and len({row[0] for row in data}) != len(data):
            raise ValueError("SOURCE_DUPLICATE_ID")
        if key == "sourceRows":
            status = rows[0].index("Classification")
            if any(len(row) <= status or row[status] == "UNCLASSIFIED" for row in data):
                raise ValueError("SOURCE_ROW_CLASSIFICATION")
        result[key] = len(data)
    return validate(result)


def read_live(source_id):
    import google.auth
    from google.auth.transport.requests import AuthorizedSession

    credentials, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"])
    ranges = {"00_MANIFEST": "A1:C50", **{tab: bounds for tab, bounds, _ in COUNT_TABS.values()}}
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{source_id}/values:batchGet"
    with AuthorizedSession(credentials) as session:
        reply = session.get(url, params=[("ranges", f"'{tab}'!{bounds}") for tab, bounds in ranges.items()], timeout=30)
        if not reply.ok:
            raise RuntimeError("GOOGLE_SHEETS_READ")
        values = reply.json()["valueRanges"]
    if len(values) != len(ranges):
        raise ValueError("SOURCE_TABS")
    return {tab: item.get("values", []) for tab, item in zip(ranges, values)}


def self_test():
    fixture = {
        "00_MANIFEST": [["Field", "Value"], ["CONTROL_VERSION", "V000002"], ["REFRESH_MODE", "MANUAL_ONLY"]],
        "VB_SOURCE_INDEX": [["Source Tab", "Classification"], ["Private tab", "BILL"], ["Private tab", "LINE"]],
        "VB_BILL_RECORDS": [["Bill Record ID"], ["private bill"]],
        "VB_DETAIL_ROWS": [["Detail ID"], ["private line"]],
        "VB_RECONCILIATION": [["Comparison"], ["private supplier"]],
        "VB_REVIEW_QUEUE": [["Status"], ["private issue"]],
    }
    snapshot = derive(fixture)
    if snapshot["billRows"] != 1 or "private" in json.dumps(snapshot).lower():
        raise ValueError("PRIVACY_TEST")
    for invalid in (dict(snapshot, private="secret"), dict(snapshot, billRows=True), dict(snapshot, sourceRows=0)):
        try:
            validate(invalid)
        except ValueError:
            continue
        raise ValueError("VALIDATION_TEST")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    self_test()
    if args.check:
        validate(json.loads(SNAPSHOT.read_text()))
    if args.output:
        source_id = os.environ.get("JP_VENDOR_BILLS_SHEET_ID", "")
        if not re.fullmatch(r"[A-Za-z0-9_-]{20,}", source_id):
            raise ValueError("SOURCE_CONFIGURATION")
        data = derive(read_live(source_id))
        args.output.write_text(json.dumps(data, indent=2) + "\n")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # Avoid provider exception text, URLs and private source rows in Actions logs.
        print(f"Vendor Bills status failed ({type(exc).__name__}).", file=sys.stderr)
        sys.exit(1)
