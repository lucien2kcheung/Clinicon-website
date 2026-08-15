/* VITAS — progressive enhancement only. Every page works without this file.
   Language is not handled here: English and 繁體中文 are separate URLs, and the
   header toggle is an ordinary link between them. */
(function () {
  'use strict';

  /* ------------------------------------------------------------ mobile nav */

  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('primary-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      document.body.classList.toggle('nav-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        navToggle.focus();
      }
    });
  }

  /* ----------------------------------------------------- header on scroll */

  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.pageYOffset > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------- reveal on scroll */

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) {
      el.classList.add('is-in');
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  /* -------------------------------------------------------------- accordion */

  document.querySelectorAll('[data-accordion] .acc__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
      btn.closest('.acc').classList.toggle('is-open', !open);
    });
  });

  /* --------------------------------------------------------- routine finder */

  var finder = document.querySelector('[data-finder]');
  if (finder) {
    var out = finder.querySelector('[data-finder-result]');
    var lang = finder.getAttribute('data-lang') === 'zh' ? 'zh' : 'en';

    var COPY = {
      before: {
        link: '/how-to-use/#before',
        en: {
          eyebrow: 'Your routine',
          title: 'Start with the two-minute check-in',
          body: 'Use it before you train, on the muscles you are about to load, then do a real warm-up. Keep the tube in your gym bag rather than the bathroom — the routine you can see is the one you keep.',
          more: 'Read the full routine',
        },
        zh: {
          eyebrow: '你的用法',
          title: '由「兩分鐘自我檢查」開始',
          body: '訓練前塗於即將發力的肌群，然後做真正的熱身。把它放在運動袋而不是浴室——看得見的習慣，才會持續。',
          more: '閱讀完整用法',
        },
      },
      after: {
        link: '/how-to-use/#after',
        en: {
          eyebrow: 'Your routine',
          title: 'Make it an after-shower habit',
          body: 'Ten minutes of slow, upward strokes on the legs, shoulders and back after you wash. Clean skin absorbs it faster, and you will use less of the tube.',
          more: 'Read the full routine',
        },
        zh: {
          eyebrow: '你的用法',
          title: '養成「洗澡後」的習慣',
          body: '洗澡後以緩慢、向上的手勢按摩雙腿、肩膊與背部約十分鐘。乾淨的皮膚吸收更快，用量也更省。',
          more: '閱讀完整用法',
        },
      },
      desk: {
        link: '/how-to-use/#desk',
        en: {
          eyebrow: 'Your routine',
          title: 'Two short resets beat one long one',
          body: 'A pea-sized amount on the neck and shoulders mid-morning and mid-afternoon, followed by shoulder rolls and thirty seconds of looking at something far away.',
          more: 'Read the full routine',
        },
        zh: {
          eyebrow: '你的用法',
          title: '兩次短暫重設，勝過一次長時間',
          body: '上午與下午中段各取豌豆大小份量，塗於頸肩，然後轉肩、望向遠處三十秒。',
          more: '閱讀完整用法',
        },
      },
    };

    finder.addEventListener('change', function () {
      var data = new FormData(finder);
      var q1 = data.get('q1');
      var q2 = data.get('q2');
      var q3 = data.get('q3');
      if (!q1 || !q2 || !q3) return;

      var key = 'after';
      if (q1 === 'desk' || q2 === 'always' || q3 === 'split') key = 'desk';
      else if (q2 === 'before' || q3 === 'two') key = 'before';

      var pick = COPY[key];
      var copy = pick[lang];
      var href = (lang === 'zh' ? '/zh' : '') + pick.link;

      out.innerHTML =
        '<p class="eyebrow eyebrow--light">' + copy.eyebrow + '</p>' +
        '<h3>' + copy.title + '</h3>' +
        '<p>' + copy.body + '</p>' +
        '<p><a class="link-arrow" href="' + href + '">' + copy.more + '</a></p>';
      out.hidden = false;
    });
  }

  /* ------------------------------------------------------------------ forms */

  var NOTE = {
    en: 'Not connected yet — add a form endpoint before launch (see README).',
    zh: '尚未連接後端——發布前請設定表單接收位址（見 README）。',
  };
  var pageLang = (document.documentElement.getAttribute('lang') || 'en').indexOf('zh') === 0 ? 'zh' : 'en';

  function wire(form, noteSel) {
    if (!form) return;
    var note = form.querySelector(noteSel);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      /* No endpoint is configured yet — see README, "Forms". */
      if (note) {
        note.textContent = NOTE[pageLang];
        note.hidden = false;
      }
      form.reset();
    });
  }

  wire(document.querySelector('[data-newsletter]'), '[data-newsletter-note]');
  wire(document.querySelector('[data-contact]'), '[data-contact-note]');
})();
