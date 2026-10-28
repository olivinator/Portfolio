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

  function page() { return location.pathname.split('/').pop() || 'index.html'; }
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
    if (placement && /\.html$/.test(href)) {
      gtag('event', 'select_project', { project: href.replace(/\.html$/, ''), placement: placement, page: page() });
    }
  }, true);

  // Embedded prototypes (Claims page): clicking into an iframe moves focus out of the page, so a window blur
  // with an iframe as the active element means someone started using that prototype. Counted once per prototype per visit.
  var seen = {};
  window.addEventListener('blur', function () {
    setTimeout(function () {
      var f = document.activeElement;
      if (!f || f.tagName !== 'IFRAME') return;
      var src = (f.getAttribute('src') || '').replace(/^.*prototypes\//, '').replace(/\.html/, '');
      if (!src || seen[src]) return;
      seen[src] = true;
      gtag('event', 'prototype_interact', { prototype: src, page: page() });
    }, 0);
  });
})();
