/**
 * Layout primitives for the VITAS site.
 *
 * URLs
 * ----
 * Every page is a real, separately addressable URL — including each language
 * and each ingredient. English lives at `/path/`, 繁體中文 at `/zh/path/`, and
 * each page renders in one language only, with <link rel="alternate" hreflang>
 * pointing at its counterpart. Nothing is hidden behind an anchor, a tab or a
 * client-side toggle, so every page can be indexed, linked and shared on its
 * own.
 *
 * Bilingual content is written as `{ en, zh }` pairs; the build sets the
 * current language once per page and `t()` returns the right side.
 */

export const SITE = {
  url: 'https://www.vitas.com.hk',
  name: 'VITAS 紓適寧',
  brandEn: 'VITAS',
  brandZh: '紓適寧',
  youtube: 'https://www.youtube.com/@VITASHK',
  facebook: 'https://www.facebook.com/vitashk/',
  email: 'hello@vitas.com.hk',
  address: {
    en: 'Hong Kong',
    zh: '香港',
  },
};

/* ------------------------------------------------------------- language */

let LANG = 'en';

/** Set by the build before rendering each page. */
export const setLang = (lang) => {
  LANG = lang;
};
export const getLang = () => LANG;

/** Bilingual value → the string for the language being rendered. */
export function t(value) {
  if (value == null) return '';
  return typeof value === 'string' ? value : value[LANG];
}

/** Block-level bilingual text. */
export function blk(tag, value, className = '') {
  const cls = className ? ` class="${className}"` : '';
  return `<${tag}${cls}>${t(value)}</${tag}>`;
}

/** Plain text in a specific language, for <title>, meta and JSON-LD. */
export const plain = (value, lang = LANG) =>
  typeof value === 'string' ? value : value[lang];

/** Escape text destined for an HTML attribute. */
export const attr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* ------------------------------------------------------------------ urls */

/** Canonical (English) path → the URL for the language being rendered. */
export const url = (path) => (LANG === 'zh' ? '/zh' + path : path);

/** Canonical path → the URL in a named language. */
export const urlIn = (path, lang) => (lang === 'zh' ? '/zh' + path : path);

/* --------------------------------------------------------------- chrome */

const navItems = [
  { href: '/product/', label: { en: 'The Cream', zh: '產品' } },
  { href: '/how-to-use/', label: { en: 'How to Use', zh: '使用方法' } },
  { href: '/ingredients/', label: { en: 'Ingredients', zh: '成分' } },
  { href: '/approach/', label: { en: 'Our Approach', zh: '我們的取態' } },
  { href: '/journal/', label: { en: 'Journal', zh: '專欄' } },
  { href: '/stockists/', label: { en: 'Where to Buy', zh: '購買地點' } },
];

function header(active, path) {
  const links = navItems
    .map(
      (item) =>
        `<a class="nav__link${active === item.href ? ' is-active' : ''}" href="${url(item.href)}"${
          active === item.href ? ' aria-current="page"' : ''
        }>${t(item.label)}</a>`
    )
    .join('\n          ');

  const other = LANG === 'zh' ? 'en' : 'zh';

  return `  <a class="skip-link" href="#main">${t({ en: 'Skip to content', zh: '跳至主要內容' })}</a>
  <header class="site-header" id="site-header">
    <div class="site-header__inner">
      <a class="wordmark" href="${url('/')}" aria-label="VITAS 紓適寧">
        <span class="wordmark__mark" aria-hidden="true">V</span>
        <span class="wordmark__latin">VITAS</span>
        <span class="wordmark__zh">紓適寧</span>
      </a>
      <nav class="nav" id="primary-nav" aria-label="${attr(t({ en: 'Primary', zh: '主要' }))}">
        <div class="nav__links">
          ${links}
        </div>
        <div class="nav__actions">
          <a class="lang-toggle" href="${urlIn(path, other)}" hreflang="${
            other === 'zh' ? 'zh-Hant' : 'en'
          }" lang="${other === 'zh' ? 'zh-Hant' : 'en'}">${other === 'zh' ? '中文' : 'EN'}</a>
          <a class="btn btn--sm" href="${url('/stockists/')}">${t({ en: 'Buy', zh: '購買' })}</a>
        </div>
      </nav>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-nav-toggle>
        <span class="nav-toggle__bar"></span>
        <span class="sr-only">${t({ en: 'Menu', zh: '選單' })}</span>
      </button>
    </div>
  </header>`;
}

function footer() {
  const col = (heading, links) => `
        <div class="footer__col">
          <h3 class="footer__heading">${t(heading)}</h3>
          <ul class="footer__list">
            ${links
              .map(
                (l) =>
                  `<li><a href="${l.external ? l.href : url(l.href)}"${
                    l.external ? ' target="_blank" rel="noopener"' : ''
                  }>${t(l.label)}</a></li>`
              )
              .join('\n            ')}
          </ul>
        </div>`;

  return `  <footer class="site-footer">
    <div class="footer__top">
      <div class="footer__intro">
        <span class="wordmark wordmark--footer">
          <span class="wordmark__mark" aria-hidden="true">V</span>
          <span class="wordmark__latin">VITAS</span>
          <span class="wordmark__zh">紓適寧</span>
        </span>
        ${blk('p', {
          en: 'A low-odour, non-greasy plant-oil cream gel for warming up before training and easing tired muscles after it. Made in France.',
          zh: '低氣味、不油膩的植物油啫喱膏，運動前熱身、運動後放鬆疲勞肌肉。法國製造。',
        })}
        <div class="footer__social">
          <a href="${SITE.youtube}" target="_blank" rel="noopener">YouTube</a>
          <a href="${SITE.facebook}" target="_blank" rel="noopener">Facebook</a>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
        </div>
      </div>
      <div class="footer__cols">
        ${col({ en: 'Product', zh: '產品' }, [
          { href: '/product/', label: { en: 'Soothing Cream Gel 100ml', zh: '舒緩啫喱膏 100毫升' } },
          { href: '/ingredients/', label: { en: 'Ingredients', zh: '成分' } },
          { href: '/how-to-use/', label: { en: 'How to use', zh: '使用方法' } },
          { href: '/stockists/', label: { en: 'Where to buy', zh: '購買地點' } },
        ])}
        ${col({ en: 'Brand', zh: '品牌' }, [
          { href: '/approach/', label: { en: 'Our approach', zh: '我們的取態' } },
          { href: '/journal/', label: { en: 'Journal', zh: '專欄' } },
          { href: '/faq/', label: { en: 'FAQ', zh: '常見問題' } },
          { href: '/contact/', label: { en: 'Contact', zh: '聯絡我們' } },
        ])}
        ${col({ en: 'Legal', zh: '條款' }, [
          { href: '/legal/privacy/', label: { en: 'Privacy', zh: '私隱政策' } },
          { href: '/legal/terms/', label: { en: 'Terms', zh: '使用條款' } },
        ])}
      </div>
    </div>
    <div class="footer__bottom">
      ${blk(
        'p',
        {
          en: 'VITAS Soothing Cream Gel is a cosmetic massage product. It is not a medicine and is not intended to diagnose, treat or cure any disease. If pain is severe, persistent or follows an injury, please see a doctor or physiotherapist.',
          zh: 'VITAS 舒緩啫喱膏屬按摩護理產品，並非藥物，不用於診斷、治療或預防任何疾病。如疼痛劇烈、持續或由受傷引起，請諮詢醫生或物理治療師。',
        },
        'footer__disclaimer'
      )}
      <p class="footer__copy">© ${new Date().getFullYear()} VITAS 紓適寧. ${t({
        en: 'All rights reserved.',
        zh: '版權所有。',
      })}</p>
    </div>
  </footer>`;
}

/**
 * Full page shell.
 *
 * @param {object} opts
 * @param {{en:string,zh:string}} opts.title
 * @param {{en:string,zh:string}} opts.description
 * @param {string} opts.path       – canonical (English) path, e.g. "/product/"
 * @param {string} opts.body
 * @param {string} [opts.active]   – nav path to highlight
 * @param {object[]} [opts.jsonLd]
 * @param {string} [opts.bodyClass]
 */
export function page({ title, description, path, body, active, jsonLd = [], bodyClass = '' }) {
  const isZh = LANG === 'zh';
  const canonical = SITE.url + url(path);
  const htmlLang = isZh ? 'zh-Hant-HK' : 'en-HK';
  const structured = jsonLd
    .map((data) => `  <script type="application/ld+json">${JSON.stringify(data)}</script>`)
    .join('\n');

  return `<!doctype html>
<html lang="${htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${attr(t(title))} | VITAS 紓適寧</title>
  <meta name="description" content="${attr(t(description))}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="en-HK" href="${SITE.url + urlIn(path, 'en')}">
  <link rel="alternate" hreflang="zh-Hant-HK" href="${SITE.url + urlIn(path, 'zh')}">
  <link rel="alternate" hreflang="x-default" href="${SITE.url + urlIn(path, 'en')}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="VITAS 紓適寧">
  <meta property="og:title" content="${attr(t(title))} | VITAS 紓適寧">
  <meta property="og:description" content="${attr(t(description))}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE.url}/assets/img/og-cover.png">
  <meta property="og:locale" content="${isZh ? 'zh_HK' : 'en_HK'}">
  <meta property="og:locale:alternate" content="${isZh ? 'en_HK' : 'zh_HK'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#EF6023">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/img/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Noto+Sans+HK:wght@300;400;500;700&display=swap">
  <link rel="stylesheet" href="/assets/css/site.css">
${structured}
</head>
<body class="${bodyClass}${isZh ? ' lang-zh' : ''}">
${header(active, path)}
  <main id="main">
${body}
  </main>
${footer()}
  <script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

/* ---------------------------------------------------------------- pieces */

/** Eyebrow + heading + optional lede, used at the top of most sections. */
export function sectionHead({ eyebrow, heading, lede, align = 'left' }) {
  return `      <div class="section-head section-head--${align}">
        ${eyebrow ? blk('p', eyebrow, 'eyebrow') : ''}
        ${blk('h2', heading, 'section-head__title')}
        ${lede ? blk('p', lede, 'section-head__lede') : ''}
      </div>`;
}

/** Call to action. Internal paths are language-prefixed automatically. */
export function cta(href, label, variant = '') {
  const external = /^https?:/.test(href);
  return `<a class="btn${variant ? ' ' + variant : ''}" href="${external ? href : url(href)}"${
    external ? ' target="_blank" rel="noopener"' : ''
  }>${t(label)}</a>`;
}

/** Inline text link with an arrow. Internal paths are language-prefixed. */
export function arrow(href, label) {
  return `<a class="link-arrow" href="${url(href)}">${t(label)}</a>`;
}

/** Illustrated media panel — SVG art on a tinted ground. */
export function figure(src, alt, tone = 'tint', { caption, w = 1200, h = 800 } = {}) {
  return `<figure class="figure figure--${tone}">
          <img src="${src}" alt="${attr(plain(alt))}" loading="lazy" decoding="async" width="${w}" height="${h}">
          ${caption ? blk('figcaption', caption) : ''}
        </figure>`;
}
