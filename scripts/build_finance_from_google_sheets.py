#!/usr/bin/env python3
"""Read ONLY approved visible KKG finance source tabs and derive Pages JSON.

Intended for authenticated GitHub Actions deployment. No write to Google Sheets,
no hidden tabs or internal payment IDs in the output, no false stale fallback.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
import json
from pathlib import Path
import re

SOURCE_ID = "1S1fkWzo6XGzyD3p92_pTG32zZ9fF3YICAv3HPTomZsE"
SOURCE_URL = "https://docs.google.com/spreadsheets/d/" + SOURCE_ID + "/edit"
SOURCE_TAB = "14_bishal_paija"
SUMMARY_TAB = "KKG_VENDOR_SUMMARY_AUTO"
OUTPUT = Path(__file__).resolve().parents[1] / "finance-public-snapshot.json"
DATE = re.compile(r"^\d{4}(?:_\d{2}_\d{2}|-\d{2}-\d{2})$")
ERRORS = {"#REF!", "#N/A", "#VALUE!", "#ERROR!", "#DIV/0!", "#NAME?", "#NUM!"}


class SourceError(Exception):
    pass


def at(row, index):
    value = row[index] if index < len(row) else ""
    return str(value or "").strip()


def amount(value, required=False):
    raw = str(value or "").strip().replace(",", "").replace("Rs", "").replace("NPR", "").strip()
    if not raw:
        if required:
            raise SourceError("REQUIRED_AMOUNT_MISSING")
        return None
    if raw in ERRORS:
        raise SourceError("SOURCE_FORMULA_ERROR")
    try:
        n = Decimal(raw)
    except InvalidOperation:
        raise SourceError("INVALID_AMOUNT") from None
    if not n.is_finite() or n < 0 or n.as_tuple().exponent < -2:
        raise SourceError("INVALID_AMOUNT_PRECISION")
    return int(n) if n == n.to_integral_value() else float(n)


def add(rows, field):
    return sum(Decimal(str(r.get(field) or 0)) for r in rows)


def derive(register, source_summary, now=None):
    if len(register) < 36 or at(register[5], 0) != "ID":
        raise SourceError("SOURCE_REGISTER_HEADER_CHANGED")
    vendors = []
    grand_index = None
    for i in range(6, len(register)):
        r = register[i]
        if at(r, 1).lower() == "total":
            grand_index = i
            break
        if not any(str(c or "").strip() for c in r):
            continue
        if at(r, 0) != str(len(vendors) + 1) or not at(r, 1):
            raise SourceError("VENDOR_ORDER_CHANGED")
        vendors.append({
            "id": len(vendors) + 1, "name": at(r, 1),
            "amount_npr": amount(at(r, 2), True),
            "qr_npr": amount(at(r, 3)),
            "discount_npr": amount(at(r, 4)),
            "payment_count": 0
        })
    if grand_index is None or not vendors or len({v["name"] for v in vendors}) != len(vendors):
        raise SourceError("VENDOR_SUMMARY_UNRESOLVED")
    grand = register[grand_index]
    declared_total = amount(at(grand, 2), True)
    declared_qr = amount(at(grand, 3)) or 0
    summary_map = {}
    for row in source_summary[2:]:
        n = at(row, 0)
        if n.isdigit():
            idx = int(n)
            if idx in summary_map:
                raise SourceError("SECONDARY_SUMMARY_DUPLICATE")
            summary_map[idx] = (at(row, 1), amount(at(row, 2), True),
                                amount(at(row, 3)) or 0, amount(at(row, 4)) or 0)
    if len(summary_map) != len(vendors):
        raise SourceError("SECONDARY_SUMMARY_COUNT_MISMATCH")

    payments = []
    ids = set()
    position = grand_index + 1
    for vendor in vendors:
        while position < len(register) and not any(str(c or "").strip() for c in register[position]):
            position += 1
        if position >= len(register) or at(register[position], 0) != vendor["name"]:
            raise SourceError("PAYMENT_SECTION_MISSING_OR_REORDERED")
        position += 1
        if position >= len(register) or at(register[position], 0) != "Date" or at(register[position], 1) != "Amount":
            raise SourceError("PAYMENT_COLUMNS_CHANGED")
        position += 1
        entries = []
        while position < len(register) and at(register[position], 0) != "Total":
            r = register[position]
            position += 1
            if not any(str(c or "").strip() for c in r):
                continue
            dt, internal_id = at(r, 0), at(r, 7)
            if not DATE.fullmatch(dt) or not internal_id:
                raise SourceError("PAYMENT_DATE_OR_ID_INVALID")
            if internal_id in ids:
                raise SourceError("PAYMENT_ID_DUPLICATE")
            ids.add(internal_id)
            entry = {
                "vendor_id": vendor["id"], "vendor": vendor["name"],
                "source_date": dt, "date_system": "BS" if "_" in dt else "AD",
                "paid_time": at(r, 2) or None,
                "amount_npr": amount(at(r, 1), True),
                "qr_npr": amount(at(r, 3)),
                "discount_npr": amount(at(r, 4))
            }
            entries.append(entry)
        if position >= len(register):
            raise SourceError("PAYMENT_SECTION_TOTAL_MISSING")
        total_row = register[position]
        position += 1
        for field, col in [("amount_npr", 1), ("qr_npr", 3), ("discount_npr", 4)]:
            calculated = add(entries, field)
            if calculated != Decimal(str(vendor[field] or 0)):
                raise SourceError("VENDOR_PAYMENT_TOTAL_MISMATCH")
            stated = at(total_row, col)
            if stated and Decimal(str(amount(stated))) != calculated:
                raise SourceError("PAYMENT_SECTION_TOTAL_MISMATCH")
        second = summary_map.get(vendor["id"])
        if not second or second != (vendor["name"], vendor["amount_npr"],
                                   vendor["qr_npr"] or 0, vendor["discount_npr"] or 0):
            raise SourceError("SECONDARY_SUMMARY_VALUE_MISMATCH")
        if not entries:
            raise SourceError("EMPTY_VENDOR_SECTION")
        vendor["payment_count"] = len(entries)
        payments.extend(entries)

    totals = {
        "vendor_count": len(vendors), "payment_count": len(payments),
        "amount_npr": amount(str(add(payments, "amount_npr")), True),
        "qr_npr": amount(str(add(payments, "qr_npr")), True),
        "discount_npr": amount(str(add(payments, "discount_npr")), True)
    }
    for field in ("amount_npr", "qr_npr", "discount_npr"):
        if add(vendors, field) != Decimal(str(totals[field])):
            raise SourceError("VENDOR_GRAND_TOTAL_MISMATCH")
    if totals["amount_npr"] != declared_total or totals["qr_npr"] != declared_qr:
        raise SourceError("REGISTER_GRAND_TOTAL_MISMATCH")
    if not payments:
        raise SourceError("NO_PAYMENT_ENTRIES")

    timestamp = now or datetime.now(timezone.utc)
    return {
        "schema": "jp.finance.public.v1", "version": "0.7.0",
        "verified_on": timestamp.date().isoformat(),
        "publication_mode": "github_actions_google_sheets",
        "source_synced_at_utc": timestamp.isoformat(timespec="seconds"),
        "company": "Rohini Engineering and Builders Pvt. Ltd.", "company_id": "REB",
        "project": "14 Bishal Paija", "project_id": "14_bishal_paija",
        "register": "Krishna Kumar Gupta — Payment to Project", "currency": "NPR",
        "source": {
            "workbook_url": SOURCE_URL, "register_tab": SOURCE_TAB,
            "vendor_range": "A7:E" + str(grand_index + 1),
            "payment_range": "A" + str(grand_index + 2) + ":H" + str(position),
            "mixed_date_systems": any(p["date_system"] == "BS" for p in payments)
                                  and any(p["date_system"] == "AD" for p in payments)
        },
        "totals": totals,
        "checks": {
            "all_payment_ids_unique": True, "all_vendor_totals_match": True,
            "source_grand_totals_match": True, "internal_ids_excluded_from_public_data": True
        },
        "vendors": vendors, "payments": payments
    }


def fetch_google():
    try:
        import google.auth
        from google.auth.transport.requests import AuthorizedSession
        credentials, _ = google.auth.default(
            scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
        )
        session = AuthorizedSession(credentials)
        response = session.get(
            "https://sheets.googleapis.com/v4/spreadsheets/" + SOURCE_ID + "/values:batchGet",
            params=[("ranges", "'14_bishal_paija'!A1:H1005"),
                    ("ranges", "'KKG_VENDOR_SUMMARY_AUTO'!A1:E100"),
                    ("valueRenderOption", "FORMATTED_VALUE")],
            timeout=45
        )
        response.raise_for_status()
        data = response.json().get("valueRanges", [])
        if len(data) != 2:
            raise SourceError("GOOGLE_SOURCE_RANGE_MISSING")
        return [d.get("values", []) for d in data]
    except SourceError:
        raise
    except Exception:
        # Never echo provider errors, credentials or source payload into public Actions logs.
        raise SourceError("AUTHENTICATED_SHEETS_FETCH_FAILED") from None


def self_test():
    rows = [
        ["REGISTER"], [], [], [], [], ["ID", "Name", "Amount", "QR", "Discount"],
        ["1", "Hardware", "100", "10", ""], ["2", "Freight", "20", "", ""],
        ["", "Total", "120", "10"], ["Hardware"], ["Date", "Amount", "Paid Time", "QR", "Discount", "", "", "Entry ID"],
        ["2083_01_17", "100", "2:00 pm", "10", "", "", "", "ID-1"], ["Total", "100", "", "10"],
        ["Freight"], ["Date", "Amount", "Paid Time", "QR", "Discount", "", "", "Entry ID"],
        ["2026-05-27", "20", "", "", "", "", "", "ID-2"], ["Total", "20"]
    ]
    rows += [[] for _ in range(24)]
    summ = [["TITLE"], ["ID", "Vendor", "Amount", "QR", "Discount"],
            ["1", "Hardware", "Rs100", "Rs10"], ["2", "Freight", "Rs20"]]
    result = derive(rows, summ, datetime(2026, 10, 31, tzinfo=timezone.utc))
    assert result["totals"] == {"vendor_count": 2, "payment_count": 2,
                                "amount_npr": 120, "qr_npr": 10, "discount_npr": 0}
    assert all("entry_id" not in x for x in result["payments"])
    assert [p["date_system"] for p in result["payments"]] == ["BS", "AD"]
    rows[11][7] = ""
    try:
        derive(rows, summ)
    except SourceError as e:
        assert str(e) == "PAYMENT_DATE_OR_ID_INVALID"
    else:
        raise AssertionError("Missing internal ID must fail closed")
    print("PASS source parser self-test, reconciled totals and missing-ID rejection")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--output", type=Path, default=OUTPUT)
    args = parser.parse_args()
    if args.self_test:
        self_test()
    else:
        try:
            source, summary = fetch_google()
            data = derive(source, summary)
            path = args.output
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print("PASS authenticated source-derived public finance:", data["totals"]["vendor_count"],
                  "vendors and", data["totals"]["payment_count"], "payments; validated.")
        except SourceError as err:
            raise SystemExit("FINANCE_REFRESH_FAILED: " + str(err)) from None
