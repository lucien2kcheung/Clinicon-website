#!/usr/bin/env node
/**
 * Rasterises assets/img/og-cover.svg to og-cover.png (1200×630), the image
 * Facebook, LinkedIn and WhatsApp show when the site is shared — those
 * platforms do not render SVG, so the PNG has to exist.
 *
 *   npx playwright install chromium   # once
 *   node src/make-og.mjs
 *
 * Only needed when the cover art changes. The generated PNG is committed.
 */
import { chromium } from 'playwright';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const img = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'img');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(resolve(img, 'og-cover.svg')).href);
await page.screenshot({ path: resolve(img, 'og-cover.png') });
await browser.close();
console.log('Wrote assets/img/og-cover.png');
