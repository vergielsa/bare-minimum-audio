/* Bare Minimum Audio — site scripts (loaded on every page) */

// ── Mobile menu ──
(function () {
  const button = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-nav');
  if (!button || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  button.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  // tap anywhere outside the menu to close it
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !button.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setOpen(false); button.focus(); }
  });
})();

// ── Portfolio lightbox ──
(function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const triggers = Array.from(document.querySelectorAll('.grid-open'));
  const img = document.getElementById('lb-img');
  const caption = document.getElementById('lb-caption');
  const closeBtn = document.getElementById('lb-close');
  let current = 0;
  let lastFocus = null;

  function show(i) {
    current = (i + triggers.length) % triggers.length;
    const t = triggers[current];
    const thumb = t.querySelector('img');
    const cap = t.parentElement.querySelector('figcaption');
    img.src = t.dataset.full || thumb.src;
    img.alt = thumb.alt;
    caption.textContent = cap ? cap.textContent : '';
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  triggers.forEach((t, i) => t.addEventListener('click', () => open(i)));
  closeBtn.addEventListener('click', close);
  document.getElementById('lb-next').addEventListener('click', () => show(current + 1));
  document.getElementById('lb-prev').addEventListener('click', () => show(current - 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      // keep keyboard focus inside the viewer
      const f = Array.from(lightbox.querySelectorAll('button'));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
