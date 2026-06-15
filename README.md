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

## Note on styles

`assets/site.css` is a **snapshot** of the `<style>` block in your `index.html`, taken so the
product pages look identical to the site. If you later restyle the homepage, re-copy that
`<style>` content into `assets/site.css` (or tell your developer to), so the product pages stay
in sync.
