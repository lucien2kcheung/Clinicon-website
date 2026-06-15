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
function slugify(s) {
  return (s || "product").toLowerCase().normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "product";
}
const used = {};
const slugs = products.map(p => {
  let base = slugify(p.name_en || p.name_tc), s = base, n = 2;
  while (used[s]) s = base + "-" + (n++);
  used[s] = 1; return s;
});

/* ---- helpers ---- */
const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const fmtPrice = n => "HK$" + Number(n || 0).toLocaleString("en-HK");
const abs = img => img ? ("/" + img.replace(/^\/+/, "")) : "";
const bi = (en, tc) => `<span class="pp-en">${en}</span><span class="pp-tc">${tc || en}</span>`;

function priceParts(p) {
  if (p.variants && p.variants.length) {
    const min = Math.min(...p.variants.map(v => Number(v[1]) || Infinity));
    if (isFinite(min) && min > 0) return { en: "From " + fmtPrice(min), tc: fmtPrice(min) + " 起", num: min };
  }
  if (p.price) return { en: fmtPrice(p.price), tc: fmtPrice(p.price), num: p.price };
  return { en: "Enquire for price", tc: "請查詢價格", num: 0 };
}

function relatedFor(i, n = 4) {
  const self = products[i], sameCat = [], others = [];
  products.forEach((p, j) => {
    if (j === i) return;
    (p.category && p.category === self.category ? sameCat : others).push(j);
  });
  return [...sameCat, ...others].slice(0, n);
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Archivo:wght@400;500;600;700&family=Noto+Sans+HK:wght@400;500;700&display=swap" rel="stylesheet">`;

const WA_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 0 0 1.523 5.26l-.999 3.648 3.965-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`;

function header() {
  return `<header>
  <nav class="nav">
    <a class="brand" href="/">
      <img src="/images/clinicon%20logo.png" alt="Clinicon Medical logo">
      <span class="bt"><b>Clinicon Medical</b><span>健力醫療器材有限公司</span></span>
    </a>
    <div class="menu" id="menu">
      <a href="/#products">${bi("Products", "產品")}</a>
      <a href="/#about">${bi("About Us", "關於我們")}</a>
      <a href="/#contact">${bi("Contact", "聯絡我們")}</a>
      <a class="wa-btn" href="${WA}" target="_blank" rel="noopener">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.4.5-.3.3c-.2.2-.3.4-.2.6.2.4.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.8-.1 1.5z"/></svg>
        ${bi("Order via WhatsApp", "透過 WhatsApp 下單")}
      </a>
      <div class="langtog" id="langtog">
        <button data-pp-lang="en" class="active">EN</button>
        <button data-pp-lang="tc">繁</button>
      </div>
    </div>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </nav>
</header>`;
}

function footer() {
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
        <a href="/#products">${bi("Products", "產品")}</a>
        <a href="/#about">${bi("About Us", "關於我們")}</a>
        <a href="/#contact">${bi("Contact", "聯絡我們")}</a>
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
    return `<a class="pp-rel-card" href="/products/${rs}">
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

function page(p, slug, i) {
  const url = `${SITE}/products/${slug}`;
  const pr = priceParts(p);
  const title = `${p.name_en} | Clinicon Medical Ltd.`;
  const desc = (p.blurb_en || `${p.name_en} — available from Clinicon Medical Ltd., a trusted Hong Kong medical supplies distributor since 1980.`)
    .replace(/\s+/g, " ").trim().slice(0, 300);
  const imgUrl = p.image_missing ? "" : SITE + abs(p.image);

  const waEn = `${WA}?text=${encodeURIComponent(`I would like to enquire about: ${p.name_en} (${pr.en}) — ${url}`)}`;
  const waTc = `${WA}?text=${encodeURIComponent(`您好，我想查詢以下產品：${p.name_tc || p.name_en}（${pr.tc}）— ${url}`)}`;

  const ld = {
    "@context": "https://schema.org/", "@type": "Product",
    name: p.name_en, alternateName: p.name_tc || undefined,
    image: imgUrl || undefined, description: desc,
    brand: { "@type": "Brand", name: p.brand || "Clinicon" },
    category: p.category || undefined, sku: p.stock_id || undefined,
    offers: {
      "@type": "Offer", url, priceCurrency: "HKD",
      price: pr.num || undefined,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Clinicon Medical Ltd." }
    }
  };

  const figure = p.image_missing
    ? `<div class="pp-noimg">${bi("Image coming soon", "圖片即將上載")}</div>`
    : `<img src="${abs(p.image)}" alt="${esc(p.name_en)}" width="640" height="640" loading="eager">`;

  const variants = (p.variants && p.variants.length)
    ? `<table class="pp-variants"><thead><tr><th>${bi("Model", "型號")}</th><th>${bi("Price", "價格")}</th></tr></thead><tbody>${
        p.variants.map(v => `<tr><td>${esc(v[0])}</td><td>${fmtPrice(v[1])}</td></tr>`).join("")
      }</tbody></table>` : "";

  const specs = (p.specs && p.specs.length)
    ? `<ul class="pp-specs">${p.specs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : "";

  const descBlock = (p.blurb_en || p.blurb_tc) ? `<section class="pp-desc">
    <h2>${bi("Product details", "產品詳情")}</h2>
    ${p.blurb_en ? `<p class="pp-en">${esc(p.blurb_en)}</p>` : ""}
    <p class="pp-tc" lang="zh-Hant">${esc(p.blurb_tc || p.blurb_en)}</p>
  </section>` : "";

  return `<!DOCTYPE html>
<html lang="en" data-pp-lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="product">
<meta property="og:title" content="${esc(p.name_en)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
${imgUrl ? `<meta property="og:image" content="${imgUrl}">` : ""}
<meta property="og:site_name" content="Clinicon Medical Ltd.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.name_en)}">
<meta name="twitter:description" content="${esc(desc)}">
${imgUrl ? `<meta name="twitter:image" content="${imgUrl}">` : ""}
${FONTS}
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="/assets/productpage.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
${header()}
<main class="pp-main wrap">
  <nav class="pp-crumb" aria-label="Breadcrumb">
    <a href="/">${bi("Home", "主頁")}</a> <span>/</span>
    <a href="/#products">${esc(p.category || "Products")}</a> <span>/</span>
    <span aria-current="page">${bi(esc(p.name_en), esc(p.name_tc))}</span>
  </nav>

  <div class="pp-grid">
    <div class="pp-figure">${figure}</div>
    <div class="pp-info">
      ${p.category ? `<div class="pp-eyebrow">${esc(p.category)}</div>` : ""}
      <h1 class="pp-name">${bi(esc(p.name_en), esc(p.name_tc))}</h1>
      <div class="pp-price">${bi(pr.en, pr.tc)}</div>
      ${variants}
      <div class="pp-cta">
        <a class="pp-wa pp-en" href="${waEn}" target="_blank" rel="noopener">${WA_SVG} Enquire via WhatsApp</a>
        <a class="pp-wa pp-tc" href="${waTc}" target="_blank" rel="noopener">${WA_SVG} 透過 WhatsApp 查詢</a>
        <a class="pp-back" href="/#products">${bi("← All products", "← 所有產品")}</a>
      </div>
      ${specs}
    </div>
  </div>

  ${descBlock}

  ${relatedBlock(i)}

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

/* ---- write everything ---- */
let count = 0;
products.forEach((p, i) => {
  const dir = path.join(OUT, "products", slugs[i]);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(p, slugs[i], i));
  count++;
});

const today = new Date().toISOString().slice(0, 10);
const urls = [`${SITE}/`, ...slugs.map(s => `${SITE}/products/${s}`)];
fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>\n`);

fs.writeFileSync(path.join(OUT, "slug-map.json"),
  JSON.stringify(products.map((p, i) => ({ name: p.name_en, slug: slugs[i], url: `/products/${slugs[i]}` })), null, 1));

console.log(`Generated ${count} bilingual product pages + sitemap.xml (${urls.length} urls).`);
console.log(`Pessary -> /products/${slugs[products.findIndex(p => /pessary/i.test(p.name_en))]}`);
