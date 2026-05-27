/* ═══════════════════════════════════════════
   CONTACT — Formspree integration
   ─────────────────────────────────────────
   1. Andá a formspree.io y creá un form.
   2. Reemplazá FORMSPREE_ENDPOINT con tu URL.
   ═══════════════════════════════════════════ */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/TU_FORM_ID';

(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = '⏳ Enviando...';

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (res.ok) {
        btn.textContent = '✓ Mensaje enviado';
        btn.style.background = 'var(--accent-green)';
        form.reset();
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = '▶ Enviar Mensaje';
          btn.style.background = '';
        }, 4000);
      } else {
        throw new Error('Error en el envío');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = '✗ Error — reintentá';
      btn.style.background = 'var(--accent-red)';
      setTimeout(() => {
        btn.textContent = '▶ Enviar Mensaje';
        btn.style.background = '';
      }, 4000);
    }
  });
})();
