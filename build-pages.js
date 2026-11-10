#!/usr/bin/env node
/* build-pages.js
   The FAQ, Services, How-to-order, Clinic-packages and Terms pages are hand-written bilingual
   masters in src/pages/<slug>.html: every phrase is <span class="pp-en">…</span><span class="pp-tc">…</span>.
   This script turns each master into
       /<slug>/index.html       English only   (<html lang="en">)
       /zh/<slug>/index.html    Chinese only   (<html lang="zh-Hant-HK">)
   so every URL carries one language in its title, H1, meta description, body and JSON-LD,
   with hreflang pairs and a language switch that links to the other URL.
   Pages whose zh setting is null in pages.config.js (Terms) are built English-only.

   Edit the master, then run:   node build-pages.js
   (run `node build-products.js` as well if you changed anything the sitemap lists) */
const fs = require("fs");
const path = require("path");
const PAGES = require("./pages.config.js");

const SITE = "https://www.clinicon.com.hk";
const SRC = path.join(__dirname, "src", "pages");
const MAX_DESC = 155;
const ZH_SLUGS = new Set(PAGES.filter(p => p.zh).map(p => "/" + p.slug));

const fail = msg => { console.error("!! build-pages: " + msg); process.exit(1); };
const decode = s => s.replace(/&nbsp;/g, " ").replace(/&middot;/g, "·").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const plain = s => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const escAttr = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escText = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/* A pair is an English span followed by a Chinese span. Either may carry extra classes
   (<span class="cp-chip pp-en">): those classes are kept on the span that survives. */
const PAIR = /<span class="([^"]*\bpp-en\b[^"]*)"[^>]*>([\s\S]*?)<\/span>\s*<span class="([^"]*\bpp-tc\b[^"]*)"[^>]*>([\s\S]*?)<\/span>/g;
const keep = (cls, txt) => { const c = cls.replace(/\bpp-(?:en|tc)\b/, "").replace(/\s+/g, " ").trim(); return c ? `<span class="${c}">${txt}</span>` : txt; };

/* ---- JSON-LD: translate every string for the Chinese page ---- */
const TEXT_KEYS = new Set(["name", "text", "description", "serviceType", "headline", "alternateName"]);
function localiseLd(ld, pairs, overrides, slug, label) {
  const missing = [];
  const urlRe = new RegExp("^" + SITE.replace(/[.]/g, "\\.") + "/" + slug + "(?=$|[#?])");
  const walk = (o, key) => {
    if (Array.isArray(o)) return o.map(v => walk(v, key));
    if (o && typeof o === "object") {
      const r = {};
      for (const [k, v] of Object.entries(o)) r[k] = walk(v, k);
      return r;
    }
    if (typeof o !== "string") return o;
    if (key === "inLanguage") return "zh-Hant-HK";
    if (key === "@id" || key === "url" || key === "item") {
      if (o === SITE + "/") return key === "item" ? SITE + "/zh" : o;     // breadcrumb Home -> Chinese home; shared @id stays
      return o.replace(urlRe, SITE + "/zh/" + slug);
    }
    if (TEXT_KEYS.has(key)) {
      const k = plain(o);
      if (overrides[k] !== undefined) return overrides[k];
      if (pairs.has(k)) return pairs.get(k);
      missing.push(key + ": " + k.slice(0, 80));
    }
    return o;
  };
  const out = walk(ld, "");
  if (missing.length) fail(label + ": no Chinese text for JSON-LD strings (add them to zh.ld in pages.config.js):\n   " + missing.join("\n   "));
  return out;
}

function build(page, lang) {
  const slug = page.slug;
  const label = (lang === "zh" ? "zh/" : "") + slug;
  let html = fs.readFileSync(path.join(SRC, slug + ".html"), "utf8");
  const zhTwin = !!page.zh;
  const en = lang === "en";

  /* pairs for JSON-LD translation: English plain text -> Chinese plain text */
  const pairs = new Map();
  for (const m of html.matchAll(PAIR)) pairs.set(plain(m[2]), plain(m[4]));

  /* 1. keep one language of every pair */
  html = html.replace(PAIR, (_, ec, et, tc, tt) => (en ? keep(ec, et) : keep(tc, tt)));
  if (/class="[^"]*\bpp-(en|tc)\b/.test(html.replace(/<style[\s\S]*?<\/style>/g, ""))) fail(label + ": unpaired pp-en/pp-tc span left in the master");

  /* 2. <html lang> */
  html = html.replace(/<html lang="en" data-pp-lang="en">/, en ? '<html lang="en">' : '<html lang="zh-Hant-HK">');

  /* 3. head: title, description, canonical, hreflang, Open Graph */
  const url = SITE + (en ? "" : "/zh") + "/" + slug;
  const enUrl = SITE + "/" + slug, zhUrl = SITE + "/zh/" + slug;
  const titleEn = decode(html.match(/<title>([\s\S]*?)<\/title>/)[1]);
  const title = en ? titleEn : page.zh.title;
  const desc = en ? (page.en.desc || decode(html.match(/<meta name="description" content="([^"]*)"/)[1])) : page.zh.desc;
  if ([...desc].length > MAX_DESC) fail(label + ": meta description is " + [...desc].length + " characters (max " + MAX_DESC + ")");
  html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>" + escText(title) + "</title>");
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, "$1" + escAttr(desc) + "$2");
  html = html.replace(/(<link rel="canonical" href=")[^"]*(">)/, "$1" + url + "$2");
  if (!en) {
    html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, "$1" + escAttr(title) + "$2");
    html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, "$1" + escAttr(desc) + "$2");
  }
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, "$1" + url + "$2");
  const alt = zhTwin
    ? `\n<link rel="alternate" hreflang="en" href="${enUrl}">\n<link rel="alternate" hreflang="zh-Hant" href="${zhUrl}">\n<link rel="alternate" hreflang="x-default" href="${enUrl}">` : "";
  html = html.replace(/(<link rel="canonical" href="[^"]*">)/, "$1" + alt);
  if (!en) html = html.replace(/(<meta property="og:site_name" content="[^"]*">)/, '$1\n<meta property="og:locale" content="zh_HK">');

  /* 4. language switch: real links to the twin URL (or no switch when there is no twin) */
  const tog = zhTwin
    ? `<div class="langtog" id="langtog">${en
        ? `<a class="active" href="/${slug}" hreflang="en">EN</a><a href="/zh/${slug}" hreflang="zh-Hant">繁</a>`
        : `<a href="/${slug}" hreflang="en">EN</a><a class="active" href="/zh/${slug}" hreflang="zh-Hant">繁</a>`}</div>`
    : "";
  if (!/<div class="langtog" id="langtog">[\s\S]*?<\/div>/.test(html)) fail(label + ": language switch not found in master");
  html = html.replace(/<div class="langtog" id="langtog">[\s\S]*?<\/div>/, tog);

  /* 5. the old inline script swapped languages in the browser; only the menu button is still needed */
  const scripts = [...html.matchAll(/<script>[\s\S]*?<\/script>/g)].filter(m => m[0].includes("clinicon-lang"));
  if (scripts.length !== 1) fail(label + ": expected one language-toggle script, found " + scripts.length);
  html = html.replace(scripts[0][0],
    '<script>\n(function(){var bg=document.getElementById("burger"),m=document.getElementById("menu");if(bg&&m)bg.addEventListener("click",function(){m.classList.toggle("open")});})();\n</script>');

  /* 6. JSON-LD */
  if (!en) {
    html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (_, a, body, c) => {
      const pretty = body.includes("\n");
      const out = localiseLd(JSON.parse(body), pairs, (page.zh.ld || {}), slug, label);
      return a + (pretty ? "\n" + JSON.stringify(out, null, 2) + "\n" : JSON.stringify(out)) + c;
    });
  }

  /* 7. internal links on the Chinese page point at Chinese URLs (Terms has no Chinese twin) */
  if (!en) {
    html = html.replace(/href="\/(#[^"]*)?"/g, (_, h) => `href="/zh${h || ""}"`);
    html = html.replace(/href="(\/(?:faq|services|how-to-order|clinic-packages))((?:#[^"]*)?)"/g,
      (m, p, h) => ZH_SLUGS.has(p) ? `href="/zh${p}${h}"` : m);
    html = html.replace(/(<a href="\/terms-and-conditions"[^>]*>)([^<]*條款及細則)(<\/a>)/g, "$1$2（英文版）$3");
  }
  return html;
}

for (const page of PAGES) {
  const outputs = [["en", path.join(__dirname, page.slug)]];
  if (page.zh) outputs.push(["zh", path.join(__dirname, "zh", page.slug)]);
  for (const [lang, dir] of outputs) {
    const html = build(page, lang);
    if (/NaN|undefined/.test(html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, ""))) fail(dir + ": NaN/undefined in output");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
    console.log("wrote " + path.relative(__dirname, path.join(dir, "index.html")));
  }
}
