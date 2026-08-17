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

import { BRAND } from './data.mjs';

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
  { href: '/shop/', label: { en: 'Shop', zh: '網上商店' } },
  { href: '/product/', label: { en: 'The Cream', zh: '產品' } },
  { href: '/ingredients/', label: { en: 'Ingredients', zh: '成分' } },
  { href: '/how-to-use/', label: { en: 'How to Use', zh: '使用方法' } },
  { href: '/for/', label: { en: 'Your Sport', zh: '你的運動' } },
  { href: '/about/', label: { en: 'About VITAS', zh: '關於 VITAS' } },
  { href: '/faq/', label: { en: 'FAQ', zh: '常見問題' } },
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
        <img src="/assets/img/logo/logo_horizontal.svg" alt="VITAS" width="180" height="50">
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
          <a class="btn btn--sm" href="${url('/shop/')}">${t({ en: 'Shop', zh: '選購' })}</a>
        </div>
      </nav>
      <a class="cart-button" href="${url('/cart/')}" data-cart-link>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8Z"/>
          <path d="M9 9V6.5a3 3 0 0 1 6 0V9"/>
        </svg>
        <span class="cart-button__count" data-cart-count hidden>0</span>
        <span class="sr-only">${t({ en: 'Cart', zh: '購物車' })}</span>
      </a>
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
          <img src="/assets/img/logo/logo_horizontal.svg" alt="VITAS" width="200" height="56">
          <span class="wordmark__zh">紓適寧</span>
        </span>
        <p class="footer__slogan">${t(BRAND.slogan)[0]}<br>${t(BRAND.slogan)[1]}</p>
        ${blk('p', {
          en: 'The clean performance gel — grape seed, niaouli and eucalyptus, formulated in France. Zero toxins, trusted in Hong Kong since 2003.',
          zh: '純淨表現凝膠——葡萄籽、綠花白千層與尤加利，法國研製。零毒素，2003 年起獲香港信賴。',
        })}
        <div class="footer__social">
          <a href="${SITE.youtube}" target="_blank" rel="noopener">YouTube</a>
          <a href="${SITE.facebook}" target="_blank" rel="noopener">Facebook</a>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
        </div>
      </div>
      <div class="footer__cols">
        ${col({ en: 'Shop', zh: '購買' }, [
          { href: '/shop/', label: { en: 'Shop now', zh: '網上商店' } },
          { href: '/product/', label: { en: 'Soothing Cream Gel 100ml', zh: '舒緩啫喱膏 100毫升' } },
          { href: '/cart/', label: { en: 'Cart', zh: '購物車' } },
          { href: '/stockists/', label: { en: 'Where to buy', zh: '購買地點' } },
        ])}
        ${col({ en: 'Brand', zh: '品牌' }, [
          { href: '/about/', label: { en: 'About VITAS', zh: '關於 VITAS' } },
          { href: '/approach/', label: { en: 'Our approach', zh: '我們的取態' } },
          { href: '/ingredients/', label: { en: 'Ingredients', zh: '成分' } },
          { href: '/how-to-use/', label: { en: 'How to use', zh: '使用方法' } },
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
      ${blk('p', BRAND.disclaimer, 'footer__disclaimer')}
      <p class="footer__copy">© ${new Date().getFullYear()} VITAS 紓適寧. ${t({
        en: 'All rights reserved.',
        zh: '版權所有。',
      })}</p>
    </div>
  </footer>`;
}


/**
 * Welcome offer. Shown once per visitor (a localStorage flag suppresses it
 * afterwards), never on the checkout pages. The email goes to the same endpoint
 * as the newsletter — see README, "Forms".
 */
function welcomeModal() {
  return `  <div class="welcome" data-welcome hidden>
    <div class="welcome__scrim" data-welcome-close></div>
    <div class="welcome__panel" role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-describedby="welcome-text">
      <button class="welcome__close" type="button" data-welcome-close aria-label="${attr(
        t({ en: 'Close', zh: '關閉' })
      )}">&times;</button>
      <p class="welcome__eyebrow">${t({ en: 'Welcome offer', zh: '迎新優惠' })}</p>
      ${blk('h2', { en: 'HK$50 off your first order', zh: '首次訂購減 HK$50' }, 'welcome__title')
        .replace('<h2', '<h2 id="welcome-title"')}
      ${blk(
        'p',
        {
          en: 'Leave your email and we will send the code — and, once a month or so, a note on training and recovery. No spam, unsubscribe in one click.',
          zh: '留下你的電郵，我們會把優惠碼寄給你；並約每月一次分享訓練與恢復的內容。不發垃圾郵件，一鍵取消訂閱。',
        },
        'welcome__text'
      ).replace('<p class', '<p id="welcome-text" class')}
      <form class="welcome__form" data-welcome-form novalidate>
        <label class="sr-only" for="welcome-email">${t({
          en: 'Email address',
          zh: '電郵地址',
        })}</label>
        <input id="welcome-email" name="email" type="email" required autocomplete="email" placeholder="you@example.com">
        <button class="btn" type="submit">${t({ en: 'Get the code', zh: '取得優惠碼' })}</button>
      </form>
      <div class="welcome__done" data-welcome-done hidden>
        <p class="welcome__code" data-welcome-code>WELCOME50</p>
        ${blk(
          'p',
          {
            en: 'Use it at checkout for HK$50 off. It is saved to this browser, so the cart will remind you.',
            zh: '結帳時輸入即減 HK$50。優惠碼已儲存於此瀏覽器，購物車會提醒你。',
          },
          'welcome__small'
        )}
        <a class="btn" href="${url('/shop/')}">${t({ en: 'Start shopping', zh: '開始選購' })}</a>
      </div>
      ${blk(
        'p',
        {
          en: 'One use per customer, on orders from this website. Not valid at Watsons, Mannings or other retailers.',
          zh: '每位顧客限用一次，只適用於本網站訂單，不適用於屈臣氏、萬寧或其他零售商。',
        },
        'welcome__terms'
      )}
    </div>
  </div>`;
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
  <meta name="theme-color" content="#F47920">
  <link rel="icon" href="/assets/img/logo/mark_app_icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/img/logo/mark_app_icon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&family=Noto+Sans+TC:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="/assets/css/site.css">
${structured}
</head>
<body class="${bodyClass}${isZh ? ' lang-zh' : ''}" data-lang="${isZh ? 'zh' : 'en'}">
${header(active, path)}
  <main id="main">
${body}
  </main>
${footer()}
${welcomeModal()}
  <script src="/assets/js/site.js" defer></script>
  <script src="/assets/js/shop.js" defer></script>
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
