// Google Analytics 4 for olivia-hadley.com (property G-W40F9HC1TR).
// Loaded in the <head> of every page. Only runs on the live domain, so local previews and the Claude preview
// never count as visits. Enhanced measurement (set in GA) already records page views, scroll depth, outbound
// clicks and engagement time; the events below add the portfolio-specific actions.
(function () {
  var ID = 'G-W40F9HC1TR';
  if (!/(^|\.)olivia-hadley\.com$/.test(location.hostname)) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', ID);

  function page() { return (location.pathname.split('/').pop() || 'index').replace(/\.html$/, ''); }
  function where(el) {
    if (el.closest('.footer')) return 'footer';
    if (el.closest('.hdr-talk, .frame-11')) return 'header';
    if (el.closest('.frame-1480.last, .frame-1463')) return 'hero';
    return 'page';
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href], button');
    if (!a) return;
    var href = a.getAttribute('href') || '';

    // Email: the "Copy" button in the email tooltip, and the envelope links themselves
    if (a.classList.contains('mail-copy')) { gtag('event', 'email_copy', { location: where(a), page: page() }); return; }
    if (href.indexOf('mailto:') === 0) { gtag('event', 'email_click', { location: where(a), page: page() }); return; }

    // LinkedIn profile
    if (href.indexOf('linkedin.com') !== -1) { gtag('event', 'linkedin_click', { location: where(a), page: page() }); return; }

    // Project cards: featured cards and bonus tiles on the homepage, and the footer project list on every page
    var placement = a.closest('.ws-tile') ? 'bonus' : a.closest('.freelance-content > .frame-10') ? 'featured' :
      a.classList.contains('fb-row') ? 'footer' : null;
    if (placement && /^[a-z0-9-]+(\.html)?$/.test(href)) {
      gtag('event', 'select_project', { project: href.replace(/\.html$/, ''), placement: placement, page: page() });
    }
  }, true);

  function protoName(f) { return (f.getAttribute('src') || '').replace(/^.*prototypes\//, '').replace(/\.html/, ''); }

  // Embedded prototypes (Claims page): clicking into an iframe moves focus out of the page, so a window blur
  // with an iframe as the active element means someone started using that prototype. Counted once per prototype per visit.
  var seen = {};
  window.addEventListener('blur', function () {
    setTimeout(function () {
      var f = document.activeElement;
      if (!f || f.tagName !== 'IFRAME') return;
      var src = protoName(f);
      if (!src || seen[src]) return;
      seen[src] = true;
      gtag('event', 'prototype_interact', { prototype: src, page: page() });
    }, 0);
  });

  // Case-study reading depth: one section_view per section the visitor reaches (its top passes 60% of the way up the
  // window), named like the sticky section labels. The Claims page marks sections with data-vtag; the other case studies
  // with a context tag at the start of each section. The homepage has neither, so nothing is sent there.
  function trackSections() {
    var secs = [].slice.call(document.querySelectorAll('[data-vtag]')).map(function (s) { return { el: s, name: s.getAttribute('data-vtag') }; });
    if (!secs.length) secs = [].slice.call(document.querySelectorAll('.link-block-7.context-tag')).map(function (t) {
      var label = t.querySelector('.text-block-8') || t; return { el: t.parentElement, name: label.textContent.trim().toLowerCase() };
    });
    if (!secs.length || !('IntersectionObserver' in window)) return;
    var total = secs.length;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var i = secs.findIndex(function (s) { return s.el === e.target; });
        gtag('event', 'section_view', { section: secs[i].name, section_number: i + 1, total_sections: total, page: page() });
      });
    }, { rootMargin: '0px 0px -40% 0px' });
    secs.forEach(function (s) { io.observe(s.el); });
  }

  // Time with prototypes: active seconds per embedded prototype. Activity inside the prototype (moving, clicking, scrolling,
  // typing) counts; a pause longer than 5 seconds counts as idle. The prototypes are on the same site, so their pages can be
  // listened to directly. Totals are sent as prototype_time when the visitor leaves or switches tabs (only new time each send).
  var IDLE = 5000, active = {}, sent = {}, last = {};
  function hookProto(f) {
    var name = protoName(f); if (!name) return;
    function on() {
      var now = Date.now(), gap = last[name] ? now - last[name] : 0;
      if (gap > 0 && gap <= IDLE && !document.hidden) active[name] = (active[name] || 0) + gap;
      last[name] = now;
    }
    function attach() {
      var d; try { d = f.contentDocument; } catch (e) { return; }
      if (!d || !d.documentElement || d.documentElement.dataset.gaHooked) return;
      d.documentElement.dataset.gaHooked = '1';
      ['pointermove', 'pointerdown', 'wheel', 'keydown', 'touchstart', 'scroll'].forEach(function (t) { d.addEventListener(t, on, { passive: true, capture: true }); });
    }
    f.addEventListener('load', attach); attach();
  }
  function flush() {
    Object.keys(active).forEach(function (name) {
      var secs = Math.round(active[name] / 1000) - (sent[name] || 0);
      if (secs < 1) return;
      sent[name] = (sent[name] || 0) + secs;
      gtag('event', 'prototype_time', { prototype: name, engaged_seconds: secs, page: page(), transport_type: 'beacon' });
    });
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) flush(); });
  window.addEventListener('pagehide', flush);

  function start() {
    trackSections();
    [].forEach.call(document.querySelectorAll('iframe[src*="prototypes/"]'), hookProto);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
