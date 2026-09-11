/* Small progressive enhancements. The page is fully usable without this file. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);

  /* Theme toggle ---------------------------------------------------------- */
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
  // Follow the OS setting until the visitor picks a theme explicitly.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    try { if (localStorage.getItem('theme')) return; } catch (err) {}
    root.dataset.theme = e.matches ? 'dark' : 'light';
  });

  /* Sticky nav border once the page is scrolled ---------------------------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* News: collapse older items behind a "Show more" button ----------------- */
  var moreBtn = document.getElementById('news-more');
  var extras = document.querySelectorAll('#news-list li[data-extra]');
  if (moreBtn && extras.length) {
    var label = moreBtn.querySelector('span');
    var setExpanded = function (expanded) {
      extras.forEach(function (li) { li.hidden = !expanded; });
      moreBtn.setAttribute('aria-expanded', String(expanded));
      label.textContent = expanded ? label.dataset.less : label.dataset.more;
    };
    setExpanded(false);
    moreBtn.hidden = false;
    moreBtn.addEventListener('click', function () {
      setExpanded(moreBtn.getAttribute('aria-expanded') !== 'true');
    });
  }

  /* Videos: load lazily, play only while on screen ------------------------- */
  var videos = document.querySelectorAll('video[data-src]');
  var attach = function (v) {
    if (v.src) return;
    v.src = v.dataset.src;
    v.load();
  };
  var tryPlay = function (v) {
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  };

  if (saveData) {
    // Show the poster only; load the clip on demand.
    videos.forEach(function (v) {
      v.addEventListener('click', function () { attach(v); tryPlay(v); }, { once: true });
    });
  } else if (reduceMotion) {
    // No autoplay; play while hovered.
    videos.forEach(function (v) {
      var card = v.closest('.pub') || v;
      card.addEventListener('mouseenter', function () { attach(v); tryPlay(v); });
      card.addEventListener('mouseleave', function () { v.pause(); });
    });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { attach(v); tryPlay(v); }
        else if (!v.paused) { v.pause(); }
      });
    }, { rootMargin: '160px 0px', threshold: 0.15 });
    videos.forEach(function (v) { io.observe(v); });
  } else {
    videos.forEach(function (v) { attach(v); tryPlay(v); });
  }

  /* Scroll reveal ------------------------------------------------------------ */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        ro.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { ro.observe(el); });
  }
})();
