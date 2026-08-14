#!/usr/bin/env node
/**
 * Generates the site's illustration set as flat SVG files.
 *
 *   node src/make-art.mjs
 *
 * These are placeholders with a point of view: botanical line art in the brand
 * palette, so the site is complete and on-brand with no photography at all.
 * When real product and lifestyle photography exists, drop it into
 * assets/img/ under the same filenames (or update the paths in src/data.mjs)
 * and delete this script.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'img');
await mkdir(out, { recursive: true });

const C = {
  paper: '#F7F4EF',
  paperDeep: '#EFE9E0',
  forest: '#22372E',
  sage: '#8FA38C',
  sageTint: '#DFE6DC',
  sand: '#E8DCC9',
  sandTint: '#F3ECE1',
  vine: '#6C4A56',
};

const svg = (w, h, inner, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"${extra}>
${inner}
</svg>
`;

const write = (name, content) => writeFile(join(out, name), content, 'utf8');

/* ------------------------------------------------------------- helpers */

/** One eucalyptus-style leaf: an almond shape with a centre vein. */
function leaf(x, y, len, wid, angle, fill, opacity = 1) {
  const d = `M0,0 C${len * 0.35},${-wid} ${len * 0.75},${-wid} ${len},0 C${len * 0.75},${wid} ${
    len * 0.35
  },${wid} 0,0 Z`;
  return `<g transform="translate(${x} ${y}) rotate(${angle})" opacity="${opacity}">
    <path d="${d}" fill="${fill}" stroke="${C.forest}" stroke-width="1.1" stroke-opacity="0.35"/>
    <path d="M${len * 0.06},0 L${len * 0.9},0" stroke="${C.forest}" stroke-width="0.9" stroke-opacity="0.28" fill="none"/>
  </g>`;
}

/* --------------------------------------------------------- eucalyptus */

{
  const leaves = [];
  const steps = 7;
  for (let i = 0; i < steps; i++) {
    const p = i / (steps - 1);
    const x = 210 + p * 520;
    const y = 780 - p * 560;
    const size = 190 - p * 70;
    leaves.push(leaf(x, y, size, size * 0.34, -34 - p * 6, i % 2 ? C.sageTint : C.sage, 0.9));
    leaves.push(
      leaf(x - 12, y + 18, size * 0.92, size * 0.3, 150 - p * 6, i % 2 ? C.sage : C.sageTint, 0.85)
    );
  }
  const art = `  <rect width="1000" height="1000" fill="${C.paper}"/>
  <circle cx="520" cy="470" r="360" fill="${C.sageTint}" opacity="0.55"/>
  <path d="M180,860 C330,720 500,560 700,300" stroke="${C.forest}" stroke-width="3" stroke-opacity="0.5" fill="none" stroke-linecap="round"/>
${leaves.join('\n')}
  <circle cx="716" cy="286" r="14" fill="${C.forest}" opacity="0.5"/>`;
  await write('plant-eucalyptus.svg', svg(1000, 1000, art, ' aria-label="Eucalyptus"'));
}

/* -------------------------------------------------------------- grape */

{
  const berries = [];
  const rows = [
    [520, 620, 3],
    [520, 700, 2],
    [520, 775, 1],
  ];
  for (const [cx, cy, n] of rows) {
    for (let i = 0; i < n; i++) {
      const x = cx + (i - (n - 1) / 2) * 92;
      berries.push(
        `<circle cx="${x}" cy="${cy}" r="45" fill="${C.vine}" opacity="0.85"/>` +
          `<circle cx="${x - 14}" cy="${cy - 15}" r="12" fill="${C.paper}" opacity="0.35"/>`
      );
    }
  }
  const lobe = (a, r) =>
    `${520 + Math.cos(a) * r},${420 + Math.sin(a) * r}`;
  const leafPath = [
    'M520,180',
    `C${lobe(-1.9, 250)} ${lobe(-2.5, 210)} 300,330`,
    `C250,360 250,420 300,450`,
    `C240,470 240,520 320,545`,
    `C380,570 460,540 520,470`,
    `C580,540 660,570 720,545`,
    `C800,520 800,470 740,450`,
    `C790,420 790,360 740,330`,
    `C${lobe(-0.65, 210)} ${lobe(-1.25, 250)} 520,180 Z`,
  ].join(' ');

  const art = `  <rect width="1000" height="1000" fill="${C.paper}"/>
  <circle cx="500" cy="480" r="370" fill="${C.sandTint}" opacity="0.9"/>
  <path d="${leafPath}" fill="${C.sage}" fill-opacity="0.4" stroke="${C.forest}" stroke-width="2.4" stroke-opacity="0.55" stroke-linejoin="round"/>
  <g stroke="${C.forest}" stroke-opacity="0.35" stroke-width="1.6" fill="none">
    <path d="M520,200 L520,470"/><path d="M520,330 L330,350"/><path d="M520,330 L710,350"/>
    <path d="M520,400 L350,470"/><path d="M520,400 L690,470"/>
  </g>
  <path d="M520,470 C520,520 520,560 520,580" stroke="${C.forest}" stroke-width="3" stroke-opacity="0.5" fill="none"/>
${berries.join('\n  ')}
  <path d="M700,560 c40,-10 60,20 30,40 -30,20 -60,-10 -20,-40" stroke="${C.forest}" stroke-width="2.2" stroke-opacity="0.45" fill="none"/>`;
  await write('plant-grape.svg', svg(1000, 1000, art, ' aria-label="Grape seed"'));
}

/* ------------------------------------------------------------- niaouli */

{
  const bristles = [];
  for (let i = 0; i < 34; i++) {
    const y = 300 + i * 12;
    const w = 120 - Math.abs(i - 17) * 4;
    bristles.push(
      `<path d="M500,${y} L${500 - w},${y - 14}" stroke="${C.sage}" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/>` +
        `<path d="M500,${y} L${500 + w},${y - 14}" stroke="${C.sage}" stroke-width="2.4" stroke-linecap="round" opacity="0.85"/>`
    );
  }
  const leaves = [];
  for (let i = 0; i < 5; i++) {
    leaves.push(leaf(500, 760 + i * 6, 210, 32, 150 + i * 12, C.sageTint, 0.9));
    leaves.push(leaf(500, 760 + i * 6, 210, 32, 30 - i * 12, C.sageTint, 0.9));
  }
  const art = `  <rect width="1000" height="1000" fill="${C.paper}"/>
  <circle cx="500" cy="500" r="355" fill="${C.sageTint}" opacity="0.5"/>
  <path d="M500,250 L500,860" stroke="${C.forest}" stroke-width="3.2" stroke-opacity="0.55" fill="none" stroke-linecap="round"/>
${bristles.join('\n  ')}
${leaves.join('\n')}
  <circle cx="500" cy="252" r="11" fill="${C.forest}" opacity="0.5"/>`;
  await write('plant-niaouli.svg', svg(1000, 1000, art, ' aria-label="Niaouli"'));
}

/* --------------------------------------------------------- product tube */

{
  const art = `  <defs>
    <linearGradient id="tube" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.42" stop-color="${C.paperDeep}"/>
      <stop offset="1" stop-color="#D9D2C6"/>
    </linearGradient>
    <linearGradient id="cap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.forest}"/>
      <stop offset="0.5" stop-color="#31503F"/>
      <stop offset="1" stop-color="#1A2C24"/>
    </linearGradient>
  </defs>
  <ellipse cx="260" cy="672" rx="185" ry="20" fill="${C.forest}" opacity="0.12"/>
  <rect x="120" y="150" width="280" height="520" rx="26" fill="url(#tube)"/>
  <path d="M120,190 h280" stroke="${C.forest}" stroke-opacity="0.12" stroke-width="1"/>
  <rect x="196" y="40" width="128" height="112" rx="14" fill="url(#cap)"/>
  <rect x="196" y="126" width="128" height="10" fill="#16241D" opacity="0.6"/>
  <rect x="150" y="270" width="220" height="250" rx="6" fill="${C.paper}" opacity="0.95"/>
  <text x="260" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="40" letter-spacing="13" fill="${C.forest}">VITAS</text>
  <text x="260" y="366" text-anchor="middle" font-family="serif" font-size="20" letter-spacing="6" fill="${C.sage}">紓適寧</text>
  <line x1="185" y1="392" x2="335" y2="392" stroke="${C.sage}" stroke-width="1"/>
  <text x="260" y="424" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="14.5" letter-spacing="2.4" fill="${C.forest}" opacity="0.75">SOOTHING</text>
  <text x="260" y="446" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="14.5" letter-spacing="2.4" fill="${C.forest}" opacity="0.75">CREAM GEL</text>
  <text x="260" y="486" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" letter-spacing="3" fill="${C.forest}" opacity="0.5">100 ml</text>
${leaf(196, 560, 78, 26, -18, C.sageTint, 0.95)}
${leaf(258, 566, 78, 26, 6, C.sage, 0.75)}
  <rect x="120" y="150" width="280" height="520" rx="26" fill="none" stroke="${C.forest}" stroke-opacity="0.18"/>
  <path d="M156,190 v440" stroke="#ffffff" stroke-opacity="0.75" stroke-width="14" stroke-linecap="round"/>`;
  await write(
    'product-tube.svg',
    svg(520, 700, art, ' aria-label="VITAS Soothing Cream Gel 100ml"')
  );
}

/* -------------------------------------------------- editorial panels */

/** Shared ground for the 3:2 editorial illustrations. */
const panel = (bgA, bgB, inner) => `  <rect width="1200" height="800" fill="${bgA}"/>
  <path d="M0,520 C260,420 420,600 660,470 C860,360 1040,430 1200,360 L1200,800 L0,800 Z" fill="${bgB}" opacity="0.85"/>
${inner}`;

{
  /* training — arcs of movement over a hill of leaves */
  const arcs = [];
  for (let i = 0; i < 5; i++) {
    arcs.push(
      `<path d="M${170 + i * 26},640 C${330 + i * 26},${360 - i * 22} ${700 + i * 20},${
        320 - i * 18
      } ${960 + i * 14},560" stroke="${C.forest}" stroke-opacity="${0.5 - i * 0.07}" stroke-width="${
        2.6 - i * 0.3
      }" fill="none" stroke-linecap="round"/>`
    );
  }
  const sprigs = [];
  for (let i = 0; i < 6; i++) {
    sprigs.push(leaf(200 + i * 160, 690 - (i % 2) * 40, 120, 40, -30 + i * 8, i % 2 ? C.sage : C.sageTint, 0.9));
  }
  await write(
    'art-training.svg',
    svg(
      1200,
      800,
      panel(
        C.sandTint,
        C.sageTint,
        `${arcs.join('\n  ')}
  <circle cx="960" cy="230" r="86" fill="${C.sand}" opacity="0.9"/>
${sprigs.join('\n')}`
      ),
      ' aria-label="Before training"'
    )
  );
}

{
  /* recovery — concentric ripples settling */
  const rings = [];
  for (let i = 0; i < 7; i++) {
    rings.push(
      `<circle cx="620" cy="400" r="${90 + i * 62}" fill="none" stroke="${C.forest}" stroke-opacity="${
        0.5 - i * 0.055
      }" stroke-width="${2.8 - i * 0.2}"/>`
    );
  }
  await write(
    'art-recovery.svg',
    svg(
      1200,
      800,
      panel(
        C.sageTint,
        C.sandTint,
        `${rings.join('\n  ')}
  <circle cx="620" cy="400" r="66" fill="${C.sage}" opacity="0.75"/>
${leaf(560, 400, 210, 62, -14, C.paper, 0.9)}
${leaf(548, 430, 180, 52, 168, C.sandTint, 0.85)}`
      ),
      ' aria-label="After training"'
    )
  );
}

{
  /* desk — quiet horizontal lines, one shoulder-shaped curve */
  const lines = [];
  for (let i = 0; i < 9; i++) {
    lines.push(
      `<path d="M120,${190 + i * 58} H${420 + (i % 3) * 120}" stroke="${C.forest}" stroke-opacity="0.26" stroke-width="2.2" stroke-linecap="round"/>`
    );
  }
  await write(
    'art-desk.svg',
    svg(
      1200,
      800,
      panel(
        C.paperDeep,
        C.sageTint,
        `${lines.join('\n  ')}
  <path d="M700,700 C700,470 780,340 930,330 C1080,320 1140,470 1140,700" fill="${C.sage}" fill-opacity="0.5" stroke="${C.forest}" stroke-opacity="0.5" stroke-width="2.6"/>
  <path d="M760,560 C830,520 1010,520 1080,560" stroke="${C.forest}" stroke-opacity="0.3" stroke-width="2" fill="none"/>
${leaf(220, 700, 150, 46, -22, C.sage, 0.75)}`
      ),
      ' aria-label="At a desk"'
    )
  );
}

/* ----------------------------------------------------- favicon & cover */

await write(
  'favicon.svg',
  svg(
    64,
    64,
    `  <rect width="64" height="64" rx="12" fill="${C.forest}"/>
  <path d="M32,14 C44,22 46,38 32,50 C18,38 20,22 32,14 Z" fill="${C.sageTint}"/>
  <path d="M32,18 L32,48" stroke="${C.forest}" stroke-width="1.6" stroke-opacity="0.65"/>`
  )
);

await write(
  'og-cover.svg',
  svg(
    1200,
    630,
    `  <rect width="1200" height="630" fill="${C.paper}"/>
  <path d="M0,430 C240,340 420,500 660,390 C860,300 1040,360 1200,300 L1200,630 L0,630 Z" fill="${C.sageTint}"/>
  <text x="80" y="250" font-family="Georgia, serif" font-size="72" letter-spacing="22" fill="${C.forest}">VITAS</text>
  <text x="80" y="310" font-family="serif" font-size="34" letter-spacing="10" fill="${C.sage}">紓適寧</text>
  <text x="80" y="392" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="2" fill="${C.forest}" opacity="0.8">Low-odour plant-oil cream gel · 100ml</text>
${leaf(880, 180, 220, 70, 24, C.sage, 0.85)}
${leaf(860, 240, 190, 60, 160, C.sageTint, 0.9)}`
  )
);

console.log('Wrote illustrations to assets/img/');
