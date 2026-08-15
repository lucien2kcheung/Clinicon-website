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
    q: { en: 'Does it smell?', zh: '有氣味嗎？' },
    a: {
      en: 'Faintly, for about a minute. There is no methyl salicylate and no camphor in the formula, which is what gives traditional medicated rubs their carrying smell. Most people cannot detect it on a colleague sitting next to them.',
      zh: '有，但很淡，約一分鐘後散去。配方不含水楊酸甲酯與樟腦——這正是傳統藥膏氣味濃烈的來源。一般情況下，鄰座同事不會聞到。',
    },
  },
  {
    q: { en: 'Is it hot or cold on the skin?', zh: '塗上去是熱還是涼？' },
    a: {
      en: 'Mildly cool, from the eucalyptus. It is not a heat rub and it does not sting. If you are used to strong hot-and-cold products, this will feel gentle by comparison — that is deliberate.',
      zh: '輕微清涼，來自尤加利。它不是「熱感」產品，也不會刺痛。如果你習慣強烈的冷熱型產品，會覺得這一支溫和得多——這是刻意的設計。',
    },
  },
  {
    q: { en: 'How often can I use it?', zh: '可以多常使用？' },
    a: {
      en: 'One to two applications a day is the usual pattern, on clean, unbroken skin. There is no need to reapply every few minutes, and doing so tells you nothing about your body.',
      zh: '一般每日一至兩次，塗於清潔、無破損的皮膚上。無需每隔數分鐘重複塗抹；那樣做並不能反映你的身體狀況。',
    },
  },
  {
    q: { en: 'Can it be used before exercise as well as after?', zh: '運動前後都可以用嗎？' },
    a: {
      en: 'Yes. Before training it is a two-minute check-in on the muscles you are about to load; after training it is a massage medium for tired legs, shoulders and back. Neither replaces a proper warm-up or a rest day.',
      zh: '可以。訓練前，它是針對即將發力肌群的兩分鐘自我檢查；訓練後，它是疲勞腿部、肩背的按摩介質。兩者都不能取代正式熱身或休息日。',
    },
  },
  {
    q: { en: 'Does it drain lactic acid or "manage the lymphatic system"?', zh: '它可以排走乳酸或「管理淋巴」嗎？' },
    a: {
      en: 'No, and we no longer say it does. Lactate clears on its own within about an hour of stopping exercise, and no topical cream drains lymph. We sell this as a low-odour, non-greasy massage cream for tired muscles, because that is what it is.',
      zh: '不能，我們亦已停止這樣宣傳。運動停止後約一小時內，乳酸會自行代謝；任何外用膏體都無法「排走淋巴」。我們把它定位為低氣味、不油膩的疲勞肌肉按摩膏，因為它就是這樣的產品。',
    },
  },
  {
    q: { en: 'Is it safe during pregnancy or for children?', zh: '孕婦或兒童可以使用嗎？' },
    a: {
      en: 'The formula contains eucalyptus and niaouli essential oils. We do not recommend it for children under 6, and if you are pregnant or breastfeeding please check with your doctor or midwife first. Avoid the face, eyes and broken skin.',
      zh: '配方含尤加利及綠花白千層精油。不建議 6 歲以下兒童使用；懷孕或哺乳期間請先諮詢醫生或助產士。避免接觸面部、眼睛及破損皮膚。',
    },
  },
  {
    q: { en: 'Where is it made?', zh: '在哪裡生產？' },
    a: {
      en: 'In France, at an EU GMP-compliant cosmetics manufacturer, and imported to Hong Kong. Batch and expiry are printed on the crimp of the tube.',
      zh: '於法國一間符合歐盟 GMP 標準的化妝品廠生產，再進口到香港。批號與有效期印於軟管末端摺口。',
    },
  },
  {
    q: { en: 'What if the pain is severe?', zh: '如果痛得厲害怎麼辦？' },
    a: {
      en: 'See a doctor or physiotherapist. This is a cosmetic massage product, not a medicine. Sharp pain, swelling that will not settle, numbness or pain following a fall or collision all need a professional opinion, not a cream.',
      zh: '請諮詢醫生或物理治療師。這是按摩護理產品，並非藥物。劇痛、持續腫脹、麻痺，或跌倒、碰撞後的疼痛，都需要專業意見，而不是一支膏。',
    },
  },
];
