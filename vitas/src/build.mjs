#!/usr/bin/env node
/**
 * Static site generator for vitas.com.hk.
 *
 *   node src/build.mjs
 *
 * Writes plain HTML into this folder (index.html, product/index.html, …) plus
 * sitemap.xml. There is no framework and no runtime dependency: commit the
 * output and Vercel serves it as-is.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { page, SITE } from './layout.mjs';
import { ARTICLES } from './data.mjs';
import * as pages from './pages.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const specs = [
  pages.home(),
  pages.product(),
  pages.howToUse(),
  pages.ingredients(),
  pages.approach(),
  pages.stockists(),
  pages.journalIndex(),
  ...ARTICLES.map((a) => pages.article(a)),
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

for (const spec of specs) {
  const file = join(root, fileFor(spec.path));
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(spec), 'utf8');
  written.push(spec.path);
}

/* -------------------------------------------------------------- sitemap.xml */

const today = new Date().toISOString().slice(0, 10);
const urls = specs
  .filter((s) => !s.path.endsWith('.html'))
  .map(
    (s) => `  <url>
    <loc>${SITE.url}${s.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${s.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${s.path === '/' ? '1.0' : s.path === '/product/' ? '0.9' : '0.7'}</priority>
  </url>`
  )
  .join('\n');

await writeFile(
  join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
  'utf8'
);

console.log(`Built ${written.length} pages:`);
for (const p of written) console.log('  ' + p);
console.log('Wrote sitemap.xml');
