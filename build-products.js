/* =====================================================================
   Clinicon — product page generator (bilingual EN / 繁中 + related links)
   Reads the PRODUCTS array from index.html (single source of truth) and
   writes /products/<slug>/index.html for each, plus sitemap.xml.
   Run:  node build-products.js
   ===================================================================== */
const fs = require("fs");
const path = require("path");

const SITE = "https://www.clinicon.com.hk";
const WA = "https://wa.me/85293209650";
const OUT = __dirname;

function loadProducts() {
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  const start = html.indexOf("const PRODUCTS =");
  if (start < 0) throw new Error("Could not find 'const PRODUCTS =' in index.html");
  const arrStart = html.indexOf("[", start);
  let depth = 0, end = -1;
  for (let i = arrStart; i < html.length; i++) {
    const c = html[i];
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  return JSON.parse(html.slice(arrStart, end + 1));
}
const products = loadProducts();

/* ---- slugs (must match the slug logic in index.html) ---- */

/* Manual slug overrides.
   Key   = the slug the default rule produces (do not change these).
   Value = the slug we actually want.
   These exist because some products have Chinese-only names, which the default
   rule strips to nothing, leaving a meaningless URL like /products/3m.
   Every key here also has a 301 in vercel.json (old -> new). Never remove a key
   without removing its redirect, and never edit a value once it is live without
   adding a new redirect for the change. */
const SLUG_OVERRIDES = {
  "product":  "biopsy-punch",                 // 取樣打孔筆
  "bd":       "bd-spinal-needle",             // BD 脊髓 / 絨毛針
  "3m":       "3m-easy-tear-paper-tape",      // 3M 易撕紙膠布
  "braun":    "braun-three-way-stopcock",     // Braun 三通掣
  "terumo":   "terumo-hypodermic-needle",     // TERUMO 針咀
  "terumo-2": "terumo-syringe-with-needle"    // TERUMO 針筒連針
};

/* Slugs too generic to rank for anything. */
const WEAK_SLUGS = new Set(["product", "products", "item", "na", ""]);

function slugify(s) {
  return (s || "product").toLowerCase().normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "product";
}

/* Default rule, unchanged from the original build so existing URLs stay stable.
   Overrides are applied on top of the result. */
const used = {};
const slugs = products.map(p => {
  let base = slugify(p.name_en || p.name_tc), s = base, n = 2;
  while (used[s]) s = base + "-" + (n++);
  used[s] = 1;
  return SLUG_OVERRIDES[s] || s;
});

/* Safety net: flag any URL that still carries no keyword, plus any collision the
   overrides may have introduced. Fix by adding an entry to SLUG_OVERRIDES and a
   matching 301 in vercel.json. */
const weak = slugs.filter(s => WEAK_SLUGS.has(s.replace(/-\d+$/, "")) ||
                               (s.length < 4 && !/\d/.test(s)));
if (weak.length) {
  console.warn("\n!! Weak slugs — these URLs cannot rank. Add SLUG_OVERRIDES entries:");
  weak.forEach(s => console.warn("     /products/" + s));
}
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length) {
  console.error("\n!! SLUG COLLISION — an override collides with another product:");
  [...new Set(dupes)].forEach(s => console.error("     /products/" + s));
  process.exit(1);
}
if (!weak.length && !dupes.length) console.log("Slug check: clean.");

/* Categories where lead time depends on manufacturer stock rather than our own.
   Everything else is treated as a stocked consumable (approx. 1 week). */
const EQUIPMENT_CATEGORIES = new Set(["Refrigeration & Equipment", "O.R. Equipment", "Electrical Appliances"]);

/* Chinese labels for categories, used on single-language Chinese pages. Mirrors NAV_CATEGORIES in index.html. */
const CATEGORY_TC = { "Electrical Appliances": "電器產品", "Refrigeration & Equipment": "冷藏及設備", "O.R. Equipment": "手術室設備" };

/* ---- helpers ---- */
const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const stripTags = s => String(s == null ? "" : s)
  .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const fmtPrice = n => "HK$" + Number(n || 0).toLocaleString("en-HK");
const abs = img => img ? ("/" + img.replace(/^\/+/, "")) : "";
/* Language mode. Most products get ONE bilingual page with an EN/繁 toggle (MODE = null).
   Products flagged `zh_page: true` get two single-language pages instead:
   /products/<slug> (MODE "en") and /zh/products/<slug> (MODE "tc"). page() sets MODE;
   bi()/dual() then emit just that language, so no hidden text of the other language ships. */
let MODE = null;
let PAGE_SLUG = "";  // slug of the page being built; the header toggle uses it to link to the other-language twin
const bi = (en, tc) => MODE === "en" ? en : MODE === "tc" ? (tc || en)
  : `<span class="pp-en" lang="en">${en}</span><span class="pp-tc" lang="zh-Hant-HK">${tc || en}</span>`;
const dual = (en, tc) => MODE === "en" ? en : MODE === "tc" ? tc
  : `<span class="pp-en">${en}</span><span class="pp-tc">${tc}</span>`;
const isZhPage = p => p.zh_page === true;
const pageUrl = (slug, lang) => (lang === "tc" ? "/zh/products/" : "/products/") + slug;

function priceParts(p) {
  if (p.variants && p.variants.length) {
    const min = Math.min(...p.variants.map(v => Number(v[1]) || Infinity));
    if (isFinite(min) && min > 0) return { en: "From " + fmtPrice(min), tc: fmtPrice(min) + " 起", num: min };
  }
  if (p.price) return { en: fmtPrice(p.price), tc: fmtPrice(p.price), num: p.price };
  return { en: "NA", tc: "NA", num: 0, na: true };
}

/* Related products. Each product links to the products that FOLLOW it (wrapping round) in
   its brand, then its category, then the whole catalogue. Rotating like this means every
   product is linked from the ones before it, so no page is left without inbound links.
   (The previous version always took the first 4 products of the category, so those few got
   hundreds of links and the rest got none, which left ~50 pages "Discovered - not indexed".) */
function relatedFor(i, n = 4) {
  const self = products[i];
  const sameBrand = j => self.brand && self.brand !== "Other" && products[j].brand === self.brand;
  const sameCat = j => self.category && products[j].category === self.category;
  const picked = new Set(), res = [];
  const add = (pred, take) => {
    let got = 0;
    for (let k = 1; k < products.length && got < take && res.length < n; k++) {
      const j = (i + k) % products.length;
      if (pred(j) && !picked.has(j)) { picked.add(j); res.push(j); got++; }
    }
  };
  add(sameBrand, 1);
  add(sameCat, n);
  add(() => true, n);
  return res;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Archivo:wght@400;500;600;700&family=Noto+Sans+HK:wght@400;500;700&display=swap" rel="stylesheet">`;

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 0 0 1.523 5.26l-.999 3.648 3.965-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`;

function header() {
  const HOME = MODE === "tc" ? "/zh" : "/";
  return `<header>
  <nav class="nav">
    <a class="brand" href="${MODE === "tc" ? "/zh" : "/"}">
      <img src="/images/clinicon%20logo.png" alt="Clinicon Medical logo">
      <span class="bt"><b>Clinicon Medical</b><span>健力醫療器材有限公司</span></span>
    </a>
    <div class="menu" id="menu">
      <a href="${HOME}#products">${bi("Products", "產品")}</a>
      <a href="${HOME}#about">${bi("About Us", "關於我們")}</a>
      <a href="${HOME}#contact">${bi("Contact", "聯絡我們")}</a>
      <a class="wa-btn" href="${WA}" target="_blank" rel="noopener">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.4.5-.3.3c-.2.2-.3.4-.2.6.2.4.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.8-.1 1.5z"/></svg>
        ${bi("Order via WhatsApp", "透過 WhatsApp 下單")}
      </a>
      ${MODE ? `<div class="langtog" id="langtog">
        ${MODE === "en" ? `<a class="active" href="${pageUrl(PAGE_SLUG, "en")}" hreflang="en">EN</a><a href="${pageUrl(PAGE_SLUG, "tc")}" hreflang="zh-Hant">繁</a>`
                        : `<a href="${pageUrl(PAGE_SLUG, "en")}" hreflang="en">EN</a><a class="active" href="${pageUrl(PAGE_SLUG, "tc")}" hreflang="zh-Hant">繁</a>`}
      </div>` : `<div class="langtog" id="langtog">
        <button data-pp-lang="en" class="active">EN</button>
        <button data-pp-lang="tc">繁</button>
      </div>`}
    </div>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </nav>
</header>`;
}

function footer() {
  const HOME = MODE === "tc" ? "/zh" : "/";
  return `<footer>
  <div class="wrap">
    <div class="fgrid">
      <div>
        <div class="flogo">Clinicon Medical Ltd.</div>
        <p style="font-size:.9rem;max-width:30em">${bi(
          "Founded in 1980. A trusted Hong Kong medical supplies distributor committed to quality and value, serving the healthcare sector for over 45 years.",
          "成立於1980年。值得信賴的香港醫療用品經銷商，致力於品質與價值，服務醫療界超過45年。")}</p>
      </div>
      <div>
        <h4>${bi("Explore", "探索")}</h4>
        <a href="${HOME}#products">${bi("Products", "產品")}</a>
        <a href="/products">${bi("All products", "所有產品")}</a>
        <a href="/brands">${bi("Brands", "品牌")}</a>
        <a href="${HOME}#about">${bi("About Us", "關於我們")}</a>
        <a href="${HOME}#contact">${bi("Contact", "聯絡我們")}</a>
        <a href="/faq">${bi("FAQ", "常見問題")}</a>
        <a href="/terms-and-conditions">${bi("Terms &amp; Conditions", "條款及細則")}</a>
      </div>
      <div>
        <h4>${bi("Contact", "聯絡")}</h4>
        <a href="tel:+85227301883">+852 2730 1883</a>
        <a href="${WA}" target="_blank" rel="noopener">WhatsApp: 9320 9650</a>
        <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a>
        <span style="font-size:.9rem;display:block;padding-top:6px">${bi(
          "Unit 411, Lippo Sun Plaza,<br>28 Canton Road, Tsimshatsui, Kowloon, HK",
          "香港九龍尖沙咀廣東道28號<br>力寶太陽廣場411室")}</span>
      </div>
    </div>
    <div class="fbtm">
      <span>${bi("© 2026 Clinicon Medical Ltd. All rights reserved.", "© 2026 健力醫療器材有限公司 版權所有。")}</span>
      <span>健力醫療器材有限公司</span>
    </div>
  </div>
</footer>`;
}

function relatedBlock(i) {
  const items = relatedFor(i).map(j => {
    const rp = products[j], rs = slugs[j], pr = priceParts(rp);
    const fig = rp.image_missing
      ? `<div class="pp-rel-noimg"></div>`
      : `<img src="${abs(rp.image)}" alt="${esc(rp.name_en)}" loading="lazy">`;
    const href = isZhPage(rp) ? pageUrl(rs, MODE) : "/products/" + rs;
    return `<a class="pp-rel-card" href="${href}">
      <div class="pp-rel-fig">${fig}</div>
      <div class="pp-rel-name">${bi(esc(rp.name_en), esc(rp.name_tc))}</div>
      <div class="pp-rel-price">${bi(pr.en, pr.tc)}</div>
    </a>`;
  }).join("");
  if (!items) return "";
  return `<section class="pp-related">
    <h2>${bi("Related products", "相關產品")}</h2>
    <div class="pp-rel-grid">${items}</div>
  </section>`;
}

/* Link from a product to its brand page (brands/brandProducts are built further down,
   before any page is written). Returns null for products with no real brand. */
function brandLinkFor(p) {
  if (!p.brand || p.brand === "Other") return null;
  const b = brands.find(x => x.name === p.brand);
  return b ? { href: "/brands/" + b.slug, name: b.name, count: brandProducts(b).length } : null;
}

/* Cut text to at most n chars: at a sentence end if one falls after minSent, otherwise at a word boundary + "…". */
function cutText(t, n, minSent) {
  t = String(t).replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n);
  const sent = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("。"));
  if (sent >= minSent) return cut.slice(0, sent + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s]+$/, "") + "…";
}
/* A real description is a sentence, not a pack size like "50/box" or "1322". */
const isRealBlurb = t => !!t && String(t).trim().length >= 45 && /[.。]\s*$/.test(String(t).trim());
const NAME_COUNT = {};
products.forEach(p => { NAME_COUNT[p.name_en] = (NAME_COUNT[p.name_en] || 0) + 1; });
const DEFAULT_OG = SITE + "/images/og-clinicon.jpg";

function page(p, slug, i, mode) {
  MODE = mode || null;
  PAGE_SLUG = slug;
  const bl = brandLinkFor(p);
  const tc = MODE === "tc";
  const name = tc ? (p.name_tc || p.name_en) : p.name_en;
  const url = `${SITE}${pageUrl(slug, MODE)}`;
  const pr = priceParts(p);
  const isEquipment = EQUIPMENT_CATEGORIES.has(p.category);
  const packOptions = (p.variants && p.variants.length)
    ? p.variants.map(v => stripTags(v[0])).filter(Boolean).join(" · ") : "";
  /* Title: keep the full brand suffix when it fits in ~60 characters, otherwise use the short one.
     Products that share a name (e.g. the two underpads) get their product code appended. */
  const dupName = (NAME_COUNT[p.name_en] || 0) > 1 && p.stock_id ? ` (${p.stock_id})` : "";
  const fullTitleEn = `${p.name_en}${dupName} | Clinicon Medical Ltd.`;
  const title = tc ? `${name} | 健力醫療器材有限公司`
    : (fullTitleEn.length <= 60 ? fullTitleEn : `${p.name_en}${dupName} | Clinicon`);
  /* Some products only have a pack size in blurb_en ("50/box", "1322"). That is a spec, not a description:
     show it as a "Pack size" row and build the description from name, brand, category and price instead. */
  const realEn = isRealBlurb(p.blurb_en) ? p.blurb_en : "";
  const packNote = (!realEn && p.blurb_en) ? String(p.blurb_en).replace(/\s+/g, " ").trim() : "";
  let desc = (tc ? (p.blurb_tc || `${name} — 健力醫療器材有限公司供應，自1980年服務香港醫療界。`)
    : (realEn || [
        p.name_en + (p.category ? " — " + p.category : "") + (bl ? " by " + bl.name : "") + ".",
        pr.na ? "" : pr.en + ".",
        p.stock_id ? "Product code " + p.stock_id + "." : "",
        "Supplied by Clinicon Medical Ltd., a Hong Kong medical supplies distributor since 1980. Order online or via WhatsApp."
      ].filter(Boolean).join(" ")))
    .replace(/\s+/g, " ").trim();
  /* Structured-data description: <= 300 chars, cut at a sentence (or word) boundary, never mid-word.
     Meta / social description: <= 160 chars so search results do not truncate it. */
  const descFull = desc;
  desc = cutText(descFull, 300, 120);
  const metaDesc = cutText(descFull, 160, 80);
  /* Photos: `image` is the main photo; optional `images` (array, main first) adds a gallery. */
  const imgList = p.image_missing ? [] : ((p.images && p.images.length) ? p.images : [p.image]);
  const imgUrl = imgList.length ? SITE + abs(imgList[0]) : "";

  const waEn = `${WA}?text=${encodeURIComponent(`I would like to enquire about: ${p.name_en} (${pr.en}) — ${url}`)}`;
  const waTc = `${WA}?text=${encodeURIComponent(`您好，我想查詢以下產品：${p.name_tc || p.name_en}（${pr.tc}）— ${url}`)}`;

  /* ---- structured data ----------------------------------------------
     Product + Offer/AggregateOffer, BreadcrumbList, and a reference back to
     the Organization node declared once on the homepage (@id keeps the entity
     single across the whole site rather than redeclaring it 220 times).
     Shipping and returns values mirror Clauses 8.2 and 9.2 of
     /terms-and-conditions — update both together if the policy changes. */
  const ORG_ID = SITE + "/#organization";

  const shipping = {
    "@type": "OfferShippingDetails",
    shippingDestination: { "@type": "DefinedRegion", addressCountry: "HK" },
    shippingRate: {
      "@type": "MonetaryAmount", value: 0, currency: "HKD",
      // free delivery applies to orders over HK$500 (Terms, Clause 8.2)
      eligibleTransactionVolume: {
        "@type": "PriceSpecification", priceCurrency: "HKD", minPrice: 500
      }
    }
  };

  const returnPolicy = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "HK",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
    merchantReturnLink: SITE + "/terms-and-conditions"
  };

  // Prices are quoted, not time-limited; give Google a rolling 12-month window.
  const priceValidUntil = new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10);

  const offerBase = {
    priceCurrency: "HKD",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    priceValidUntil,
    seller: { "@id": ORG_ID },
    shippingDetails: shipping,
    hasMerchantReturnPolicy: returnPolicy
  };

  const variantPrices = (p.variants || []).map(v => Number(v[1])).filter(n => n > 0);

  let offers;
  if (variantPrices.length > 1) {
    offers = Object.assign({
      "@type": "AggregateOffer", url, offerCount: variantPrices.length,
      lowPrice: Math.min(...variantPrices), highPrice: Math.max(...variantPrices)
    }, offerBase);
  } else if (pr.num > 0) {
    offers = Object.assign({ "@type": "Offer", url, price: pr.num }, offerBase);
  } else {
    // No published price — omit offers entirely rather than emit an invalid one.
    offers = undefined;
  }

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": url + "#product",
        name: name, alternateName: MODE ? undefined : (p.name_tc || undefined),
        image: imgList.length > 1 ? imgList.map(x => SITE + abs(x)) : (imgUrl || undefined), description: desc,
        brand: { "@type": "Brand", name: (p.brand && p.brand !== "Other") ? p.brand : "Clinicon Medical Ltd." },
        category: p.category || undefined,
        sku: p.stock_id || undefined,
        mpn: p.stock_id || undefined,
        url,
        offers,
        additionalProperty: [
          p.stock_id ? { "@type": "PropertyValue", name: "Product code", value: p.stock_id } : null,
          p.category ? { "@type": "PropertyValue", name: "Category", value: p.category } : null,
          packOptions ? { "@type": "PropertyValue", name: "Pack options", value: packOptions } : null,
          packNote ? { "@type": "PropertyValue", name: "Specification", value: packNote } : null,
          { "@type": "PropertyValue", name: "Lead time",
            value: isEquipment ? "Varies with stock availability" : "Typically within 1 week" }
        ].filter(Boolean),
        manufacturer: p.brand && p.brand !== "Other"
          ? { "@type": "Organization", name: p.brand } : undefined,
        isRelatedTo: undefined
      },
      {
        "@type": "BreadcrumbList",
        "@id": url + "#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: tc ? "主頁" : "Home", item: tc ? SITE + "/zh" : SITE + "/" },
          { "@type": "ListItem", position: 2, name: (tc ? CATEGORY_TC[p.category] : "") || p.category || (tc ? "產品" : "Products"), item: tc ? SITE + "/zh#products" : SITE + "/#products" },
          { "@type": "ListItem", position: 3, name: name }
        ]
      },
      {
        "@type": "WebPage",
        "@id": url + "#webpage",
        url, name: title,
        isPartOf: { "@id": SITE + "/#website" },
        about: { "@id": url + "#product" },
        breadcrumb: { "@id": url + "#breadcrumb" },
        inLanguage: tc ? "zh-HK" : "en-HK"
      }
    ]
  };

  const figure = p.image_missing
    ? `<div class="pp-noimg">${bi("Image coming soon", "圖片即將上載")}</div>`
    : (imgList.length > 1
        ? `<div class="pp-gallery">
      <div class="pp-gal-main"><img src="${abs(imgList[0])}" alt="${esc(name)}" width="640" height="640" loading="eager">
        <button type="button" class="pp-gal-btn pp-gal-prev" aria-label="${tc ? "上一張" : "Previous photo"}">&#8249;</button>
        <button type="button" class="pp-gal-btn pp-gal-next" aria-label="${tc ? "下一張" : "Next photo"}">&#8250;</button></div>
      <div class="pp-thumbs">${imgList.map((x, k) => `<button type="button" class="pp-thumb${k === 0 ? " is-active" : ""}" data-src="${abs(x)}" aria-label="${tc ? `相片 ${k + 1} / ${imgList.length}` : `Photo ${k + 1} of ${imgList.length}`}"><img src="${abs(x)}" alt="${esc(name)} – photo ${k + 1}" loading="lazy"></button>`).join("")}</div>
    </div>
    <script>(function(){var g=document.currentScript.parentNode.querySelector(".pp-gallery"),m=g.querySelector(".pp-gal-main img"),t=[].slice.call(g.querySelectorAll(".pp-thumb")),i=0;function s(k){i=(k+t.length)%t.length;m.src=t[i].getAttribute("data-src");t.forEach(function(b,j){b.classList.toggle("is-active",j===i)});}t.forEach(function(b,j){b.addEventListener("click",function(){s(j)});});g.querySelector(".pp-gal-prev").addEventListener("click",function(){s(i-1)});g.querySelector(".pp-gal-next").addEventListener("click",function(){s(i+1)});})();</script>`
        : `<img src="${abs(p.image)}" alt="${esc(name)}" width="640" height="640" loading="eager">`);

  const variants = (p.variants && p.variants.length)
    ? `<table class="pp-variants"><thead><tr><th>${bi("Model", "型號")}</th><th>${bi("Price", "價格")}</th><th></th></tr></thead><tbody>${
        p.variants.map((v, k) => `<tr><td>${esc(v[0])}</td><td>${fmtPrice(v[1])}</td><td><button class="pp-add" data-vi="${k}">${bi("Add", "加入")}</button></td></tr>`).join("")
      }</tbody></table>` : "";

  // solo add-to-cart button for simple (non-variant) products — priced or NA
  const addSolo = !(p.variants && p.variants.length)
    ? `<button class="pp-add pp-add-solo" data-vi="-1">${bi("Add to cart", "加入購物車")}</button>` : "";

  /* Some legacy spec entries are nested arrays containing raw HTML; flatten and
     strip so they render as clean list items rather than escaped markup. */
  const specLines = ((MODE === "en" && p.specs_en) || (tc && p.specs_tc) || p.specs || []).flat(Infinity)
    .map(stripTags).filter(Boolean);
  const specs = specLines.length
    ? `<ul class="pp-specs">${specLines.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : "";

  /* ---- product details table ----------------------------------------
     Built from fields that exist for every product. Gives answer engines a
     table to extract and buyers a scannable summary. Rows with no data are
     omitted rather than rendered empty. */
  const detailRows = [
    [bi("Brand", "品牌"), bl ? `<a href="${bl.href}">${esc(p.brand)}</a>` : (p.brand && p.brand !== "Other" ? esc(p.brand) : "")],
    [bi("Category", "類別"), p.category ? esc(tc ? (CATEGORY_TC[p.category] || p.category) : p.category) : ""],
    [bi("Product code", "產品編號"), p.stock_id ? esc(p.stock_id) : ""],
    [bi("Pack options", "包裝選項"), packOptions ? esc(packOptions) : ""],
    [bi("Specification", "規格"), packNote ? esc(packNote) : ""],
    [bi("Price", "價格"), pr.num > 0 ? bi(pr.en, pr.tc)
      : bi("On enquiry", "請查詢")],
    [bi("Lead time", "交貨期"), isEquipment
      ? bi("Varies with stock availability — please enquire", "視乎存貨供應情況，請向我們查詢")
      : bi("Typically within 1 week", "一般一星期內")],
    [bi("Delivery", "送貨"), bi("Free within Hong Kong on orders over HK$500",
                                "香港境內訂單滿HK$500免費送貨")],
    [bi("Returns", "退貨"), bi(
      'Defective or incorrect goods: notify within 7 days. <a href="/faq">See FAQ</a>',
      '如貨品有損壞或發錯，請於7天內通知我們。<a href="/faq">查看常見問題</a>')]
  ].filter(r => r[1]);

  const detailsTable = `<section class="pp-detailtable">
    <h2>${bi("Product details at a glance", "產品規格一覽")}</h2>
    <table class="pp-spectable">
      <tbody>${detailRows.map(([k, v]) =>
        `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("")}</tbody>
    </table>
    ${specs}
  </section>`;

  /* ---- question-led answers, built only from data already on the page ---- */
  const leadEn = isEquipment ? "varies with stock availability, so please enquire for the current lead time"
                             : "typically within 1 week";
  const leadTc = isEquipment ? "視乎存貨供應情況而定，請向我們查詢最新交貨期" : "一般在一星期內";
  const priceEn = pr.num > 0 ? `Price: ${pr.en}.` : "Price on enquiry.";
  const priceTc = pr.num > 0 ? `價格：${pr.tc}。` : "價格請向我們查詢。";
  const brandEn = bl ? ` from ${esc(p.brand)}` : "";
  const brandTc = bl ? `（${esc(p.brand)}）` : "";
  const qaBlock = `<section class="pp-qa">
    <h2>${bi("Quick answers", "常見問題")}</h2>
    <h3>${bi(`What is the lead time for ${esc(p.name_en)}?`, `${esc(p.name_tc || p.name_en)} 的交貨期是多久？`)}</h3>
    <p>${bi(`Lead time for this product is ${leadEn}. Delivery is free within Hong Kong on orders over HK$500.`,
            `此產品的交貨期${leadTc}。香港境內訂單滿 HK$500 免費送貨。`)}</p>
    <h3>${bi(`Is ${esc(p.name_en)} available in Hong Kong?`, `香港可以買到 ${esc(p.name_tc || p.name_en)} 嗎？`)}</h3>
    <p>${bi(`Yes. Clinicon Medical Ltd., a Hong Kong medical supplies distributor since 1980, supplies this product${brandEn}. ${priceEn} Order online, or message us on WhatsApp to confirm current stock.`,
            `可以。自1980年服務香港的健力醫療器材有限公司供應此產品${brandTc}。${priceTc}歡迎網上下單，或透過 WhatsApp 查詢現時存貨。`)}</p>
    <h3>${bi("What if the goods are defective or incorrect?", "如貨品有損壞或發錯怎麼辦？")}</h3>
    <p>${bi('Notify us within 7 days of delivery. After verification we will repair, replace or refund the affected goods at no extra cost, as set out in our <a href="/terms-and-conditions">terms and conditions</a>.',
            '請於收貨後7天內通知我們。經核實後，我們會按<a href="/terms-and-conditions">條款及細則</a>免費維修、更換或退款。')}</p>
  </section>`;

  const descBlock = MODE
    ? ((tc ? p.blurb_tc : realEn) ? `<section class="pp-desc">
    <h2>${bi("Product details", "產品詳情")}</h2>
    <p lang="${tc ? "zh-Hant-HK" : "en"}">${esc(tc ? p.blurb_tc : realEn)}</p>
  </section>` : "")
    : (realEn || p.blurb_tc) ? `<section class="pp-desc">
    <h2>${bi("Product details", "產品詳情")}</h2>
    ${realEn ? `<p class="pp-en">${esc(realEn)}</p>` : ""}
    <p class="pp-tc" lang="zh-Hant">${esc(p.blurb_tc || realEn)}</p>
  </section>` : "";

  return `<!DOCTYPE html>
<html lang="${tc ? "zh-Hant-HK" : "en"}" data-pp-lang="${tc ? "tc" : "en"}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(metaDesc)}">
<link rel="canonical" href="${url}">${MODE ? `
<link rel="alternate" hreflang="en" href="${SITE}${pageUrl(slug, "en")}">
<link rel="alternate" hreflang="zh-Hant" href="${SITE}${pageUrl(slug, "tc")}">
<link rel="alternate" hreflang="x-default" href="${SITE}${pageUrl(slug, "en")}">` : ""}
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48">
<link rel="icon" type="image/png" href="/favicon-192x192.png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="product">
<meta property="og:title" content="${esc(name)}">${tc ? `
<meta property="og:locale" content="zh_HK">` : ""}
<meta property="og:description" content="${esc(metaDesc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${imgUrl || DEFAULT_OG}">
<meta property="og:site_name" content="Clinicon Medical Ltd.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(name)}">
<meta name="twitter:description" content="${esc(metaDesc)}">
<meta name="twitter:image" content="${imgUrl || DEFAULT_OG}">
${FONTS}
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="/assets/productpage.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18249191886"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18249191886');
  gtag('config', 'G-P6NNSWFGGZ');
</script>
<script src="/assets/track.js" defer></script>
</head>
<body>
${header()}
<main class="pp-main wrap">
  <nav class="pp-crumb" aria-label="Breadcrumb">
    <a href="${tc ? "/zh" : "/"}">${bi("Home", "主頁")}</a> <span>/</span>
    <a href="${tc ? "/zh" : "/"}#products">${esc(tc ? (CATEGORY_TC[p.category] || p.category || "產品") : (p.category || "Products"))}</a> <span>/</span>
    <span aria-current="page">${bi(esc(p.name_en), esc(p.name_tc))}</span>
  </nav>

  <div class="pp-grid">
    <div class="pp-figure">${figure}</div>
    <div class="pp-info">
      ${p.category ? `<div class="pp-eyebrow">${esc(tc ? (CATEGORY_TC[p.category] || p.category) : p.category)}</div>` : ""}
      <h1 class="pp-name">${bi(esc(p.name_en), esc(p.name_tc))}</h1>${bl ? `
      <div class="pp-brandline">${bi("Brand", "品牌")}: <a href="${bl.href}">${esc(bl.name)}</a>${bl.count > 1 ? ` · <a href="${bl.href}">${bi(`See all ${bl.count} ${esc(bl.name)} products`, `查看全部 ${bl.count} 款 ${esc(bl.name)} 產品`)} →</a>` : ""}</div>` : ""}
      <div class="pp-price">${bi(pr.en, pr.tc)}</div>
      ${variants}
      <div class="pp-cta">
        ${addSolo}
        ${MODE === "tc" ? "" : `<a class="pp-wa${MODE ? "" : " pp-en"}" href="${waEn}" target="_blank" rel="noopener">${WA_SVG} Enquire via WhatsApp</a>`}
        ${MODE === "en" ? "" : `<a class="pp-wa${MODE ? "" : " pp-tc"}" href="${waTc}" target="_blank" rel="noopener">${WA_SVG} 透過 WhatsApp 查詢</a>`}
        <a class="pp-back" href="/products">${bi("← All products", "← 所有產品")}</a>
      </div>
    </div>
  </div>

  ${descBlock}

  ${detailsTable}

  ${qaBlock}

  ${relatedBlock(i)}

  <p class="pp-enquiry-note">
    ${MODE ? dual(`To order or ask a question, message us on WhatsApp at <a href="${WA}" target="_blank" rel="noopener">9320 9650</a> or email <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a>.`,
           `如需下單或查詢，請透過 WhatsApp <a href="${WA}" target="_blank" rel="noopener">9320 9650</a> 與我們聯絡，或電郵至 <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a>。`)
    : `<span class="pp-en">To order or ask a question, message us on WhatsApp at <a href="${WA}" target="_blank" rel="noopener">9320 9650</a> or email <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a>.</span>
    <span class="pp-tc">如需下單或查詢，請透過 WhatsApp <a href="${WA}" target="_blank" rel="noopener">9320 9650</a> 與我們聯絡，或電郵至 <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a>。</span>`}
  </p>
</main>

<div class="pp-toast" id="ppToast" role="status" aria-live="polite">
  ${dual("Added to cart ✓", "已加入購物車 ✓")}
  <a class="pp-toast-link" href="${tc ? "/zh?cart=open" : "/?cart=open"}">${dual("View cart", "查看購物車")}</a>
</div>
<script>window.PP={pi:${i},name_en:${JSON.stringify(p.name_en)},name_tc:${JSON.stringify(p.name_tc || "")},price:${Number(p.price) || 0},na:${pr.na ? "true" : "false"},variants:${JSON.stringify(p.variants || [])}};</script>
${footer()}
<script>
${MODE ? `(function(){
  var bg=document.getElementById("burger"),m=document.getElementById("menu");
  if(bg&&m)bg.addEventListener("click",function(){m.classList.toggle("open")});
})();` : `(function(){
  var K="clinicon-lang";
  function set(l){document.documentElement.setAttribute("data-pp-lang",l);
    document.documentElement.setAttribute("lang",l==="tc"?"zh-Hant":"en");
    try{localStorage.setItem(K,l)}catch(e){}
    document.querySelectorAll(".langtog button").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-pp-lang")===l)});}
  var init="en";try{init=localStorage.getItem(K)||"en"}catch(e){}
  set(init);
  document.querySelectorAll(".langtog button").forEach(function(b){b.addEventListener("click",function(){set(b.getAttribute("data-pp-lang"))})});
  var bg=document.getElementById("burger"),m=document.getElementById("menu");
  if(bg&&m)bg.addEventListener("click",function(){m.classList.toggle("open")});
})();`}
(function(){
  var P=window.PP; if(!P) return;
  var toast=document.getElementById("ppToast");
  function showToast(){ if(!toast)return; toast.classList.add("show"); clearTimeout(toast._t); toast._t=setTimeout(function(){toast.classList.remove("show");},2600); }
  document.querySelectorAll(".pp-add").forEach(function(b){
    b.addEventListener("click",function(){
      var vi=parseInt(b.getAttribute("data-vi"),10);
      var isVar=vi>=0 && P.variants[vi];
      var price=isVar?P.variants[vi][1]:P.price;
      var vlabel=isVar?P.variants[vi][0]:"";
      var noprice=!isVar && P.na;
      var key=P.pi+"_"+vi;
      var cart=[]; try{cart=JSON.parse(localStorage.getItem("clinicon_cart")||"[]");}catch(e){}
      var ex=null; for(var i=0;i<cart.length;i++){if(cart[i].key===key){ex=cart[i];break;}}
      if(ex)ex.qty++; else cart.push({key:key,name_en:P.name_en,name_tc:P.name_tc,vlabel:vlabel,price:price,qty:1,noprice:noprice});
      try{localStorage.setItem("clinicon_cart",JSON.stringify(cart));}catch(e){}
      showToast();
    });
  });
})();
</script>
</body>
</html>`;
}


/* =====================================================================
   Brand pages  ->  /brands/<slug>
   Data lives in brands.json (website, logo, description). Every brand tagged on a
   product also gets a page, with no description if brands.json has none.
   A product is listed on a brand's page when its `brand` matches OR the brand is in
   its `tags` (this is how 3M and Solventum share one product list).
   ===================================================================== */
const brandData = JSON.parse(fs.readFileSync(path.join(__dirname, "brands.json"), "utf8"));
function brandSlug(n) {
  return String(n).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "brand";
}
const brands = brandData.map(b => Object.assign({}, b));
/* No logo set in brands.json? Use images/brands/<slug>.<ext> if someone has uploaded one. */
const findLogo = slug => { for (const ext of ["png", "jpg", "jpeg", "svg", "webp"])
  if (fs.existsSync(path.join(__dirname, "images", "brands", slug + "." + ext))) return `/images/brands/${slug}.${ext}`;
  return null; };
{
  const known = new Set(brands.map(b => b.name));
  products.forEach(p => {
    const b = p.brand;
    if (b && b !== "Other" && !known.has(b)) {
      known.add(b);
      brands.push({ name: b, slug: brandSlug(b), tile: false, logo: null, website: null, description: [] });
    }
  });
  brands.forEach(b => { if (!b.logo) b.logo = findLogo(b.slug); });
  const seen = {};
  brands.forEach(b => {
    if (seen[b.slug]) { console.error("!! BRAND SLUG COLLISION: " + b.slug); process.exit(1); }
    seen[b.slug] = 1;
  });
}
const brandProducts = b => products.map((p, i) => i)
  .filter(i => products[i].brand === b.name || (products[i].tags || []).includes(b.name));

const clip = (t, n) => { t = String(t).replace(/\s+/g, " ").trim(); if (t.length <= n) return t;
  const c = t.slice(0, n - 1); return c.slice(0, c.lastIndexOf(" ")) + "…"; };
const siteHost = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return u; } };

function brandCard(j) {
  const rp = products[j], rs = slugs[j], pr = priceParts(rp);
  const fig = rp.image_missing
    ? `<div class="pp-rel-noimg"></div>`
    : `<img src="${abs(rp.image)}" alt="${esc(rp.name_en)}" loading="lazy">`;
  return `<a class="pp-rel-card" href="/products/${rs}">
      <div class="pp-rel-fig">${fig}</div>
      <div class="pp-rel-name">${bi(esc(rp.name_en), esc(rp.name_tc))}</div>
      <div class="pp-rel-price">${bi(pr.en, pr.tc)}</div>
    </a>`;
}

function brandPage(b) {
  MODE = null; PAGE_SLUG = "";
  const idx = brandProducts(b);
  const url = `${SITE}/brands/${b.slug}`;
  const paras = b.description || [];
  const title = `${b.name} products | Clinicon Medical Ltd.`;
  const desc = clip(paras[0] || `${b.name} products available from Clinicon Medical Ltd., a trusted Hong Kong medical supplies distributor since 1980.`, 300);
  const metaDesc = cutText(desc, 160, 80);
  const logoUrl = b.logo ? SITE + b.logo : "";

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Brand", "@id": url + "#brand", name: b.name, url,
        logo: logoUrl || undefined, description: paras.length ? paras.join(" ") : undefined,
        sameAs: b.website ? [b.website] : undefined },
      { "@type": "BreadcrumbList", "@id": url + "#breadcrumb", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: "Brands", item: SITE + "/brands" },
        { "@type": "ListItem", position: 3, name: b.name } ] },
      { "@type": "CollectionPage", "@id": url + "#webpage", url, name: title, inLanguage: "en-HK",
        isPartOf: { "@id": SITE + "/#website" }, about: { "@id": url + "#brand" },
        breadcrumb: { "@id": url + "#breadcrumb" },
        mainEntity: { "@type": "ItemList", numberOfItems: idx.length,
          itemListElement: idx.map((j, k) => ({ "@type": "ListItem", position: k + 1, url: `${SITE}/products/${slugs[j]}` })) } }
    ]
  };

  const logoBlock = b.logo ? `<div class="br-logo"><img src="${b.logo}" alt="${esc(b.name)} logo"></div>` : "";
  const siteLink = b.website
    ? `<a class="br-site" href="${esc(b.website)}" target="_blank" rel="noopener">${bi("Official website", "官方網站")}: ${esc(siteHost(b.website))} ↗</a>` : "";
  const aka = b.now_known_as
    ? `<a class="br-aka" href="/brands/${b.now_known_as.slug}">${bi("Now known as " + esc(b.now_known_as.name), "現稱 " + esc(b.now_known_as.name))} →</a>` : "";
  const idBlock = (logoBlock || siteLink || aka) ? `<div class="br-id">${logoBlock}${siteLink}${aka}</div>` : "";

  /* Facts about what we list for this brand, derived from the catalogue (no invented history). */
  const cats = [...new Set(idx.map(j => products[j].category).filter(Boolean))];
  /* English-only product names for the sentence: drop any Chinese tail, skip names that would be left too short. */
  const sample = idx.map(j => products[j].name_en.replace(/\s*[\u3400-\u9fff].*$/, "").trim())
    .filter((n, k, a) => n.length >= 8 && a.indexOf(n) === k).slice(0, 3);
  const listEn = a => a.length > 1 ? a.slice(0, -1).join(", ") + " and " + a[a.length - 1] : (a[0] || "");
  const listTc = a => a.join("、");
  const catsEn = listEn(cats.slice(0, 4)), catsTc = listTc(cats.slice(0, 4).map(c => CATEGORY_TC[c] || c));
  const brandQa = `<section class="pp-qa br-qa">
    <h2>${bi(`${esc(b.name)} at Clinicon`, `${esc(b.name)}：健力供應資訊`)}</h2>
    <h3>${bi(`Is ${esc(b.name)} available from Clinicon in Hong Kong?`, `香港健力醫療器材有限公司有供應 ${esc(b.name)} 嗎？`)}</h3>
    <p>${idx.length
      ? bi(`Yes. Clinicon Medical Ltd. lists ${idx.length} ${esc(b.name)} product${idx.length > 1 ? "s" : ""} for Hong Kong customers${catsEn ? `, in ${esc(catsEn)}` : ""}${sample.length ? `, including ${esc(listEn(sample))}` : ""}. Prices, pack options and lead times are on each product page.`,
           `有。健力醫療器材有限公司現為香港客戶提供 ${idx.length} 款 ${esc(b.name)} 產品${catsTc ? `，涵蓋${esc(catsTc)}` : ""}。價格、包裝選項及交貨期載於各產品頁。`)
      : bi(`We don't list any ${esc(b.name)} products online right now. Message us on WhatsApp or email and we will check what we can supply.`,
           `目前網上未有 ${esc(b.name)} 產品。歡迎透過 WhatsApp 或電郵查詢，我們會為你查看可供應的產品。`)}</p>
    <h3>${bi(`How do I order ${esc(b.name)} products?`, `如何訂購 ${esc(b.name)} 產品？`)}</h3>
    <p>${bi(`Add items to the cart on the product pages, or message us on <a href="${WA}" target="_blank" rel="noopener">WhatsApp 9320 9650</a> or email <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a> for a quotation. Delivery within Hong Kong is free on orders over HK$500.`,
            `可在產品頁加入購物車，或透過 <a href="${WA}" target="_blank" rel="noopener">WhatsApp 9320 9650</a>、電郵 <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a> 索取報價。香港境內訂單滿 HK$500 免費送貨。`)}</p>
  </section>`;

  const productsBlock = idx.length
    ? `<section class="pp-related br-products">
    <h2>${bi(`Products we supply (${idx.length})`, `我們供應的產品（${idx.length}）`)}</h2>
    <div class="pp-rel-grid">${idx.map(brandCard).join("")}</div>
  </section>`
    : `<section class="pp-related br-products">
    <h2>${bi("Products we supply", "我們供應的產品")}</h2>
    <p class="br-empty">${bi(
      `We don't have any ${esc(b.name)} products listed online right now. To enquire, message us on <a href="${WA}" target="_blank" rel="noopener">WhatsApp 9320 9650</a> or email <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a>.`,
      `目前網上暫無 ${esc(b.name)} 產品。如需查詢，請透過 <a href="${WA}" target="_blank" rel="noopener">WhatsApp 9320 9650</a> 或電郵 <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a> 與我們聯絡。`)}</p>
  </section>`;

  return `<!DOCTYPE html>
<html lang="en" data-pp-lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(metaDesc)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48">
<link rel="icon" type="image/png" href="/favicon-192x192.png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(b.name)}">
<meta property="og:description" content="${esc(metaDesc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${logoUrl || DEFAULT_OG}">
<meta property="og:site_name" content="Clinicon Medical Ltd.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(b.name)}">
<meta name="twitter:description" content="${esc(metaDesc)}">
<meta name="twitter:image" content="${logoUrl || DEFAULT_OG}">
${FONTS}
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="/assets/productpage.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18249191886"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18249191886');
  gtag('config', 'G-P6NNSWFGGZ');
</script>
<script src="/assets/track.js" defer></script>
</head>
<body>
${header()}
<main class="pp-main wrap">
  <nav class="pp-crumb" aria-label="Breadcrumb">
    <a href="/">${bi("Home", "主頁")}</a> <span>/</span>
    <a href="/brands">${bi("Brands", "品牌")}</a> <span>/</span>
    <span aria-current="page">${esc(b.name)}</span>
  </nav>

  <section class="br-hero${idBlock ? "" : " br-hero-solo"}">
    ${idBlock}
    <div class="br-text">
      <div class="pp-eyebrow">${bi("Brand", "品牌")}</div>
      <h1 class="pp-name">${esc(b.name)}</h1>
      ${paras.map(t => `<p>${esc(t)}</p>`).join("\n      ")}${b.part_of ? `
      <p class="br-partof">${b.part_of.slug ? esc(b.part_of.text).replace(esc(b.part_of.name), `<a href="/brands/${b.part_of.slug}">${esc(b.part_of.name)}</a>`) : esc(b.part_of.text)}</p>` : ""}
    </div>
  </section>

  ${productsBlock}

  ${brandQa}

  <p class="pp-enquiry-note">
    <span class="pp-en">To order or ask a question, message us on WhatsApp at <a href="${WA}" target="_blank" rel="noopener">9320 9650</a> or email <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a>.</span>
    <span class="pp-tc">如需下單或查詢，請透過 WhatsApp <a href="${WA}" target="_blank" rel="noopener">9320 9650</a> 與我們聯絡，或電郵至 <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a>。</span>
  </p>
</main>
${footer()}
<script>
(function(){
  var K="clinicon-lang";
  function set(l){document.documentElement.setAttribute("data-pp-lang",l);
    document.documentElement.setAttribute("lang",l==="tc"?"zh-Hant":"en");
    try{localStorage.setItem(K,l)}catch(e){}
    document.querySelectorAll(".langtog button").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-pp-lang")===l)});}
  var init="en";try{init=localStorage.getItem(K)||"en"}catch(e){}
  set(init);
  document.querySelectorAll(".langtog button").forEach(function(b){b.addEventListener("click",function(){set(b.getAttribute("data-pp-lang"))})});
  var bg=document.getElementById("burger"),m=document.getElementById("menu");
  if(bg&&m)bg.addEventListener("click",function(){m.classList.toggle("open")});
})();
</script>
</body>
</html>`;
}


/* ---- crawlable hub pages: /products (every product) and /brands (every brand) ----
   Plain <a> links, linked from every footer, so no product or brand page depends on
   JavaScript or on the related-products rotation to be discovered. */
function hubShell({ path: hubPath, title, desc, crumbEn, crumbTc, eyebrowEn, eyebrowTc, h1En, h1Tc, introEn, introTc, body }) {
  MODE = null; PAGE_SLUG = "";
  const url = SITE + hubPath;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", "@id": url + "#breadcrumb", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: crumbEn } ] },
      { "@type": "CollectionPage", "@id": url + "#webpage", url, name: title, inLanguage: "en-HK",
        isPartOf: { "@id": SITE + "/#website" }, breadcrumb: { "@id": url + "#breadcrumb" } }
    ]
  };
  return `<!DOCTYPE html>
<html lang="en" data-pp-lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48">
<link rel="icon" type="image/png" href="/favicon-192x192.png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(h1En)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Clinicon Medical Ltd.">
${FONTS}
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="/assets/productpage.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18249191886"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18249191886');
  gtag('config', 'G-P6NNSWFGGZ');
</script>
<script src="/assets/track.js" defer></script>
</head>
<body>
${header()}
<main class="pp-main wrap">
  <nav class="pp-crumb" aria-label="Breadcrumb">
    <a href="/">${bi("Home", "主頁")}</a> <span>/</span>
    <span aria-current="page">${bi(crumbEn, crumbTc)}</span>
  </nav>
  <section class="hub-head">
    <div class="pp-eyebrow">${bi(eyebrowEn, eyebrowTc)}</div>
    <h1 class="pp-name">${bi(h1En, h1Tc)}</h1>
    <p class="hub-intro">${bi(introEn, introTc)}</p>
  </section>
  ${body}
  <p class="pp-enquiry-note">
    <span class="pp-en">To order or ask a question, message us on WhatsApp at <a href="${WA}" target="_blank" rel="noopener">9320 9650</a> or email <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a>.</span>
    <span class="pp-tc">如需下單或查詢，請透過 WhatsApp <a href="${WA}" target="_blank" rel="noopener">9320 9650</a> 與我們聯絡，或電郵至 <a href="mailto:info@clinicon.com.hk">info@clinicon.com.hk</a>。</span>
  </p>
</main>
${footer()}
<script>
(function(){
  var K="clinicon-lang";
  function set(l){document.documentElement.setAttribute("data-pp-lang",l);
    document.documentElement.setAttribute("lang",l==="tc"?"zh-Hant":"en");
    try{localStorage.setItem(K,l)}catch(e){}
    document.querySelectorAll(".langtog button").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-pp-lang")===l)});}
  var init="en";try{init=localStorage.getItem(K)||"en"}catch(e){}
  set(init);
  document.querySelectorAll(".langtog button").forEach(function(b){b.addEventListener("click",function(){set(b.getAttribute("data-pp-lang"))})});
  var bg=document.getElementById("burger"),m=document.getElementById("menu");
  if(bg&&m)bg.addEventListener("click",function(){m.classList.toggle("open")});
})();
</script>
</body>
</html>`;
}

function productsHubPage() {
  const groups = new Map();
  products.forEach((p, i) => {
    const c = p.category || "Other";
    if (!groups.has(c)) groups.set(c, []);
    groups.get(c).push(i);
  });
  const body = [...groups].map(([cat, idx]) => `<section class="hub-group">
    <h2>${bi(esc(cat), esc(CATEGORY_TC[cat] || cat))} <span class="hub-count">(${idx.length})</span></h2>
    <ul class="hub-list">
${idx.map(j => `      <li><a href="/products/${slugs[j]}">${bi(esc(products[j].name_en), esc(products[j].name_tc || products[j].name_en))}</a></li>`).join("\n")}
    </ul>
  </section>`).join("\n  ");
  return hubShell({
    path: "/products",
    title: "All products | Clinicon Medical Ltd.",
    desc: `Browse all ${products.length} medical supplies and equipment from Clinicon Medical Ltd., a Hong Kong medical supplies distributor since 1980, by category.`,
    crumbEn: "All products", crumbTc: "所有產品",
    eyebrowEn: "Catalogue", eyebrowTc: "產品目錄",
    h1En: "All products", h1Tc: "所有產品",
    introEn: `${products.length} products across ${groups.size} categories. Select a product for price, pack options and ordering.`,
    introTc: `共 ${products.length} 款產品，分為 ${groups.size} 個類別。點選產品即可查看價格、包裝選項及下單方法。`,
    body
  });
}

function brandsHubPage() {
  const rows = brands.map(b => ({ b, n: brandProducts(b).length }));
  const body = `<section class="hub-group">
    <ul class="hub-list">
${rows.map(({ b, n }) => `      <li><a href="/brands/${b.slug}">${esc(b.name)}</a>${n ? ` <span class="hub-count">(${n})</span>` : ""}</li>`).join("\n")}
    </ul>
  </section>`;
  return hubShell({
    path: "/brands",
    title: "Brands | Clinicon Medical Ltd.",
    desc: `Medical brands supplied by Clinicon Medical Ltd. in Hong Kong, including ${brands.slice(0, 4).map(b => b.name).join(", ")} and more.`,
    crumbEn: "Brands", crumbTc: "品牌",
    eyebrowEn: "Brands", eyebrowTc: "品牌",
    h1En: "Brands we supply", h1Tc: "我們供應的品牌",
    introEn: `${brands.length} brands. Select a brand to see its products.`,
    introTc: `共 ${brands.length} 個品牌。點選品牌即可查看其產品。`,
    body
  });
}

/* Homepage brand tiles link to these pages; fail the build if a link would 404. */
{
  const slugSet = new Set(brands.map(b => b.slug));
  const home = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  const bad = [...home.matchAll(/href="\/brands\/([^"]+)"/g)].map(m => m[1]).filter(x => !slugSet.has(x));
  if (bad.length) { console.error("!! index.html links to brand pages that do not exist: " + bad.join(", ")); process.exit(1); }
}

/* ---- write everything ---- */
let count = 0;
let zhCount = 0;
products.forEach((p, i) => {
  const write = (base, html) => {
    const dir = path.join(OUT, base, slugs[i]);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  };
  if (isZhPage(p)) {
    // single-language twins: English at /products/<slug>, Chinese at /zh/products/<slug>
    write("products", page(p, slugs[i], i, "en"));
    write(path.join("zh", "products"), page(p, slugs[i], i, "tc"));
    zhCount++;
  } else {
    write("products", page(p, slugs[i], i));
  }
  count++;
});
MODE = null;

brands.forEach(b => {
  const dir = path.join(OUT, "brands", b.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), brandPage(b));
});
MODE = null;

fs.mkdirSync(path.join(OUT, "products"), { recursive: true });
fs.writeFileSync(path.join(OUT, "products", "index.html"), productsHubPage());
fs.mkdirSync(path.join(OUT, "brands"), { recursive: true });
fs.writeFileSync(path.join(OUT, "brands", "index.html"), brandsHubPage());
MODE = null;

/* No <lastmod>: it used to be the build date on every URL, which is not when a page changed,
   and Google ignores lastmod once it learns it is unreliable. */

/* Homepage is bilingual (/ and /zh), so it carries hreflang. Regular product pages
   are bilingual single URLs, so they carry no zh-Hant alternate. Products flagged
   `zh_page` have a separate /zh/products/<slug> twin, so they list both. */
const HOME_ALT =
  `<xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/>` +
  `<xhtml:link rel="alternate" hreflang="zh-Hant" href="${SITE}/zh"/>` +
  `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;

const entries = [
  `  <url><loc>${SITE}/</loc>${HOME_ALT}</url>`,
  `  <url><loc>${SITE}/zh</loc>${HOME_ALT}</url>`,
  `  <url><loc>${SITE}/faq</loc></url>`,
  `  <url><loc>${SITE}/services</loc></url>`,
  `  <url><loc>${SITE}/how-to-order</loc></url>`,
  `  <url><loc>${SITE}/clinic-packages</loc></url>`,
  /* /promotions is deliberately left out: it is a "coming soon" page marked noindex until real offers are published. */
  `  <url><loc>${SITE}/terms-and-conditions</loc></url>`,
  `  <url><loc>${SITE}/products</loc></url>`,
  `  <url><loc>${SITE}/brands</loc></url>`,
  ...slugs.flatMap((s, i) => {
    if (!isZhPage(products[i])) return [`  <url><loc>${SITE}/products/${s}</loc></url>`];
    const alt = `<xhtml:link rel="alternate" hreflang="en" href="${SITE}/products/${s}"/>` +
      `<xhtml:link rel="alternate" hreflang="zh-Hant" href="${SITE}/zh/products/${s}"/>` +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/products/${s}"/>`;
    return [
      `  <url><loc>${SITE}/products/${s}</loc>${alt}</url>`,
      `  <url><loc>${SITE}/zh/products/${s}</loc>${alt}</url>`
    ];
  }),
  ...brands.map(b => `  <url><loc>${SITE}/brands/${b.slug}</loc></url>`)
];

fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>\n`);

fs.writeFileSync(path.join(OUT, "slug-map.json"),
  JSON.stringify(products.map((p, i) => ({ name: p.name_en, slug: slugs[i], url: `/products/${slugs[i]}` })), null, 1));

console.log(`Generated ${brands.length} brand pages, ${count} product pages (${zhCount} with a separate /zh/products twin) + sitemap.xml (${entries.length} urls).`);
