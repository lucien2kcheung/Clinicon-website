# VITAS 紓適寧 — website

A complete, bilingual (EN / 繁體中文) static website for the VITAS Soothing Cream Gel,
built to be uploaded to GitHub and hosted on Vercel. No framework, no dependencies,
no database — plain HTML, one stylesheet, one small JavaScript file.

Design follows **VITAS Brand Guidelines v1.0 (2026)**: heritage orange
`#F47920` leads, Ember `#C6531A` carries small text and buttons (orange is a
brand colour, not a text colour), Cooling Mint `#17B39A` supports, on Chalk
`#FBF6EE` and Carbon `#17181A` — roughly the 60/30/7/3 ratio the guidelines
specify. Type is Sora (display), Inter (body), Space Mono (specs and labels)
and Noto Sans TC for 繁體中文. Logos come from the supplied kit, unmodified, in
`assets/img/logo/` (see `docs/logo-kit-README.txt`).

**Positioning: Option A** from the VITAS Brand Repositioning Proposal v3.0 —
*Activate Circulation. Accelerate Recovery.* (「激活循環，加速重生。」), with
*Prime · Perform · Recover* as the supporting triptych, aimed at Hyrox athletes,
padel players and running clubs aged 25–45. The slogan is a brand promise, not a
medical claim: it always renders beside the sensory sub-copy, and the deck's
disclaimer sits in the footer of every page. Both strings live in `BRAND`
(`src/data.mjs`) — see `docs/positioning.md` before writing any new copy.

The structure and pacing are modelled on [drhauschka.com](https://www.drhauschka.com/)
(botanical editorial layout, ingredient stories, guided "find your routine" tool,
calm natural palette), rebuilt from scratch for a single-product muscle-care brand.
See `docs/drhauschka-analysis.md` for the teardown that informed it, and
`docs/positioning.md` for the claim rules the copy follows.

---

## 1. Deploy: GitHub → Vercel

The site lives in the `vitas/` folder of this repository.

1. Push this branch to GitHub (already done if you are reading this on GitHub).
2. In Vercel: **Add New → Project → Import** this repository.
3. Configure:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | **Other** |
   | Root Directory | **`vitas`** |
   | Build Command | `node src/build.mjs` (or leave empty — the HTML is committed) |
   | Output Directory | leave empty |
   | Install Command | leave empty |

4. **Deploy.** First build takes well under a minute.
5. **Domains →** add `vitas.com.hk` and `www.vitas.com.hk`, then point the DNS
   records Vercel shows you at your registrar. Set `vitas.com.hk` to redirect to
   `www.vitas.com.hk` (or the other way round — just pick one and be consistent).

If you would rather this site sat in its own repository, copy the contents of
`vitas/` to the root of a new repo; then Root Directory can be left empty.

### After the first deploy

- Google Search Console → add the domain → **Sitemaps** → submit `sitemap.xml`.
- Check `https://<your-domain>/404.html` renders, and that
  `https://<your-domain>/product` redirects to `/product/`.
- Re-check every redirect in `vercel.json` against the real old URLs still in
  Search Console under **Indexing → Pages → Not found (404)**, and add any that
  are missing.

---

## 2. Editing content

Everything is generated from three files in `src/`:

```
src/data.mjs     ← product facts, the three plants, stockists, journal articles, FAQ
src/pages.mjs    ← the page bodies (hero copy, section copy)
src/layout.mjs   ← <head>, header, footer, shared components
```

After any edit:

```bash
cd vitas
node src/build.mjs      # rewrites index.html, product/index.html, …, sitemap.xml
```

Commit the regenerated HTML. That is the whole workflow.

### Every page is its own URL

There are no tabs, pop-ups or client-side toggles hiding content. Each page is a
separate HTML file at a separate address, in both languages:

```
/                         /zh/
/shop/                    /zh/shop/
/cart/                    /zh/cart/
/checkout/success/        /zh/checkout/success/
/checkout/cancelled/      /zh/checkout/cancelled/
/product/                 /zh/product/
/how-to-use/              /zh/how-to-use/
/ingredients/             /zh/ingredients/
/ingredients/eucalyptus/  /zh/ingredients/eucalyptus/
/ingredients/grape-seed/  /zh/ingredients/grape-seed/
/ingredients/niaouli/     /zh/ingredients/niaouli/
/about/                   /zh/about/
/for/                     /zh/for/
/for/hyrox/               /zh/for/hyrox/
/for/padel/               /zh/for/padel/
/for/running/             /zh/for/running/
/approach/                /zh/approach/
/stockists/               /zh/stockists/
/journal/                 /zh/journal/
/journal/<slug>/          /zh/journal/<slug>/
/faq/  /contact/  /legal/privacy/  /legal/terms/   (+ /zh/… for each)
```

Each page carries its own `<title>`, meta description, canonical URL, JSON-LD and
breadcrumbs, and `<link rel="alternate" hreflang>` tags pointing at its
counterpart in the other language. `sitemap.xml` lists all of them with their
alternates. The header language button is an ordinary link between the two URLs —
no JavaScript involved, so the site works fully with JS disabled. (The old site
rendered nothing without JS; that was its single biggest technical problem.)

**Bilingual text** is written as `{ en: '…', zh: '…' }` pairs in `src/`; the build
renders each page once per language.

Local preview:

```bash
npm run dev             # builds, then serves on http://localhost:8123
```

## 3. Illustrations

`assets/img/*.svg` are generated by `node src/make-art.mjs` — orange line art on
white, taken from the pack, so the site is complete without any photography.
`product-tube.svg` is a drawing of the tube, not a photo of it.

**They are placeholders.** The sport modules (`sport-hyrox.svg`,
`sport-padel.svg`, `sport-running.svg`) use the angled speed bands and outlined
figures from the IG demo deck, warm orange for the pre-session half and mint for
the post-session half. They are holding the space for commissioned photography.

Shot list, per the repositioning deck (§04 Visual Direction):

| Slot | File | Ratio | Brief |
| --- | --- | --- | --- |
| Sport modules | `sport-*.svg` | 3:2 | Athletes mid-action, not posing. Real HK locations — Hyrox floor, padel court, harbourfront |
| Editorial panels | `art-*.svg` | 3:2 | Gel texture on skin, hands working a calf, a gym bag |
| Ingredients | `plant-*.svg` | 1:1 | Ingredient hero shots: grape seeds, niaouli, eucalyptus |
| Pack | `product-tube.svg` | tall | Product on a plain ground; a tall transparent PNG works best |
| Founder | `art-founder.svg` | 1:1 | Portrait of Rosana Li |

Drop replacements into `assets/img/` under the same filenames, or update the
paths in `src/data.mjs`. **Do not use the AI-generated images from the IG demo
PDF on the live site** — they carry a generator watermark, the text in them is
garbled, and several of the claims printed on them ("lymphatic wellness",
"muscle repair", "anti-inflammatory") are on the deck's own forbidden list.

`assets/img/og-cover.png` is the social-share image, rasterised from
`og-cover.svg` by `node src/make-og.mjs` (needs Playwright installed locally).
Regenerate it if you change the cover art.

## 4. Shop, cart and Stripe checkout

The shop is two products (`src/data.mjs` → `PRODUCTS`), a cart held in the
browser's `localStorage`, and a Stripe Checkout session created by a serverless
function.

```
/shop/                     the two products, add to cart
/cart/                     quantities, discount code, totals
POST /api/checkout         creates the Stripe session   (api/checkout.js)
/checkout/success/         return page after payment
/checkout/cancelled/       return page if they back out
```

**Security note:** the browser sends only product ids and quantities.
`api/checkout.js` re-reads every price from `src/data.mjs`, so editing the cart
in devtools cannot change what is charged. Keep it that way.

### Turning it on

1. Create a Stripe account and get the secret key
   (Developers → API keys). Use `sk_test_…` first.
2. In Vercel → Project → Settings → **Environment Variables**, add:
   - `STRIPE_SECRET_KEY` = `sk_test_…` (then `sk_live_…` when you go live)
   - `SITE_URL` = `https://www.vitas.com.hk`
3. Redeploy. `npm install` runs automatically and installs the `stripe`
   package listed in `package.json`.
4. Test with Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC.

Until the key is set, the Checkout button shows "Checkout is not connected yet"
rather than failing silently. Nothing else on the site depends on it.

### The HK$50 welcome offer

The pop-up (see below) hands out the code **`WELCOME50`**. Create it once in
Stripe so the discount is actually applied at payment:

1. Stripe → Products → **Coupons** → New: amount off **HK$50.00**, currency HKD,
   duration "once".
2. On that coupon, **Add promotion code** → code `WELCOME50` → set
   "Limit to first-time customers" and any expiry you want.

`api/checkout.js` looks the code up by name at checkout time and applies it if
it is active — the browser never decides the discount. The cart page also shows
the HK$50 in its totals so the number the customer sees matches the one Stripe
charges. Change the amount in **three** places if you change the offer:
the Stripe coupon, `SHOP.welcomeValue` in `src/data.mjs`, and `WELCOME_VALUE`
in `assets/js/shop.js`.

### Shipping and returns

Local delivery is HK$30, free over HK$300 — set in `SHOP.freeShippingOver`
(`src/data.mjs`) and mirrored in `api/checkout.js` as Stripe shipping options,
and in `assets/js/shop.js` for the cart display. The 14-day returns line on the
shop page and in the FAQ is a policy statement: confirm it is the policy you
actually want to operate before launch.

## 5. The welcome pop-up

`src/layout.mjs` → `welcomeModal()` renders it on every page; `assets/js/shop.js`
decides when to show it:

- appears 2.5 seconds after the first page view,
- never on `/cart/` or `/checkout/…`,
- never again once dismissed or completed (`vitas-welcome-seen` in
  localStorage),
- closes on Escape, on the scrim, or on the × button, and keeps keyboard focus
  inside itself while open.

Submitting the form reveals the code and stores it so the cart pre-fills it.
**It does not yet send the address anywhere** — wire the form to your email
provider (see Forms, below) or the addresses are lost.

## 6. Forms

The newsletter and contact forms are wired up in the markup but **submit
nowhere** — they show a note saying so. Before launch, point them at a real
endpoint. The simplest options, in order of effort:

- **Formspree / Basin / Formsubmit** — change the `<form action="…">` in
  `src/pages.mjs` and delete the interception in `assets/js/site.js`.
- **A Vercel serverless function** — add `api/subscribe.js` in this folder and
  post to `/api/subscribe`.
- **Your email provider's embed** (Mailchimp, Brevo) — replace the form markup.

## 7. Things to verify before launch

These need a human with access to the business; they are marked here so they do
not get missed:

- [ ] **Stockist URLs** in `src/data.mjs` — confirm each one still resolves to a
      live product page (they were compiled from public listings, not verified
      from inside this build environment).
- [ ] **Price** — HK$250/100ml is what the retail listings show; confirm it is
      current before it goes on the site.
- [ ] **Contact details** — `SITE.email` and the address in `src/layout.mjs` are
      placeholders.
- [ ] **Legal pages** — `/legal/privacy/` and `/legal/terms/` contain marked
      placeholders. Replace with text reviewed against the Personal Data
      (Privacy) Ordinance and Hong Kong trade-description rules.
- [ ] **Claims** — read `docs/positioning.md`. The copy on this site deliberately
      drops the lymphatic / detox / lactic-acid / whitening claims used
      previously. Retail listings, packaging and reseller copy should be brought
      in line, or the site and the shelf will contradict each other.
- [ ] **Reviews** — no testimonials are published because none have been
      verified. Do not paste in the templated reseller reviews; collect real
      ones (see the analysis doc, "what VITAS should copy").
- [ ] **YouTube** — the footer links to @VITASHK. If you want video embedded on
      the site, add the specific video IDs; nothing is embedded blind.
- [ ] **About page facts** — `ABOUT` in `src/data.mjs` follows the brand's own
      account and the public retail record. The founding dates, the founder's
      biography and the "two decades of formulation" line are **not**
      independently verified here. Rosana Li should read and correct that page
      before it goes live, and the quotation attributed to her must be approved
      by her (it was written as a draft, not transcribed from an interview).
- [ ] **Second product** — `cream-duo` is a two-pack of the same SKU, priced at
      HK$450. If a genuine second product exists, replace it in `PRODUCTS`.
- [ ] **Retail partner logos** — the Retail Partners section on the homepage uses
      the retailers' names set in type, not their logos, and links nowhere.
      Using the actual Watsons / Mannings marks needs each retailer's written
      permission and their brand files; drop them into `assets/img/logo/` and
      swap the markup in `retailPartners()` once you have it.
- [ ] **Stripe** — coupon and promotion code created, live key set, a real test
      order placed and refunded, and receipts/emails configured in Stripe.
- [ ] **Delivery and returns** — confirm HK$30 / free over HK$300 and the 14-day
      returns window are the policies you will actually honour.
- [ ] **Legal sign-off on the slogan** — "Activate Circulation. Accelerate
      Recovery." is used with the deck's sensory sub-copy and footer disclaimer
      exactly as §08 specifies. Have HK counsel confirm that pairing before
      launch; it is the one line on the site that needs it.
- [ ] **"22 years" / "since 2003"** — used throughout because the brand
      documents assert it. Get the incorporation or first-formulation date on
      paper so the number can be defended.
- [ ] **Sport photography** — the sport pages are the ones a KOL or a club will
      link to. They need real images before any campaign spend.
- [ ] **Social proof** — the deck's homepage architecture calls for athlete
      testimonials (§09 ⑤). Nothing is published because nothing is verified;
      collect real ones and they can slot in under the sport modules.

## 8. File map

```
vitas/
├── index.html, product/, how-to-use/, ingredients/…, approach/,
│   stockists/, journal/…, faq/, contact/, legal/…, 404.html   ← generated (EN)
├── zh/…                                                      ← generated (繁體中文)
├── sitemap.xml, robots.txt, vercel.json
├── assets/
│   ├── css/site.css        one stylesheet
│   ├── js/site.js          nav, accordion, routine finder (no language logic)
│   ├── js/shop.js          cart, welcome offer, Stripe checkout call
│   ├── img/logo/*          supplied logo kit, unmodified
│   └── img/*.svg|png       generated illustrations
├── api/checkout.js         Vercel function → Stripe Checkout session
├── .env.example            the two environment variables Vercel needs
├── src/
│   ├── build.mjs           generator entry point
│   ├── data.mjs            product / plants / stockists / articles / FAQ
│   ├── pages.mjs           page bodies
│   ├── layout.mjs          shell, header, footer, components
│   ├── make-art.mjs        illustration generator
│   └── make-og.mjs         social image rasteriser
└── docs/
    ├── drhauschka-analysis.md   what the reference site does well / badly
    └── positioning.md           the claim rules this copy follows
```
