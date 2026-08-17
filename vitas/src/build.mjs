#!/usr/bin/env node
/**
 * Static site generator for vitas.com.hk.
 *
 *   node src/build.mjs
 *
 * Writes plain HTML into this folder — one file per page, per language:
 *
 *   /index.html              /zh/index.html
 *   /product/index.html      /zh/product/index.html
 *   /ingredients/eucalyptus/index.html …
 *
 * Every page is its own URL. There is no framework and no runtime dependency:
 * commit the output and Vercel serves it as-is.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { page, setLang, urlIn, SITE } from './layout.mjs';
import { ARTICLES, PLANTS, SPORTS } from './data.mjs';
import * as pages from './pages.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['en', 'zh'];

/** Build the page list for whichever language is currently set. */
const buildSpecs = () => [
  pages.home(),
  pages.shop(),
  pages.cart(),
  pages.checkoutResult('success'),
  pages.checkoutResult('cancelled'),
  pages.product(),
  pages.howToUse(),
  pages.ingredients(),
  ...PLANTS.map((p) => pages.ingredient(p)),
  pages.sportsIndex(),
  ...SPORTS.map((sp) => pages.sport(sp)),
  pages.approach(),
  pages.stockists(),
  pages.journalIndex(),
  ...ARTICLES.map((a) => pages.article(a)),
  pages.about(),
  pages.faq(),
  pages.contact(),
  pages.legal('privacy'),
  pages.legal('terms'),
  pages.notFound(),
];

/** "/product/" → "product/index.html"; "/404.html" → "404.html". */
const fileFor = (path) =>
  path.endsWith('.html') ? path.replace(/^\//, '') : join(path.replace(/^\//, ''), 'index.html');

const written = [];
const canonicalPaths = [];

for (const lang of LANGS) {
  setLang(lang);
  for (const spec of buildSpecs()) {
    const path = urlIn(spec.path, lang);
    const file = join(root, fileFor(path));
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, page(spec), 'utf8');
    written.push(path);
    const indexable = !spec.path.endsWith('.html') && !spec.path.startsWith('/checkout/');
    if (lang === 'en' && indexable) canonicalPaths.push(spec.path);
  }
}

/* -------------------------------------------------------------- sitemap.xml */

const today = new Date().toISOString().slice(0, 10);

const entry = (path, lang) => `  <url>
    <loc>${SITE.url}${urlIn(path, lang)}</loc>
    <xhtml:link rel="alternate" hreflang="en-HK" href="${SITE.url}${urlIn(path, 'en')}"/>
    <xhtml:link rel="alternate" hreflang="zh-Hant-HK" href="${SITE.url}${urlIn(path, 'zh')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}${urlIn(path, 'en')}"/>
    <lastmod>${today}</lastmod>
    <changefreq>${path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '/' ? '1.0' : path === '/product/' ? '0.9' : '0.7'}</priority>
  </url>`;

const urls = LANGS.flatMap((lang) => canonicalPaths.map((path) => entry(path, lang))).join('\n');

await writeFile(
  join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
  'utf8'
);

console.log(`Built ${written.length} pages (${canonicalPaths.length} × ${LANGS.length} languages + 404):`);
for (const p of written) console.log('  ' + p);
console.log('Wrote sitemap.xml');
