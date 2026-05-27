/* ═══════════════════════════════════════════
   MAIN — Navigation, Theme, Scroll, i18n
   ═══════════════════════════════════════════ */

/* ── Nav scroll effect ── */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ── Mobile nav toggle ── */
(function () {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
  });
})();

/* ── Active nav highlight ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => {
        a.classList.toggle('active', a.dataset.nav === e.target.id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
})();

/* ── Theme toggle ── */
(function () {
  const btn  = document.getElementById('themeToggle');
  const body = document.body;
  const key  = 'portfolio-theme';
  const saved = localStorage.getItem(key);
  if (saved) body.dataset.theme = saved;

  btn?.addEventListener('click', () => {
    const isDark = body.dataset.theme !== 'light';
    body.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem(key, body.dataset.theme);
    if (btn) btn.textContent = isDark ? '☀' : '◑';
  });
})();

/* ── Language toggle (stub) ── */
(function () {
  const btn = document.getElementById('langToggle');
  if (!btn) return;

  const translations = {
    en: {
      'hero-pre':    'MECHATRONICS ENGINEERING',
      'hero-status': 'AVAILABLE FOR PROJECTS',
      'hero-desc':   'I design embedded systems, industrial automation and 3D mechanical models.<br/>From control logic to real hardware.',
      'about-title': 'About Me',
    },
    es: {
      'hero-pre':    'INGENIERÍA MECATRÓNICA',
      'hero-status': 'DISPONIBLE PARA PROYECTOS',
      'hero-desc':   'Diseño sistemas embebidos, automatización industrial y modelos mecánicos 3D.<br/>De la lógica de control al hardware real.',
      'about-title': 'Sobre Mí',
    }
  };

  let lang = 'es';

  btn.addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    btn.textContent = lang === 'es' ? 'EN' : 'ES';
    const t = translations[lang];
    Object.entries(t).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = val;
    });
  });
})();

/* ── Smooth scroll for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Reveal all .reveal elements already in view on load ── */
window.addEventListener('load', () => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
});
