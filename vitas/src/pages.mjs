/**
 * Page bodies. Each export returns a spec for layout.page().
 *
 * `path` is always the canonical English path — the build renders each spec
 * once per language and prefixes the Chinese one with /zh.
 */

import {
  SITE,
  t,
  blk,
  plain,
  attr,
  url,
  urlIn,
  getLang,
  sectionHead,
  cta,
  arrow,
  figure,
} from './layout.mjs';
import { PRODUCT, PLANTS, STOCKISTS, ARTICLES, FAQS } from './data.mjs';

/* --------------------------------------------------------- shared partials */

const productJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'VITAS Soothing Cream Gel 100ml',
  alternateName: 'VITAS 紓適寧 舒緩啫喱膏 100毫升',
  sku: PRODUCT.sku,
  brand: { '@type': 'Brand', name: 'VITAS 紓適寧' },
  description: plain({
    en: 'A low-odour, non-greasy plant-oil cream gel with eucalyptus, grape seed and niaouli. For warming up before training and massaging tired muscles afterwards. Made in France.',
    zh: '含尤加利、葡萄籽與綠花白千層的低氣味、不油膩植物油啫喱膏。適合訓練前熱身及訓練後按摩疲勞肌肉。法國製造。',
  }),
  image: [SITE.url + '/assets/img/product-tube.svg'],
  countryOfOrigin: 'FR',
  offers: {
    '@type': 'Offer',
    price: String(PRODUCT.price),
    priceCurrency: PRODUCT.currency,
    availability: 'https://schema.org/InStock',
    url: SITE.url + url(PRODUCT.slug),
    seller: { '@type': 'Organization', name: 'VITAS 紓適寧' },
  },
});

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VITAS 紓適寧',
  url: SITE.url,
  logo: SITE.url + '/assets/img/favicon.svg',
  sameAs: [SITE.youtube, SITE.facebook],
  contactPoint: {
    '@type': 'ContactPoint',
    email: SITE.email,
    contactType: 'customer service',
    areaServed: 'HK',
    availableLanguage: ['en', 'zh-Hant'],
  },
};

const breadcrumb = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t(item.name),
    item: SITE.url + url(item.path),
  })),
});

const HOME_CRUMB = { name: { en: 'Home', zh: '首頁' }, path: '/' };

/** Breadcrumb trail shown above a page title. */
function crumbs(trail) {
  return `        <nav class="crumbs" aria-label="${attr(t({ en: 'Breadcrumb', zh: '路徑' }))}">
          ${trail
            .map((c, i) =>
              i === trail.length - 1
                ? `<span aria-current="page">${t(c.name)}</span>`
                : `<a href="${url(c.path)}">${t(c.name)}</a><span aria-hidden="true">/</span>`
            )
            .join('\n          ')}
        </nav>`;
}

/** Slim page header used by every page except the homepage. */
function pageHero({ eyebrow, title, lede, trail }) {
  return `    <section class="page-hero">
      <div class="wrap">
${trail ? crumbs(trail) : ''}
        ${blk('p', eyebrow, 'eyebrow')}
        ${blk('h1', title, 'page-hero__title')}
        ${lede ? blk('p', lede, 'page-hero__lede') : ''}
      </div>
    </section>`;
}

/** Orange band listing what is deliberately absent from the formula. */
function freeFromBand() {
  return `    <section class="band band--brand reveal">
      <div class="wrap band__inner">
        <div class="band__head">
          ${blk('p', { en: 'Formulation', zh: '配方' }, 'eyebrow eyebrow--light')}
          ${blk('h2', { en: 'What is deliberately not in it', zh: '刻意不加入的成分' }, 'band__title')}
          ${blk(
            'p',
            {
              en: 'Most muscle rubs work by shouting. Ours is built around the things it leaves out — which is why you can use it at 3pm in an open-plan office.',
              zh: '大部分肌肉按摩產品靠「強烈」取勝。我們的配方，重點在於它不含甚麼——這也是你可以在下午三時的開放式辦公室使用它的原因。',
            },
            'band__lede'
          )}
        </div>
        <ul class="chips">
          ${PRODUCT.freeFrom.map((f) => `<li class="chip">${t(f)}</li>`).join('\n          ')}
        </ul>
      </div>
    </section>`;
}

/** Buy strip: price, size and the two retail chains. */
function buyStrip() {
  return `    <section class="buy reveal" id="buy">
      <div class="wrap buy__inner">
        <div class="buy__art">
          <img src="/assets/img/product-tube.svg" alt="${attr(
            t({
              en: 'VITAS Soothing Cream Gel 100ml tube',
              zh: 'VITAS 舒緩啫喱膏 100毫升',
            })
          )}" width="520" height="700" loading="lazy" decoding="async">
        </div>
        <div class="buy__body">
          ${blk('p', { en: 'One product, one job', zh: '一支產品，一個用途' }, 'eyebrow')}
          ${blk('h2', { en: 'Soothing Cream Gel', zh: '舒緩啫喱膏' }, 'buy__title')}
          <p class="buy__meta"><span>${PRODUCT.size}</span><span aria-hidden="true">·</span><span>${
            PRODUCT.priceLabel
          }</span><span aria-hidden="true">·</span><span>${t(PRODUCT.origin)}</span></p>
          ${blk(
            'p',
            {
              en: 'Stocked on the shelf at Watsons and Mannings across Hong Kong, and delivered by the online stores below.',
              zh: '全港屈臣氏及萬寧門市有售，亦可於以下網店選購。',
            },
            'buy__text'
          )}
          <div class="buy__actions">
            ${cta(STOCKISTS[0].url, { en: 'Buy at Watsons', zh: '於屈臣氏選購' })}
            ${cta(STOCKISTS[1].url, { en: 'Buy at Mannings', zh: '於萬寧選購' }, 'btn--ghost')}
          </div>
          <p class="buy__all">${arrow('/stockists/', {
            en: 'See all stockists',
            zh: '查看所有銷售點',
          })}</p>
        </div>
      </div>
    </section>`;
}

/** Newsletter block. The form posts nowhere until an endpoint is configured. */
function newsletter() {
  return `    <section class="signup reveal">
      <div class="wrap signup__inner">
        <div>
          ${blk('h2', { en: 'Slow letters, not spam', zh: '慢一點的通訊，不是垃圾郵件' }, 'signup__title')}
          ${blk(
            'p',
            {
              en: 'Occasional notes on training, recovery and what we are changing about this brand. Roughly monthly.',
              zh: '偶爾分享訓練、恢復，以及這個品牌正在改變的事。大約每月一次。',
            },
            'signup__text'
          )}
        </div>
        <form class="signup__form" data-newsletter action="#" method="post" novalidate>
          <label class="sr-only" for="email">${t({ en: 'Email address', zh: '電郵地址' })}</label>
          <input id="email" name="email" type="email" required autocomplete="email"
                 placeholder="you@example.com">
          <button class="btn btn--light" type="submit">${t({ en: 'Sign up', zh: '訂閱' })}</button>
          <p class="signup__note" data-newsletter-note hidden></p>
        </form>
      </div>
    </section>`;
}

function journalCard(article) {
  return `<article class="card card--journal">
            <a class="card__link" href="${url('/journal/' + article.slug + '/')}">
              <span class="card__art"><img src="${article.art}" alt="" width="1200" height="800" loading="lazy" decoding="async"></span>
              <span class="card__meta">${t(article.tag)} · ${t({
                en: article.readEn,
                zh: article.readZh,
              })}</span>
              ${blk('span', article.title, 'card__title')}
              ${blk('span', article.lede, 'card__lede')}
            </a>
          </article>`;
}

function plantCard(p, { role = true } = {}) {
  return `<article class="card card--plant">
            <a class="card__link" href="${url('/ingredients/' + p.id + '/')}">
              <span class="card__art card__art--tint"><img src="${p.art}" alt="" width="1000" height="1000" loading="lazy" decoding="async"></span>
              ${role ? `<span class="card__meta">${t(p.role)}</span>` : ''}
              ${blk('span', { en: p.nameEn, zh: p.nameZh }, 'card__title')}
              <span class="card__latin">${p.latin}</span>
              ${blk('span', p.short, 'card__lede')}
            </a>
          </article>`;
}

/* ------------------------------------------------------------------- pages */

export function home() {
  const body = `    <section class="hero">
      <div class="hero__bg" aria-hidden="true"></div>
      <div class="wrap hero__inner">
        <div class="hero__copy">
          ${blk('p', { en: 'Since 2013 · Made in France', zh: '2013 年起 · 法國製造' }, 'eyebrow')}
          ${blk(
            'h1',
            {
              en: 'Warm up quietly.<br>Wind down properly.',
              zh: '安靜地熱身。<br>好好地放鬆。',
            },
            'hero__title'
          )}
          ${blk(
            'p',
            {
              en: 'A plant-oil cream gel for the two minutes before training and the ten minutes after — cool on the skin, absorbed in under a minute, and quiet enough to wear to work.',
              zh: '為訓練前兩分鐘與訓練後十分鐘而設的植物油啫喱膏——皮膚清涼，一分鐘內吸收，氣味淡得可以穿著它去上班。',
            },
            'hero__lede'
          )}
          <div class="hero__actions">
            ${cta('/product/', { en: 'Meet the cream', zh: '認識產品' })}
            ${cta('/how-to-use/', { en: 'Find your routine', zh: '找出你的用法' }, 'btn--ghost')}
          </div>
          <p class="hero__meta">${t({
            en: '100ml · HK$250 · At Watsons & Mannings',
            zh: '100毫升 · HK$250 · 屈臣氏及萬寧有售',
          })}</p>
        </div>
        <div class="hero__art">
          <img src="/assets/img/product-tube.svg" alt="${attr(
            t({
              en: 'VITAS Soothing Cream Gel, 100ml tube',
              zh: 'VITAS 舒緩啫喱膏 100毫升',
            })
          )}" width="520" height="700" fetchpriority="high" decoding="async">
        </div>
      </div>
    </section>

    <section class="section plants reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Three plants', zh: '三種植物' },
  heading: { en: 'A short ingredient list, on purpose', zh: '刻意簡短的成分表' },
  lede: {
    en: 'Grape seed carries it, eucalyptus cools it, niaouli keeps it from smelling like a pharmacy. Each one has its own page.',
    zh: '葡萄籽承載，尤加利清涼，綠花白千層讓氣味不像藥房。每一種都有獨立頁面。',
  },
})}
        <div class="grid grid--3">
          ${PLANTS.map((p) => plantCard(p)).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="section split reveal">
      <div class="wrap split__inner">
        ${figure('/assets/img/art-training.svg', { en: 'Before training', zh: '訓練前' }, 'tint')}
        <div class="split__body">
          ${blk('p', { en: 'Before', zh: '運動前' }, 'eyebrow')}
          ${blk('h2', { en: 'Two minutes, paying attention', zh: '兩分鐘，專注地檢查' }, 'split__title')}
          ${blk(
            'p',
            {
              en: 'Work a thin layer into the muscles you are about to load — calves before a run, shoulders before the wall, quads and hips before the bar. The cream does not warm the muscle up; the noticing does. You will find out which side is tight before the session tells you the hard way.',
              zh: '把薄薄一層推開於即將發力的肌群——跑步前小腿、攀岩前肩背、負重前股四頭肌與髖部。真正令肌肉熱起來的不是膏，而是動作與專注。你會在訓練用更痛的方式提醒你之前，先發現哪一邊比較緊。',
            },
            'split__text'
          )}
          <p>${arrow('/how-to-use/', { en: 'The full routine', zh: '完整用法' })}</p>
        </div>
      </div>
      <div class="wrap split__inner split__inner--reverse">
        ${figure('/assets/img/art-recovery.svg', { en: 'After training', zh: '訓練後' }, 'wash')}
        <div class="split__body">
          ${blk('p', { en: 'After', zh: '運動後' }, 'eyebrow')}
          ${blk('h2', { en: 'Ten minutes with your hands', zh: '用雙手的十分鐘' }, 'split__title')}
          ${blk(
            'p',
            {
              en: 'Tired legs and shoulders respond to being worked on. Grape seed oil gives your hands enough glide to do that properly, then disappears fast enough that you can dress and go. No slick, no shine, no smell trailing you into dinner.',
              zh: '疲勞的雙腿與肩膊，需要被好好按揉。葡萄籽油提供足夠滑度讓雙手工作，又吸收得夠快，讓你可以立即穿衣外出。不黏、不油光，也不會把氣味帶到餐桌上。',
            },
            'split__text'
          )}
          <p>${arrow('/journal/lactic-acid-myth/', {
            en: 'What recovery actually is',
            zh: '恢復到底是甚麼',
          })}</p>
        </div>
      </div>
    </section>

${freeFromBand()}

    <section class="section finder-teaser reveal">
      <div class="wrap finder-teaser__inner">
        <div>
          ${blk('p', { en: 'Guided', zh: '引導' }, 'eyebrow')}
          ${blk('h2', { en: 'Not sure how to use it?', zh: '不確定該怎樣用？' }, 'finder-teaser__title')}
          ${blk(
            'p',
            {
              en: 'Three questions — what you do, when you ache, how much time you have — and we will give you a routine you will actually keep.',
              zh: '三條問題：你做甚麼運動、甚麼時候痠痛、有多少時間。我們會給你一套你真的會持續使用的方法。',
            },
            'finder-teaser__text'
          )}
          ${cta('/how-to-use/#finder', { en: 'Start the three questions', zh: '開始三條問題' })}
        </div>
        <img class="finder-teaser__art" src="/assets/img/art-desk.svg" alt="" width="1200" height="800" loading="lazy" decoding="async">
      </div>
    </section>

${buyStrip()}

    <section class="section journal reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Journal', zh: '專欄' },
  heading: { en: 'Fewer claims, more useful writing', zh: '少一點宣稱，多一點有用的內容' },
})}
        <div class="grid grid--3">
          ${ARTICLES.map(journalCard).join('\n          ')}
        </div>
      </div>
    </section>

${newsletter()}`;

  return {
    title: {
      en: 'Low-odour muscle cream for before and after training',
      zh: '運動前後適用的低氣味肌肉按摩膏',
    },
    description: {
      en: 'VITAS 紓適寧 Soothing Cream Gel: a low-odour, non-greasy plant-oil cream gel with eucalyptus, grape seed and niaouli. 100ml, HK$250, at Watsons and Mannings in Hong Kong.',
      zh: 'VITAS 紓適寧舒緩啫喱膏：含尤加利、葡萄籽及綠花白千層的低氣味、不油膩植物油啫喱膏。100毫升，HK$250，香港屈臣氏及萬寧有售。',
    },
    path: '/',
    active: '/',
    body,
    jsonLd: [orgJsonLd, productJsonLd()],
    bodyClass: 'page-home',
  };
}

export function product() {
  const body = `${pageHero({
    eyebrow: { en: 'The product', zh: '產品' },
    title: { en: 'Soothing Cream Gel', zh: '舒緩啫喱膏' },
    lede: {
      en: 'One tube, three plants, two moments in the day. 100ml, HK$250.',
      zh: '一支軟管，三種植物，一天中的兩個時刻。100毫升，HK$250。',
    },
    trail: [HOME_CRUMB, { name: { en: 'The Cream', zh: '產品' }, path: '/product/' }],
  })}

    <section class="section product-main">
      <div class="wrap product-main__inner">
        <div class="product-main__art">
          <img src="/assets/img/product-tube.svg" alt="${attr(
            t({ en: 'VITAS Soothing Cream Gel 100ml', zh: 'VITAS 舒緩啫喱膏 100毫升' })
          )}" width="520" height="700" decoding="async">
        </div>
        <div class="product-main__body">
          <dl class="spec">
            <div class="spec__row"><dt>${t({ en: 'Size', zh: '容量' })}</dt><dd>${
              PRODUCT.size
            }</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Price', zh: '售價' })}</dt><dd>${
              PRODUCT.priceLabel
            }</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Texture', zh: '質地' })}</dt><dd>${t(
              PRODUCT.texture
            )}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Scent', zh: '氣味' })}</dt><dd>${t({
              en: 'Faint green eucalyptus, gone within a minute.',
              zh: '淡淡的尤加利草本香，約一分鐘散去。',
            })}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Made in', zh: '生產地' })}</dt><dd>${t(
              PRODUCT.origin
            )} · ${t(PRODUCT.gmp)}</dd></div>
            <div class="spec__row"><dt>${t({ en: 'Best for', zh: '適合' })}</dt><dd>${t({
              en: 'Pre-training preparation, post-training massage, desk-bound neck and shoulders.',
              zh: '訓練前準備、訓練後按摩、久坐引起的頸肩緊繃。',
            })}</dd></div>
          </dl>
          <div class="buy__actions">
            ${cta(STOCKISTS[0].url, { en: 'Buy at Watsons', zh: '於屈臣氏選購' })}
            ${cta('/stockists/', { en: 'All stockists', zh: '所有銷售點' }, 'btn--ghost')}
          </div>
          ${blk(
            'p',
            {
              en: 'Sold in Hong Kong through Watsons, Mannings and selected online pharmacies. We do not currently sell direct from this site.',
              zh: '於香港透過屈臣氏、萬寧及指定網上藥房發售。本網站目前不設直接訂購。',
            },
            'product-main__note'
          )}
        </div>
      </div>
    </section>

    <section class="section claims reveal">
      <div class="wrap grid grid--2">
        <div class="claims__col">
          ${blk('h2', { en: 'What it does', zh: '它會做到' }, 'claims__title')}
          <ul class="ticks">
            ${[
              {
                en: 'Gives a mild, clean cooling sensation on the skin',
                zh: '在皮膚上帶來溫和、乾淨的清涼感',
              },
              {
                en: 'Provides enough glide for a proper self-massage',
                zh: '提供足夠滑度，讓你好好自我按摩',
              },
              { en: 'Absorbs in under a minute, leaving no shine', zh: '一分鐘內吸收，不留油光' },
              {
                en: 'Stays quiet — no medicated smell in a lift or a meeting',
                zh: '氣味低調——在升降機或會議室都不會有藥油味',
              },
              {
                en: 'Works as a daily habit, before or after exercise or at a desk',
                zh: '可作日常習慣：運動前後，或辦公桌前',
              },
            ]
              .map((i) => `<li>${t(i)}</li>`)
              .join('\n            ')}
          </ul>
        </div>
        <div class="claims__col claims__col--muted">
          ${blk('h2', { en: 'What it does not do', zh: '它不會做到' }, 'claims__title')}
          <ul class="crosses">
            ${[
              { en: 'It does not "flush out lactic acid"', zh: '不會「排走乳酸」' },
              { en: 'It does not drain or manage the lymphatic system', zh: '不會排走或管理淋巴' },
              { en: 'It does not whiten skin or reshape the body', zh: '不會美白或改變體形' },
              { en: 'It does not treat injuries, illness or organs', zh: '不能治療受傷、疾病或器官問題' },
              { en: 'It does not replace a warm-up, rest, or a physio', zh: '不能取代熱身、休息或物理治療' },
            ]
              .map((i) => `<li>${t(i)}</li>`)
              .join('\n            ')}
          </ul>
          <p>${arrow('/approach/', { en: 'Why we cut the claims', zh: '我們為何刪走那些宣稱' })}</p>
        </div>
      </div>
    </section>

${freeFromBand()}

    <section class="section ingredients-list reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Inside the tube', zh: '軟管裡有甚麼' },
  heading: { en: 'The three that matter', zh: '關鍵的三種成分' },
})}
        <div class="grid grid--3">
          ${PLANTS.map((p) => plantCard(p, { role: false })).join('\n          ')}
        </div>
        ${blk(
          'p',
          {
            en: 'Full INCI list is printed on the carton. If you have a known sensitivity to essential oils, patch test on the inner forearm first.',
            zh: '完整 INCI 成分表印於外盒。如你對精油有已知敏感，請先於前臂內側試用。',
          },
          'note'
        )}
      </div>
    </section>

${newsletter()}`;

  return {
    title: { en: 'Soothing Cream Gel 100ml', zh: '舒緩啫喱膏 100毫升' },
    description: {
      en: 'VITAS Soothing Cream Gel 100ml (HK$250): eucalyptus, grape seed and niaouli in a light, non-greasy cream gel. What it does, what it does not do, and where to buy it.',
      zh: 'VITAS 舒緩啫喱膏 100毫升（HK$250）：尤加利、葡萄籽與綠花白千層，輕盈不油膩。它會做到甚麼、不會做到甚麼，以及在哪裡購買。',
    },
    path: '/product/',
    active: '/product/',
    body,
    jsonLd: [
      productJsonLd(),
      breadcrumb([HOME_CRUMB, { name: { en: 'Soothing Cream Gel', zh: '舒緩啫喱膏' }, path: '/product/' }]),
    ],
  };
}

export function howToUse() {
  const routines = [
    {
      id: 'before',
      eyebrow: { en: '2 minutes · before training', zh: '2 分鐘 · 訓練前' },
      title: { en: 'The pre-session check-in', zh: '賽前自我檢查' },
      steps: [
        {
          en: 'Warm the tube in your hand and take an amount the size of a five-cent coin per muscle group.',
          zh: '把軟管在手中稍為回溫，每個肌群取約五毫硬幣大小的份量。',
        },
        {
          en: 'Work it in with the heel of your hand, following the length of the muscle — calves and hamstrings for running, shoulders and lats for climbing or swimming, quads and hips for lifting.',
          zh: '用掌根順著肌肉走向推開——跑步用小腿與膕繩肌，攀岩或游泳用肩膊與背闊肌，負重訓練用股四頭肌與髖部。',
        },
        {
          en: 'Note anything that feels stiffer than usual. That information is the point of the two minutes.',
          zh: '留意哪裡比平時更僵硬。這兩分鐘的價值，就在這個訊息。',
        },
        {
          en: 'Then do a real warm-up: five to ten minutes of easy movement, building to your first working set.',
          zh: '然後做真正的熱身：五至十分鐘輕鬆活動，逐步過渡到第一組正式訓練。',
        },
      ],
    },
    {
      id: 'after',
      eyebrow: { en: '10 minutes · after training', zh: '10 分鐘 · 訓練後' },
      title: { en: 'The evening wind-down', zh: '運動後放鬆' },
      steps: [
        {
          en: 'Shower first. Clean, dry skin absorbs it faster and you will use less.',
          zh: '先洗澡。乾淨、乾爽的皮膚吸收更快，用量也更省。',
        },
        {
          en: 'Work upwards along the limb in long, slow strokes, then circle the areas that took the most load.',
          zh: '沿著肢體以長而緩慢的手勢向上推，再於受力最多的部位打圈按揉。',
        },
        {
          en: 'Give it a minute to absorb before you dress. It should not feel slick.',
          zh: '穿衣前等約一分鐘讓它吸收，皮膚不應有滑膩感。',
        },
        {
          en: 'Pair it with the boring things that work: water, food, and going to bed at a reasonable hour.',
          zh: '配合真正有效但不吸引的事：補水、進食，以及在合理的時間睡覺。',
        },
      ],
    },
    {
      id: 'desk',
      eyebrow: { en: '3 minutes · at a desk', zh: '3 分鐘 · 辦公桌前' },
      title: { en: 'The office reset', zh: '辦公室重設' },
      steps: [
        {
          en: 'A pea-sized amount along each side of the neck and across the top of the shoulders.',
          zh: '豌豆大小的份量，塗於頸部兩側及肩膊上方。',
        },
        {
          en: 'Slow circles towards the collarbone, thumbs doing the work, jaw relaxed.',
          zh: '以拇指緩慢向鎖骨方向打圈，放鬆下顎。',
        },
        {
          en: 'Ten shoulder rolls backwards, ten chin tucks, then stand up.',
          zh: '向後轉肩十次、收下巴十次，然後站起來。',
        },
        {
          en: 'Twice a day beats once a week. Mid-morning and mid-afternoon are the natural slots.',
          zh: '每天兩次勝過每週一次。上午與下午中段是最自然的時機。',
        },
      ],
    },
  ];

  const opt = (name, v, label) =>
    `<label class="opt"><input type="radio" name="${name}" value="${v}"><span>${t(label)}</span></label>`;

  const body = `${pageHero({
    eyebrow: { en: 'How to use', zh: '使用方法' },
    title: { en: 'Three routines, none of them complicated', zh: '三套用法，都不複雜' },
    lede: {
      en: 'Apply once or twice a day to clean, unbroken skin. Avoid the eyes and face. That is the whole instruction — the rest is how to make it a habit.',
      zh: '每日一至兩次，塗於清潔、無破損的皮膚，避開眼睛及面部。說明就這麼多——其餘的，是如何養成習慣。',
    },
    trail: [HOME_CRUMB, { name: { en: 'How to Use', zh: '使用方法' }, path: '/how-to-use/' }],
  })}

    <section class="section routines">
      <div class="wrap">
        ${routines
          .map(
            (r, i) => `<article class="routine reveal" id="${r.id}">
          <div class="routine__head">
            <span class="routine__num">0${i + 1}</span>
            ${blk('p', r.eyebrow, 'eyebrow')}
            ${blk('h2', r.title, 'routine__title')}
          </div>
          <ol class="routine__steps">
            ${r.steps.map((s) => `<li>${t(s)}</li>`).join('\n            ')}
          </ol>
        </article>`
          )
          .join('\n        ')}
      </div>
    </section>

    <section class="section finder reveal" id="finder">
      <div class="wrap finder__inner">
${sectionHead({
  eyebrow: { en: 'Three questions', zh: '三條問題' },
  heading: { en: 'Find the routine you will actually keep', zh: '找出你真的會持續的用法' },
  align: 'center',
})}
        <form class="finder__form" data-finder data-lang="${getLang()}">
          <fieldset class="finder__step">
            <legend>${t({ en: '1. What are you doing?', zh: '1. 你在做甚麼？' })}</legend>
            <div class="finder__options">
              ${opt('q1', 'run', { en: 'Running, cycling, hiking', zh: '跑步、單車、行山' })}
              ${opt('q1', 'gym', { en: 'Gym, lifting, climbing', zh: '健身、負重、攀岩' })}
              ${opt('q1', 'desk', { en: 'Mostly sitting at a desk', zh: '大部分時間坐在辦公桌前' })}
            </div>
          </fieldset>
          <fieldset class="finder__step">
            <legend>${t({ en: '2. When does it bother you?', zh: '2. 甚麼時候最不舒服？' })}</legend>
            <div class="finder__options">
              ${opt('q2', 'before', { en: 'Stiff before I start', zh: '開始前就已經僵硬' })}
              ${opt('q2', 'after', { en: 'Sore the next day', zh: '第二天痠痛' })}
              ${opt('q2', 'always', { en: 'A constant background ache', zh: '長期隱隱作痛' })}
            </div>
          </fieldset>
          <fieldset class="finder__step">
            <legend>${t({
              en: '3. How much time will you give it?',
              zh: '3. 你願意花多少時間？',
            })}</legend>
            <div class="finder__options">
              ${opt('q3', 'two', { en: 'Two minutes, honestly', zh: '老實說，兩分鐘' })}
              ${opt('q3', 'ten', { en: 'Ten minutes in the evening', zh: '晚上十分鐘' })}
              ${opt('q3', 'split', { en: 'A little, twice a day', zh: '每天兩次，每次少少' })}
            </div>
          </fieldset>
          <div class="finder__result" data-finder-result hidden aria-live="polite"></div>
        </form>
      </div>
    </section>

    <section class="section safety reveal">
      <div class="wrap safety__inner">
        ${blk('h2', { en: 'Sensible cautions', zh: '使用注意' }, 'safety__title')}
        <ul class="safety__list">
          ${[
            {
              en: 'External use only. Keep away from eyes, mouth and broken skin.',
              zh: '只供外用。避免接觸眼睛、口腔及破損皮膚。',
            },
            { en: 'Not recommended for children under 6.', zh: '不建議 6 歲以下兒童使用。' },
            {
              en: 'If pregnant or breastfeeding, ask your doctor before use.',
              zh: '懷孕或哺乳期間，請先諮詢醫生。',
            },
            {
              en: 'Patch test on the inner forearm if you have sensitive skin.',
              zh: '皮膚敏感者請先於前臂內側試用。',
            },
            { en: 'Stop if the skin becomes red or irritated.', zh: '如皮膚出現泛紅或不適，請停止使用。' },
            {
              en: 'Severe, sudden or post-injury pain needs a doctor, not a cream.',
              zh: '劇烈、突發或受傷後的疼痛，請求醫，而非依賴按摩膏。',
            },
          ]
            .map((i) => `<li>${t(i)}</li>`)
            .join('\n          ')}
        </ul>
      </div>
    </section>`;

  return {
    title: { en: 'How to use', zh: '使用方法' },
    description: {
      en: 'Three simple routines for VITAS Soothing Cream Gel: a two-minute pre-training check-in, a ten-minute post-training wind-down, and a three-minute desk reset.',
      zh: 'VITAS 舒緩啫喱膏的三套用法：訓練前兩分鐘自我檢查、訓練後十分鐘放鬆，以及辦公桌前三分鐘重設。',
    },
    path: '/how-to-use/',
    active: '/how-to-use/',
    body,
    jsonLd: [
      breadcrumb([HOME_CRUMB, { name: { en: 'How to use', zh: '使用方法' }, path: '/how-to-use/' }]),
    ],
  };
}

export function ingredients() {
  const body = `${pageHero({
    eyebrow: { en: 'Ingredients', zh: '成分' },
    title: { en: 'Three plants, and why each one is there', zh: '三種植物，各有其理由' },
    lede: {
      en: 'Every ingredient in this cream has a job you can feel. None of them has been asked to do anything a plant oil cannot do. Each has its own page.',
      zh: '這支啫喱膏中的每一種成分，都有你感覺得到的作用；我們亦沒有要求它們做植物油做不到的事。每一種成分都有獨立頁面。',
    },
    trail: [HOME_CRUMB, { name: { en: 'Ingredients', zh: '成分' }, path: '/ingredients/' }],
  })}

    <section class="section">
      <div class="wrap">
        <div class="grid grid--3">
          ${PLANTS.map((p) => plantCard(p)).join('\n          ')}
        </div>
      </div>
    </section>

${freeFromBand()}

    <section class="section reveal">
      <div class="wrap prose">
        ${blk('h2', { en: 'On "natural"', zh: '關於「天然」' })}
        ${blk('p', {
          en: '"Natural" is not a regulated word and it is not, by itself, a benefit — poison ivy is natural. What we mean by it is narrower and checkable: the active character of this cream comes from three plant extracts rather than from methyl salicylate or camphor, the formula is made in France to EU cosmetic GMP, and the full INCI list is printed on the carton rather than hidden behind a marketing word.',
          zh: '「天然」並非受規管的字眼，本身也不等於好處——毒藤同樣天然。我們所指的意思更狹窄、也可以查證：這支啫喱膏的感受來自三種植物萃取，而非水楊酸甲酯或樟腦；配方於法國按歐盟化妝品 GMP 生產；完整 INCI 成分表印在外盒上，而不是躲在一個營銷字眼背後。',
        })}
        ${blk('h2', { en: 'Sourcing and manufacture', zh: '來源與生產' })}
        ${blk('p', {
          en: 'The cream is produced by a contract manufacturer in France working to EU GMP standards for cosmetics, and shipped to Hong Kong in finished retail packs. Batch numbers and expiry dates are printed on the crimp of each tube; if you ever want the documentation behind a specific batch, write to us and we will send it.',
          zh: '產品由法國一間符合歐盟化妝品 GMP 標準的代工廠生產，以零售包裝形式運抵香港。每支軟管末端摺口均印有批號及有效期；如需查閱某一批次的相關文件，歡迎來信索取。',
        })}
      </div>
    </section>

${buyStrip()}`;

  return {
    title: { en: 'Ingredients', zh: '成分' },
    description: {
      en: 'Eucalyptus globulus, Vitis vinifera grape seed and Melaleuca viridiflora niaouli — the three plants in VITAS Soothing Cream Gel, and what each one actually does.',
      zh: '尤加利、葡萄籽與綠花白千層——VITAS 舒緩啫喱膏中的三種植物，以及它們各自的實際作用。',
    },
    path: '/ingredients/',
    active: '/ingredients/',
    body,
    jsonLd: [breadcrumb([HOME_CRUMB, { name: { en: 'Ingredients', zh: '成分' }, path: '/ingredients/' }])],
  };
}

/** One page per plant, each on its own URL. */
export function ingredient(p) {
  const others = PLANTS.filter((x) => x.id !== p.id);
  const path = `/ingredients/${p.id}/`;

  const body = `${pageHero({
    eyebrow: p.role,
    title: { en: p.nameEn, zh: p.nameZh },
    lede: p.short,
    trail: [
      HOME_CRUMB,
      { name: { en: 'Ingredients', zh: '成分' }, path: '/ingredients/' },
      { name: { en: p.nameEn, zh: p.nameZh }, path },
    ],
  })}

    <section class="section">
      <div class="wrap plant">
        ${figure(p.art, { en: p.nameEn, zh: p.nameZh }, 'tint', { w: 1000, h: 1000 })}
        <div class="plant__body">
          <p class="plant__latin">${p.latin}</p>
          ${blk('p', p.long, 'plant__text')}
        </div>
      </div>
    </section>

    <section class="section reveal">
      <div class="wrap grid grid--3">
        ${p.facts
          .map(
            (f) => `<div class="fact">
          ${blk('h2', f.h, 'fact__title')}
          ${blk('p', f.p, 'fact__text')}
        </div>`
          )
          .join('\n        ')}
      </div>
    </section>

${freeFromBand()}

    <section class="section reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'The other two', zh: '另外兩種' },
  heading: { en: 'What else is in the tube', zh: '軟管裡還有甚麼' },
})}
        <div class="grid grid--2">
          ${others.map((o) => plantCard(o)).join('\n          ')}
        </div>
      </div>
    </section>

${buyStrip()}`;

  return {
    title: { en: `${p.nameEn} — ingredient`, zh: `${p.nameZh}——成分` },
    description: {
      en: `${p.nameEn} (${p.latin}) in VITAS Soothing Cream Gel: what it contributes, what it feels like, and what we do not claim for it.`,
      zh: `VITAS 舒緩啫喱膏中的${p.nameZh}（${p.latin}）：它的作用、實際感受，以及我們不會宣稱的事。`,
    },
    path,
    active: '/ingredients/',
    body,
    jsonLd: [
      breadcrumb([
        HOME_CRUMB,
        { name: { en: 'Ingredients', zh: '成分' }, path: '/ingredients/' },
        { name: { en: p.nameEn, zh: p.nameZh }, path },
      ]),
    ],
  };
}

export function approach() {
  const body = `${pageHero({
    eyebrow: { en: 'Our approach', zh: '我們的取態' },
    title: { en: 'We took claims off this product, not added them', zh: '我們刪走宣稱，而不是加上去' },
    lede: {
      en: 'This brand spent years being sold as something it is not. This page is the correction, written down, so you can hold us to it.',
      zh: '這個品牌曾多年以「並非事實」的方式被推銷。這一頁是我們的更正，白紙黑字寫下來，讓你可以監督我們。',
    },
    trail: [HOME_CRUMB, { name: { en: 'Our Approach', zh: '我們的取態' }, path: '/approach/' }],
  })}

    <section class="section reveal">
      <div class="wrap prose">
        ${blk('h2', { en: 'What changed', zh: '改變了甚麼' })}
        ${blk('p', {
          en: 'VITAS used to be marketed as a "lymphatic management" product, with a claim list that ran from draining lactic acid to improving memory. Some of those claims were unprovable. One of them — the lactic acid story — is straightforwardly contradicted by the evidence. Keeping them would have meant asking you to believe things we cannot demonstrate, so we removed them from our packaging, our retail listings and this website.',
          zh: 'VITAS 過去以「淋巴管理」產品作宣傳，宣稱範圍由排走乳酸到改善記憶力。當中部分說法無法證實；而乳酸那一項，更與科學證據直接抵觸。若繼續沿用，等於要求你相信我們無法證明的事。因此，我們把這些說法從包裝、零售資料及本網站上刪除。',
        })}
        ${blk('h2', { en: 'What we will say', zh: '我們會說的' })}
        ${blk('p', {
          en: 'That this is a light, low-odour cream gel built around eucalyptus, grape seed and niaouli. That it feels mildly cool, absorbs quickly and gives you enough glide for a proper massage. That it is made in France under EU cosmetic GMP. That it is pleasant enough to use daily, which matters more than any single application, because the useful part of recovery is the habit.',
          zh: '這是一支以尤加利、葡萄籽與綠花白千層為核心的輕盈低氣味啫喱膏；它帶來溫和清涼感、吸收快，並提供足夠滑度作按摩；它於法國按歐盟化妝品 GMP 生產；它的膚感足以令人每天使用——而這比任何單次使用都重要，因為恢復真正有效的部分，是習慣。',
        })}
        ${blk('h2', { en: 'What we will not say', zh: '我們不會說的' })}
        ${blk('p', {
          en: 'That it drains lactic acid, manages the lymphatic system, detoxifies, whitens skin, reshapes the body, protects organs, sharpens memory or relieves migraines. That it treats injury or disease. That it works in one minute, or is "100% absorbed". Where a competitor makes those claims about a similar cream, treat the claim, not the cream, as the difference.',
          zh: '我們不會說它可以排走乳酸、管理淋巴、排毒、美白、改變體形、保護器官、增強記憶或紓緩偏頭痛；不會說它能治療受傷或疾病；不會說它「一分鐘見效」或「100% 吸收」。若同類產品有這些宣稱，真正的分別在於那些宣稱，而不是產品本身。',
        })}
        ${blk('h2', { en: 'The honest case for the price', zh: '關於價格，誠實的說法' })}
        ${blk('p', {
          en: 'At HK$250 for 100ml, this costs several times more than a tube of traditional medicated rub. You are not buying stronger analgesia; you are buying a formula without methyl salicylate or camphor, a texture that does not leave you greasy, a smell that does not enter the room before you do, and French manufacture. If those things do not matter to you, a HK$40 tube of something fierce will do the job — and we would rather say that here than have you find it out at home.',
          zh: '100毫升售 HK$250，是傳統藥膏的數倍價錢。你買的並不是更強的止痛效果，而是一個不含水楊酸甲酯與樟腦的配方、不油膩的膚感、不會先於你進入房間的氣味，以及法國生產。如果這些對你並不重要，一支四十元、氣味濃烈的產品同樣可以完成任務——我們寧願在這裡說清楚，也不想你買回家才發現。',
        })}
        ${blk('h2', { en: 'Reviews', zh: '評價' })}
        ${blk('p', {
          en: 'We do not publish testimonials we did not receive, and we do not pay for reviews. When we have enough verified customer reviews to be worth reading, they will appear on the product page with the verification method described. Until then, this space stays empty on purpose.',
          zh: '我們不會刊登並非真實收到的推薦，也不會付費購買評價。當累積到足夠、可核實的顧客評價時，它們會出現在產品頁，並列明核實方式。在此之前，這一欄刻意留白。',
        })}
      </div>
    </section>

    <section class="band band--wash reveal">
      <div class="wrap band__inner band__inner--stack">
        ${blk('h2', { en: 'If we get it wrong, tell us', zh: '如果我們說錯了，請告訴我們' }, 'band__title')}
        ${blk(
          'p',
          {
            en: 'If you find a claim on a shelf talker, a reseller listing or an old advert that contradicts this page, send it to us. Grey-market listings of this product still carry the old copy, and we are working through them.',
            zh: '如果你在貨架標示、經銷商網頁或舊廣告上，看到與本頁不符的宣稱，請告訴我們。市面上仍有沿用舊文案的平行進口資料，我們正在逐一處理。',
          },
          'band__lede'
        )}
        ${cta('/contact/', { en: 'Contact us', zh: '聯絡我們' })}
      </div>
    </section>`;

  return {
    title: { en: 'Our approach', zh: '我們的取態' },
    description: {
      en: 'Why VITAS removed its lymphatic, detox and lactic-acid claims, what it will and will not say about the cream, and the honest case for a HK$250 price.',
      zh: 'VITAS 為何刪除淋巴、排毒與乳酸相關宣稱，我們會說與不會說甚麼，以及 HK$250 定價的誠實理由。',
    },
    path: '/approach/',
    active: '/approach/',
    body,
    jsonLd: [breadcrumb([HOME_CRUMB, { name: { en: 'Our approach', zh: '我們的取態' }, path: '/approach/' }])],
  };
}

export function stockists() {
  const body = `${pageHero({
    eyebrow: { en: 'Where to buy', zh: '購買地點' },
    title: { en: 'On the shelf, and online', zh: '門市與網店' },
    lede: {
      en: 'VITAS Soothing Cream Gel 100ml, HK$250. Sold through Hong Kong pharmacy chains and a small number of online stores.',
      zh: 'VITAS 舒緩啫喱膏 100毫升，HK$250。於香港連鎖藥房及少數網店發售。',
    },
    trail: [HOME_CRUMB, { name: { en: 'Where to Buy', zh: '購買地點' }, path: '/stockists/' }],
  })}

    <section class="section stockists">
      <div class="wrap">
        <div class="grid grid--2">
          ${STOCKISTS.map(
            (s) => `<a class="stockist reveal${s.featured ? ' stockist--featured' : ''}" href="${
              s.url
            }" target="_blank" rel="noopener">
            <span class="stockist__name">${s.name}</span>
            <span class="stockist__kind">${t(s.kind)}</span>
            <span class="stockist__note">${t(s.note)}</span>
            <span class="stockist__go">${t({ en: 'Visit store', zh: '前往商店' })} →</span>
          </a>`
          ).join('\n          ')}
        </div>
        ${blk(
          'p',
          {
            en: 'Buying elsewhere? Check the tube for a batch number and expiry date on the crimp. Grey-market listings sometimes carry old packaging and old claims, and we cannot vouch for storage conditions outside our own supply chain.',
            zh: '在其他渠道購買？請檢查軟管末端摺口是否印有批號及有效期。平行進口貨品有時仍使用舊包裝與舊宣稱，我們亦無法保證供應鏈以外的儲存狀況。',
          },
          'note'
        )}
      </div>
    </section>

    <section class="band band--brand reveal">
      <div class="wrap band__inner band__inner--stack">
        ${blk('p', { en: 'Trade', zh: '批發' }, 'eyebrow eyebrow--light')}
        ${blk('h2', { en: 'Stocking VITAS', zh: '成為銷售點' }, 'band__title')}
        ${blk(
          'p',
          {
            en: 'Gyms, physiotherapy clinics, climbing walls and running stores: we work with a small number of trade partners in Hong Kong. Tell us about your space and we will send terms.',
            zh: '健身室、物理治療診所、攀石場及跑步用品店：我們與香港少數合作夥伴供貨。請告訴我們你的場地資料，我們會提供條款。',
          },
          'band__lede'
        )}
        ${cta('/contact/', { en: 'Trade enquiries', zh: '批發查詢' }, 'btn--light')}
      </div>
    </section>`;

  return {
    title: { en: 'Where to buy', zh: '購買地點' },
    description: {
      en: 'Buy VITAS Soothing Cream Gel 100ml (HK$250) at Watsons and Mannings across Hong Kong, or online through HKTVmall, Gogo Herbs and HK Medical Store.',
      zh: '於全港屈臣氏及萬寧選購 VITAS 舒緩啫喱膏 100毫升（HK$250），或經 HKTVmall、Gogo Herbs 及網上藥房購買。',
    },
    path: '/stockists/',
    active: '/stockists/',
    body,
    jsonLd: [breadcrumb([HOME_CRUMB, { name: { en: 'Where to buy', zh: '購買地點' }, path: '/stockists/' }])],
  };
}

export function journalIndex() {
  const body = `${pageHero({
    eyebrow: { en: 'Journal', zh: '專欄' },
    title: { en: 'Training, recovery, and being honest about both', zh: '訓練、恢復，以及對兩者誠實' },
    lede: {
      en: 'Short pieces about what helps tired muscles, including the parts that have nothing to do with buying a cream.',
      zh: '關於疲勞肌肉的短文，包括那些與買不買一支膏完全無關的部分。',
    },
    trail: [HOME_CRUMB, { name: { en: 'Journal', zh: '專欄' }, path: '/journal/' }],
  })}

    <section class="section">
      <div class="wrap">
        <div class="grid grid--3">
          ${ARTICLES.map(journalCard).join('\n          ')}
        </div>
      </div>
    </section>

${newsletter()}`;

  return {
    title: { en: 'Journal', zh: '專欄' },
    description: {
      en: 'Short, useful writing from VITAS on warming up, recovery, desk-bound necks and the lactic acid myth.',
      zh: 'VITAS 專欄：熱身、恢復、辦公室頸肩，以及乳酸迷思。',
    },
    path: '/journal/',
    active: '/journal/',
    body,
    jsonLd: [breadcrumb([HOME_CRUMB, { name: { en: 'Journal', zh: '專欄' }, path: '/journal/' }])],
  };
}

export function article(a) {
  const others = ARTICLES.filter((x) => x.slug !== a.slug);
  const path = `/journal/${a.slug}/`;

  const body = `    <article class="article">
      <header class="article__head">
        <div class="wrap">
${crumbs([HOME_CRUMB, { name: { en: 'Journal', zh: '專欄' }, path: '/journal/' }, { name: a.title, path }])}
          <p class="eyebrow">${t(a.tag)} · <time datetime="${a.date}">${a.date}</time> · ${t({
            en: a.readEn,
            zh: a.readZh,
          })}</p>
          ${blk('h1', a.title, 'article__title')}
          ${blk('p', a.lede, 'article__lede')}
        </div>
      </header>
      <div class="wrap">
        <img class="article__art" src="${a.art}" alt="" width="1200" height="800" decoding="async">
        <div class="prose">
          ${a.body
            .map(
              (s) => `${blk('h2', s.h)}\n          ${s.p.map((p) => blk('p', p)).join('\n          ')}`
            )
            .join('\n          ')}
        </div>
      </div>
    </article>

    <section class="section reveal">
      <div class="wrap">
${sectionHead({
  eyebrow: { en: 'Keep reading', zh: '繼續閱讀' },
  heading: { en: 'More from the journal', zh: '更多專欄文章' },
})}
        <div class="grid grid--2">
          ${others.map(journalCard).join('\n          ')}
        </div>
      </div>
    </section>

${newsletter()}`;

  return {
    title: a.title,
    description: a.lede,
    path,
    active: '/journal/',
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: t(a.title),
        description: t(a.lede),
        datePublished: a.date,
        inLanguage: getLang() === 'zh' ? 'zh-Hant-HK' : 'en-HK',
        author: { '@type': 'Organization', name: 'VITAS 紓適寧' },
        publisher: { '@type': 'Organization', name: 'VITAS 紓適寧' },
        mainEntityOfPage: SITE.url + url(path),
      },
      breadcrumb([
        HOME_CRUMB,
        { name: { en: 'Journal', zh: '專欄' }, path: '/journal/' },
        { name: a.title, path },
      ]),
    ],
  };
}

export function faq() {
  const body = `${pageHero({
    eyebrow: { en: 'FAQ', zh: '常見問題' },
    title: { en: 'Questions people actually ask', zh: '大家真正會問的問題' },
    trail: [HOME_CRUMB, { name: { en: 'FAQ', zh: '常見問題' }, path: '/faq/' }],
  })}

    <section class="section">
      <div class="wrap wrap--narrow">
        <div class="accordion" data-accordion>
          ${FAQS.map(
            (f, i) => `<div class="acc reveal">
            <button class="acc__q" type="button" aria-expanded="false" aria-controls="acc-${i}">
              ${blk('span', f.q, 'acc__label')}
              <span class="acc__icon" aria-hidden="true"></span>
            </button>
            <div class="acc__a" id="acc-${i}" hidden>
              ${blk('p', f.a)}
            </div>
          </div>`
          ).join('\n          ')}
        </div>
        ${blk(
          'p',
          {
            en: 'Something not answered here? Write to us — we answer email ourselves.',
            zh: '找不到答案？歡迎來信，我們會親自回覆。',
          },
          'note'
        )}
        <p class="note">${arrow('/contact/', { en: 'Contact us', zh: '聯絡我們' })}</p>
      </div>
    </section>`;

  return {
    title: { en: 'FAQ', zh: '常見問題' },
    description: {
      en: 'Does it smell? Is it hot or cold? Can I use it before exercise? Straight answers about VITAS Soothing Cream Gel.',
      zh: '有氣味嗎？是熱還是涼？運動前可以用嗎？關於 VITAS 舒緩啫喱膏的直接答案。',
    },
    path: '/faq/',
    active: '/faq/',
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: getLang() === 'zh' ? 'zh-Hant-HK' : 'en-HK',
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: t(f.q),
          acceptedAnswer: { '@type': 'Answer', text: t(f.a) },
        })),
      },
      breadcrumb([HOME_CRUMB, { name: { en: 'FAQ', zh: '常見問題' }, path: '/faq/' }]),
    ],
  };
}

export function contact() {
  const body = `${pageHero({
    eyebrow: { en: 'Contact', zh: '聯絡我們' },
    title: { en: 'Talk to a person', zh: '與真人對話' },
    lede: {
      en: 'Product questions, trade enquiries, or a claim you have seen somewhere that we should know about.',
      zh: '產品查詢、批發合作，或你在某處看到、值得我們知道的宣稱。',
    },
    trail: [HOME_CRUMB, { name: { en: 'Contact', zh: '聯絡我們' }, path: '/contact/' }],
  })}

    <section class="section">
      <div class="wrap contact__inner">
        <form class="contact__form" data-contact novalidate>
          <div class="field">
            <label for="name">${t({ en: 'Name', zh: '稱呼' })}</label>
            <input id="name" name="name" type="text" required autocomplete="name">
          </div>
          <div class="field">
            <label for="cemail">${t({ en: 'Email', zh: '電郵' })}</label>
            <input id="cemail" name="email" type="email" required autocomplete="email">
          </div>
          <div class="field">
            <label for="topic">${t({ en: 'Topic', zh: '主題' })}</label>
            <select id="topic" name="topic">
              <option value="product">${t({ en: 'Product question', zh: '產品查詢' })}</option>
              <option value="trade">${t({ en: 'Trade / stocking', zh: '批發／銷售點' })}</option>
              <option value="claim">${t({ en: 'A claim I have seen', zh: '我看到的宣稱' })}</option>
              <option value="other">${t({ en: 'Something else', zh: '其他' })}</option>
            </select>
          </div>
          <div class="field">
            <label for="message">${t({ en: 'Message', zh: '訊息' })}</label>
            <textarea id="message" name="message" rows="6" required></textarea>
          </div>
          <button class="btn" type="submit">${t({ en: 'Send', zh: '傳送' })}</button>
          <p class="signup__note" data-contact-note hidden></p>
        </form>
        <aside class="contact__aside">
          ${blk('h2', { en: 'Direct', zh: '直接聯絡' }, 'contact__h')}
          <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
          ${blk('h2', { en: 'Watch', zh: '影片' }, 'contact__h')}
          <p><a href="${SITE.youtube}" target="_blank" rel="noopener">YouTube — @VITASHK</a></p>
          <p><a href="${SITE.facebook}" target="_blank" rel="noopener">Facebook — VITAS 紓適寧</a></p>
          ${blk('h2', { en: 'Response time', zh: '回覆時間' }, 'contact__h')}
          ${blk('p', {
            en: 'Two working days, usually less. We are a small team in Hong Kong.',
            zh: '通常兩個工作天內回覆。我們是香港的小團隊。',
          })}
        </aside>
      </div>
    </section>`;

  return {
    title: { en: 'Contact', zh: '聯絡我們' },
    description: {
      en: 'Contact VITAS 紓適寧 — product questions, trade enquiries and press.',
      zh: '聯絡 VITAS 紓適寧——產品查詢、批發合作及傳媒。',
    },
    path: '/contact/',
    active: '/contact/',
    body,
    jsonLd: [breadcrumb([HOME_CRUMB, { name: { en: 'Contact', zh: '聯絡我們' }, path: '/contact/' }])],
  };
}

export function legal(kind) {
  const isPrivacy = kind === 'privacy';
  const path = isPrivacy ? '/legal/privacy/' : '/legal/terms/';
  const title = isPrivacy ? { en: 'Privacy', zh: '私隱政策' } : { en: 'Terms of use', zh: '使用條款' };

  const body = `${pageHero({
    eyebrow: { en: 'Legal', zh: '條款' },
    title,
    trail: [HOME_CRUMB, { name: title, path }],
  })}
    <section class="section">
      <div class="wrap prose">
        ${
          isPrivacy
            ? blk('p', {
                en: 'This site collects no analytics cookies and runs no third-party trackers. If you submit the contact or newsletter form, the details you type are sent to us and used only to reply to you or to send the newsletter you asked for. Ask us to delete them at any time and we will.',
                zh: '本網站不使用分析 cookie，亦沒有第三方追蹤程式。如你提交聯絡或訂閱表格，所填資料只會用於回覆你，或發送你要求的通訊。你可隨時要求我們刪除相關資料。',
              }) +
              blk('p', {
                en: 'PLACEHOLDER: before launch, replace this page with a Personal Data (Privacy) Ordinance compliant notice reviewed by your legal adviser, covering data classes collected, purpose, transfer, retention and the data access / correction request channel.',
                zh: '（待補：發布前，請由法律顧問審閱並替換為符合《個人資料（私隱）條例》的完整聲明，涵蓋收集的資料類別、用途、轉移、保留期及查閱／更正途徑。）',
              })
            : blk('p', {
                en: 'The information on this site describes a cosmetic massage product. It is general information, not medical advice, and it does not replace an assessment by a doctor or physiotherapist. Product availability, packaging and pricing at third-party retailers are set by those retailers and may differ from what is described here.',
                zh: '本網站資料描述的是一款按摩護理產品，屬一般資訊，並非醫療建議，亦不能取代醫生或物理治療師的評估。第三方零售商的供應情況、包裝及售價由該零售商決定，可能與本網站所述不同。',
              }) +
              blk('p', {
                en: 'PLACEHOLDER: before launch, replace with full terms reviewed by your legal adviser, covering intellectual property, limitation of liability, governing law (Hong Kong SAR) and how disputes are handled.',
                zh: '（待補：發布前，請由法律顧問審閱並替換為完整條款，涵蓋知識產權、責任限制、適用法律（香港特別行政區）及爭議處理方式。）',
              })
        }
      </div>
    </section>`;

  return {
    title,
    description: isPrivacy
      ? { en: 'How VITAS handles the information you send us.', zh: 'VITAS 如何處理你提供的資料。' }
      : { en: 'Terms of use for the VITAS website.', zh: 'VITAS 網站使用條款。' },
    path,
    body,
  };
}

export function notFound() {
  const body = `    <section class="page-hero">
      <div class="wrap">
        <p class="eyebrow">404</p>
        ${blk('h1', { en: 'That page has moved on', zh: '此頁面不存在' }, 'page-hero__title')}
        ${blk(
          'p',
          {
            en: 'The old VITAS site had a lot of addresses. This one has a few, and they are all in the menu above.',
            zh: '舊版 VITAS 網站有很多網址。新版只有幾個，全部都在上方選單中。',
          },
          'page-hero__lede'
        )}
        <p class="hero__actions">${cta('/', { en: 'Back to the homepage', zh: '返回首頁' })}</p>
      </div>
    </section>`;
  return {
    title: { en: 'Page not found', zh: '找不到頁面' },
    description: { en: 'Page not found.', zh: '找不到頁面。' },
    path: '/404.html',
    body,
  };
}
