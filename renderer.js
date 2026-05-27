/* ═══════════════════════════════════════════
   RENDERER — Builds DOM from data files
   ═══════════════════════════════════════════ */

/* ── Typed text animation ── */
(function typedInit() {
  const el = document.getElementById('hero-typed');
  if (!el) return;

  const phrases = [
    'Firmware Embebido',
    'Automatización PLC',
    'CAD 3D / Mecánica',
    'Sistemas de Control',
    'STM32 / AVR',
    'Electrónica Industrial',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[phraseIdx];
    el.textContent = deleting
      ? phrase.slice(0, charIdx--)
      : phrase.slice(0, charIdx++);

    let delay = deleting ? 40 : 80;

    if (!deleting && charIdx > phrase.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && charIdx < 0) {
      deleting = false;
      charIdx = 0;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(tick, delay);
  }
  tick();
})();

/* ── Count-up animation ── */
(function countUp() {
  const els = document.querySelectorAll('.stat-n[data-target]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = Math.ceil(target / 40);
      const iv = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(iv);
      }, 40);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => obs.observe(el));
})();

/* ── Reveal on scroll ── */
(function revealInit() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── Skills renderer ── */
(function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid || typeof SKILLS_DATA === 'undefined') return;

  const colorMap = {
    cyan:   ['fill-cyan',   'fill-cyan'],
    violet: ['fill-violet', 'fill-violet'],
    purple: ['fill-purple', 'fill-purple'],
    green:  ['fill-green',  'fill-green'],
  };

  SKILLS_DATA.forEach((cat, ci) => {
    const fillClass = colorMap[cat.color]?.[0] ?? 'fill-cyan';

    const card = document.createElement('div');
    card.className = 'skill-category reveal';
    card.style.transitionDelay = `${ci * 0.08}s`;

    card.innerHTML = `
      <div class="skill-cat-header">
        <span class="skill-cat-icon">${cat.icon}</span>
        <span class="skill-cat-name">${cat.category}</span>
      </div>
      ${cat.skills.map((sk, si) => `
        <div class="skill-item">
          <div class="skill-row">
            <span class="skill-name">${sk.name}</span>
            <span class="skill-pct">${sk.pct}%</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill ${fillClass}"
                 style="width:${sk.pct}%; --delay:${si * 0.08}s"
                 data-pct="${sk.pct / 100}"></div>
          </div>
        </div>
      `).join('')}
    `;

    grid.appendChild(card);
  });

  /* Animate bars when visible */
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => bar.classList.add('animated'));
      e.target.querySelectorAll('.metric-bar').forEach(bar => bar.classList.add('animated'));
      barObs.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category, .about-metrics').forEach(el => barObs.observe(el));
})();

/* ── Projects renderer ── */
(function renderProjects() {
  const grid   = document.getElementById('projectsGrid');
  const filter = document.getElementById('projectsFilter');
  if (!grid || typeof PROJECTS_DATA === 'undefined') return;

  /* ── Filters ── */
  PROJECT_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat.key === 'all' ? ' active' : '');
    btn.textContent = cat.label;
    btn.dataset.filter = cat.key;
    filter.appendChild(btn);
  });

  filter.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const key = btn.dataset.filter;
    grid.querySelectorAll('.project-card').forEach(card => {
      const cats = card.dataset.categories.split(',');
      card.classList.toggle('hidden', key !== 'all' && !cats.includes(key));
    });
  });

  /* ── Cards ── */
  PROJECTS_DATA.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.dataset.categories = Array.isArray(p.category) ? p.category.join(',') : p.category;
    card.style.transitionDelay = `${i * 0.07}s`;

    const thumb = p.image
      ? `<img src="${p.image}" alt="${p.title}" loading="lazy" />`
      : `<div class="project-thumb-placeholder">${p.emoji}</div>`;

    const ghLink = p.github
      ? `<a class="project-link" href="${p.github}" target="_blank" rel="noopener" onclick="event.stopPropagation()">⌥ Repo</a>`
      : '';
    const demoLink = p.demo
      ? `<a class="project-link" href="${p.demo}" target="_blank" rel="noopener" onclick="event.stopPropagation()">↗ Demo</a>`
      : '';
    const pdfLink = p.pdf
      ? `<a class="project-link" href="${p.pdf}" target="_blank" rel="noopener" onclick="event.stopPropagation()">↓ PDF</a>`
      : '';

    card.innerHTML = `
      <div class="project-thumb">
        ${thumb}
        <span class="project-badge">${p.badge}</span>
      </div>
      <div class="project-body">
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <div class="project-footer">
          <div class="project-links">${ghLink}${demoLink}${pdfLink}</div>
          <button class="project-more-btn" data-id="${p.id}">Ver más →</button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openModal(p.id));
    grid.appendChild(card);
  });
})();

/* ── Project Modal ── */
(function modalInit() {
  const modal    = document.getElementById('projectModal');
  const content  = document.getElementById('modalContent');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  if (!modal) return;

  window.openModal = function (id) {
    const p = PROJECTS_DATA.find(x => x.id === id);
    if (!p) return;

    const heroHtml = p.image
      ? `<div class="modal-hero"><img src="${p.image}" alt="${p.title}" /></div>`
      : `<div class="modal-hero"><div class="modal-hero-placeholder">${p.emoji}</div></div>`;

    const galleryHtml = p.gallery?.length
      ? `<p class="modal-section-title">// GALERÍA</p>
         <div class="modal-gallery">
           ${p.gallery.map(img => `<img src="${img}" alt="" loading="lazy">`).join('')}
         </div>`
      : '';

    const linksHtml = [
      p.github && `<a class="btn btn-ghost" href="${p.github}" target="_blank">⌥ GitHub</a>`,
      p.demo   && `<a class="btn btn-secondary" href="${p.demo}" target="_blank">↗ Demo</a>`,
      p.pdf    && `<a class="btn btn-secondary" href="${p.pdf}" target="_blank" download>↓ PDF</a>`,
      p.video  && `<a class="btn btn-ghost" href="${p.video}" target="_blank">▶ Video</a>`,
    ].filter(Boolean).join('');

    content.innerHTML = `
      ${heroHtml}
      <h2 class="modal-title">${p.title}</h2>
      <div class="modal-tags">
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="modal-desc">${p.fullDescription || p.description}</div>
      ${galleryHtml}
      ${linksHtml ? `<p class="modal-section-title">// LINKS</p><div class="modal-links">${linksHtml}</div>` : ''}
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ── Timeline renderer ── */
(function renderTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container || typeof TIMELINE_DATA === 'undefined') return;

  TIMELINE_DATA.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = `timeline-item tl-${item.type} reveal`;
    el.style.transitionDelay = `${i * 0.1}s`;
    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-date">${item.date}</div>
      <div class="timeline-card">
        <span class="timeline-card-type">${item.typeLabel}</span>
        <h3 class="timeline-card-title">${item.title}</h3>
        <p class="timeline-card-place">${item.place}</p>
        <p class="timeline-card-desc">${item.description}</p>
      </div>
    `;
    container.appendChild(el);
  });
})();

/* ── Snippets renderer ── */
(function renderSnippets() {
  const tabs = document.getElementById('snippetsTabs');
  const body = document.getElementById('snippetsBody');
  if (!tabs || !body || typeof SNIPPETS_DATA === 'undefined') return;

  SNIPPETS_DATA.forEach((sn, i) => {
    const btn = document.createElement('button');
    btn.className = 'snippet-tab' + (i === 0 ? ' active' : '');
    btn.textContent = sn.label;
    btn.dataset.id = sn.id;
    tabs.appendChild(btn);

    const div = document.createElement('div');
    div.className = 'snippet-content' + (i === 0 ? ' active' : '');
    div.dataset.id = sn.id;
    div.innerHTML = `<pre><code>${escapeHtml(sn.code)}</code></pre>`;
    body.appendChild(div);
  });

  tabs.addEventListener('click', e => {
    const btn = e.target.closest('.snippet-tab');
    if (!btn) return;
    tabs.querySelectorAll('.snippet-tab').forEach(b => b.classList.remove('active'));
    body.querySelectorAll('.snippet-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    body.querySelector(`.snippet-content[data-id="${btn.dataset.id}"]`)?.classList.add('active');
  });

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();

/* ── GitHub Stats ── */
(function fetchGitHubStats() {
  const username = 'tuusuario'; // ← Cambiá por tu usuario real
  const reposEl     = document.getElementById('ghRepos');
  const starsEl     = document.getElementById('ghStars');
  const followersEl = document.getElementById('ghFollowers');
  const langsEl     = document.getElementById('ghLangs');

  if (!reposEl) return;

  fetch(`https://api.github.com/users/${username}`)
    .then(r => r.json())
    .then(data => {
      if (data.message) return; // rate limit or not found
      if (reposEl) reposEl.textContent = data.public_repos ?? '—';
      if (followersEl) followersEl.textContent = data.followers ?? '—';
    })
    .catch(() => {});

  fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
    .then(r => r.json())
    .then(repos => {
      if (!Array.isArray(repos)) return;

      /* Stars */
      const stars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
      if (starsEl) starsEl.textContent = stars;

      /* Languages */
      const langCount = {};
      repos.forEach(r => {
        if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
      });
      const sorted = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
      if (langsEl) {
        langsEl.innerHTML = sorted.map(([lang]) =>
          `<span class="gh-lang-badge">${lang}</span>`
        ).join('');
      }
    })
    .catch(() => {});
})();
