#!/usr/bin/env python3
"""Authenticated read-only Amrit LIVE Sheet -> vetted Pages projection.

Google Sheet remains the human source of truth. A verified CAD/drawing-backed
measurement and an approved rate selection must be present before BOQ pricing.
No workbook edits, credentials, raw source links or financial transactions are
published. When no source rows exist, publish an authenticated *empty* status.
"""
import argparse
from copy import deepcopy
from datetime import datetime, timezone
from hashlib import sha256
import json
import math
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = "projects/rohini/ward-14/amrit-rawat"
SHEET_ID = "1QfVM08Zvd_mv7EXcTxT9WMYPHzTAUHOTmL10ULo4oIA"
PROJECT = "RE-AMRIT-RAWAT-W14"
ORG = "ROHINI"
TABS = {
    "measurements": ("01_MEASUREMENTS", [
        "Measurement_ID", "Project_ID", "Organization_ID", "Work_ID",
        "Work_Item_ID", "Location_Grid", "Measurement_Method",
        "Drawing_Revision", "Evidence_ID", "Dimensions_or_BBS",
        "Quantity", "Unit", "Measured_Date", "Verification_Status",
        "Approved_By", "Source_Link"]),
    "rates": ("02_RATE_SELECTIONS", [
        "Work_Item_ID", "Unit", "Rate_ID", "Rate_Source_ID",
        "Unit_Rate_NPR", "Rate_Version", "Scope_Family", "Pricing_Option",
        "Approval_Status", "Approved_By", "Source_Link"]),
    "boq": ("03_BOQ", ["Work_Item_ID", "Description", "Derived_Verified_Quantity"]),
    "aoc": ("04_AOC", ["Cost_Group", "BOQ_Subtotal_NPR"]),
    "contractor": ("05_CONTRACTOR_RA", ["RA_Bill_ID", "Project_ID"]),
    "vendor": ("06_VENDOR_INVOICES", ["Invoice_ID", "Project_ID"]),
    "payments": ("07_PAYMENT_ALLOCATIONS", ["Payment_ID", "Organization_ID"]),
    "history": ("90_VERSION_HISTORY", ["Version", "Date_NPT", "Operation"]),
}
RANGES = [(key, name, "'" + name + "'!A1:P500") for key, (name, _) in TABS.items()]


def populated(row):
    return any(str(value).strip() for value in row)


def value(row, idx):
    return str(row[idx]).strip() if idx < len(row) and row[idx] is not None else ""


def positive_number(v, field):
    if isinstance(v, bool):
        raise ValueError(field + ": boolean is not a quantity")
    try:
        n = float(v)
    except (ValueError, TypeError):
        raise ValueError(field + ": invalid number") from None
    if not math.isfinite(n) or n <= 0:
        raise ValueError(field + ": must be finite and positive")
    return n


def nonnegative_number(v, field):
    n = float(v)
    if not math.isfinite(n) or n < 0:
        raise ValueError(field + ": must be finite and nonnegative")
    return n


def check_tabs(data):
    for key, (title, expected) in TABS.items():
        rows = data.get(key)
        if not isinstance(rows, list) or not rows:
            raise ValueError("Missing live tab " + title)
        if [value(rows[0], i) for i in range(len(expected))] != expected:
            raise ValueError("Sheet header drift in " + title)
    return data


def project(data, baseline, catalog, generated_at):
    check_tabs(data)
    valid_work_ids = {w["workId"] for w in catalog["works"]}
    if len(valid_work_ids) != len(catalog["works"]):
        raise ValueError("Invalid work catalog")
    versions = [
        value(row, 0) for row in data["history"][1:]
        if re.fullmatch(r"V\d{6}", value(row, 0))
    ]
    if not versions:
        raise ValueError("Live source has no version ledger")
    latest_version = max(versions)

    measurements, rates, rejected = [], [], {"measurements": 0, "rates": 0}
    seen_m, seen_r = set(), set()
    for row in data["measurements"][1:]:
        if not populated(row):
            continue
        if value(row, 13).upper() != "VERIFIED":
            rejected["measurements"] += 1
            continue
        if value(row, 1) != PROJECT or value(row, 2) != ORG:
            raise ValueError("Verified measurement mismatches project or organization")
        required = [0, 3, 4, 5, 6, 7, 8, 11, 12, 14, 15]
        if any(not value(row, i) for i in required):
            raise ValueError("Verified measurement lacks source, revision, approval or unit")
        if value(row, 3) not in valid_work_ids:
            raise ValueError("Verified measurement has unknown work taxonomy")
        mid = value(row, 0)
        if mid in seen_m:
            raise ValueError("Duplicate verified measurement ID")
        seen_m.add(mid)
        measurements.append({
            "measurementId": mid,
            "projectId": PROJECT,
            "organizationId": ORG,
            "workId": value(row, 3),
            "workItemId": value(row, 4),
            "locationOrGrid": value(row, 5),
            "measurementMethod": value(row, 6),
            "sourceRevision": value(row, 7),
            "sourceEvidenceId": value(row, 8),
            "quantity": positive_number(row[10] if len(row) > 10 else None, "quantity"),
            "unit": value(row, 11),
            "measuredDate": value(row, 12),
            "verificationStatus": "VERIFIED"
        })

    for row in data["rates"][1:]:
        if not populated(row):
            continue
        if value(row, 8).upper() != "APPROVED":
            rejected["rates"] += 1
            continue
        required = [0, 1, 2, 3, 5, 6, 7, 9, 10]
        if any(not value(row, i) for i in required):
            raise ValueError("Approved rate lacks source, approval or scope")
        key = (value(row, 0), value(row, 1))
        if key in seen_r:
            raise ValueError("Duplicate approved rate selection")
        seen_r.add(key)
        rates.append({
            "workItemId": key[0],
            "unit": key[1],
            "rateId": value(row, 2),
            "sourceId": value(row, 3),
            "unitRateNpr": nonnegative_number(row[4] if len(row) > 4 else None, "unit rate"),
            "rateVersion": value(row, 5),
            "scopeFamily": value(row, 6),
            "pricingOption": value(row, 7),
            "status": "APPROVED"
        })

    output = deepcopy(baseline)
    if output["schema"] != "jp.project-costing.projection.v1" or output["projectId"] != PROJECT:
        raise ValueError("Unexpected project template / cross-project import")
    if output["sourceAuthorities"]["measurementBookSheetId"] != SHEET_ID:
        raise ValueError("LIVE workbook authority was changed")
    if not isinstance(generated_at, str) or not generated_at.endswith("Z"):
        raise ValueError("Invalid generation timestamp")
    output["sourceVersion"] = latest_version
    output["measurementRows"] = measurements
    output["rateSelections"] = rates
    # Derived BOQ stays in the existing JS calculation engine; approved BOQ
    # and actual paid transactions are NOT inferred from a source tab.
    output["boqRows"] = []
    output["publicSnapshot"] = {
        "generatedAtUtc": generated_at,
        "authenticatedSourceFetch": True,
        "sourceAdmission": "VERIFIED_MEASUREMENT_INPUTS" if measurements
                           else "LIVE_SHEET_READ_NO_VERIFIED_MEASUREMENTS",
        "scope": "VERIFIED_INPUTS_PENDING_DERIVED_BOQ" if measurements else "TEMPLATE_ONLY",
        "admittedMeasurementRows": len(measurements),
        "admittedRateSelections": len(rates),
        "unadmittedRows": rejected,
        "otherTabs": {
            key: sum(populated(row) for row in data[key][1:])
            for key in ("boq", "aoc", "contractor", "vendor", "payments")
        },
        "sourceFingerprintSha256": sha256(json.dumps(
            data, ensure_ascii=False, separators=(",", ":"), sort_keys=True
        ).encode("utf-8")).hexdigest(),
        "financeSourceIndependentlyOwned": True
    }
    output["notes"] = [
        "Authenticated read-only source: Amrit original LIVE measurement and costing workbook.",
        "Only explicitly VERIFIED measurement rows with approval, source ID and drawing revision are admitted.",
        "Rate selections require explicit APPROVED status and source, scope and approver.",
        "Client indicative rates are not treated as approved rates or measured quantities.",
        "Draft BOQ is calculated by the existing shared JS engine; totals need separate approval.",
        "Other source tabs and Finance transactions are NOT silently certified as payable.",
        "No external raw Source_Link, account, credential or private contact is published."
    ]
    return output


def self_test():
    base = json.loads((ROOT / BASE / "project-costing.json").read_text())
    catalog = json.loads((ROOT / "templates/project-costing/v1/work-catalog.json").read_text())
    w = catalog["works"][0]
    fixture = {key: [headers] for key, (_, headers) in TABS.items()}
    fixture["history"].append(["V000001", "2026-10-31", "PROJECT_INITIAL_LIVE_CREATE"])
    empty = project(fixture, base, catalog, "2026-11-09T00:00:00Z")
    assert empty["measurementRows"] == [] and empty["publicSnapshot"]["authenticatedSourceFetch"]
    assert empty["boqRows"] == [] and empty["aoc"]["grandTotalNpr"] is None
    fixture["measurements"].append([
        "TEST-M001", PROJECT, ORG, w["workId"], "ITEM-1", "A1",
        "CAD source-derived dimensions", "CAD-REV1", "CAD-EVIDENCE-1",
        "test-only", 2.5, "m³", "2026-11-09", "VERIFIED", "TEST-QA", "https://example.com/test"
    ])
    fixture["rates"].append([
        "ITEM-1", "m³", "TEST-R1", "TEST-SOURCE-1", 500, "V000001",
        "STRUCTURE", "CIVIL_TRADE", "APPROVED", "TEST-QA", "https://example.com/test"
    ])
    admitted = project(fixture, base, catalog, "2026-11-09T00:00:00Z")
    assert len(admitted["measurementRows"]) == len(admitted["rateSelections"]) == 1
    assert admitted["boqRows"] == [] and admitted["sourceVersion"] == "V000001"
    assert "https://example.com" not in json.dumps(admitted)
    fixture["measurements"][1][1] = "WRONG-PROJECT"
    try:
        project(fixture, base, catalog, "2026-11-09T00:00:00Z")
        raise AssertionError("Cross-project acceptance")
    except ValueError as exc:
        assert "project or organization" in str(exc)
    fixture["measurements"][1][1] = PROJECT
    fixture["measurements"][1][13] = "DRAFT"
    not_admitted = project(fixture, base, catalog, "2026-11-09T00:00:00Z")
    assert not not_admitted["measurementRows"] and not_admitted["publicSnapshot"]["unadmittedRows"]["measurements"] == 1
    print("AMRIT INTAKE SELF-TEST PASS: empty, admitted, rejected, privacy and cross-project guards")


def read_live():
    import google.auth
    from google.auth.transport.requests import AuthorizedSession
    credentials, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"])
    session = AuthorizedSession(credentials)
    response = session.get(
        "https://sheets.googleapis.com/v4/spreadsheets/" + SHEET_ID + "/values:batchGet",
        params=[("ranges", rng) for _, _, rng in RANGES] +
               [("valueRenderOption", "UNFORMATTED_VALUE")],
        timeout=40
    )
    response.raise_for_status()
    payload = response.json()
    regions = payload.get("valueRanges", [])
    if len(regions) != len(RANGES):
        raise ValueError("Expected exactly nine original tabs")
    return {key: region.get("values", []) for (key, _, _), region in zip(RANGES, regions)}


if __name__ == "__main__":
    cli = argparse.ArgumentParser()
    cli.add_argument("--self-test", action="store_true")
    cli.add_argument("--output", help="Path to Pages-staged project-costing.json; never original LIVE Sheet")
    args = cli.parse_args()
    if args.self_test:
        self_test()
    else:
        if not args.output:
            cli.error("--output is mandatory; committed source snapshots are never overwritten")
        dest = Path(args.output).resolve()
        if not str(dest).endswith("/_site/" + BASE + "/project-costing.json"):
            raise ValueError("Refusing to write outside staged public Pages projection")
        data = read_live()
        baseline = json.loads((ROOT / BASE / "project-costing.json").read_text())
        catalog = json.loads((ROOT / "templates/project-costing/v1/work-catalog.json").read_text())
        timestamp = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
        output = project(data, baseline, catalog, timestamp)
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
        status = output["publicSnapshot"]
        print("AMRIT LIVE PROJECT SHEET READ PASS: verified measurements=" +
              str(status["admittedMeasurementRows"]) +
              "; approved rate selections=" + str(status["admittedRateSelections"]) +
              "; no unverified quantities, BOQ approvals or payments created")
