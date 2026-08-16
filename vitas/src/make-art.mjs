#!/usr/bin/env node
/**
 * Generates the site's illustration set as flat SVG files.
 *
 *   node src/make-art.mjs
 *
 * One colour, drawn from the pack: orange line art on white. These are
 * placeholders with a point of view, so the site is complete and on-brand with
 * no photography at all. When real product and lifestyle photography exists,
 * drop it into assets/img/ under the same filenames (or update the paths in
 * src/data.mjs) and delete this script.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'img');
await mkdir(out, { recursive: true });

/* Brand Guidelines v1.0 — heritage orange, mint, chalk, carbon. */
const C = {
  white: '#FFFFFF',
  paper: '#FBF6EE',   /* Chalk */
  wash: '#FEF6EF',    /* orange-50 */
  tint: '#FBCEA9',    /* orange-200 */
  mid: '#F9B078',     /* orange-300 */
  brand: '#F47920',   /* VITAS Orange */
  deep: '#C6531A',    /* Ember */
  mint: '#17B39A',    /* Cooling Mint */
  mintWash: '#D3F1EC',
  ink: '#17181A',     /* Carbon */
  line: '#E7E0D4',
};

const svg = (w, h, inner, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"${extra}>
${inner}
</svg>
`;

const write = (name, content) => writeFile(join(out, name), content, 'utf8');

/* ------------------------------------------------------------- helpers */

/** One leaf: an almond shape with a centre vein. */
function leaf(x, y, len, wid, angle, fill, opacity = 1) {
  const d = `M0,0 C${len * 0.35},${-wid} ${len * 0.75},${-wid} ${len},0 C${len * 0.75},${wid} ${
    len * 0.35
  },${wid} 0,0 Z`;
  return `<g transform="translate(${x} ${y}) rotate(${angle})" opacity="${opacity}">
    <path d="${d}" fill="${fill}" stroke="${C.deep}" stroke-width="${Math.max(1.6, len * 0.025)}" stroke-opacity="0.5"/>
    <path d="M${len * 0.06},0 L${len * 0.9},0" stroke="${C.deep}" stroke-width="${Math.max(1.2, len * 0.018)}" stroke-opacity="0.4" fill="none"/>
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
    leaves.push(leaf(x, y, size, size * 0.34, -34 - p * 6, i % 2 ? C.tint : C.mid, 0.95));
    leaves.push(leaf(x - 12, y + 18, size * 0.92, size * 0.3, 150 - p * 6, i % 2 ? C.mid : C.tint, 0.9));
  }
  const art = `  <rect width="1000" height="1000" fill="${C.paper}"/>
  <circle cx="520" cy="470" r="360" fill="${C.wash}"/>
  <path d="M180,860 C330,720 500,560 700,300" stroke="${C.deep}" stroke-width="3" stroke-opacity="0.6" fill="none" stroke-linecap="round"/>
${leaves.join('\n')}
  <circle cx="716" cy="286" r="14" fill="${C.brand}"/>`;
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
        `<circle cx="${x}" cy="${cy}" r="45" fill="${C.brand}"/>` +
          `<circle cx="${x - 14}" cy="${cy - 15}" r="12" fill="${C.white}" opacity="0.5"/>`
      );
    }
  }
  const lobe = (a, r) => `${520 + Math.cos(a) * r},${420 + Math.sin(a) * r}`;
  const leafPath = [
    'M520,180',
    `C${lobe(-1.9, 250)} ${lobe(-2.5, 210)} 300,330`,
    'C250,360 250,420 300,450',
    'C240,470 240,520 320,545',
    'C380,570 460,540 520,470',
    'C580,540 660,570 720,545',
    'C800,520 800,470 740,450',
    'C790,420 790,360 740,330',
    `C${lobe(-0.65, 210)} ${lobe(-1.25, 250)} 520,180 Z`,
  ].join(' ');

  const art = `  <rect width="1000" height="1000" fill="${C.paper}"/>
  <circle cx="500" cy="480" r="370" fill="${C.wash}"/>
  <path d="${leafPath}" fill="${C.tint}" stroke="${C.deep}" stroke-width="2.6" stroke-opacity="0.65" stroke-linejoin="round"/>
  <g stroke="${C.deep}" stroke-opacity="0.45" stroke-width="1.8" fill="none">
    <path d="M520,200 L520,470"/><path d="M520,330 L330,350"/><path d="M520,330 L710,350"/>
    <path d="M520,400 L350,470"/><path d="M520,400 L690,470"/>
  </g>
  <path d="M520,470 C520,520 520,560 520,580" stroke="${C.deep}" stroke-width="3" stroke-opacity="0.6" fill="none"/>
${berries.join('\n  ')}
  <path d="M700,560 c40,-10 60,20 30,40 -30,20 -60,-10 -20,-40" stroke="${C.deep}" stroke-width="2.4" stroke-opacity="0.55" fill="none"/>`;
  await write('plant-grape.svg', svg(1000, 1000, art, ' aria-label="Grape seed"'));
}

/* ------------------------------------------------------------- niaouli */

{
  const bristles = [];
  for (let i = 0; i < 34; i++) {
    const y = 300 + i * 12;
    const w = 120 - Math.abs(i - 17) * 4;
    bristles.push(
      `<path d="M500,${y} L${500 - w},${y - 14}" stroke="${C.brand}" stroke-width="2.6" stroke-linecap="round" opacity="0.9"/>` +
        `<path d="M500,${y} L${500 + w},${y - 14}" stroke="${C.brand}" stroke-width="2.6" stroke-linecap="round" opacity="0.9"/>`
    );
  }
  const leaves = [];
  for (let i = 0; i < 5; i++) {
    leaves.push(leaf(500, 760 + i * 6, 210, 32, 150 + i * 12, C.tint, 0.95));
    leaves.push(leaf(500, 760 + i * 6, 210, 32, 30 - i * 12, C.tint, 0.95));
  }
  const art = `  <rect width="1000" height="1000" fill="${C.paper}"/>
  <circle cx="500" cy="500" r="355" fill="${C.wash}"/>
  <path d="M500,250 L500,860" stroke="${C.deep}" stroke-width="3.4" stroke-opacity="0.6" fill="none" stroke-linecap="round"/>
${bristles.join('\n  ')}
${leaves.join('\n')}
  <circle cx="500" cy="252" r="11" fill="${C.brand}"/>`;
  await write('plant-niaouli.svg', svg(1000, 1000, art, ' aria-label="Niaouli"'));
}

/* ----------------------------------------------------------- the pack */

{
  /* White tube standing on its flip cap, orange print — as sold. */
  const art = `  <defs>
    <linearGradient id="tube" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="0.38" stop-color="#FFFFFF"/>
      <stop offset="0.78" stop-color="#F3EBE6"/>
      <stop offset="1" stop-color="#E4D9D2"/>
    </linearGradient>
  </defs>
  <ellipse cx="260" cy="676" rx="150" ry="16" fill="${C.ink}" opacity="0.1"/>

  <!-- crimped seal at the top -->
  <rect x="176" y="52" width="168" height="26" rx="4" fill="#F1E9E4" stroke="${C.line}" stroke-width="1.5"/>
  <g stroke="${C.line}" stroke-width="1.4">
    ${Array.from({ length: 11 }, (_, i) => `<path d="M${190 + i * 14},56 v18"/>`).join('\n    ')}
  </g>

  <!-- body: shoulders at the top, widening to the cap -->
  <path d="M186,78 C186,140 150,190 148,300 L146,586 C146,600 158,608 176,608 L344,608
           C362,608 374,600 374,586 L372,300 C370,190 334,140 334,78 Z"
        fill="url(#tube)" stroke="${C.line}" stroke-width="1.5"/>

  <!-- flip cap -->
  <path d="M160,610 h200 c8,0 12,5 12,12 v34 c0,8 -6,14 -14,14 H162 c-8,0 -14,-6 -14,-14 v-34 c0,-7 4,-12 12,-12 Z"
        fill="#FBF7F5" stroke="${C.line}" stroke-width="1.5"/>
  <path d="M148,626 h224" stroke="${C.line}" stroke-width="1.2"/>

  <!-- print -->
  <circle cx="260" cy="150" r="21" fill="${C.brand}"/>
  <text x="260" y="158" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="500" fill="#FFFFFF">V</text>
  <text x="260" y="205" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11" letter-spacing="1.9" fill="${C.brand}">SOOTHING CREAM GEL</text>
  <text x="262" y="300" text-anchor="start" transform="rotate(90 262 300)" font-family="Helvetica, Arial, sans-serif" font-size="86" font-weight="300" letter-spacing="10" fill="${C.brand}">VITAS</text>
  <text x="260" y="566" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" letter-spacing="3" fill="${C.brand}">MADE IN FRANCE</text>
  <text x="260" y="592" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12" letter-spacing="2" fill="${C.brand}" opacity="0.9">100ml</text>

  <!-- highlight -->
  <path d="M180,150 C176,260 174,420 176,560" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" fill="none"/>`;
  await write('product-tube.svg', svg(520, 700, art, ' aria-label="VITAS Soothing Cream Gel 100ml"'));
}

/* -------------------------------------------------- editorial panels */

/** Shared ground for the 3:2 editorial illustrations. */
const panel = (bgA, bgB, inner) => `  <rect width="1200" height="800" fill="${bgA}"/>
  <path d="M0,520 C260,420 420,600 660,470 C860,360 1040,430 1200,360 L1200,800 L0,800 Z" fill="${bgB}"/>
${inner}`;

{
  /* training — arcs of movement over a hill of leaves */
  const arcs = [];
  for (let i = 0; i < 5; i++) {
    arcs.push(
      `<path d="M${170 + i * 26},640 C${330 + i * 26},${360 - i * 22} ${700 + i * 20},${
        320 - i * 18
      } ${960 + i * 14},560" stroke="${C.deep}" stroke-opacity="${0.6 - i * 0.09}" stroke-width="${
        2.8 - i * 0.3
      }" fill="none" stroke-linecap="round"/>`
    );
  }
  const sprigs = [];
  for (let i = 0; i < 6; i++) {
    sprigs.push(leaf(200 + i * 160, 690 - (i % 2) * 40, 120, 40, -30 + i * 8, i % 2 ? C.mid : C.tint, 0.95));
  }
  await write(
    'art-training.svg',
    svg(
      1200,
      800,
      panel(
        C.paper,
        C.wash,
        `${arcs.join('\n  ')}
  <circle cx="960" cy="230" r="86" fill="${C.brand}" opacity="0.9"/>
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
      `<circle cx="620" cy="400" r="${90 + i * 62}" fill="none" stroke="${C.deep}" stroke-opacity="${
        0.5 - i * 0.055
      }" stroke-width="${11 - i * 1.1}"/>`
    );
  }
  await write(
    'art-recovery.svg',
    svg(
      1200,
      800,
      panel(
        C.wash,
        C.tint,
        `${rings.join('\n  ')}
  <circle cx="620" cy="400" r="66" fill="${C.brand}"/>
${leaf(560, 400, 210, 62, -14, C.white, 0.95)}
${leaf(548, 430, 180, 52, 168, C.tint, 0.95)}`
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
      `<path d="M120,${190 + i * 58} H${420 + (i % 3) * 120}" stroke="${C.deep}" stroke-opacity="0.32" stroke-width="9" stroke-linecap="round"/>`
    );
  }
  await write(
    'art-desk.svg',
    svg(
      1200,
      800,
      panel(
        C.paper,
        C.wash,
        `${lines.join('\n  ')}
  <path d="M700,700 C700,470 780,340 930,330 C1080,320 1140,470 1140,700" fill="${C.tint}" stroke="${C.deep}" stroke-opacity="0.6" stroke-width="9"/>
  <path d="M760,560 C830,520 1010,520 1080,560" stroke="${C.deep}" stroke-opacity="0.45" stroke-width="8" fill="none"/>
${leaf(220, 700, 150, 46, -22, C.mid, 0.9)}`
      ),
      ' aria-label="At a desk"'
    )
  );
}


/* ------------------------------------------------- the duo (two packs) */

{
  /* Two tubes, one behind the other — the Recovery Duo on the shop page. */
  const tube = (x, y, scale, shade) => `  <g transform="translate(${x} ${y}) scale(${scale})" opacity="${shade}">
    <rect x="176" y="52" width="168" height="26" rx="4" fill="#F1E9E4" stroke="${C.line}" stroke-width="1.5"/>
    <path d="M186,78 C186,140 150,190 148,300 L146,586 C146,600 158,608 176,608 L344,608
             C362,608 374,600 374,586 L372,300 C370,190 334,140 334,78 Z"
          fill="#FFFFFF" stroke="${C.line}" stroke-width="1.5"/>
    <path d="M160,610 h200 c8,0 12,5 12,12 v34 c0,8 -6,14 -14,14 H162 c-8,0 -14,-6 -14,-14 v-34 c0,-7 4,-12 12,-12 Z"
          fill="#FBF7F5" stroke="${C.line}" stroke-width="1.5"/>
    <circle cx="260" cy="150" r="21" fill="${C.brand}"/>
    <text x="260" y="158" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="500" fill="#FFFFFF">V</text>
    <text x="260" y="205" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11" letter-spacing="1.9" fill="${C.brand}">SOOTHING CREAM GEL</text>
    <text x="262" y="300" text-anchor="start" transform="rotate(90 262 300)" font-family="Helvetica, Arial, sans-serif" font-size="86" font-weight="300" letter-spacing="10" fill="${C.brand}">VITAS</text>
    <text x="260" y="566" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" letter-spacing="3" fill="${C.brand}">MADE IN FRANCE</text>
    <path d="M180,150 C176,260 174,420 176,560" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" fill="none"/>
  </g>`;

  const art = `  <ellipse cx="300" cy="676" rx="215" ry="18" fill="${C.ink}" opacity="0.1"/>
${tube(-70, 40, 0.86, 0.85)}
${tube(90, 0, 1, 1)}`;
  await write('product-duo.svg', svg(600, 700, art, ' aria-label="VITAS Recovery Duo — two 100ml tubes"'));
}

/* ----------------------------------------------------- founder portrait */

{
  /* A portrait frame rather than a fake photograph: swap in the real one. */
  const art = `  <rect width="1000" height="1000" fill="${C.wash}"/>
  <circle cx="500" cy="470" r="300" fill="${C.tint}"/>
  <path d="M500,300 a115,115 0 1,0 0.1,0 Z" fill="${C.white}" stroke="${C.deep}" stroke-width="4" stroke-opacity="0.5"/>
  <path d="M320,760 C320,620 400,545 500,545 C600,545 680,620 680,760 Z" fill="${C.white}" stroke="${C.deep}" stroke-width="4" stroke-opacity="0.5"/>
  <path d="M250,830 H750" stroke="${C.deep}" stroke-width="5" stroke-opacity="0.35" stroke-linecap="round"/>
${leaf(700, 260, 190, 58, 28, C.mid, 0.95)}
${leaf(680, 320, 160, 48, 158, C.tint, 0.95)}
  <circle cx="286" cy="250" r="26" fill="${C.brand}"/>`;
  await write('art-founder.svg', svg(1000, 1000, art, ' aria-label="Founder portrait placeholder"'));
}

/* ----------------------------------------------------- favicon & cover */

await write(
  'favicon.svg',
  svg(
    64,
    64,
    `  <rect width="64" height="64" rx="14" fill="${C.brand}"/>
  <text x="32" y="45" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="500" fill="#FFFFFF">V</text>`
  )
);

await write(
  'og-cover.svg',
  svg(
    1200,
    630,
    `  <rect width="1200" height="630" fill="${C.white}"/>
  <path d="M0,430 C240,340 420,500 660,390 C860,300 1040,360 1200,300 L1200,630 L0,630 Z" fill="${C.wash}"/>
  <circle cx="104" cy="176" r="26" fill="${C.brand}"/>
  <text x="104" y="186" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="500" fill="#FFFFFF">V</text>
  <text x="152" y="196" font-family="Helvetica, Arial, sans-serif" font-size="76" font-weight="300" letter-spacing="20" fill="${C.brand}">VITAS</text>
  <text x="80" y="270" font-family="'Noto Sans HK', sans-serif" font-size="36" letter-spacing="10" fill="${C.brand}">紓適寧</text>
  <text x="80" y="360" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="2" fill="${C.ink}" opacity="0.85">Low-odour plant-oil cream gel · 100ml</text>
${leaf(880, 180, 220, 70, 24, C.tint, 0.95)}
${leaf(860, 240, 190, 60, 160, C.mid, 0.9)}`
  )
);

console.log('Wrote illustrations to assets/img/');
