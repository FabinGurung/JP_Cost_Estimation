#!/usr/bin/env python3
"""Authenticated Fabin normalized Google Sheet -> PUBLIC-SAFE, unapproved aggregate projection.

Read-only. Source has six project tabs, normalized rows, a five-project Total
and documented unresolved exceptions. No party names, transaction rows,
internal Google Sheet IDs, source URLs or service-account credentials leave
this script. Unlike KKG's verified payment snapshot, these source amounts
remain explicitly UNVERIFIED; no paid/approved status is inferred.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from hashlib import sha256
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ID = "1_MYCZ98tsfmWgTn_-jQBU9OcdrygwC9nlE9BF1gWK2k"
OUTPUT = ROOT / "fabin-payments-public.json"
SOURCE_TABS = (
    "04_Basketball", "09_prithivi Mandi", "14_kharika_poudel",
    "13_hari_baral", "31_sharada_adhikari", "14_bishal_paija"
)
SUMMARY_ORDER = (
    "14_bishal_paija", "31_sharada_adhikari", "09_prithivi Mandi",
    "14_kharika_poudel", "13_hari_baral"
)
SHEET_RANGES = {
    "00_MANIFEST": "A1:C40",
    "01_PROJECTS": "A1:J30",
    "02_PARTY_REGISTER": "A1:M700",
    "03_PAYMENT_EVENTS": "A1:P2000",
    "04_RECONCILIATION": "A1:J30",
    "05_PROJECT_SUMMARY": "A1:J30",
    "06_REVIEW_QUEUE": "A1:G150",
    "90_VERSION_HISTORY": "A1:J150",
    "Total": "A1:E15",
}
for _tab in SOURCE_TABS:
    SHEET_RANGES[_tab] = "A1:F500"

HEADERS = {
    "00_MANIFEST": ["Field", "Value", "Purpose / context"],
    "01_PROJECTS": ["Source_Tab", "Source_Project_Name", "Company_As_Recorded",
                    "Approved_Project_ID", "Included_In_Source_Total",
                    "Source_Declared_NPR", "Source_QR_NPR", "Source_Discount_NPR",
                    "Approval_Status", "Review_Note"],
    "02_PARTY_REGISTER": ["Party_Row_ID", "Source_Tab", "Source_Header_Row",
                          "Party_As_Recorded", "Summary_Row", "Declared_Amount_NPR",
                          "Declared_QR_NPR", "Declared_Discount_NPR", "Detail_Amount_NPR",
                          "Difference_NPR", "Event_Count", "Review_State", "Notes"],
    "03_PAYMENT_EVENTS": ["Event_ID", "Source_Tab", "Source_Project", "Party_Row_ID",
                          "Party_As_Recorded", "Original_Row", "Time_As_Recorded",
                          "Date_As_Recorded", "Amount_As_Recorded_NPR",
                          "QR_As_Recorded_NPR", "Discount_As_Recorded_NPR",
                          "Transaction_Class", "Approval_Status", "Review_Flags",
                          "Original_A1_Range", "Source_Version"],
    "04_RECONCILIATION": ["Source_Tab", "Project_As_Recorded", "Source_Declared_NPR",
                          "Normalized_Events_NPR", "Difference_NPR", "Event_Count",
                          "Party_Sections", "Review_Issues", "Result",
                          "Include_In_Five_Project_Total"],
    "05_PROJECT_SUMMARY": ["Source_Tab", "Project_As_Recorded", "Company_As_Recorded",
                           "Workbook_Source_Amount_NPR", "Normalized_Event_Amount_NPR",
                           "Difference_NPR", "Source_Total_Included", "Review_State",
                           "Approval", "Notes"],
    "06_REVIEW_QUEUE": ["Issue_Code", "Source_Tab", "Subject", "Original_Range",
                         "Description", "Value_or_Count", "Status"],
    "90_VERSION_HISTORY": ["Version", "Date_NPT", "Operation", "Changed_Ranges",
                           "Evidence_File", "PRE_Backup_File", "Reviewer", "Status",
                           "Notes", "POST_Backup_File"],
}


class SourceError(Exception):
    pass


def val(row, i):
    return str(row[i]).strip() if i < len(row) and row[i] is not None else ""


def money(value, *, required=True):
    raw = str(value or "").strip().replace(",", "").replace("NPR", "").strip()
    if not raw:
        if required:
            raise SourceError("FINANCIAL_FIELD_MISSING")
        return Decimal("0")
    try:
        amount = Decimal(raw)
    except InvalidOperation:
        raise SourceError("FINANCIAL_FIELD_INVALID") from None
    if not amount.is_finite() or amount.as_tuple().exponent < -3:
        raise SourceError("FINANCIAL_FIELD_PRECISION_OR_NAN")
    return amount


def complete(rows, expected, tab):
    if not rows or [val(rows[0], i) for i in range(len(expected))] != expected:
        raise SourceError("HEADER_DRIFT_" + tab.replace(" ", "_"))
    return [r for r in rows[1:] if any(val(r, i) for i in range(len(expected)))]


def derive(data, now=None):
    for tab, header in HEADERS.items():
        if tab not in data:
            raise SourceError("MISSING_REQUIRED_TAB")
        complete(data[tab], header, tab)
    if "Total" not in data or [val(data["Total"][0], i) for i in range(5)] != [
            "Project", "Amount", "QR", "Discount", "Company"]:
        raise SourceError("LEGACY_TOTAL_SCHEMA_CHANGED")

    manifest = {val(row, 0): val(row, 1)
                for row in complete(data["00_MANIFEST"], HEADERS["00_MANIFEST"], "00_MANIFEST")}
    version = manifest.get("Current_Register_Version", "")
    if version != "V000001" or manifest.get("Native_Google_Sheet_ID") != SOURCE_ID:
        raise SourceError("UNEXPECTED_SOURCE_ID_OR_VERSION")
    if manifest.get("Business_Approval") != "NOT_APPROVED":
        raise SourceError("REVIEW_ADMISSION_NOT_IMPLEMENTED")
    histories = complete(data["90_VERSION_HISTORY"], HEADERS["90_VERSION_HISTORY"], "90_VERSION_HISTORY")
    if version not in [val(x, 0) for x in histories]:
        raise SourceError("MISSING_VERSION_HISTORY")

    project_rows = complete(data["01_PROJECTS"], HEADERS["01_PROJECTS"], "01_PROJECTS")
    project_summaries = complete(data["05_PROJECT_SUMMARY"], HEADERS["05_PROJECT_SUMMARY"], "05_PROJECT_SUMMARY")
    reconcile_rows = complete(data["04_RECONCILIATION"], HEADERS["04_RECONCILIATION"], "04_RECONCILIATION")
    party_rows = complete(data["02_PARTY_REGISTER"], HEADERS["02_PARTY_REGISTER"], "02_PARTY_REGISTER")
    event_rows = complete(data["03_PAYMENT_EVENTS"], HEADERS["03_PAYMENT_EVENTS"], "03_PAYMENT_EVENTS")
    review_rows = complete(data["06_REVIEW_QUEUE"], HEADERS["06_REVIEW_QUEUE"], "06_REVIEW_QUEUE")

    if len(project_rows) != len(SOURCE_TABS) or len(project_summaries) != len(SOURCE_TABS) \
            or len(reconcile_rows) != len(SOURCE_TABS):
        raise SourceError("PROJECT_REGISTER_INCOMPLETE")
    projects = {}
    for row in project_rows:
        tab = val(row, 0)
        if tab not in SOURCE_TABS or tab in projects:
            raise SourceError("UNKNOWN_OR_DUPLICATE_PROJECT_TAB")
        if val(row, 4) != ("NO" if tab == "04_Basketball" else "YES"):
            raise SourceError("EXCLUDED_PROJECT_SCOPE_CHANGED")
        if val(row, 8) != "UNREVIEWED":
            raise SourceError("REVIEW_APPROVAL_NOT_IMPLEMENTED")
        projects[tab] = row

    party_ids = set()
    for row in party_rows:
        pid, tab = val(row, 0), val(row, 1)
        if not pid or pid in party_ids or tab not in projects:
            raise SourceError("PARTY_ID_DUPLICATE_OR_CROSS_PROJECT")
        party_ids.add(pid)
    if not party_ids:
        raise SourceError("EMPTY_PARTY_REGISTER")

    count_by_tab = {tab: 0 for tab in SOURCE_TABS}
    sums = {tab: Decimal("0") for tab in SOURCE_TABS}
    seen_event_ids = set()
    raw_event_refs = set()
    for row in event_rows:
        event_id, tab, party_id = val(row, 0), val(row, 1), val(row, 3)
        if not event_id or event_id in seen_event_ids or tab not in projects or party_id not in party_ids:
            raise SourceError("DUPLICATE_OR_INVALID_EVENT_ID")
        seen_event_ids.add(event_id)
        try:
            original_row = int(val(row, 5))
        except ValueError:
            raise SourceError("SOURCE_ROW_MISSING") from None
        if original_row < 2 or (tab, original_row) in raw_event_refs:
            raise SourceError("SOURCE_ROW_DUPLICATE_OR_INVALID")
        raw_event_refs.add((tab, original_row))
        source_rows = data.get(tab, [])
        if original_row > len(source_rows):
            raise SourceError("ORIGINAL_PAYMENT_ROW_MISSING")
        original = source_rows[original_row - 1]
        if val(original, 0) != val(row, 6) or val(original, 1) != val(row, 7):
            raise SourceError("ORIGINAL_PAYMENT_DATE_TIME_CHANGED")
        amt = money(val(row, 8))
        if money(val(original, 2)) != amt:
            raise SourceError("ORIGINAL_PAYMENT_AMOUNT_CHANGED")
        if val(row, 11) != "UNCLASSIFIED" or val(row, 12) != "SOURCE_ONLY_NOT_APPROVED":
            raise SourceError("UNAPPROVED_TRANSACTION_CLASSIFICATION")
        if val(row, 15) != version or val(row, 14) != "'{}'!A{}:E{}".format(
                tab, original_row, original_row):
            raise SourceError("SOURCE_ROW_LINEAGE_BROKEN")
        sums[tab] += amt
        count_by_tab[tab] += 1

    if len(event_rows) != len(seen_event_ids) or not event_rows:
        raise SourceError("EMPTY_OR_DUPLICATE_EVENT_LEDGER")

    from_summary = {val(row, 0): row for row in project_summaries}
    from_reconcile = {val(row, 0): row for row in reconcile_rows}
    if set(from_summary) != set(projects) or set(from_reconcile) != set(projects):
        raise SourceError("PROJECT_SUMMARY_TAB_COVERAGE_CHANGED")

    publicly_displayed = []
    source_total, ledger_total = Decimal("0"), Decimal("0")
    for tab in SOURCE_TABS:
        p, s, rec = projects[tab], from_summary[tab], from_reconcile[tab]
        raw = data.get(tab, [])
        source_totals = [r for r in raw[1:65] if val(r, 1).lower() == "total"]
        if len(source_totals) != 1:
            raise SourceError("SOURCE_PROJECT_TOTAL_MISSING")
        declared = money(val(source_totals[0], 2))
        if any(money(val(r, idx)) != declared for r, idx in [(p, 5), (s, 3), (rec, 2)]):
            raise SourceError("PROJECT_SOURCE_AMOUNT_DRIFT")
        if money(val(s, 4)) != sums[tab] or money(val(rec, 3)) != sums[tab]:
            raise SourceError("NORMALIZED_SUMMARY_NOT_RECALCULATED")
        delta = sums[tab] - declared
        if money(val(s, 5)) != delta or money(val(rec, 4)) != delta:
            raise SourceError("RECONCILIATION_DIFFERENCE_CHANGED")
        if int(val(rec, 5)) != count_by_tab[tab]:
            raise SourceError("PAYMENT_ENTRY_COUNT_DRIFT")
        if val(s, 8) != "NOT_APPROVED":
            raise SourceError("SUMMARY_CANNOT_ASSERT_APPROVAL")
        if val(s, 6) != ("NO" if tab == "04_Basketball" else "YES"):
            raise SourceError("SOURCE_TOTAL_INCLUSION_DRIFT")
        if tab == "04_Basketball":
            continue
        if delta != 0 and not any(val(e, 0) == "PROJECT_TOTAL_CONFLICT"
                                 and val(e, 1) == tab for e in review_rows):
            raise SourceError("UNREVIEWED_AMOUNT_DIFFERENCE")
        source_total += declared
        ledger_total += sums[tab]
        publicly_displayed.append({
            "sourceProject": val(p, 1),
            "companyAsRecorded": val(p, 2),
            "sourceAmountNpr": float(declared),
            "normalizedEntriesNpr": float(sums[tab]),
            "differenceNpr": float(delta),
            "entryCount": count_by_tab[tab],
            "reconciliation": "SOURCE_TOTAL_CONFLICT" if delta else "ARITHMETIC_MATCH_ONLY",
            "approval": "NOT_VERIFIED"
        })

    raw_summary = data["Total"]
    if len(raw_summary) < 7 or val(raw_summary[6], 0) != "Total":
        raise SourceError("SOURCE_FIVE_PROJECT_TOTAL_MISSING")
    for i, tab in enumerate(SUMMARY_ORDER, start=1):
        if money(val(raw_summary[i], 1)) != money(val(projects[tab], 5)):
            raise SourceError("FIVE_PROJECT_SOURCE_SUMMARY_CHANGED")
    if money(val(raw_summary[6], 1)) != source_total:
        raise SourceError("CROSS_PROJECT_TOTAL_DRIFT")
    if money(manifest.get("Source_Reported_Grand_Total_NPR")) != source_total:
        raise SourceError("MANIFEST_TOTAL_DRIFT")

    timestamp = now or datetime.now(timezone.utc)
    return {
        "schema": "jp.fabin-payments.source-aggregate.v1",
        "sourceVersion": version,
        "generatedAtUtc": timestamp.isoformat(timespec="seconds").replace("+00:00", "Z"),
        "authenticatedSourceFetch": True,
        "publicationStatus": "SOURCE_REPORTED_NOT_VERIFIED",
        "amountMeaning": "SOURCE_REPORTED_NOT_CERTIFIED_PAID",
        "currency": "NPR",
        "sourceProjectCount": len(publicly_displayed),
        "sourceDeclaredGrandTotalNpr": float(source_total),
        "normalizedEventsGrandTotalNpr": float(ledger_total),
        "reconciliationDifferenceNpr": float(ledger_total - source_total),
        "sourceEventCount": len(event_rows),
        "sourcePartySectionCount": len(party_ids),
        "reviewQueueIssueCount": len(review_rows),
        "projects": publicly_displayed,
        "exclusions": ["04_Basketball: possible overlap with 09 Prithivi Mandi"],
        "cautions": [
            "All amounts are self-reported source-book values, not certified payments.",
            "Project IDs, vendors, dates, refunds and source invoices require review.",
            "Hari Baral detailed rows exceed its stated project source total by NPR 500.",
            "The Basketball tab is excluded to avoid potential double counting."
        ],
        "privacy": {
            "publishedIndividualTransactions": 0,
            "publishedPartyNames": 0,
            "publishedRawSourceUrls": 0,
            "officialProjectIdentityVerified": False
        },
        "checks": {
            "sourceAndNormalizedSummaryMatched": True,
            "allPaymentSourceRowsTraceable": True,
            "projectSummaryExcludesBasketball": True,
            "allTransactionsUnapproved": True
        }
    }


def fetch_google():
    try:
        import google.auth
        from google.auth.transport.requests import AuthorizedSession
        credentials, _ = google.auth.default(
            scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
        )
        session = AuthorizedSession(credentials)
        params = [("ranges", "'{}'!{}".format(tab.replace("'", "''"), range_a1))
                  for tab, range_a1 in SHEET_RANGES.items()]
        params.append(("valueRenderOption", "FORMATTED_VALUE"))
        response = session.get(
            "https://sheets.googleapis.com/v4/spreadsheets/{}/values:batchGet".format(SOURCE_ID),
            params=params, timeout=70
        )
        response.raise_for_status()
        result = response.json().get("valueRanges", [])
        if len(result) != len(SHEET_RANGES):
            raise SourceError("SOURCE_TABS_NOT_ALL_AVAILABLE")
        return {name: result[i].get("values", [])
                for i, name in enumerate(SHEET_RANGES)}
    except SourceError:
        raise
    except Exception:
        # Never print private source cells, provider auth headers or private URLs.
        raise SourceError("AUTHENTICATED_FABIN_SOURCE_READ_FAILED") from None


def self_test():
    assert money("1,234.500") == Decimal("1234.500")
    assert money("-18,000") == Decimal("-18000")
    assert money("", required=False) == 0
    try:
        money("NaN")
    except SourceError:
        pass
    else:
        raise AssertionError("NaN must fail closed")
    try:
        derive({})
    except SourceError as exc:
        assert str(exc) == "MISSING_REQUIRED_TAB"
    else:
        raise AssertionError("Missing source must fail closed")
    print("FABIN PARSER SELF-TEST PASS: decimal precision, refunds, closed source admission")


if __name__ == "__main__":
    cli = argparse.ArgumentParser()
    cli.add_argument("--self-test", action="store_true")
    cli.add_argument("--output", type=Path, default=OUTPUT)
    args = cli.parse_args()
    if args.self_test:
        self_test()
    else:
        try:
            out = derive(fetch_google())
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n",
                                   encoding="utf-8")
            print("FABIN NORMALIZED LIVE READ PASS: {} projects, {} entries, "
                  "{} review issues; source-reported UNVERIFIED aggregates only".format(
                      out["sourceProjectCount"], out["sourceEventCount"],
                      out["reviewQueueIssueCount"]))
        except SourceError as exc:
            raise SystemExit("FABIN_SOURCE_REFRESH_FAILED: " + str(exc)) from None
