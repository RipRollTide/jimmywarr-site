/* JimmyWarr.com — the only script on the site. About 2 KB: header, menu, reveals, lightbox, contact form. */
(function () {
  var d = document, w = window;

  // Header: hide on scroll down, show on scroll up, hairline after 80px.
  var hdr = d.querySelector('.hdr'), lastY = w.scrollY;
  if (hdr) {
    w.addEventListener('scroll', function () {
      var y = w.scrollY;
      hdr.classList.toggle('is-scrolled', y > 80);
      if (y > lastY && y > 200) hdr.classList.add('is-hidden');
      else if (y < lastY) hdr.classList.remove('is-hidden');
      lastY = y;
    }, { passive: true });
  }

  // Mobile menu
  var menu = d.getElementById('mnav'), openBtn = d.querySelector('.menu-btn');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    d.body.style.overflow = open ? 'hidden' : '';
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var c = menu.querySelector('.mnav-close'); if (c) c.focus(); } else if (openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  if (menu) menu.querySelector('.mnav-close').addEventListener('click', function () { setMenu(false); });

  // Reveal on scroll
  var items = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in w && !w.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  // Lightbox (Set pages)
  var lb = d.getElementById('lb');
  if (lb) {
    var shots = [].slice.call(d.querySelectorAll('[data-lb]')), img = lb.querySelector('img'),
        count = lb.querySelector('.lb-count'), i = 0, x0 = null, opener = null;
    function show(n) {
      i = (n + shots.length) % shots.length;
      var s = shots[i];
      img.src = s.getAttribute('data-full'); img.alt = s.getAttribute('data-alt') || '';
      count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(shots.length).padStart(2, '0');
    }
    function open(n) { opener = shots[n]; show(n); lb.classList.add('open'); d.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); }
    function close() { lb.classList.remove('open'); d.body.style.overflow = ''; if (opener) opener.focus(); }
    shots.forEach(function (s, n) { s.addEventListener('click', function () { open(n); }); });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelectorAll('.prev').forEach(function (b) { b.addEventListener('click', function () { show(i - 1); }); });
    lb.querySelectorAll('.next').forEach(function (b) { b.addEventListener('click', function () { show(i + 1); }); });
    d.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(i - 1);
      else if (e.key === 'ArrowRight') show(i + 1);
    });
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
    });
  }

  // Contact form: opens the visitor's email app with the message filled in (no backend needed).
  var form = d.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      ['f-name', 'f-email', 'f-msg'].forEach(function (id) {
        var f = d.getElementById(id), lab = form.querySelector('label[for="' + id + '"]');
        var bad = !f.value.trim() || (f.type === 'email' && !/.+@.+\..+/.test(f.value));
        lab.classList.toggle('req', bad);
        lab.textContent = lab.getAttribute('data-label') + (bad ? ' — required' : '');
        if (bad) ok = false;
      });
      if (!ok) return;
      var to = form.getAttribute('data-to'), type = d.getElementById('f-type').value;
      var subject = 'Project inquiry — ' + type + ' — ' + d.getElementById('f-name').value;
      var body = d.getElementById('f-msg').value + '\n\n— ' + d.getElementById('f-name').value + ' (' + d.getElementById('f-email').value + ')';
      w.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      form.hidden = true;
      d.getElementById('form-done').hidden = false;
    });
  }
})();
