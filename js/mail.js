// Email address, assembled in the browser so it never appears as text in the page source.
// Address scrapers read the raw HTML and don't run scripts, so they find nothing; visitors get working links.
// In the HTML, email links are written as <a href="#" data-mail> and copy buttons as data-mail-copy;
// this fills them in. It loads right after the page content, before the other scripts that use the links.
(function () {
  var addr = ['olivia', 'r', 'hadley'].join('.') + String.fromCharCode(64) + ['gmail', 'com'].join('.');
  window.ohMail = function () { return addr; };
  function fill(root) {
    (root || document).querySelectorAll('a[data-mail]').forEach(function (a) { a.setAttribute('href', 'mailto:' + addr); });
    (root || document).querySelectorAll('[data-mail-copy]').forEach(function (b) { b.setAttribute('data-copy-email', addr); });
  }
  window.ohMailFill = fill;
  fill();
})();
