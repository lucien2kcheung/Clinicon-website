/* Settings for the hand-written bilingual pages that build-pages.js splits into
   one English URL and one Chinese URL each.  Also read by build-products.js (sitemap + zh links).

   slug        URL path (/faq) and the name of the master file in src/pages/<slug>.html
   en.desc     English meta description  (build fails if longer than 155 characters)
   zh          null = the page stays English-only (no /zh twin, no hreflang).
   zh.title    Chinese <title>   (also used for og:title)
   zh.desc     Chinese meta description (also used for og:description; max 155 characters)
   zh.ld       English -> Chinese text for strings in the JSON-LD that do not appear in the visible
               page. Strings that DO appear in the page are translated automatically from the page's
               own Chinese text; the build fails and lists any string it cannot translate.
*/
module.exports = [
  {
    slug: "faq",
    en: { desc: "Ordering medical supplies in Hong Kong: lead times, free delivery over HK$500, payment terms, equipment servicing, tenders and returns." },
    zh: {
      title: "常見問題：訂購、送貨及退貨 | 健力醫療器材有限公司",
      desc: "香港醫療用品訂購常見問題：交貨期、滿HK$500免費送貨、付款方式、設備保養、政府招標及無菌產品退貨安排。",
      ld: {
        "Frequently Asked Questions | Clinicon Medical Ltd.": "常見問題 | 健力醫療器材有限公司",
        "Home": "主頁"
      }
    }
  },
  {
    slug: "services",
    en: { desc: "Department of Health-aligned servicing, calibration and validation for autoclaves, vaccine fridges, ECG machines and operating tables across Hong Kong." },
    zh: {
      title: "醫療設備保養及校準服務 | 健力醫療器材有限公司",
      desc: "符合衞生署要求的醫療設備保養、校準及驗證服務，涵蓋消毒爐、疫苗雪櫃、心電圖機及手術床，合資格工程師提供全港服務。",
      ld: {
        "Medical Equipment Servicing & Maintenance": "醫療設備保養及維修",
        "Medical equipment servicing, calibration and validation": "醫療設備保養、校準及驗證",
        "Servicing, calibration and validation for autoclaves, vaccine fridges, ECG machines, operating tables and other medical equipment in Hong Kong.":
          "為香港的消毒爐、疫苗雪櫃、心電圖機、手術床及其他醫療設備提供保養、校準及驗證服務。",
        "Hong Kong": "香港",
        "Home": "主頁"
      }
    }
  },
  {
    slug: "how-to-order",
    en: { desc: "How to order medical supplies from Clinicon: quote the product code by WhatsApp, email or phone and we confirm price, stock and delivery. Free over HK$500." },
    zh: {
      title: "如何訂購醫療用品 | 健力醫療器材有限公司",
      desc: "如何向健力訂購醫療用品：提供產品編號，以 WhatsApp、電郵或電話下單，我們確認價格、存貨及送貨安排，滿HK$500免費送貨。",
      ld: {
        "How to Order": "如何訂購",
        "How to order medical supplies from Clinicon in Hong Kong": "如何向健力（香港）訂購醫療用品",
        "Home": "主頁"
      }
    }
  },
  {
    slug: "clinic-packages",
    en: { desc: "Equipment for opening a new clinic in Hong Kong: autoclaves, operating tables, surgical lights, AEDs, refrigerators and more. Request a quote via WhatsApp." },
    zh: {
      title: "新診所開業設備套餐 | 健力醫療器材有限公司",
      desc: "香港新診所開業設備：消毒爐、手術床、手術燈、AED 除顫器、醫療雪櫃等，歡迎透過 WhatsApp 或電郵索取報價。",
      ld: {
        "New Clinic Setup Packages": "新診所開業設備套餐",
        "Clinic packages": "診所設備套餐",
        "Home": "主頁"
      }
    }
  },
  /* The Terms body exists in English only (the Chinese header/footer on the old page were the
     only Chinese). A Chinese legal text needs a proper translation, so this page stays English-only. */
  { slug: "terms-and-conditions", en: {}, zh: null }
];
