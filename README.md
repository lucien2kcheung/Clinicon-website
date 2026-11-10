# Clinicon — product pages & SEO

This adds a real, indexable page for every product so they can rank on Google
(previously every product shared one URL inside a pop-up, which Google can't index).

## What's in this package

```
index.html                 ← PATCHED: product cards are real links that open the product page in a NEW TAB
build-products.js          ← generator: reads PRODUCTS from index.html, writes the pages below
assets/site.css            ← snapshot of your site styles (used by the product pages)
assets/productpage.css     ← layout styles for the product pages
products/<slug>/index.html ← 220 generated product pages (bilingual EN/繁, with a Related products block)
sitemap.xml                ← lists the homepage + all 220 product URLs (submit to Google)
vercel.json                ← 301 redirect from the old Wix pessary URL → new page
slug-map.json              ← reference list of every product name → its URL
```

Your existing `images/` folder is reused as-is — nothing to change there.

## Deploy (GitHub → Vercel)

Upload/commit these to the **root** of your Clinicon repo (same level as `index.html`):
`index.html` (replace), `assets/` (the two CSS files), `products/`, `sitemap.xml`,
`vercel.json`, `slug-map.json`. Vercel redeploys automatically.

After it deploys, test:
- `https://www.clinicon.com.hk/products/ring-pessary`  → the new pessary page (200, not 404)
- `https://www.clinicon.com.hk/product-page/子宮托-ring-pessary` → should now 301-redirect to the page above
- On the homepage, right-click a product → "Open in new tab" → lands on its own page

## Recover the Google ranking (do this once, it's the important part)

1. **Google Search Console** (clinicon.com.hk property) → **Sitemaps** → submit `sitemap.xml`.
2. **URL Inspection** → paste `https://www.clinicon.com.hk/products/ring-pessary` → **Request indexing**.
3. **Indexing → Pages** → look for anything under "Not found (404)". Every old Wix URL still
   listed there needs a 301 in `vercel.json` (see below). Add one per dead URL, pointing to the
   matching new `/products/<slug>` (find the slug in `slug-map.json`).

## Adding more redirects (for other old Wix URLs)

Edit `vercel.json` and add entries:

```json
{
  "redirects": [
    { "source": "/product-page/子宮托-ring-pessary", "destination": "/products/ring-pessary", "permanent": true },
    { "source": "/product-page/OLD-WIX-SLUG", "destination": "/products/NEW-SLUG", "permanent": true }
  ]
}
```

`"permanent": true` = 301, which passes the old page's ranking to the new one.

## When you add or edit products later

Your products live in the `PRODUCTS = [...]` array inside `index.html` — that's the single
source of truth. After editing it:

```
node build-products.js
```

This regenerates all product pages + `sitemap.xml` from the current `PRODUCTS`. Commit the result.
(Requires Node.js installed locally. The homepage card links update automatically because they
use the same slug logic.)

## Separate English / Chinese pages for a product

By default each product has ONE bilingual page with an EN/繁 toggle. To give a product two
single-language pages instead, add `"zh_page": true` to its entry in `PRODUCTS`. The build then writes
`/products/<slug>` (English only) and `/zh/products/<slug>` (Chinese only), links them with
hreflang, and lists both in the sitemap. Such products use `blurb_en` / `blurb_tc`, and optionally
`specs_en` / `specs_tc` for spec lists.

## Brand pages

`/brands/<slug>` is generated for every brand in `brands.json` plus every other brand tagged on a product
(those get no description). `brands.json` holds the website, logo and description paragraphs. A product is
listed on a brand's page when its `brand` matches or the brand appears in its `tags` (that is how 3M and
Solventum share a list). Drop a logo at `images/brands/<slug>.png` and the page picks it up. Homepage brand tiles
link to these pages, and the build fails if a tile points at a page that does not exist.

## Note on styles

`assets/site.css` is a **snapshot** of the `<style>` block in your `index.html`, taken so the
product pages look identical to the site. If you later restyle the homepage, re-copy that
`<style>` content into `assets/site.css` (or tell your developer to), so the product pages stay
in sync.

## FAQ, Services, How to order, Clinic packages, Terms (English + Chinese URLs)

These five pages are hand-written masters in `src/pages/<slug>.html`, with every phrase written twice:
`<span class="pp-en">English</span><span class="pp-tc">中文</span>`. **Edit the master, never the generated files**, then run:

```
node build-pages.js
node build-products.js     # only needed if you changed pages.config.js (it writes the sitemap)
```

`build-pages.js` writes `/<slug>` (English only) and `/zh/<slug>` (Chinese only), each with its own title, meta
description, H1, JSON-LD, canonical, `hreflang` pair and a language switch that links to the other URL.
`pages.config.js` holds the English meta description (max 155 characters, enforced by the build) and the Chinese
title and description. If the JSON-LD contains a string that is not visible on the page, the build stops and asks for
a Chinese version in `zh.ld`. Terms and Conditions has `zh: null` because only its header and footer were ever
translated, so it stays English-only until a proper Chinese legal text exists. `src/` is excluded from the deploy
(`.vercelignore`) and sent with `X-Robots-Tag: noindex` as a backup.

## Prices that are missing

A product with no usable price (`"N/A"`, empty, or 0) shows "Request a quote" / 查詢報價 on product pages, brand
pages, the homepage and the cart, and gets no `Offer` in its JSON-LD. `build-products.js` stops the build if any page
would contain `NaN`, `undefined`, an "NA" price, or a non-numeric `price` in JSON-LD.

## Rebuilding without touching every page

`priceValidUntil` is "build date + 1 year", so a normal rebuild rewrites all ~750 pages. Pin the date to keep a
commit down to the real changes: `BUILD_DATE=2026-11-09 node build-products.js`.

## Renaming a product

The slug comes from the English name. When you fix a name, add a 301 for `/products/<old>` and `/zh/products/<old>`
in `vercel.json`, and delete the old folders (the build does not remove them).
