#!/usr/bin/env python3
"""End-to-end check of scrape.py against a local mock of the site's structure.

Serves listing pages at /type/<slug>/<n>/ and profile pages at /doctor/<id>/,
in three different markup styles (JSON-LD, definition list, table), then runs
the real crawler against it and asserts the workbook comes out correct.

    python test_scrape.py
"""

from __future__ import annotations

import http.server
import socketserver
import sys
import tempfile
import threading
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import scrape  # noqa: E402

PER_PAGE = 5
CATEGORY_SIZES = {"dentists": 12, "chinese-medicine": 8, "doctors": 14, "physiotherapists": 6}
DISTRICTS = ["中西區", "灣仔區", "東區"]
SPECIALTIES = ["牙科普通科", "內科", "骨科"]


def profile_id(slug: str, index: int) -> str:
    return f"{slug}-{index}"


def listing_html(slug: str, page: int) -> str:
    total = CATEGORY_SIZES[slug]
    pages = (total + PER_PAGE - 1) // PER_PAGE
    start = (page - 1) * PER_PAGE
    rows = "".join(
        f'<li><a href="/doctor/{profile_id(slug, i)}/">醫師 {i}</a></li>'
        for i in range(start, min(start + PER_PAGE, total))
    )
    pager = "".join(f'<a href="/type/{slug}/{p}/">{p}</a> ' for p in range(1, pages + 1))
    nav = "".join(f'<a href="/type/{s}/">{s}</a> ' for s in CATEGORY_SIZES)
    return f"""<html><head><title>{slug} 名單</title></head><body>
    <nav>{nav}<a href="/about/">關於</a></nav>
    <ul>{rows}</ul><div class="pagination">{pager}</div></body></html>"""


def type_index_html() -> str:
    labels = {"dentists": "牙醫", "chinese-medicine": "中醫師",
              "doctors": "醫生", "physiotherapists": "物理治療師"}
    links = "".join(f'<a href="/type/{s}/">{l}名單</a> ' for s, l in labels.items())
    return f"<html><body><h1>按類別</h1>{links}</body></html>"


def profile_html(slug: str, index: int) -> str:
    """Rotate through three markup styles so all parser paths get exercised."""
    name = f"陳大文 {slug} {index}"
    phone = f"2{index:03d} {1000 + index}"
    fax = f"3{index:03d} {2000 + index}"
    email = f"{slug}{index}@example.com"
    address = f"香港{DISTRICTS[index % 3]}示範道 {index} 號 {index}樓"
    district = DISTRICTS[index % 3]
    specialty = SPECIALTIES[index % 3]
    crumbs = (f'<a href="/district/d{index % 3}/">{district}</a>'
              f'<a href="/specialist/s{index % 3}/">{specialty}</a>')
    style = index % 3

    if style == 0:
        body = f"""<script type="application/ld+json">{{
          "@context":"https://schema.org","@type":"Physician",
          "name":"{name}","telephone":"{phone}","faxNumber":"{fax}",
          "email":"{email}","medicalSpecialty":"{specialty}",
          "address":{{"@type":"PostalAddress","streetAddress":"{address}",
                      "addressLocality":"{district}"}}
        }}</script><h1>{name}</h1>{crumbs}"""
    elif style == 1:
        body = f"""<h1>{name}</h1>{crumbs}
        <dl><dt>診所名稱</dt><dd>{slug} 醫務中心</dd>
            <dt>地址</dt><dd>{address}</dd>
            <dt>電話</dt><dd>{phone}</dd>
            <dt>傳真</dt><dd>{fax}</dd>
            <dt>電郵</dt><dd>{email}</dd>
            <dt>地區</dt><dd>{district}</dd>
            <dt>專科</dt><dd>{specialty}</dd>
            <dt>應診時間</dt><dd>星期一至五 09:00-18:00</dd></dl>"""
    else:
        body = f"""<h1>{name}</h1>{crumbs}
        <table>
          <tr><th>地址</th><td>{address}</td></tr>
          <tr><th>電話</th><td>{phone}</td></tr>
          <tr><th>傳真</th><td>{fax}</td></tr>
          <tr><th>註冊編號</th><td>M{10000 + index}</td></tr>
          <tr><th>地區</th><td>{district}</td></tr>
          <tr><th>專科</th><td>{specialty}</td></tr>
        </table>
        <p>電郵：{email}</p><a href="mailto:{email}">聯絡</a>"""

    return f"<html><head><title>{name} | hkdoctorlist</title></head><body>{body}</body></html>"


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args):  # silence per-request logging
        pass

    def do_GET(self):
        path = self.path.split("?")[0]
        parts = [p for p in path.split("/") if p]
        html = None

        if path == "/robots.txt":
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write(b"User-agent: *\nDisallow: /admin/\n")
            return

        if parts == ["type"]:
            html = type_index_html()
        elif len(parts) >= 2 and parts[0] == "type" and parts[1] in CATEGORY_SIZES:
            slug = parts[1]
            page = int(parts[2]) if len(parts) > 2 and parts[2].isdigit() else 1
            pages = (CATEGORY_SIZES[slug] + PER_PAGE - 1) // PER_PAGE
            if 1 <= page <= pages:
                html = listing_html(slug, page)
        elif len(parts) == 2 and parts[0] == "doctor":
            slug, _, idx = parts[1].rpartition("-")
            if slug in CATEGORY_SIZES and idx.isdigit():
                html = profile_html(slug, int(idx))

        if html is None:
            self.send_error(404)
            return
        payload = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def main() -> int:
    with socketserver.TCPServer(("127.0.0.1", 0), Handler) as httpd:
        port = httpd.server_address[1]
        threading.Thread(target=httpd.serve_forever, daemon=True).start()
        scrape.BASE = f"http://127.0.0.1:{port}"

        tmp = Path(tempfile.mkdtemp())
        cache = scrape.Cache(tmp / "cache.sqlite")
        fetcher = scrape.Fetcher(cache, delay=0.0, timeout=10, retries=1)

        categories = scrape.verify_category_slugs(fetcher)
        assert set(categories) == set(CATEGORY_SIZES), categories

        data = {}
        for slug, tab in categories.items():
            data[tab] = scrape.scrape_category(fetcher, slug, tab, None, workers=4)

        failures: list[str] = []

        for slug, tab in categories.items():
            got, want = len(data[tab]), CATEGORY_SIZES[slug]
            if got != want:
                failures.append(f"{tab}: got {got} records, expected {want}")

        required = ("name", "address", "phone", "fax", "email", "district", "specialty")
        for tab, records in data.items():
            for rec in records:
                missing = [k for k in required if not rec.get(k)]
                if missing:
                    failures.append(f"{tab} {rec.url}: missing {missing}")

        # Spot-check exact values across all three markup styles.
        dentists = {r.url: r for r in data["牙醫"]}
        for idx in (0, 1, 2):
            url = f"{scrape.BASE}/doctor/dentists-{idx}/"
            rec = dentists.get(url)
            if not rec:
                failures.append(f"missing profile {url}")
                continue
            checks = {
                "phone": f"2{idx:03d} {1000 + idx}",
                "fax": f"3{idx:03d} {2000 + idx}",
                "email": f"dentists{idx}@example.com",
                "district": DISTRICTS[idx % 3],
                "specialty": SPECIALTIES[idx % 3],
            }
            for key, want in checks.items():
                if rec.get(key) != want:
                    failures.append(
                        f"style {idx} {key}: got {rec.get(key)!r}, expected {want!r}")
            if f"示範道 {idx} 號" not in rec.get("address"):
                failures.append(f"style {idx} address: got {rec.get('address')!r}")

        out = tmp / "out.xlsx"
        scrape.write_workbook(data, out)

        from openpyxl import load_workbook
        wb = load_workbook(out)
        expected_tabs = ["說明 Summary", "牙醫", "中醫師", "醫生", "物理治療師"]
        if wb.sheetnames != expected_tabs:
            failures.append(f"tabs: got {wb.sheetnames}, expected {expected_tabs}")
        for slug, tab in categories.items():
            if tab in wb.sheetnames:
                rows = wb[tab].max_row - 1
                if rows != CATEGORY_SIZES[slug]:
                    failures.append(f"{tab} sheet: {rows} rows, expected {CATEGORY_SIZES[slug]}")

        httpd.shutdown()

        if failures:
            print("FAILED:")
            for f in failures:
                print("  -", f)
            return 1
        total = sum(len(r) for r in data.values())
        print(f"PASS - {total} records across {len(data)} tabs, workbook verified")
        print(f"  sample workbook: {out}")
        return 0


if __name__ == "__main__":
    sys.exit(main())
