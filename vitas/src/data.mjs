/**
 * Single source of truth for facts that appear in more than one place:
 * the product, the three plants, stockists and journal articles.
 *
 * Claim discipline: everything here is either a verifiable fact (size, price,
 * ingredients, manufacturing) or a sensory/comfort statement. Physiological
 * claims — lymphatic drainage, "flushing lactic acid", detox, whitening,
 * body-shaping, organ or memory benefits — are deliberately absent. See
 * /approach/ and docs/positioning.md.
 */


/**
 * Master positioning — Option A, per VITAS Brand Repositioning Proposal v3.0.
 *
 * COMPLIANCE: the slogan is a brand promise, not a medical claim, and the deck
 * requires it to travel with `sensory` sub-copy wherever it appears, plus the
 * `disclaimer` in the footer of every page. Do not use one without the other.
 * Red-light claims (cures, eliminates lactic acid, speeds lymphatic drainage,
 * treats inflammation) are listed in docs/positioning.md and must stay off the
 * site.
 */
export const BRAND = {
  slogan: {
    en: ['Activate Circulation.', 'Accelerate Recovery.'],
    zh: ['激活循環，', '加速重生。'],
  },
  triptych: [
    { en: 'Prime', zh: '啟動' },
    { en: 'Perform', zh: '發揮' },
    { en: 'Recover', zh: '恢復' },
  ],
  heroLede: {
    en: 'The clean performance gel for athletes who care about what goes on their body. Warm up. Cool down. One French-made formula. Zero toxins.',
    zh: '為在意「塗在身上的是甚麼」的運動員而設的純淨表現凝膠。賽前熱身，賽後放鬆。一支法國配方，零毒素。',
  },
  proof: {
    en: 'French-made · Zero toxins · Trusted since 2003',
    zh: '法國製造 · 純淨配方 · 2003 年起信賴',
  },
  sensory: {
    en: 'VITAS provides a warming sensation when massaged into muscles before training, and a cooling sensation afterwards. These sensory experiences are part of your active warm-up and wind-down routine.',
    zh: 'VITAS 於按摩時帶來溫熱觸感（賽前）與清涼觸感（賽後），融入你的熱身與放鬆步驟。',
  },
  disclaimer: {
    en: 'Disclaimer: VITAS is a cosmetic product for external massage use. Statements regarding circulation and recovery refer to the sensory experience during and after massage routines, not medical outcomes. This product is not a medicine and makes no medical claims. If you experience persistent pain, consult a healthcare professional.',
    zh: '免責聲明：VITAS 為外用按摩用途化妝品。「循環」及「恢復」等陳述僅指按摩期間及之後的感受，並非醫療效果。本產品非藥物，不作醫療聲稱。如持續不適，請諮詢醫生。',
  },
};

/**
 * Sport modules. Each is its own URL so it can be linked from a club, a KOL
 * post or a shelf talker without landing people on a generic homepage.
 */
export const SPORTS = [
  {
    id: 'hyrox',
    art: '/assets/img/sport-hyrox.svg',
    name: { en: 'Hyrox', zh: 'Hyrox' },
    who: { en: 'For Hyrox athletes', zh: '給 Hyrox 選手' },
    hook: {
      en: 'From burpees to broad jumps — keep your legs feeling light.',
      zh: '從波比跳到立定跳遠，讓雙腿保持輕盈。',
    },
    lede: {
      en: 'Eight workouts, eight kilometres, and a sled that does not care how you feel. The work between stations is where the session is won — and the two minutes before and ten minutes after are the part you control.',
      zh: '八個項目、八公里，還有一台不理會你感受的雪橇。真正決定表現的，是站與站之間的處理——而賽前兩分鐘與賽後十分鐘，是你能控制的部分。',
    },
    before: {
      en: 'Ten minutes before the first station, massage into quads, calves and shoulders. The warming sensation is your cue that the muscle has had attention — then go and do the dynamic warm-up properly.',
      zh: '第一站前十分鐘，按摩股四頭肌、小腿與肩膊。溫熱觸感提醒你這組肌肉已被照顧——然後認真完成動態熱身。',
    },
    after: {
      en: 'After the last sled push, shower, then work upward along the legs in long slow strokes. Cooling, non-greasy, absorbed before you put your kit back on.',
      zh: '最後一次推雪橇後先洗澡，再以長而緩慢的手勢沿雙腿向上按摩。清涼、不油膩，穿回衣服前已吸收。',
    },
  },
  {
    id: 'padel',
    art: '/assets/img/sport-padel.svg',
    name: { en: 'Padel', zh: '板式網球' },
    who: { en: 'For padel players', zh: '給板式網球員' },
    hook: {
      en: 'Stay quick on your feet through the third set.',
      zh: '到第三盤，腳步依然靈活。',
    },
    lede: {
      en: 'Padel is played in short, explosive bursts — and the bill arrives the next morning in your calves, forearms and lower back. A weekend sport deserves a weekday routine.',
      zh: '板式網球由短促而爆發的動作組成，而代價會在第二天早上出現在小腿、前臂與下背。週末運動，值得一套平日的照顧習慣。',
    },
    before: {
      en: 'Before you step on court: calves, forearms and shoulders. Two minutes, both sides, paying attention to whichever one is complaining.',
      zh: '上場前：小腿、前臂與肩膊。兩分鐘，兩側都做，特別留意比較不適的一邊。',
    },
    after: {
      en: 'After the match — before the drinks, ideally — a cooling massage through the legs and forearms. It is a small ritual, and it is the one padel players skip most.',
      zh: '賽後——最好在喝東西之前——為雙腿與前臂做一次清涼按摩。這是很小的步驟，也是板式網球員最常略過的一步。',
    },
  },
  {
    id: 'running',
    art: '/assets/img/sport-running.svg',
    name: { en: 'Running', zh: '跑步' },
    who: { en: 'For running clubs', zh: '給跑團' },
    hook: {
      en: 'For the legs that feel like cement after intervals.',
      zh: '給間歇跑後像水泥一樣的雙腿。',
    },
    lede: {
      en: 'Three to five runs a week, one of them hard. Whether you run Happy Valley loops or the harbourfront, the routine that keeps you consistent is the one that takes two minutes and does not smell.',
      zh: '每週三至五課，其中一課是硬課。無論你跑跑馬地圈還是海濱長廊，能讓你持續的，是那個只花兩分鐘、又沒有氣味的習慣。',
    },
    before: {
      en: 'Calves, hamstrings and hip flexors before you start — especially on interval days, and especially on the side that always tightens first.',
      zh: '起跑前處理小腿、膕繩肌與髖屈肌——間歇日尤其重要，尤其是那條總是先繃緊的腿。',
    },
    after: {
      en: 'After the cool-down jog: long upward strokes on the calves and quads while your heart rate settles. It travels well in a running belt or a club bag.',
      zh: '緩跑放鬆後：趁心率回落，於小腿與股四頭肌以長而向上的手勢按摩。放在跑步腰包或跑團袋中都方便。',
    },
  },
];

export const PRODUCT = {
  slug: '/product/',
  nameEn: 'Soothing Cream Gel',
  nameZh: '舒緩啫喱膏',
  size: '100ml',
  price: 250,
  currency: 'HKD',
  priceLabel: 'HK$250',
  sku: 'VTS001',
  origin: { en: 'Made in France', zh: '法國製造' },
  gmp: { en: 'EU GMP manufacture', zh: '歐盟 GMP 生產' },
  texture: {
    en: 'A cream-gel that absorbs in under a minute and leaves no shine.',
    zh: '啫喱質地，一分鐘內吸收，不留油光。',
  },
  freeFrom: [
    { en: 'No methyl salicylate', zh: '不含水楊酸甲酯' },
    { en: 'No camphor', zh: '不含樟腦' },
    { en: 'No hormones', zh: '不含激素' },
    { en: 'No steroids', zh: '不含類固醇' },
    { en: 'No medicinal smell', zh: '沒有藥油氣味' },
  ],
};

/**
 * The shop catalogue. Prices are in cents (HKD) because that is what Stripe
 * expects; `priceLabel` is what the site shows.
 *
 * PLACEHOLDER: `duo` is a bundle of the same SKU, not a second product. When a
 * genuine second SKU exists (a travel size, a larger tube), replace it here and
 * the shop page picks it up with no other change.
 */
export const PRODUCTS = [
  {
    id: 'cream-100',
    slug: '/product/',
    art: '/assets/img/product-tube.svg',
    name: { en: 'Soothing Cream Gel', zh: '舒緩啫喱膏' },
    variant: { en: '100ml tube', zh: '100毫升 軟管' },
    price: 25000,
    priceLabel: 'HK$250',
    badge: null,
    blurb: {
      en: 'The one product. Grape seed, eucalyptus and niaouli in a light cream gel that absorbs in under a minute and does not smell like a pharmacy.',
      zh: '唯一的產品。葡萄籽、尤加利與綠花白千層，輕盈啫喱質地，一分鐘內吸收，沒有藥房氣味。',
    },
    points: [
      { en: 'One to two applications a day', zh: '每日一至兩次' },
      { en: 'Roughly 6 weeks of daily use', zh: '每日使用約可用六星期' },
      { en: 'Made in France · EU GMP', zh: '法國製造 · 歐盟 GMP' },
    ],
  },
  {
    id: 'cream-duo',
    slug: '/product/',
    art: '/assets/img/product-duo.svg',
    name: { en: 'Recovery Duo', zh: '雙支裝' },
    variant: { en: '2 × 100ml tubes', zh: '2 × 100毫升' },
    price: 45000,
    priceLabel: 'HK$450',
    badge: { en: 'Save HK$50', zh: '慳 HK$50' },
    blurb: {
      en: 'Two tubes: one for the gym bag, one for the desk drawer. The routine you can see is the one you keep — and this is how most people get past week three.',
      zh: '兩支裝：一支放運動袋，一支放辦公桌抽屜。看得見的習慣才會持續——大部分人能撐過第三週，靠的就是這個。',
    },
    points: [
      { en: 'Two 100ml tubes', zh: '兩支 100毫升' },
      { en: 'HK$225 each — HK$50 off', zh: '每支 HK$225——減 HK$50' },
      { en: 'Free local delivery', zh: '免費本地送遞' },
    ],
  },
];

export const PURITY = {
  out: [
    { en: 'Methyl salicylate — synthetic, skin irritant', zh: '水楊酸甲酯——合成物，可刺激皮膚' },
    { en: 'Camphor — neurotoxic in high doses', zh: '樟腦——高劑量具神經毒性' },
    { en: 'Synthetic steroids — long-term health risk', zh: '合成類固醇——長期健康風險' },
    { en: 'Artificial fragrance — hidden allergens', zh: '人造香料——隱藏致敏原' },
  ],
  in: [
    { en: 'Grape seed extract — the light, fast carrier', zh: '葡萄籽萃取——輕盈快吸的基底' },
    { en: 'Niaouli oil — the gentle warming note', zh: '綠花白千層油——溫和的暖感' },
    { en: 'Eucalyptus oil — the cooling note', zh: '尤加利油——清涼感' },
    { en: 'Water-based gel — fast absorption, no residue', zh: '水基啫喱——快速吸收，不留殘膜' },
  ],
  marks: [
    { en: 'Clean', zh: '純淨' },
    { en: 'Transparent', zh: '透明' },
    { en: 'Trusted since 2003', zh: '2003 年起信賴' },
  ],
};

export const SHOP = {
  freeShippingOver: 30000,
  currency: 'hkd',
  welcomeCode: 'WELCOME50',
  welcomeValue: 5000,
};

export const PLANTS = [
  {
    id: 'eucalyptus',
    art: '/assets/img/plant-eucalyptus.svg',
    latin: 'Eucalyptus globulus',
    nameEn: 'Eucalyptus',
    nameZh: '尤加利',
    role: { en: 'The cool one', zh: '清涼感' },
    short: {
      en: 'Gives the cream its quiet coolness on the skin — noticeable, never fierce.',
      zh: '為啫喱膏帶來皮膚上的清涼感——感覺得到，但從不刺激。',
    },
    long: {
      en: 'Eucalyptus globulus leaf oil is rich in 1,8-cineole, the compound behind its clean, faintly camphoraceous scent and the cool feeling it leaves behind. In VITAS it is dosed for comfort rather than shock: enough to register as you rub it in, not enough to announce itself to the person sitting next to you.',
      zh: '尤加利葉油富含 1,8-桉葉素，帶來清新氣息與塗抹後的清涼感。在 VITAS 配方中，它的比例以「舒適」為準：搓揉時感覺得到，卻不會讓身旁的人聞到。',
    },
    facts: [
      {
        h: { en: 'What you feel', zh: '你會感覺到' },
        p: {
          en: 'A cool note that arrives a few seconds after you rub it in and fades over the next few minutes. It is a sensation on the skin, not a change in the temperature of the muscle underneath.',
          zh: '搓揉後數秒出現的清涼感，並在數分鐘內散去。這是皮膚表面的感覺，並非下層肌肉溫度的改變。',
        },
      },
      {
        h: { en: 'Why not menthol or camphor', zh: '為何不用薄荷腦或樟腦' },
        p: {
          en: 'Both are stronger, cheaper and carry a medicated smell across a room. Eucalyptus gives a gentler version of the same cool sensation, which is the whole point of a cream you can use at your desk.',
          zh: '兩者都更強烈、更便宜，但氣味會傳遍整個房間。尤加利提供較溫和的同類清涼感——而這正是一支可以在辦公桌前使用的按摩膏的意義。',
        },
      },
      {
        h: { en: 'Where it comes from', zh: '來源' },
        p: {
          en: 'Steam-distilled from the leaves of the blue gum tree. In the finished cream it appears on the INCI list as Eucalyptus Globulus Leaf Oil.',
          zh: '以蒸餾法自藍桉樹葉萃取。在成品的 INCI 成分表上，標示為 Eucalyptus Globulus Leaf Oil。',
        },
      },
    ],
  },
  {
    id: 'grape-seed',
    art: '/assets/img/plant-grape.svg',
    latin: 'Vitis vinifera',
    nameEn: 'Grape seed',
    nameZh: '葡萄籽',
    role: { en: 'The carrier', zh: '基底' },
    short: {
      en: 'A light, fast-absorbing oil pressed from wine-grape seeds. It is why the cream slides and then disappears.',
      zh: '由釀酒葡萄籽壓榨而成的輕質油，好推開、吸收快，是不油膩的關鍵。',
    },
    long: {
      en: 'Grape seed oil is one of the lightest cosmetic carrier oils there is — high in linoleic acid, low in tack. It gives your hands enough glide to work a muscle properly, then sinks in fast enough that you can put a shirt back on straight away. It is also, unglamorously, why the cream feels expensive.',
      zh: '葡萄籽油是最輕盈的化妝品基底油之一，亞油酸含量高、黏膩感低。它讓雙手有足夠的滑度按摩肌肉，又吸收得夠快，讓你可以立即穿回衣服；同時也是這支啫喱膏膚感細緻的原因。',
    },
    facts: [
      {
        h: { en: 'What it does here', zh: '它在配方中的角色' },
        p: {
          en: 'Carries the two essential oils and gives your hands glide. Without a good carrier you cannot work a muscle for ten minutes — the cream drags, and you stop after two.',
          zh: '承載兩種精油，並為雙手提供滑度。沒有好的基底油，就無法持續按摩十分鐘——膏體會拉扯皮膚，兩分鐘就會停下來。',
        },
      },
      {
        h: { en: 'Why it does not feel greasy', zh: '為何不油膩' },
        p: {
          en: 'Grape seed oil is high in linoleic acid and light in texture, so it absorbs rather than sitting on the surface. You can dress within a minute of using it.',
          zh: '葡萄籽油亞油酸含量高、質地輕盈，會被吸收而非停留在表面。使用後約一分鐘即可穿衣。',
        },
      },
      {
        h: { en: 'An honest note', zh: '誠實的補充' },
        p: {
          en: 'Grape seed extract is often sold on its antioxidant content. That evidence is for oral and cosmetic-skin use — we make no claim that it does anything for circulation or recovery from the outside.',
          zh: '葡萄籽萃取常以抗氧化作賣點，但相關證據多來自口服或護膚用途。我們不會宣稱它由外用途徑改善循環或恢復。',
        },
      },
    ],
  },
  {
    id: 'niaouli',
    art: '/assets/img/plant-niaouli.svg',
    latin: 'Melaleuca viridiflora',
    nameEn: 'Niaouli',
    nameZh: '綠花白千層',
    role: { en: 'The rounding note', zh: '氣味平衡' },
    short: {
      en: 'A soft green aromatic from the same family as tea tree. It rounds the eucalyptus so the cream smells like a plant, not a pharmacy.',
      zh: '與茶樹同科的溫和芳香植物，柔化尤加利的氣味，讓啫喱膏聞起來像植物，而非藥房。',
    },
    long: {
      en: 'Niaouli essential oil sits between eucalyptus and tea tree — fresh, slightly sweet, far less sharp than either. Its job in this formula is aromatic balance. Remove it and the cream smells clinical; with it, the scent fades to almost nothing within a few minutes of application.',
      zh: '綠花白千層精油的氣味介乎尤加利與茶樹之間：清新、微甜，比兩者都柔和。它在配方中的角色是平衡香氣——沒有它，膏體聞起來會很「醫療」；有了它，塗抹數分鐘後氣味幾乎完全散去。',
    },
    facts: [
      {
        h: { en: 'The smallest of the three', zh: '三者中比例最小' },
        p: {
          en: 'Niaouli is present in a small proportion. Its job is the finish of the scent rather than the feel of the cream.',
          zh: '綠花白千層的比例最小，作用在於氣味的收尾，而非膏體的膚感。',
        },
      },
      {
        h: { en: 'Family resemblance', zh: '同科植物' },
        p: {
          en: 'Melaleuca viridiflora is a relative of tea tree and cajeput, native to New Caledonia and northern Australia.',
          zh: '綠花白千層與茶樹、白千層同屬，原產於新喀里多尼亞及澳洲北部。',
        },
      },
      {
        h: { en: 'If you are sensitive', zh: '如你屬敏感肌' },
        p: {
          en: 'Essential oils are the part of any natural formula most likely to irritate sensitive skin. Patch test on the inner forearm before using it over a large area.',
          zh: '在天然配方中，精油是最可能引起敏感的成分。大面積使用前，請先於前臂內側試用。',
        },
      },
    ],
  },
];

export const STOCKISTS = [
  {
    name: 'Watsons 屈臣氏',
    kind: { en: '600+ stores in Hong Kong & Macau', zh: '香港及澳門 600 多間分店' },
    url: 'https://www.watsons.com.hk/en/vitas-vitas-soothing-cream-gel-100ml/p/BP_226509',
    note: {
      en: 'Healthcare aisle, external muscle care. In store and online.',
      zh: '健與美貨架，外用肌肉護理區。門市及網店有售。',
    },
    featured: true,
  },
  {
    name: 'Mannings 萬寧',
    kind: { en: 'Stores across Hong Kong', zh: '全港分店' },
    url: 'https://www.mannings.com.hk/vitas-soothing-cream-gel-100ml/p/816504',
    note: { en: 'In store and online.', zh: '門市及網店有售。' },
    featured: true,
  },
  {
    name: 'HKTVmall',
    kind: { en: 'Online, next-day delivery', zh: '網購，翌日送達' },
    url: 'https://www.hktvmall.com/hktv/en/search?q=VITAS',
    note: { en: 'Search "VITAS 紓適寧".', zh: '搜尋「VITAS 紓適寧」。' },
  },
  {
    name: 'Gogo Herbs',
    kind: { en: 'Online health store', zh: '網上健康產品店' },
    url: 'https://gogoherbs.com/en/product/vts001',
    note: { en: 'Ships within Hong Kong.', zh: '香港境內配送。' },
  },
  {
    name: 'HK Medical Store',
    kind: { en: 'Online pharmacy', zh: '網上藥房' },
    url: 'https://hkmedicalstore.com/products/vitas-cream-100ml',
    note: { en: 'Ships within Hong Kong.', zh: '香港境內配送。' },
  },
];

export const ARTICLES = [
  {
    slug: 'lactic-acid-myth',
    date: '2026-07-14',
    readEn: '5 min read',
    readZh: '5 分鐘閱讀',
    tag: { en: 'Recovery', zh: '恢復' },
    title: {
      en: 'The lactic acid myth — and what actually makes you sore',
      zh: '乳酸迷思——真正令你痠痛的是甚麼',
    },
    lede: {
      en: 'For years this product was sold on "flushing out lactic acid". That claim is wrong, so we stopped making it. Here is the honest version.',
      zh: '多年來，這支產品以「排走乳酸」作賣點。這個說法並不正確，所以我們不再這樣說。以下是誠實的版本。',
    },
    art: '/assets/img/art-recovery.svg',
    body: [
      {
        h: { en: 'Lactate leaves on its own', zh: '乳酸會自行代謝' },
        p: [
          {
            en: 'Blood lactate rises during hard efforts and returns to resting levels within roughly 30 to 60 minutes of stopping — usually well before you have finished showering. Nothing you rub on your skin speeds that up, and nothing needs to.',
            zh: '劇烈運動時血液乳酸會上升，停止運動後約 30 至 60 分鐘便回落至靜息水平——通常在你洗完澡之前就完成了。塗抹在皮膚上的任何東西都無法加快這個過程，也沒有這個必要。',
          },
        ],
      },
      {
        h: { en: 'The soreness two days later is something else', zh: '兩天後的痠痛是另一回事' },
        p: [
          {
            en: 'Delayed onset muscle soreness — the stiffness that peaks 24 to 72 hours after unfamiliar or eccentric work — is an inflammatory response to microscopic damage in the muscle fibres. It arrives long after lactate has gone. Treating one by naming the other was always a category error.',
            zh: '延遲性肌肉痠痛（DOMS）在不熟悉或離心運動後 24 至 72 小時達到高峰，是肌纖維微細損傷引起的發炎反應。它出現時，乳酸早已消失。用乳酸來解釋 DOMS，本身就是概念錯置。',
          },
        ],
      },
      {
        h: { en: 'So what is a massage cream for?', zh: '那麼按摩膏的作用是甚麼？' },
        p: [
          {
            en: 'Two honest things. It makes hands-on massage possible without dragging on dry skin, and it feels cool and pleasant while you do it. Massage after training is well liked by the people who do it, and a medium that absorbs cleanly makes it more likely you will bother. That is a modest claim, and it is one we can stand behind.',
            zh: '兩件誠實的事：它讓雙手能順暢按摩而不拉扯乾燥皮膚；塗抹時清涼舒適。運動後按摩之所以受歡迎，往往因為感覺良好；而一款吸收乾淨的介質，會令你更願意去做。這是一個克制的說法，也是我們能夠站得住腳的說法。',
          },
        ],
      },
    ],
  },
  {
    slug: 'warm-up-rub',
    date: '2026-06-02',
    readEn: '4 min read',
    readZh: '4 分鐘閱讀',
    tag: { en: 'Training', zh: '訓練' },
    title: {
      en: 'What a pre-workout rub can and cannot do',
      zh: '運動前按摩膏做得到與做不到的事',
    },
    lede: {
      en: 'A cream does not warm a muscle up. Movement does. But the two minutes you spend applying it are not wasted.',
      zh: '按摩膏不會令肌肉熱身，動作才會。但塗抹它的兩分鐘並不浪費。',
    },
    art: '/assets/img/art-training.svg',
    body: [
      {
        h: { en: 'Cooling is a skin sensation, not a muscle temperature', zh: '清涼是皮膚感覺，不是肌肉溫度' },
        p: [
          {
            en: 'The coolness you feel from eucalyptus is a sensory effect at the surface of the skin. It does not change the temperature of the tissue underneath, and it is not a substitute for five minutes of easy cycling, rowing or skipping.',
            zh: '尤加利帶來的清涼感是皮膚表層的感官效果，並不會改變下層組織的溫度，也不能取代五分鐘的輕鬆單車、划船或跳繩。',
          },
        ],
      },
      {
        h: { en: 'What the ritual actually buys you', zh: '這個步驟真正的價值' },
        p: [
          {
            en: 'Attention. Working cream into your calves, quads and shoulders forces you to notice which side is tight, which knee is complaining, whether last session left something behind. Athletes who do a consistent pre-session check-in tend to make better decisions about load — not because of the cream, but because of the two minutes.',
            zh: '注意力。把啫喱膏推開至小腿、股四頭肌與肩膊時，你會察覺哪一邊比較緊、哪邊膝蓋在抗議、上一課是否留下了甚麼。有固定賽前自我檢查習慣的運動員，對訓練量的判斷通常更好——不是因為那支膏，而是因為那兩分鐘。',
          },
        ],
      },
      {
        h: { en: 'Where to put it', zh: '塗在哪裡' },
        p: [
          {
            en: 'The areas you are about to load, plus anywhere that felt stiff getting out of bed. Calves before running, shoulders and lats before climbing or swimming, quads and hips before lifting. Then go and actually warm up.',
            zh: '即將發力的部位，以及起床時覺得僵硬的地方。跑步前小腿、攀岩或游泳前肩背、負重訓練前股四頭肌與髖部。然後，去真正熱身。',
          },
        ],
      },
    ],
  },
  {
    slug: 'desk-neck',
    date: '2026-05-08',
    readEn: '3 min read',
    readZh: '3 分鐘閱讀',
    tag: { en: 'Everyday', zh: '日常' },
    title: {
      en: 'Desk neck: a three-minute reset for shoulders that live at a keyboard',
      zh: '辦公室頸：給長期對著鍵盤的肩頸三分鐘',
    },
    lede: {
      en: 'The most common reason people in Hong Kong reach for this cream has nothing to do with sport.',
      zh: '香港人使用這支啫喱膏最常見的原因，其實與運動無關。',
    },
    art: '/assets/img/art-desk.svg',
    body: [
      {
        h: { en: 'Why it happens', zh: '為甚麼會這樣' },
        p: [
          {
            en: 'Holding a static posture loads the small stabilising muscles of the neck and upper back for hours without a break. They are not injured; they are simply never allowed to stop working. The fix is interruption, not force.',
            zh: '長時間維持固定姿勢，會令頸部與上背的小穩定肌群連續數小時工作而沒有休息。它們並沒有受傷，只是從未被允許停下來。解決方法是「中斷」，不是「用力」。',
          },
        ],
      },
      {
        h: { en: 'The three minutes', zh: '三分鐘怎麼做' },
        p: [
          {
            en: 'One: a pea-sized amount along each side of the neck and across the top of the shoulders, worked in slow circles towards the collarbone. Two: ten slow shoulder rolls backwards, then ten chin tucks. Three: stand up and look at something more than six metres away for thirty seconds. Repeat mid-morning and mid-afternoon rather than saving it all for the evening.',
            zh: '第一：豌豆大小的份量，塗於頸部兩側及肩膊上方，以緩慢打圈方式向鎖骨方向推開。第二：慢慢向後轉肩十次，再做十次收下巴。第三：站起來，望向六米以外的景物三十秒。與其留待晚上一次過，不如上午與下午各做一次。',
          },
        ],
      },
      {
        h: { en: 'Why this cream in particular', zh: '為甚麼用這一支' },
        p: [
          {
            en: 'Because it does not smell. A traditional medicated oil at 3pm in an open-plan office is a social decision as much as a physical one. This one absorbs in under a minute and is gone from the air before your next meeting.',
            zh: '因為它沒有氣味。下午三時在開放式辦公室用傳統藥油，是一個社交決定多於生理決定。這一支一分鐘內吸收，氣味在下一個會議前已經消散。',
          },
        ],
      },
    ],
  },
];

export const FAQS = [
  {
    q: { en: 'What is the story behind VITAS?', zh: 'VITAS 紓適寧的歷史？' },
    a: {
      en: 'VITAS was created in Hong Kong to bring a French-made, plant-based recovery cream to a market dominated by strong medicated rubs. The formula — grape seed, niaouli and eucalyptus — comes out of two decades of formulation work in France, and the finished product has been on Hong Kong pharmacy shelves at Watsons and Mannings for over a decade. Today it is still a small operation: one product, made to the same specification, sold in the same city. Read the longer version on our About page.',
      zh: 'VITAS 紓適寧於香港創立，目的是在以強效藥膏為主的市場中，帶來一支法國製造的植物配方恢復啫喱膏。配方以葡萄籽、綠花白千層與尤加利為核心，源自法國二十年的配方研發；成品在香港屈臣氏及萬寧的貨架上已超過十年。時至今日，它仍是一盤小生意：一支產品、同一個規格、同一個城市。詳情請看「關於 VITAS」。',
    },
  },
  {
    q: {
      en: 'How is VITAS different from other soothing products on the market?',
      zh: 'VITAS 紓適寧跟市面上的其他舒緩產品有什麼分別？',
    },
    a: {
      en: 'Three practical differences. One: no methyl salicylate and no camphor, which is what gives traditional medicated rubs their carrying smell — you can use VITAS at your desk without announcing it. Two: a grape-seed base that absorbs in under a minute and leaves no shine, so you can dress straight after. Three: no hormones and no steroids, made in France to EU cosmetic GMP. What it is not is stronger than a HK$40 tube of something fierce — it is gentler on purpose.',
      zh: '三個實際分別。第一：不含水楊酸甲酯及樟腦——這正是傳統藥膏氣味濃烈的來源，所以 VITAS 可以在辦公桌前使用而不會驚動旁人。第二：葡萄籽基底，一分鐘內吸收、不留油光，塗後可即時穿衣。第三：不含激素及類固醇，於法國按歐盟化妝品 GMP 生產。但它並不比一支四十元、氣味強烈的產品「更強效」——它是刻意做得溫和。',
    },
  },
  {
    q: {
      en: 'What does it actually do, and what does it feel like?',
      zh: 'VITAS 紓適寧產品特點和功效？',
    },
    a: {
      en: 'On the skin: a mild, clean cooling sensation that arrives a few seconds after you rub it in and fades over the next few minutes. In use: enough glide for a proper self-massage on tired legs, shoulders and neck, before training or after it. In daily life: light enough and quiet enough to use twice a day without anyone noticing. It is a cosmetic massage cream — it supports the routine, it does not treat injury or illness.',
      zh: '皮膚感受：搓揉後數秒出現溫和乾淨的清涼感，並於數分鐘內散去。使用時：提供足夠滑度，讓你為疲勞的雙腿、肩膊與頸部好好按摩，運動前後皆可。日常上：質地輕、氣味低，每日兩次也不會被察覺。它是按摩護理產品——輔助你的日常習慣，並不能治療受傷或疾病。',
    },
  },
  {
    q: {
      en: 'What is in the VITAS Soothing Cream Gel?',
      zh: 'VITAS 紓適寧淋巴管理啫喱膏成分？',
    },
    a: {
      en: 'Three plant actives in a light water- and oil-based cream gel: grape seed (Vitis vinifera) as the carrier, eucalyptus (Eucalyptus globulus) for the cooling note, and niaouli (Melaleuca viridiflora) to round the scent. No hormones, no steroids, no methyl salicylate, no camphor. The full INCI list is printed on the carton — if you have a known essential-oil sensitivity, read it before you buy and patch test on the inner forearm.',
      zh: '三種植物成分，配於輕盈的水油啫喱基底：葡萄籽（Vitis vinifera）作基底、尤加利（Eucalyptus globulus）帶來清涼感、綠花白千層（Melaleuca viridiflora）平衡氣味。不含激素、類固醇、水楊酸甲酯或樟腦。完整 INCI 成分表印於外盒——如你對精油有已知敏感，請先閱讀成分並於前臂內側試用。',
    },
  },
  {
    q: { en: 'Where is VITAS made?', zh: 'VITAS 紓適寧是哪裡製造的呢？' },
    a: {
      en: 'In France, by a contract manufacturer working to EU GMP standards for cosmetics, then imported to Hong Kong in finished retail packs. Batch number and expiry date are printed on the crimp at the end of each tube. If you want the documentation behind a specific batch, write to us and we will send it.',
      zh: '於法國生產，由符合歐盟化妝品 GMP 標準的代工廠製造，再以零售包裝進口到香港。每支軟管末端摺口印有批號及有效期。如需查閱某一批次的相關文件，歡迎來信索取。',
    },
  },
  {
    q: {
      en: 'Who should not use VITAS?',
      zh: '哪些人士不宜使用 VITAS 紓適寧淋巴管理啫喱膏？',
    },
    a: {
      en: 'Do not use it on broken skin, on the face or near the eyes. It is not recommended for children under 6. If you are pregnant or breastfeeding, check with your doctor or midwife first — the formula contains eucalyptus and niaouli essential oils. If you have sensitive skin or a known reaction to essential oils, patch test on the inner forearm and stop if the skin becomes red or irritated. Severe, sudden or post-injury pain needs a doctor or physiotherapist, not a cream.',
      zh: '請勿用於破損皮膚、面部或眼睛附近。不建議 6 歲以下兒童使用。懷孕或哺乳期間請先諮詢醫生或助產士——配方含尤加利及綠花白千層精油。如屬敏感肌或對精油有已知反應，請先於前臂內側試用；若出現泛紅或不適應立即停用。劇烈、突發或受傷後的疼痛，請諮詢醫生或物理治療師，而非依賴按摩膏。',
    },
  },
  {
    q: { en: 'Does it smell? Is it greasy?', zh: '有氣味嗎？會油膩嗎？' },
    a: {
      en: 'Faintly, for about a minute, then it is gone. There is no methyl salicylate and no camphor in the formula, so it does not carry across a room. It absorbs in under a minute and leaves no shine — most people can dress straight afterwards.',
      zh: '有淡淡氣味，約一分鐘後散去。配方不含水楊酸甲酯及樟腦，氣味不會擴散至整個房間。一分鐘內吸收、不留油光，一般塗後可即時穿衣。',
    },
  },
  {
    q: { en: 'How often can I use it, and before or after exercise?', zh: '可以多常使用？運動前還是運動後？' },
    a: {
      en: 'One to two applications a day on clean, unbroken skin. Both: before training it is a two-minute check-in on the muscles you are about to load; after training it is a massage medium for tired legs, shoulders and back. There is no need to reapply every few minutes. Neither use replaces a proper warm-up or a rest day.',
      zh: '每日一至兩次，塗於清潔、無破損的皮膚。運動前後皆可：訓練前，是針對即將發力肌群的兩分鐘自我檢查；訓練後，是疲勞腿部、肩背的按摩介質。無需每隔數分鐘重複塗抹。兩者都不能取代正式熱身或休息日。',
    },
  },
  {
    q: {
      en: 'Does it drain lactic acid or "manage the lymphatic system"?',
      zh: '它可以排走乳酸或「管理淋巴」嗎？',
    },
    a: {
      en: 'No, and we no longer say it does. Lactate clears on its own within about an hour of stopping exercise, and no topical cream drains lymph. The retail name of the SKU in some listings still carries the older wording; the product is a low-odour, non-greasy massage cream for tired muscles, which is what we sell it as.',
      zh: '不能，我們亦已停止這樣宣傳。運動停止後約一小時內乳酸會自行代謝；任何外用膏體都無法「排走淋巴」。部分零售平台的產品名稱仍沿用舊有字眼；產品本身是低氣味、不油膩的疲勞肌肉按摩膏，我們亦以此定位發售。',
    },
  },
  {
    q: { en: 'How do I order, and how much is delivery?', zh: '如何訂購？運費多少？' },
    a: {
      en: 'Order from the Shop page — checkout is handled by Stripe, which accepts card and Apple Pay / Google Pay. Local delivery within Hong Kong is free on orders over HK$300 and HK$30 otherwise, usually 2–4 working days. You can also buy in person at Watsons and Mannings across Hong Kong.',
      zh: '可於「網上商店」下單，付款由 Stripe 處理，支援信用卡及 Apple Pay／Google Pay。香港本地送遞：滿 HK$300 免運費，否則 HK$30，一般 2–4 個工作天送達。亦可於全港屈臣氏及萬寧門市選購。',
    },
  },
  {
    q: { en: 'Can I return it?', zh: '可以退貨嗎？' },
    a: {
      en: 'Unopened tubes can be returned within 14 days of delivery for a full refund — email us and we will arrange it. We cannot accept opened tubes back for hygiene reasons. If something arrived damaged, send a photo and we will replace it.',
      zh: '未開封產品可於收貨後 14 天內退貨並全額退款——請來電郵，我們會安排。基於衞生理由，已開封產品恕不接受退回。如收到的產品有損壞，請提供照片，我們會安排更換。',
    },
  },
];

/**
 * About page content.
 *
 * PLACEHOLDER — VERIFY BEFORE LAUNCH: the founding narrative below follows the
 * brand's own account (VITAS Brand Guidelines v1.0, 2026) and the public retail
 * record. Specific dates, the founder's biography and the "two decades of
 * formulation" line are not independently substantiated here. Confirm every
 * factual detail with Rosana Li before this page goes live, and see
 * docs/positioning.md.
 */
export const ABOUT = {
  founder: { en: 'Rosana Li', zh: 'Rosana Li' },
  chapters: [
    {
      h: { en: 'It started with a smell', zh: '一切由氣味開始' },
      p: [
        {
          en: 'Anyone who has shared a lift in Hong Kong after someone applied a traditional medicated rub knows the problem. The products that work on tired muscles announce themselves — a sharp wall of methyl salicylate and camphor that follows you into the office, the MTR and the meeting you are already late for. Most people solve it by not using anything until they get home, which is to say by not using anything at all.',
          zh: '在香港，只要曾經在升降機裡碰上剛塗完藥油的人，就明白問題所在。真正對疲勞肌肉有幫助的產品，往往氣味逼人——水楊酸甲酯與樟腦的味道會一路跟著你進辦公室、進地鐵、進那個你已經遲到的會議。大部分人的解決方法，是等回家才用；換句話說，就是根本不用。',
        },
        {
          en: 'VITAS exists because of that gap: something you can actually use in the middle of a working day, on the muscles that are tired now rather than the ones you will get to tonight.',
          zh: 'VITAS 紓適寧就是為了填補這個空隙而存在：一支你真的可以在工作日中途使用的產品，照顧此刻疲勞的肌肉，而不是留待今晚才處理。',
        },
      ],
    },
    {
      h: { en: 'Why France', zh: '為甚麼是法國' },
      p: [
        {
          en: 'The formula was developed and is still made in France, by a cosmetics manufacturer working to EU GMP standards. That decision cost more than making it closer to home, and it was made for two reasons: the regulatory framework for cosmetic manufacture in the EU is strict and documented, and the plant-oil expertise — grape seed in particular — sits there.',
          zh: '配方在法國研發，至今仍於當地由符合歐盟 GMP 標準的化妝品廠生產。這個決定比就近生產昂貴，原因有二：歐盟對化妝品生產的規管嚴謹且有完整文件紀錄；而植物油——尤其是葡萄籽——的專業也在那裡。',
        },
        {
          en: 'The result is a short list: grape seed to carry, eucalyptus to cool, niaouli to round the scent. No hormones, no steroids, no methyl salicylate, no camphor. It is a smaller promise than most of the shelf makes, and it is one we can keep.',
          zh: '結果是一張很短的成分表：葡萄籽承載、尤加利清涼、綠花白千層平衡氣味。不含激素、類固醇、水楊酸甲酯或樟腦。這個承諾比貨架上大部分產品都小，但我們守得住。',
        },
      ],
    },
    {
      h: { en: 'On the shelf, in Hong Kong', zh: '在香港的貨架上' },
      p: [
        {
          en: 'Getting a small brand onto the shelf at Watsons and Mannings is the hardest thing to do in Hong Kong retail, and it took years. It is also the part of this business we are proudest of: it means someone can pick the tube up, read the carton and decide for themselves, without a website in between.',
          zh: '在香港零售市場，把一個小品牌放上屈臣氏與萬寧的貨架，是最難的一件事，而我們花了多年時間。這也是我們最自豪的部分：顧客可以拿起產品、看清楚外盒，然後自己決定——中間不需要一個網站。',
        },
      ],
    },
    {
      h: { en: 'What changed in 2026', zh: '2026 年的改變' },
      p: [
        {
          en: 'For years this product was marketed with a longer list of promises than it could support — lymphatic management, draining lactic acid, and further still. We have taken those claims off the packaging, the retail listings and this website, and replaced them with what the cream actually does. It is a smaller story. It is also a true one, and it is written down on our approach page so you can hold us to it.',
          zh: '多年來，這支產品的宣傳承諾遠超它能支持的範圍——淋巴管理、排走乳酸，以至更多。我們已把這些說法從包裝、零售資料及本網站上刪除，改為說明它真正的作用。這是一個比較小的故事，但它是真的；我們把它寫在「我們的取態」一頁，讓你可以監督我們。',
        },
      ],
    },
  ],
  founderNote: {
    h: { en: 'A note from Rosana Li, founder', zh: '創辦人 Rosana Li 的話' },
    p: [
      {
        en: 'I started VITAS because I wanted something I could use at three in the afternoon without changing the air in the room. I trained, I sat at a desk, and I was tired of choosing between a product that worked and a product I could be seen using.',
        zh: '我創立 VITAS，是因為我想要一支下午三時可以使用、又不會改變整個房間空氣的產品。我有訓練習慣，也長時間坐在辦公桌前；在「有效」與「用得出街」之間二選一，我已經受夠了。',
      },
      {
        en: 'The hardest decision of the last year was to say less about what this cream does. It is a good product, honestly described: it cools, it absorbs, it makes a ten-minute massage possible, and it does not follow you around. That is the whole promise, and I would rather earn a customer with it than sell one a story.',
        zh: '過去一年最艱難的決定，是少說一點這支膏的功效。它是一支好產品，值得被誠實地描述：它清涼、吸收快、讓十分鐘的按摩成為可能，而且不會跟著你到處走。這就是全部的承諾——我寧願用它換來一位顧客，也不想用一個故事賣出一支產品。',
      },
    ],
  },
};
