/* Click tracking for GA4 + Google Ads, plus a source "ref" code on WhatsApp messages.
 *
 * GA4 (G-P6NNSWFGGZ) and the Google Ads tag (AW-18249191886) are loaded in each page's <head>.
 *
 * Google Ads conversion labels: leave a label empty ('') and that conversion is not sent.
 * Fill them in from Google Ads -> Goals -> Conversions -> (action) -> Tag setup ->
 * "Use the event snippet": send_to: 'AW-18249191886/<LABEL>'.
 *
 * Source ref: if a visitor arrives from a Google Ad (gclid), a Meta ad (fbclid) or a link with
 * utm_source, we remember it for the session and add " [ref:G]" / " [ref:M]" / " [ref:<SOURCE>]"
 * to the WhatsApp message they send. Log it in the enquiry sheet to see which channel produced
 * each enquiry. Organic visitors get no tag.
 */
(function () {
  var AW = 'AW-18249191886';
  var LABELS = {
    whatsapp: '',
    phone: '',
  };
  var SRC_KEY = 'cl_src';

  function ev(name, params) {
    if (window.gtag) window.gtag('event', name, params || {});
  }
  function adsConversion(key) {
    if (!LABELS[key] || !window.gtag) return;
    window.gtag('event', 'conversion', { send_to: AW + '/' + LABELS[key] });
  }

  /* Remember where the visitor came from (first touch of the session wins). */
  try {
    var q = new URLSearchParams(location.search);
    var src = '';
    if (q.get('gclid')) src = 'G';
    else if (q.get('fbclid')) src = 'M';
    else if (q.get('utm_source')) src = q.get('utm_source').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    if (src && !sessionStorage.getItem(SRC_KEY)) sessionStorage.setItem(SRC_KEY, src);
  } catch (e) {}

  function refTag() {
    try {
      var s = sessionStorage.getItem(SRC_KEY);
      return s ? ' [ref:' + s + ']' : '';
    } catch (e) {
      return '';
    }
  }
  window.clRef = refTag; // used by the homepage quote basket

  document.addEventListener(
    'click',
    function (e) {
      var t = e.target;
      if (!t || !t.closest) return;

      var a = t.closest('a[href*="wa.me"], a[href^="tel:"]');
      if (a) {
        var href = a.getAttribute('href') || '';
        if (href.indexOf('tel:') === 0) {
          ev('phone_click', { page_path: location.pathname });
          adsConversion('phone');
        } else {
          ev('whatsapp_click', { page_path: location.pathname, method: 'link' });
          adsConversion('whatsapp');
          var tag = refTag();
          if (tag && href.indexOf('ref%3A') === -1) {
            a.setAttribute(
              'href',
              href.indexOf('text=') > -1
                ? href + encodeURIComponent(tag)
                : href + (href.indexOf('?') > -1 ? '&' : '?') + 'text=' + encodeURIComponent("Hi, I'd like to enquire." + tag)
            );
          }
        }
        return;
      }

      /* Homepage quote basket: the button opens WhatsApp from script, not via a link. */
      if (t.closest('#cartSend')) {
        ev('whatsapp_click', { page_path: location.pathname, method: 'cart' });
        adsConversion('whatsapp');
      }
    },
    true
  );
})();
