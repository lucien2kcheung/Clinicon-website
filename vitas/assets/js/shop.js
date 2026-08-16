/* VITAS — cart, welcome offer and Stripe checkout.
   Progressive enhancement: with JavaScript off the shop pages still read, and
   the stockist links still work. Prices shown here are for display only —
   /api/checkout re-prices every line from the server-side catalogue before it
   creates a Stripe session. */
(function () {
  'use strict';

  var CART_KEY = 'vitas-cart';
  var PROMO_KEY = 'vitas-promo';
  var WELCOME_KEY = 'vitas-welcome-seen';
  var WELCOME_CODE = 'WELCOME50';
  var WELCOME_VALUE = 5000;
  var SHIPPING = 3000;
  var FREE_OVER = 30000;

  var lang = document.body.getAttribute('data-lang') === 'zh' ? 'zh' : 'en';
  var zh = lang === 'zh';
  var base = zh ? '/zh' : '';

  var T = {
    added: { en: 'Added to cart', zh: '已加入購物車' },
    remove: { en: 'Remove', zh: '移除' },
    qty: { en: 'Quantity', zh: '數量' },
    free: { en: 'Free', zh: '免費' },
    promoOk: { en: 'HK$50 welcome offer applied.', zh: '已套用 HK$50 迎新優惠。' },
    promoBad: { en: 'That code is not recognised.', zh: '無法辨識此優惠碼。' },
    working: { en: 'Taking you to Stripe…', zh: '正前往 Stripe…' },
    failed: {
      en: 'Checkout is not connected yet. Add STRIPE_SECRET_KEY in Vercel to enable it (see README).',
      zh: '結帳功能尚未連接。請在 Vercel 設定 STRIPE_SECRET_KEY 以啟用（見 README）。',
    },
  };
  var say = function (key) {
    return T[key][lang];
  };
  var money = function (cents) {
    return 'HK$' + Math.round(cents / 100);
  };

  /* ---------------------------------------------------------------- state */

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* private mode — the cart lives for this page view only */
    }
  }

  var cart = read(CART_KEY, []);
  if (!Array.isArray(cart)) cart = [];

  var promo = read(PROMO_KEY, '');

  var subtotal = function () {
    return cart.reduce(function (sum, line) {
      return sum + line.price * line.qty;
    }, 0);
  };

  var count = function () {
    return cart.reduce(function (sum, line) {
      return sum + line.qty;
    }, 0);
  };

  function persist() {
    save(CART_KEY, cart);
    paintBadge();
    paintCart();
  }

  /* ---------------------------------------------------------------- badge */

  function paintBadge() {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = String(n);
      el.hidden = n === 0;
    });
  }

  /* ----------------------------------------------------------- add to cart */

  document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-add-to-cart');
      var line = cart.filter(function (l) {
        return l.id === id;
      })[0];

      if (line) {
        line.qty += 1;
      } else {
        cart.push({
          id: id,
          name: btn.getAttribute('data-name'),
          variant: btn.getAttribute('data-variant'),
          price: parseInt(btn.getAttribute('data-price'), 10),
          art: btn.getAttribute('data-art'),
          qty: 1,
        });
      }
      persist();

      var original = btn.textContent;
      btn.textContent = say('added');
      btn.classList.add('is-added');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('is-added');
      }, 1600);
    });
  });

  /* ------------------------------------------------------------- cart page */

  var itemsEl = document.querySelector('[data-cart-items]');

  function paintCart() {
    if (!itemsEl) return;

    if (!cart.length) {
      itemsEl.innerHTML =
        '<p class="cart__empty">' +
        (zh ? '購物車是空的。 ' : 'Your cart is empty. ') +
        '<a href="' + base + '/shop/">' +
        (zh ? '前往商店' : 'Go to the shop') +
        '</a></p>';
    } else {
      itemsEl.innerHTML = cart
        .map(function (line, i) {
          return (
            '<article class="cart-line">' +
            '<img class="cart-line__art" src="' + line.art + '" alt="" width="120" height="160">' +
            '<div class="cart-line__body">' +
            '<h2 class="cart-line__name">' + line.name + '</h2>' +
            '<p class="cart-line__variant">' + line.variant + '</p>' +
            '<button class="cart-line__remove" type="button" data-remove="' + i + '">' +
            say('remove') +
            '</button>' +
            '</div>' +
            '<div class="cart-line__qty">' +
            '<label class="sr-only" for="qty-' + i + '">' + say('qty') + '</label>' +
            '<button type="button" data-step="-1" data-index="' + i + '" aria-label="−">−</button>' +
            '<input id="qty-' + i + '" type="number" min="1" max="20" value="' + line.qty + '" data-qty="' + i + '">' +
            '<button type="button" data-step="1" data-index="' + i + '" aria-label="+">+</button>' +
            '</div>' +
            '<p class="cart-line__price">' + money(line.price * line.qty) + '</p>' +
            '</article>'
          );
        })
        .join('');
    }

    var sub = subtotal();
    var discount = promo === WELCOME_CODE && cart.length ? Math.min(WELCOME_VALUE, sub) : 0;
    var shipping = !cart.length ? 0 : sub - discount >= FREE_OVER ? 0 : SHIPPING;

    var set = function (sel, value) {
      var el = document.querySelector(sel);
      if (el) el.textContent = value;
    };
    set('[data-cart-subtotal]', money(sub));
    set('[data-cart-discount]', '−' + money(discount));
    set('[data-cart-shipping]', !cart.length ? '—' : shipping === 0 ? say('free') : money(shipping));
    set('[data-cart-total]', money(Math.max(0, sub - discount + shipping)));

    var row = document.querySelector('[data-cart-discount-row]');
    if (row) row.hidden = discount === 0;

    var checkoutBtn = document.querySelector('[data-checkout]');
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

    var promoInput = document.querySelector('[data-promo-input]');
    if (promoInput && promo && !promoInput.value) promoInput.value = promo;
  }

  if (itemsEl) {
    itemsEl.addEventListener('click', function (e) {
      var remove = e.target.closest('[data-remove]');
      var step = e.target.closest('[data-step]');
      if (remove) {
        cart.splice(parseInt(remove.getAttribute('data-remove'), 10), 1);
        persist();
      } else if (step) {
        var i = parseInt(step.getAttribute('data-index'), 10);
        cart[i].qty = Math.min(20, Math.max(1, cart[i].qty + parseInt(step.getAttribute('data-step'), 10)));
        persist();
      }
    });

    itemsEl.addEventListener('change', function (e) {
      var input = e.target.closest('[data-qty]');
      if (!input) return;
      var i = parseInt(input.getAttribute('data-qty'), 10);
      cart[i].qty = Math.min(20, Math.max(1, parseInt(input.value, 10) || 1));
      persist();
    });
  }

  /* ----------------------------------------------------------- promo code */

  var promoBtn = document.querySelector('[data-promo-apply]');
  if (promoBtn) {
    promoBtn.addEventListener('click', function () {
      var input = document.querySelector('[data-promo-input]');
      var note = document.querySelector('[data-promo-note]');
      var code = (input.value || '').trim().toUpperCase();

      if (code === WELCOME_CODE) {
        promo = code;
        save(PROMO_KEY, promo);
        note.textContent = say('promoOk');
        note.className = 'cart__promo-note is-ok';
      } else {
        promo = '';
        save(PROMO_KEY, '');
        note.textContent = say('promoBad');
        note.className = 'cart__promo-note is-bad';
      }
      note.hidden = false;
      paintCart();
    });
  }

  /* -------------------------------------------------------------- checkout */

  var checkout = document.querySelector('[data-checkout]');
  if (checkout) {
    checkout.addEventListener('click', function () {
      var note = document.querySelector('[data-checkout-note]');
      checkout.disabled = true;
      if (note) {
        note.textContent = say('working');
        note.hidden = false;
        note.className = 'cart__note';
      }

      fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(function (l) {
            return { id: l.id, qty: l.qty };
          }),
          promo: promo || null,
          lang: lang,
        }),
      })
        .then(function (res) {
          return res.ok ? res.json() : Promise.reject(new Error('HTTP ' + res.status));
        })
        .then(function (data) {
          if (!data.url) throw new Error('no session url');
          window.location.href = data.url;
        })
        .catch(function () {
          checkout.disabled = false;
          if (note) {
            note.textContent = say('failed');
            note.className = 'cart__note is-bad';
            note.hidden = false;
          }
        });
    });
  }

  /* -------------------------------------------------------- welcome offer */

  var welcome = document.querySelector('[data-welcome]');

  function closeWelcome() {
    if (!welcome) return;
    welcome.hidden = true;
    document.body.classList.remove('welcome-open');
    save(WELCOME_KEY, true);
    if (welcome.__opener && welcome.__opener.focus) welcome.__opener.focus();
  }

  function openWelcome() {
    if (!welcome) return;
    welcome.__opener = document.activeElement;
    welcome.hidden = false;
    document.body.classList.add('welcome-open');
    var field = welcome.querySelector('input[type=email]');
    if (field) field.focus();
  }

  if (welcome) {
    var seen = read(WELCOME_KEY, false);
    var onCheckout = /\/(cart|checkout)\//.test(window.location.pathname);

    if (!seen && !onCheckout) {
      setTimeout(openWelcome, 2500);
    }

    welcome.querySelectorAll('[data-welcome-close]').forEach(function (el) {
      el.addEventListener('click', closeWelcome);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !welcome.hidden) closeWelcome();
      /* keep focus inside the dialog while it is open */
      if (e.key === 'Tab' && !welcome.hidden) {
        var focusable = welcome.querySelectorAll('button, [href], input');
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    var form = welcome.querySelector('[data-welcome-form]');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        /* TODO before launch: POST the address to your email provider.
           See README, "Forms". */
        promo = WELCOME_CODE;
        save(PROMO_KEY, promo);
        save(WELCOME_KEY, true);
        form.hidden = true;
        var done = welcome.querySelector('[data-welcome-done]');
        if (done) done.hidden = false;
        paintCart();
      });
    }
  }

  /* ------------------------------------------------------------------ init */

  paintBadge();
  paintCart();
})();
