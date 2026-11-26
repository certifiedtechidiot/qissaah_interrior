/* Qissaah Interior interactive studio UI */
(() => {
  'use strict';

  const PRODUCTS = {
    'solis-sofa': {
      id: 'solis-sofa',
      name: 'The Solis Sofa',
      category: 'Seating',
      price: 'From $2,800',
      leadtime: 'Made to order in 6 to 8 weeks',
      materials: 'Belgian raw linen, kiln dried European oak base',
      dimensions: '240 cm W x 102 cm D x 74 cm H',
      img: './assets/images/prod-solis-sofa.jpg',
      desc: 'Low profile architectural seating upholstered in breathable unbleached linen with sculpted down wrapped cushions.'
    },
    'lume-table': {
      id: 'lume-table',
      name: 'Lume Dining Table',
      category: 'Dining',
      price: 'From $1,950',
      leadtime: 'Crafted in 5 to 7 weeks',
      materials: 'Smoked solid walnut, matte oil hand finish',
      dimensions: '230 cm L x 105 cm W x 75 cm H',
      img: './assets/images/prod-lume-table.jpg',
      desc: 'Generous sculptural dining centerpiece supported by twin fluted architectural timber columns.'
    },
    'terra-chair': {
      id: 'terra-chair',
      name: 'Terra Lounge Chair',
      category: 'Seating',
      price: 'From $1,420',
      leadtime: 'In studio craft, 4 to 5 weeks',
      materials: 'Cognac virgin wool velvet, recessed steel swivel',
      dimensions: '84 cm W x 88 cm D x 76 cm H',
      img: './assets/images/prod-terra-chair.jpg',
      desc: 'Deep enveloping armchair shaped for reading corners, offering subtle 360 degree swivel movement.'
    },
    'aurelia-bed': {
      id: 'aurelia-bed',
      name: 'Aurelia Bed',
      category: 'Bedroom',
      price: 'From $2,600',
      leadtime: 'Made to order in 6 weeks',
      materials: 'Unbleached ivory boucle, solid ash timber frame',
      dimensions: '198 cm W x 224 cm L x 98 cm H',
      img: './assets/images/prod-aurelia-bed.jpg',
      desc: 'Quiet platform sanctuary featuring cushioned perimeter rails and generous headboard support.'
    },
    'nora-sideboard': {
      id: 'nora-sideboard',
      name: 'Nora Cabinet',
      category: 'Dining',
      price: 'From $1,780',
      leadtime: 'Crafted in 5 weeks',
      materials: 'Quarter sawn walnut, concealed brass joinery',
      dimensions: '190 cm W x 48 cm D x 182 cm H',
      img: './assets/images/prod-nora-sideboard.jpg',
      desc: 'Architectural shelving and cabinet system with vertical timber grain continuity and deep display bays.'
    },
    'vale-lamp': {
      id: 'vale-lamp',
      name: 'Vale Floor Lamp',
      category: 'Lighting',
      price: 'From $480',
      leadtime: 'Ready in 2 to 3 weeks',
      materials: 'Hand brushed solid bronze, spun dome shade',
      dimensions: '46 cm Shade x 162 cm H',
      img: './assets/images/prod-vale-lamp.jpg',
      desc: 'Arched reading and ambient luminaire engineered to cast warm indirect light across limestone and linen.'
    }
  };

  const CHAPTERS = {
    people: {
      lead: 'More Than Furniture. A Way of Living.',
      body: 'Qissaah Interior was founded on a simple conviction that well designed spaces bring calm, warmth, and connection to everyday life. We collaborate with skilled artisans and architects to craft quiet heirloom pieces.'
    },
    materials: {
      lead: 'Timber, Stone, and Tactile Fibres.',
      body: 'Every room begins with honest raw materials selected for patina and touch. Kiln dried walnut, honed travertine, brushed bronze, and unbleached Belgian linen age gracefully alongside daily life.'
    },
    sustainability: {
      lead: 'Built Once, Built to Endure.',
      body: 'We source FSC certified regional hardwoods, natural plant oil finishes free of harsh solvents, and removable upholstery covers so pieces remain repairable for decades.'
    },
    process: {
      lead: 'From Architectural Brief to Installation.',
      body: 'Each commission moves from spatial planning and custom millwork drawings to studio sampling and white glove placement inside your finished residence.'
    }
  };

  const HERO_CAPTIONS = [
    'Natural materials.<br>Better living.',
    'Honest joinery.<br>Gather in light.',
    'Quiet corners.<br>Made to endure.'
  ];

  const savedIds = new Set();

  /* 1. Hero Slider */
  const heroSlides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const pagerBtns = Array.from(document.querySelectorAll('[data-slide-target]'));
  const heroProgress = document.getElementById('hero-progress-fill');
  const heroCaption = document.getElementById('hero-scene-caption');
  let activeSlide = 0;

  function setHeroSlide(idx) {
    activeSlide = idx;
    heroSlides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    pagerBtns.forEach((b, i) => b.setAttribute('aria-selected', String(i === idx)));
    if (heroProgress) {
      heroProgress.style.transform = `scaleX(${(idx + 1) / heroSlides.length})`;
    }
    if (heroCaption && HERO_CAPTIONS[idx]) {
      heroCaption.innerHTML = HERO_CAPTIONS[idx];
    }
  }

  pagerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = Number(btn.dataset.slideTarget);
      if (!Number.isNaN(target)) setHeroSlide(target);
    });
  });

  /* 2. Story Chapters */
  const chapterBtns = Array.from(document.querySelectorAll('[data-chapter]'));
  const chapterLead = document.getElementById('chapter-lead');
  const chapterBody = document.getElementById('chapter-body');

  function setChapter(key) {
    const ch = CHAPTERS[key];
    if (!ch) return;
    chapterBtns.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.chapter === key)));
    if (chapterLead) chapterLead.textContent = ch.lead;
    if (chapterBody) chapterBody.textContent = ch.body;
  }

  chapterBtns.forEach((btn) => {
    btn.addEventListener('click', () => setChapter(btn.dataset.chapter));
  });

  document.querySelectorAll('[data-chapter-jump]').forEach((el) => {
    el.addEventListener('click', () => setChapter(el.dataset.chapterJump));
  });

  /* 3. Collection Filters */
  const filterBtns = Array.from(document.querySelectorAll('[data-filter]'));
  const productCards = Array.from(document.querySelectorAll('.product-card'));
  const resetFilterLink = document.getElementById('reset-filter-link');

  function applyFilter(cat) {
    filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
    productCards.forEach((card) => {
      const match = cat === 'All' || card.dataset.category === cat;
      card.hidden = !match;
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  if (resetFilterLink) {
    resetFilterLink.addEventListener('click', () => applyFilter('All'));
  }

  document.querySelectorAll('[data-filter-jump]').forEach((el) => {
    el.addEventListener('click', () => {
      const cat = el.dataset.filterJump;
      if (cat) applyFilter(cat);
    });
  });

  /* 4. Mobile Menu Drawer */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function toggleMobileMenu(force) {
    if (!menuBtn || !mobileDrawer) return;
    const open = typeof force === 'boolean' ? force : menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      mobileDrawer.hidden = false;
      requestAnimationFrame(() => mobileDrawer.classList.add('is-open'));
    } else {
      mobileDrawer.classList.remove('is-open');
      setTimeout(() => {
        if (menuBtn.getAttribute('aria-expanded') !== 'true') mobileDrawer.hidden = true;
      }, 320);
    }
  }

  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener('click', () => toggleMobileMenu());
    mobileDrawer.querySelectorAll('a, button').forEach((item) => {
      item.addEventListener('click', () => toggleMobileMenu(false));
    });
  }

  /* 5. Modal Manager */
  let lastFocused = null;
  const allModals = Array.from(document.querySelectorAll('.modal-backdrop'));

  function closeAllModals() {
    allModals.forEach((m) => { m.hidden = true; });
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    allModals.forEach((m) => { if (m !== modal) m.hidden = true; });
    modal.hidden = false;
    const firstInput = modal.querySelector('input, select, textarea, button:not([data-close-modal])') || modal.querySelector('[data-close-modal]');
    if (firstInput) firstInput.focus();
  }

  allModals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
    modal.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', closeAllModals);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      toggleMobileMenu(false);
    }
  });

  /* 6. Consultation Modal + Validation (Gate 70 honest endpoint handling) */
  const consultModal = document.getElementById('consultation-modal');
  const consultForm = document.getElementById('consultation-form');
  const consultNotes = document.getElementById('consult-notes');
  const consultHelp = document.getElementById('consult-help');

  document.querySelectorAll('[data-open-consultation]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (consultNotes && savedIds.size > 0 && !consultNotes.value.trim()) {
        const names = [...savedIds].map((id) => PRODUCTS[id]?.name).filter(Boolean).join(', ');
        consultNotes.value = `Interested in: ${names}.`;
      }
      openModal(consultModal);
    });
  });

  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('consult-name');
      const emailInput = document.getElementById('consult-email');
      const nameOk = nameInput && nameInput.value.trim().length >= 2;
      const emailOk = emailInput && emailInput.checkValidity();

      nameInput.setAttribute('aria-invalid', String(!nameOk));
      emailInput.setAttribute('aria-invalid', String(!emailOk));

      if (!nameOk) {
        consultHelp.textContent = 'Enter your full name so the studio can address your brief.';
        nameInput.focus();
        return;
      }
      if (!emailOk) {
        consultHelp.textContent = 'That email address looks incomplete. Write it as name@example.com.';
        emailInput.focus();
        return;
      }
      if (!consultForm.dataset.endpoint) {
        consultHelp.textContent = 'Nothing was sent: connect the consultation endpoint in scripts/main.js to activate live studio scheduling.';
        return;
      }
      fetch(consultForm.dataset.endpoint, { method: 'POST', body: new FormData(consultForm) })
        .then((r) => {
          consultHelp.textContent = r.ok ? `Request delivered for ${nameInput.value.trim()}.` : 'Request failed. Try again shortly.';
        })
        .catch(() => {
          consultHelp.textContent = 'Network interruption. Try again shortly.';
        });
    });
  }

  /* 7. Newsletter Validation (Gate 70 honest endpoint handling) */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterInput = document.getElementById('newsletter-email');
  const newsletterHelp = document.getElementById('newsletter-help');

  if (newsletterForm && newsletterInput && newsletterHelp) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const valid = newsletterInput.checkValidity();
      newsletterInput.setAttribute('aria-invalid', String(!valid));
      if (!valid) {
        newsletterHelp.textContent = 'That address looks incomplete. Write it as name@example.com.';
        newsletterInput.focus();
        return;
      }
      if (!newsletterForm.dataset.endpoint) {
        newsletterHelp.textContent = 'Nothing was sent: newsletter endpoint is not connected yet.';
        return;
      }
      fetch(newsletterForm.dataset.endpoint, { method: 'POST', body: new FormData(newsletterForm) })
        .then((r) => {
          newsletterHelp.textContent = r.ok ? `Lookbook notes will go to ${newsletterInput.value.trim()}.` : 'Subscription could not finish. Try again.';
        })
        .catch(() => {
          newsletterHelp.textContent = 'Subscription could not finish. Try again.';
        });
    });
  }

  /* 8. Product Quick View & Saved Inquiry List */
  const qvModal = document.getElementById('quickview-modal');
  const qvTitle = document.getElementById('qv-title');
  const qvCat = document.getElementById('qv-category');
  const qvImg = document.getElementById('qv-img');
  const qvPrice = document.getElementById('qv-price');
  const qvLead = document.getElementById('qv-leadtime');
  const qvDesc = document.getElementById('qv-desc');
  const qvMat = document.getElementById('qv-materials');
  const qvDim = document.getElementById('qv-dimensions');
  const qvSaveBtn = document.getElementById('qv-save-btn');
  const bagCount = document.getElementById('bag-count');
  let currentProductId = null;

  function syncBagCount() {
    if (!bagCount) return;
    bagCount.textContent = String(savedIds.size);
    bagCount.hidden = savedIds.size === 0;
  }

  function updateQuickViewButton(id) {
    if (!qvSaveBtn) return;
    const isSaved = savedIds.has(id);
    qvSaveBtn.querySelector('span').textContent = isSaved ? 'Remove from Inquiry List' : 'Add to Inquiry List';
  }

  function openProductQuickView(id) {
    const p = PRODUCTS[id];
    if (!p || !qvModal) return;
    currentProductId = id;
    qvTitle.textContent = p.name;
    qvCat.textContent = p.category;
    qvImg.src = p.img;
    qvImg.alt = p.name;
    qvPrice.textContent = p.price;
    qvLead.textContent = p.leadtime;
    qvDesc.textContent = p.desc;
    qvMat.textContent = p.materials;
    qvDim.textContent = p.dimensions;
    updateQuickViewButton(id);
    openModal(qvModal);
  }

  document.querySelectorAll('[data-quickview]').forEach((btn) => {
    btn.addEventListener('click', () => openProductQuickView(btn.dataset.quickview));
  });

  if (qvSaveBtn) {
    qvSaveBtn.addEventListener('click', () => {
      if (!currentProductId) return;
      if (savedIds.has(currentProductId)) savedIds.delete(currentProductId);
      else savedIds.add(currentProductId);
      syncBagCount();
      updateQuickViewButton(currentProductId);
    });
  }

  /* Saved Inquiry Bag Modal */
  const bagBtn = document.getElementById('open-bag-btn');
  const bagModal = document.getElementById('bag-modal');
  const bagContents = document.getElementById('bag-contents');

  function renderBag() {
    if (!bagContents) return;
    if (savedIds.size === 0) {
      bagContents.innerHTML = `
        <div class="bag-empty">
          <p class="body-3" style="color: var(--color-ink); margin-bottom: var(--space-xs);">Your inquiry list is empty.</p>
          <p class="body-6" style="color: var(--color-muted); margin-bottom: var(--space-md);">Inspect any signature piece to add custom dimensions or finish requests.</p>
          <a class="btn-primary button-sm" href="#collections" id="bag-browse-link">Browse Curated Pieces</a>
        </div>`;
      const browseLink = document.getElementById('bag-browse-link');
      if (browseLink) browseLink.addEventListener('click', closeAllModals);
      return;
    }

    const itemsHtml = [...savedIds].map((id) => {
      const p = PRODUCTS[id];
      if (!p) return '';
      return `
        <div class="bag-item">
          <div class="bag-item__left">
            <img class="bag-item__thumb" src="${p.img}" alt="${p.name}" width="56" height="56">
            <div>
              <p class="title-4">${p.name}</p>
              <p class="caption-5" style="color: var(--color-muted);">${p.price}</p>
            </div>
          </div>
          <button class="modal-close" type="button" data-remove-bag="${p.id}" aria-label="Remove ${p.name}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>`;
    }).join('');

    bagContents.innerHTML = `
      <div class="bag-list">${itemsHtml}</div>
      <button class="btn-primary button-sm" type="button" id="bag-consult-btn" style="width: 100%;">Request Quote for Saved Pieces</button>`;

    bagContents.querySelectorAll('[data-remove-bag]').forEach((btn) => {
      btn.addEventListener('click', () => {
        savedIds.delete(btn.dataset.removeBag);
        syncBagCount();
        renderBag();
      });
    });

    const bagConsultBtn = document.getElementById('bag-consult-btn');
    if (bagConsultBtn) {
      bagConsultBtn.addEventListener('click', () => {
        const names = [...savedIds].map((id) => PRODUCTS[id]?.name).filter(Boolean).join(', ');
        if (consultNotes) consultNotes.value = `Interested in: ${names}.`;
        openModal(consultModal);
      });
    }
  }

  if (bagBtn) {
    bagBtn.addEventListener('click', () => {
      renderBag();
      openModal(bagModal);
    });
  }

  /* 9. Search Modal */
  const searchBtn = document.getElementById('open-search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('studio-search-input');
  const searchResults = document.getElementById('search-results');

  function renderSearch(query) {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();
    const hits = Object.values(PRODUCTS).filter((p) =>
      !q || `${p.name} ${p.category} ${p.materials} ${p.desc}`.toLowerCase().includes(q)
    );
    if (!hits.length) {
      searchResults.innerHTML = '<p class="body-6" style="color: var(--color-muted); padding: var(--space-md) 0;">No studio pieces match that term. Try sofa, walnut, linen, or lamp.</p>';
      return;
    }
    searchResults.innerHTML = hits.map((p) => `
      <button class="search-hit" type="button" data-search-pick="${p.id}">
        <span>
          <strong class="title-4" style="display: block;">${p.name}</strong>
          <span class="caption-5" style="color: var(--color-muted);">${p.category}</span>
        </span>
        <span class="caption-1">${p.price}</span>
      </button>`).join('');

    searchResults.querySelectorAll('[data-search-pick]').forEach((btn) => {
      btn.addEventListener('click', () => openProductQuickView(btn.dataset.searchPick));
    });
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      renderSearch('');
      openModal(searchModal);
    });
    searchInput.addEventListener('input', () => renderSearch(searchInput.value));
  }

  /* 10. Info Modal (Philosophy, Privacy, Terms, Cookies) */
  const infoModal = document.getElementById('info-modal');
  const infoTitle = document.getElementById('info-modal-title');
  const infoBody = document.getElementById('info-modal-body');
  const philosophyBtn = document.getElementById('open-philosophy-btn');

  const INFO_COPY = {
    philosophy: {
      title: 'The Qissaah Interior Philosophy',
      paragraphs: [
        'We approach architecture and furniture as a single continuous conversation. Rather than filling rooms with passing decoration, Qissaah Interior builds grounded spaces around daylight, acoustic softness, and honest timber joinery.',
        'Every custom commission begins with material samples placed in the actual orientation of your room before milling begins.'
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      paragraphs: [
        'Consultation inquiries and material requests submitted to Qissaah Interior are used strictly to prepare residential design proposals and studio scheduling.',
        'We do not sell or distribute client contact records or architectural floorplans to outside marketing brokers.'
      ]
    },
    terms: {
      title: 'Terms of Service',
      paragraphs: [
        'Bespoke furniture pieces are crafted to order in regional timber and stone workshops. Natural grain, veining, and weave variations are inherent hallmarks of solid organic materials.',
        'Lead times begin upon formal finish sign off and workshop deposit confirmation.'
      ]
    },
    cookies: {
      title: 'Cookie Settings',
      paragraphs: [
        'This static studio showcase stores your saved inquiry pieces only within active session memory and places zero third party advertising trackers on your device.'
      ]
    }
  };

  function openInfo(key) {
    const item = INFO_COPY[key];
    if (!item || !infoModal) return;
    infoTitle.textContent = item.title;
    infoBody.innerHTML = item.paragraphs.map((txt) => `<p>${txt}</p>`).join('');
    openModal(infoModal);
  }

  if (philosophyBtn) philosophyBtn.addEventListener('click', () => openInfo('philosophy'));
  document.querySelectorAll('[data-open-legal]').forEach((btn) => {
    btn.addEventListener('click', () => openInfo(btn.dataset.openLegal));
  });

  /* 11. Scroll Reveal Observer (Gate 62) */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  /* 12. Mandatory Tagline Word Reveal (AI Design Skill B11) */
  const taglineEl = document.getElementById('tagline-reveal-text');
  if (taglineEl) {
    const words = taglineEl.textContent.trim().split(/\s+/);
    taglineEl.innerHTML = words.map((w) => `<span class="tagline-word">${w}</span>`).join(' ');
    const wordSpans = Array.from(taglineEl.querySelectorAll('.tagline-word'));

    if (reducedMotion || !('IntersectionObserver' in window)) {
      wordSpans.forEach((sp) => sp.classList.add('is-lit'));
    } else {
      let ticking = false;
      let active = false;
      let maxLitCount = 0;

      const updateWords = () => {
        ticking = false;
        const rect = taglineEl.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const progress = Math.min(1, Math.max(0, (vh * 0.88 - rect.top) / (vh * 0.42)));
        const litCount = Math.ceil(progress * wordSpans.length);
        if (litCount > maxLitCount) {
          maxLitCount = litCount;
        }
        wordSpans.forEach((sp, idx) => sp.classList.toggle('is-lit', idx < maxLitCount));
      };

      const onScroll = () => {
        if (!active || ticking) return;
        ticking = true;
        requestAnimationFrame(updateWords);
      };

      const tagObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          active = entry.isIntersecting;
          if (active) updateWords();
        });
      }, { threshold: 0.05 });

      tagObserver.observe(taglineEl);
      window.addEventListener('scroll', onScroll, { passive: true });
      updateWords();
    }
  }
})();
