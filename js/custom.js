// custom.js — your own scripts and animations go here.
// Loaded at the end of every page, after jQuery and webflow.js.

// Tag the page by its filename so per-page styles (e.g. each project's brand color) can key off it
// Pages are linked without ".html" (olivia-hadley.com/caimber); the per-page styles still key off the file name.
var OH_PAGE = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '');
document.documentElement.setAttribute('data-page', OH_PAGE + '.html');

// "top" tag: smooth-scroll back to the top of the page on every page,
// whether or not that page has a #top anchor.
document.querySelectorAll('.sticky-tag-top').forEach(function (tag) {
  var link = tag.closest('a');
  if (!link) return;
  link.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
});

// Site footer: one shared component for every page. Each page carries an empty
// <section class="footer" data-site-footer> (the home page adds the "home" variant, which shows only the
// contact block, since its project cards sit right above). Edit the footer here and it changes everywhere.
// Runs before the pages' inline scripts, so the email tooltip and header-on-dark scripts find it.
(function () {
  var COPYRIGHT = '© 2026 Olivia Hadley | Last updated Oct 2026';
  var slots = document.querySelectorAll('[data-site-footer]');
  if (!slots.length) return;
  var here = OH_PAGE;
  // Project lists: [page, name, year, cover image, (unused span from the old bento layout)]
  var P = 'images/';
  var featured = [
    ['claims-service-case-study', 'SonderMind Claims Service', '2026', 'claims-cover-r11-p-1080.jpg', 5],
    ['wellness-picture', 'SonderMind Wellness Picture', '2026', 'wp-cover-r16-p-1080.jpg', 7],
    ['truetoform-scan-app', 'TrueToForm iOS Scan App', '2021', '65b5711be460af631de91a63_Scan-app-no-text-p-1080.jpg', 5],
    ['play-movies-tv-ios-revamp', 'Google Play Movies & TV for iOS', '2019', '65b5711c32335b4b3146c0bc_MT-V-1-p-1080.jpg', 7]
  ];
  var bonus = [
    ['fitsearch-by-truetoform', 'FitSearch by TrueToForm', '2022', '65b5711c1cd5394f50a0ef35_Fitsearch-no-text-p-800.jpg', 4],
    ['caimber', 'Caimber', '2023', '65b5711b17c3ad76b1c133c2_Caimber-p-800.jpg', 3],
    ['google-entertainment-space', 'Google Entertainment Space', '2020', '65b5711c3061e1aff3be74bf_MT-V-2-p-800.jpg', 5],
    ['google-chat-gif-integration', 'Google Chat GIF integration', '2017', '65b5711c349765854a7daac2_MT-V-3-p-800.jpg', 5],
    ['thryft', 'Thryft', '2022', '65b5711cfe1ff665b821657b_Thryft-p-800.jpg', 3],
    ['apple-music', 'Apple Music', '2016 - 2017', '65b99f6ff4deef0bcaaf5c2e_apple-p-800.jpg', 4]
  ];
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function tile(p) {
    var cur = p[0] === here;
    return '<li><a href="' + p[0] + '" class="fb-row' + (cur ? ' is-current' : '') + '"' + (cur ? ' aria-current="page"' : '') + '>' +
      '<span class="fb-thumb"><img src="' + P + p[3] + '" loading="lazy" alt=""/></span>' +
      '<span class="fb-text"><span class="fb-name">' + esc(p[1]) + '</span>' + (p[2] ? '<span class="fb-year">' + p[2] + '</span>' : '') + '</span>' +
      (cur ? '<span class="fb-here" role="img" aria-label="You&#x27;re here" title="You&#x27;re here">&#x1F440;</span>' : '') +
      '<span class="fb-arrow" aria-hidden="true"><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h12M11 5l5 5-5 5"/></svg></span></a></li>';
  }
  function grid(label, list, cls) {
    return '<div class="fb-group ' + cls + '"><div class="fb-label">' + label + '</div><ul class="fb-list" role="list">' + list.map(tile).join('') + '</ul></div>';
  }
  function contact(home) {
    return '<div class="frame-1480 footer' + (home ? ' home' : '') + '"><div class="frame-1481"><div class="div-block-39">' +
      '<h1 class="footer-header">Let&#x27;s Talk design</h1><img src="images/659073d7ff63da989b596d53_arrow-right.svg" loading="lazy" alt="" class="image-16 white"/></div>' +
      '<ul role="list" class="list w-list-unstyled">' +
      '<li class="list-item-3"><a href="' + (window.ohMail ? 'mailto:' + window.ohMail() : '#') + '" data-mail class="link-block light w-inline-block"><img src="images/659070c55237cf2d0b7751c5_Vectors-Wrapper.svg" loading="lazy" width="17.111112594604492" height="14" alt="" class="vectors-wrapper-7 light"/></a></li>' +
      '<li class="list-item"><a href="https://www.linkedin.com/in/olivia-hadley-b0040872/" target="_blank" class="link-block light w-inline-block"><img src="images/659070c6ef55cf400e300f22_Vectors-Wrapper.svg" loading="lazy" width="16" height="16" alt="" class="vectors-wrapper-8 light"/></a></li>' +
      '</ul><div class="footer-text copy-wrigth">' + COPYRIGHT + '</div></div></div>';
  }
  slots.forEach(function (slot) {
    var home = slot.getAttribute('data-site-footer') === 'home';
    slot.innerHTML = '<div class="div-block-38">' + (home ? '' :
      '<h1 class="heading-2">Go ahead, look around</h1>' +
      '<div class="fb-cols">' + grid('Featured work', featured, 'fb-featured') + grid('Bonus work', bonus, 'fb-bonus') + '</div>') +
      contact(home) + '</div>';
  });
})();

// Open every page at the top. A fresh visit (a link click, not Back/Forward or
// reload, and no #anchor) should never land mid-page, even inside a preview
// frame that keeps its own scroll position between pages.
(function () {
  if (location.hash) return;
  var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (nav && nav.type !== 'navigate') return;
  // the whole document, not #top: #top sits below the sticky header, so aligning it would scroll the page down
  var top = document.documentElement;
  function toTop() { window.scrollTo(0, 0); try { top.scrollIntoView({ block: 'start' }); } catch (e) {} }
  var moved = false;
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) {
    window.addEventListener(t, function () { moved = true; }, { once: true, passive: true });
  });
  toTop();
  window.addEventListener('load', function () { if (!moved) toTop(); }, { once: true });
})();

// Reveal-on-scroll: any element with class="reveal" fades up the first
// time it enters the viewport (styles live in css/custom.css).
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });
})();


// Case-study section tags: center each tag column under the header's circle logo,
// the way the homepage section labels line up (recomputed on resize).
(function () {
  var tags = [].slice.call(document.querySelectorAll('.link-block-7.context-tag'));
  var logo = document.querySelector('.frame-11 .container-logo');
  if (!tags.length || !logo) return;
  // Bottom of a section's real content: the last visible in-flow block. Cards, images and media count whole;
  // transparent wrappers are looked into, so their bottom padding doesn't count as content.
  function contentBottom(el, skip) {
    var best = -Infinity;
    [].forEach.call(el.children, function (c) {
      if (skip && c.matches(skip)) return;
      if (/^(SCRIPT|STYLE)$/.test(c.tagName)) return;
      var cs = getComputedStyle(c);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'absolute' || cs.position === 'fixed') return;
      var r = c.getBoundingClientRect();
      if (!r.height) return;
      var boxed = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || cs.borderBottomWidth !== '0px' ||
        cs.boxShadow !== 'none' || /^(IMG|VIDEO|FIGURE|SVG|CANVAS|IFRAME|TABLE)$/i.test(c.tagName) || !c.children.length;
      var b = boxed ? r.bottom : contentBottom(c, skip);
      if (b > best) best = b;
    });
    return best;
  }
  function align() {
    var l = logo.getBoundingClientRect(), cx = l.left + l.width / 2;
    var circle = logo.querySelector('.animated-circle-2') || logo;
    var circleBottom = circle.getBoundingClientRect().bottom; // the header is sticky at the top, so this is constant
    tags.forEach(function (t) {
      t.style.setProperty('--tag-dx', '0px');
      var r = (t.querySelector('img') || t).getBoundingClientRect();
      if (!r.width) return;
      t.style.setProperty('--tag-dx', (cx - (r.left + r.width / 2)).toFixed(1) + 'px');
      // While stuck, every word stops the same 19px below the header circle (as on the home page).
      // Each tag's text sits at a different depth inside its link, so each gets its own sticky offset.
      var txt = t.querySelector('.text-block-8');
      if (txt) {
        t.style.top = '';
        var off = txt.getBoundingClientRect().top - t.getBoundingClientRect().top;
        t.style.top = (circleBottom + 19 - off).toFixed(1) + 'px';
      }
      // Let go of the label where its section's content ends, not at the bottom of the section's box
      var p = t.parentElement, ps = getComputedStyle(p);
      t.style.marginBottom = '0px';
      var inner = p.getBoundingClientRect().bottom - parseFloat(ps.paddingBottom) - parseFloat(ps.borderBottomWidth);
      var end = contentBottom(p, '.link-block-7.context-tag');
      if (isFinite(end)) t.style.marginBottom = Math.max(0, inner - end).toFixed(1) + 'px';
    });
    mirrorTop(cx);
  }
  // The "top" tag on the right mirrors them: its center sits as far past the right edge of the
  // text column as the left tags sit before its left edge.
  var topLinks = [].slice.call(document.querySelectorAll('a .sticky-tag-top')).map(function (e) { return e.closest('a'); });
  var blocks = [].slice.call(document.querySelectorAll('#top, .paragraph-block, .div-block-24'));
  function mirrorTop(tagCx) {
    var left = Infinity, right = -Infinity;
    blocks.forEach(function (b) {
      var r = b.getBoundingClientRect();
      if (r.width) { left = Math.min(left, r.left); right = Math.max(right, r.right); }
    });
    topLinks.forEach(function (a) {
      a.style.translate = '';
      if (!isFinite(left)) return;
      var tag = a.querySelector('.sticky-tag-top').getBoundingClientRect();
      if (!tag.width) return;
      // never past the window edge: at most as far in from the right as the left tags are from the left
      var target = Math.min(right + (left - tagCx), document.documentElement.clientWidth - tagCx);
      a.style.translate = (target - (tag.left + tag.width / 2)).toFixed(1) + 'px 0';
    });
  }
  align();
  window.addEventListener('resize', align);
  window.addEventListener('load', align);
  // images and videos that load late change section heights
  if (window.ResizeObserver) { var raf; new ResizeObserver(function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(align); }).observe(document.body); }
})();

// Product screens (all case studies): tag them for the lift style in custom.css and feed the
// pointer position (-0.5 … 0.5) into --mx/--my while hovered. Diagrams, memes and logos are left out.
(function () {
  var shots = document.querySelectorAll([
    '.quick-stack-2 .cell-drop-shadow', '.quick-stack-3 img.image-22', 'img.image-24:not(.no-round)', 'img.image-19',
    'img.image-30', '.background-video-2',                                                     // TrueToForm scan app
    'img.image-43', 'img.image-44', 'img.image-45', 'img.image-46', 'img.image-35', 'img.image-42', // Play Movies & TV
    '.container-2 img.image-22', '.background-video-4',                                         // FitSearch
    'img.image-48', 'img.image-36', 'img.tf-hero',                                             // Caimber, Thryft
    '.background-video-5', '.background-video-6', '.background-video-7'                        // Entertainment Space, Chat
  ].join(','));
  shots.forEach(function (el) { el.classList.add('shot-lift'); });
  if (!matchMedia('(hover: hover)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  shots.forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
    });
    el.addEventListener('pointerleave', function () { el.style.setProperty('--mx', 0); el.style.setProperty('--my', 0); });
  });
})();


// Site cursor: crosshair; over links/buttons it twists and turns purple, over text it becomes a text cursor.
// Mouse/trackpad only; touch and keyboard keep the native pointer.
(()=>{const fine=matchMedia('(hover: hover) and (pointer: fine)');const hasText=el=>{if(!el||el.nodeType!==1||el.closest('svg,img,video,iframe,canvas,picture'))return false;for(const n of el.childNodes)if(n.nodeType===3&&n.textContent.trim())return true;return false};const dot=document.createElement('div');dot.className='portfolio-cursor';dot.setAttribute('aria-hidden','true');dot.innerHTML='<span><i class="xh-v"></i><i class="xh-h"></i><i class="xh-m"></i><i class="xh-d"></i></span>';document.body.append(dot);const root=document.documentElement;if(fine.matches)root.classList.add('has-xhair-cursor');const interactive='a[href],button,summary,input,select,textarea,label,[role="button"],[role="tab"],[tabindex]:not([tabindex="-1"]),.freelance-content > .frame-10 > .image-container';const hide=()=>{dot.classList.remove('is-visible','is-text');root.classList.remove('has-xhair-cursor')};document.addEventListener('pointermove',e=>{if(!fine.matches||e.pointerType!=='mouse'){hide();return}root.classList.add('has-xhair-cursor');dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';dot.classList.add('is-visible');const t=e.target.closest(interactive);dot.classList.toggle('is-interactive',!!t&&!t.matches(':disabled,[aria-disabled="true"]'));dot.classList.toggle('is-text',!(t&&!t.matches(':disabled,[aria-disabled="true"]'))&&hasText(e.target))},{passive:true});root.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);document.addEventListener('keydown',e=>{if(e.key==='Tab')hide()});fine.addEventListener('change',hide)})();
// Keep the decorative cursor following the mouse over same-origin embedded prototypes (iframes swallow the page's pointer events).
(()=>{const fine=matchMedia('(hover: hover) and (pointer: fine)'),CLS='has-xhair-cursor',sel='a[href],button,summary,input,select,textarea,label,[role="button"],[role="tab"],[tabindex]:not([tabindex="-1"])',seen=new WeakSet();const hasText=el=>{if(!el||el.nodeType!==1||el.closest('svg,img,video,canvas,picture'))return false;for(const n of el.childNodes)if(n.nodeType===3&&n.textContent.trim())return true;return false};const hook=f=>{let d;try{d=f.contentDocument}catch(e){return}if(!d||!d.documentElement||d.documentElement.dataset.xhBridge)return;d.documentElement.dataset.xhBridge='1';const st=d.createElement('style');st.textContent='@media (hover:hover) and (pointer:fine){html.xh-on,html.xh-on *{cursor:none!important}}';(d.head||d.documentElement).append(st);d.addEventListener('pointermove',e=>{const dot=document.querySelector('.portfolio-cursor');if(!dot||!fine.matches||e.pointerType!=='mouse'){d.documentElement.classList.remove('xh-on');return}d.documentElement.classList.add('xh-on');const r=f.getBoundingClientRect(),sx=f.offsetWidth?r.width/f.offsetWidth:1,sy=f.offsetHeight?r.height/f.offsetHeight:1;dot.style.left=(r.left+(f.clientLeft+e.clientX)*sx)+'px';dot.style.top=(r.top+(f.clientTop+e.clientY)*sy)+'px';document.documentElement.classList.add(CLS);dot.classList.add('is-visible');const t=e.target.closest&&e.target.closest(sel),on=!!t&&!t.matches(':disabled,[aria-disabled="true"]');dot.classList.toggle('is-interactive',on);dot.classList.toggle('is-text',!on&&hasText(e.target))},{passive:true})};const watch=f=>{if(seen.has(f))return;seen.add(f);f.addEventListener('load',()=>hook(f));hook(f)};document.querySelectorAll('iframe').forEach(watch);new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;if(n.tagName==='IFRAME')watch(n);else n.querySelectorAll('iframe').forEach(watch)}))).observe(document.body,{childList:true,subtree:true})})();

// No widows: join the last two words of every heading, card title, paragraph, list item and caption with a
// non-breaking space, so a line never ends with a single word on its own. Skips the animated hero headline.
(function () {
  var SEL = 'h1,h2,h3,h4,h5,h6,p,li,figcaption,blockquote,.ws-title,.fb-name,.p1,.p2';
  var SKIP = '.header-hero,.hero-title-line-1,.header-statement-text,.portfolio-cursor,[contenteditable],svg,script,style,textarea,input';
  function lastText(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n, last = null;
    while ((n = w.nextNode())) if (/\S/.test(n.nodeValue)) last = n;
    return last;
  }
  function prevText(el, node) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n, prev = null;
    while ((n = w.nextNode()) && n !== node) if (/\S/.test(n.nodeValue)) prev = n;
    return prev;
  }
  // a joined pair that can't fit (a long word pair in a big display title on a phone) stays breakable
  function tooWide(el) { return el.scrollWidth > el.clientWidth + 1; }
  function fix(el) {
    if (el.dataset.noWidow || el.closest(SKIP)) return;
    el.dataset.noWidow = '1';
    var t = lastText(el); if (!t) return;
    var v = t.nodeValue.replace(/\s+$/, ''), trail = t.nodeValue.slice(v.length);
    if ((v.match(/\S+/g) || []).length < 1 || el.textContent.trim().split(/\s+/).length < 3) return;
    var i = v.search(/\s\S+$/);
    if (i > 0) { var before = t.nodeValue; t.nodeValue = v.slice(0, i) + ' ' + v.slice(i + 1) + trail; if (tooWide(el)) t.nodeValue = before; return; }
    // the last word is its own text node (e.g. after a link or <strong>): glue the space before it
    var p = prevText(el, t);
    if (p && /\s$/.test(p.nodeValue) && !/\n\s*$/.test(p.nodeValue)) { var pb = p.nodeValue; p.nodeValue = pb.replace(/\s$/, ' '); if (tooWide(el)) p.nodeValue = pb; }
  }
  function run(root) { (root || document).querySelectorAll(SEL).forEach(fix); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { run(); }); else run();
  window.addEventListener('load', function () { run(); });
})();


// Footer list: the row for the page you're on stays clickable and takes you back to the top
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('.fb-row.is-current');
  if (!a) return;
  e.preventDefault();
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' });
});
