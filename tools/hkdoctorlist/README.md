# hkdoctorlist.com.hk → Excel

Scrapes [hkdoctorlist.com.hk](https://www.hkdoctorlist.com.hk/) into a single
`.xlsx` workbook with one tab per category.

| Tab | Source listing | Approx. size |
| --- | --- | --- |
| 牙醫 | `/type/dentists/` | ~1,376 |
| 中醫師 | `/type/chinese-medicine/` | ~2,029 |
| 醫生 | `/type/doctors/` | ~6,478 |
| 物理治療師 | `/type/physiotherapists/` | ~554 |

Roughly **10,400 practitioners**, so a full run fetches ~11,000 pages.

## Columns

Each tab carries: 姓名 Name · 中文姓名 Name (Chinese) · 診所名稱 Clinic ·
地址 Address · 中文地址 Address (Chinese) · 電話 Phone · 電郵 Email · 傳真 Fax ·
地區 District · 專科 Specialty · 資格 Qualifications · 註冊編號 Registration No. ·
語言 Languages · 應診時間 Office Hours · 性別 Gender · 執業類別 Practice Type ·
編號 Provider ID · 個人檔案 Profile URL.

A `說明 Summary` tab records the source, export timestamp, and per-tab counts.
Columns the site does not publish for a given practitioner come out blank —
in particular **email and fax are sparse** on directories like this one, so
expect many empty cells in those two columns rather than a full set.
Practitioners the site files under `/unknown/` have no district, so that cell
is blank by design rather than by extraction failure.

### A note on mangled emails

The site serves some addresses with a bad search/replace applied to its own
data: `diestelandpartners.com` is published as `dies電話andpartners.com`, the
substring `tel` having been swapped for its Chinese label. An email address
can never legitimately contain Chinese characters, so `demangle_email()`
reverses the known label substitutions and the workbook carries the repaired
address. This is a repair of the source's error, not a guess.

## Usage

```bash
pip install -r requirements.txt

python scrape.py --limit 25        # quick smoke test, 25 per category
python scrape.py                   # full run -> hkdoctorlist.xlsx
```

Useful flags:

| Flag | Purpose |
| --- | --- |
| `--out PATH` | workbook path (default `hkdoctorlist.xlsx`) |
| `--limit N` | cap practitioners per category — use this first |
| `--workers N` | concurrent fetches (default 4) |
| `--delay SEC` | min seconds between requests (default 0.4) |
| `--jsonl PATH` | also dump raw records as JSONL |
| `--probe URL` | print exactly how one page is being parsed |
| `--reparse` | rebuild the workbook from cache, no network |

### Cache and resuming

Every fetched page is stored in `hkdoctorlist-cache.sqlite`. Re-running skips
anything already cached, so an interrupted run resumes where it stopped, and
`--reparse` re-applies the extraction rules to cached HTML without re-fetching.
Delete the file to force a fresh crawl.

At the default 0.4s delay with 4 workers, a full run takes roughly 1–2 hours.
Raising `--workers` or lowering `--delay` speeds it up at the cost of being
less polite to the site.

## How the extraction works

The site's exact markup is not hardcoded, since it may change. Each detail page
is read in layers, first match wins:

1. **The page's embedded `providerPayload` / `officeHrRaw` literals**, which the
   detail template ships for its own bookmark and share widgets. This is the
   only clean source for the Chinese name and Chinese district.
2. **schema.org JSON-LD**. Every page carries a site-wide `Organization` node
   and a `BreadcrumbList` alongside the practitioner's own `Physician` /
   `Dentist` node, so only practitioner types are read on the first pass —
   otherwise every doctor is named "香港醫生資料庫".
3. **Heading blocks** — the live layout puts labels in `<h2>` and the value in
   the following siblings, climbing a level when a heading is wrapped with a
   badge (office hours), stopping at the next heading so an empty block such as
   Languages cannot absorb the column beside it.
4. **Label/value pairs** from `<dl>`, `<table>`, and adjacent-sibling markup,
   matched against both Chinese and English label variants.
5. **`label: value` text lines** anywhere on the page.
6. **Direct fallbacks** — `mailto:` / `tel:` links, HK phone-number and email
   regexes, `<h1>`/`<title>` for the name, and `/district/` + `/specialist/`
   breadcrumb links for location and specialty.
7. **Quick-info bar** for gender and practice type, which are bare spans with
   no label of their own.
8. **Label-echo cleanup** — a value that is nothing but the field's own label
   is blanked, so an empty block yields an empty cell.

Listing pagination is read from the page's own pager links, with a
stop-on-two-empty-pages guard in case that count is stale. The profile URL
prefix is inferred from whichever non-navigation path segment dominates the
first listing page, so a change to the profile URL shape does not break it.

### If the site's markup changes

Run `python scrape.py --probe <a profile URL>`. It prints the JSON-LD found,
the label/value pairs detected, and the resulting record field by field. Add
any new label wording to the relevant `Field(...)` entry in `scrape.py`, then
`--reparse` to rebuild from cache without re-crawling.

## Tests

```bash
python test_scrape.py
```

Spins up a local mock of the site — paginated listings plus profile pages in
three different markup styles (JSON-LD, `<dl>`, `<table>`) — runs the real
crawler against it, and asserts the record counts, field values, and workbook
tabs all come out right. No network access needed.

## Politeness and terms

`robots.txt` is fetched and honoured by default (`--ignore-robots` overrides).
Requests are rate limited and retried with exponential backoff. Before
publishing or redistributing the scraped data, check the site's own terms of
use — this tool only automates reading pages the site serves publicly.
