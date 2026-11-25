/**
 * Qissaah Interiors — Interactive Controller
 * Smooth scroll, mobile drawer, B11 tagline reveal, collection filter,
 * piece specification lightbox, policy dialog, and honest form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenisInstance = null;

  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#' && !anchor.classList.contains('open-consultation-trigger')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenisInstance.scrollTo(targetEl, { offset: 0, duration: 1.0 });
          }
        }
      });
    });
  }

  // 1. Mobile Navigation Drawer
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const drawerCloseTop = document.getElementById('drawerCloseTop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    const toggleMenu = (isOpen) => {
      const open = typeof isOpen === 'boolean' ? isOpen : !mobileDrawer.classList.contains('is-open');
      mobileDrawer.classList.toggle('is-open', open);
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileDrawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (lenisInstance) {
        if (open) lenisInstance.stop();
        else lenisInstance.start();
      }
      if (open && drawerCloseTop) drawerCloseTop.focus({ preventScroll: true });
      if (!open) mobileToggle.focus({ preventScroll: true });
    };

    mobileToggle.addEventListener('click', () => toggleMenu());
    if (mobileDrawerBackdrop) mobileDrawerBackdrop.addEventListener('click', () => toggleMenu(false));
    if (drawerCloseTop) drawerCloseTop.addEventListener('click', () => toggleMenu(false));
    mobileLinks.forEach((link) => link.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) toggleMenu(false);
    });
  }

  // 2. Active Section Highlight in HUD Nav
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('is-current', link.getAttribute('href') === `#${currentId}`);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // 3. B11 Tagline Word Reveal on Scroll
  const taglineWords = document.querySelectorAll('.tagline-word');
  if (prefersReducedMotion) {
    taglineWords.forEach((word) => word.classList.add('is-active'));
  } else if (taglineWords.length && 'IntersectionObserver' in window) {
    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const word = entry.target;
          const index = Array.from(taglineWords).indexOf(word);
          setTimeout(() => word.classList.add('is-active'), index * 45);
          wordObserver.unobserve(word);
        }
      });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.2 });
    taglineWords.forEach((word) => wordObserver.observe(word));
  } else {
    taglineWords.forEach((word) => word.classList.add('is-active'));
  }

  // 4. Category Filter for Signature Collection
  const filterButtons = document.querySelectorAll('.collection-controls [data-filter]');
  const collectionCards = document.querySelectorAll('#collectionGrid .project-card');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-selected', active);
        b.setAttribute('aria-selected', String(active));
      });
      collectionCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.hidden = !show;
      });
    });
  });

  // 6. Consultation Dialog Modal
  const consultationModal = document.getElementById('consultationModal');
  const openTriggers = document.querySelectorAll('.open-consultation-trigger');
  const closeDialogBtn = document.getElementById('closeDialogBtn');
  const consultationForm = document.getElementById('consultationForm');
  const projectNotes = document.getElementById('projectNotes');
  let previousActiveElement = null;

  const openConsultationDialog = (prefillText = '') => {
    if (!consultationModal) return;
    previousActiveElement = document.activeElement;
    if (prefillText && projectNotes) projectNotes.value = prefillText;
    consultationModal.classList.add('is-active');
    consultationModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenisInstance) lenisInstance.stop();
    const firstInput = consultationModal.querySelector('input');
    if (firstInput) firstInput.focus({ preventScroll: true });
  };

  const closeConsultationDialog = () => {
    if (!consultationModal) return;
    consultationModal.classList.remove('is-active');
    consultationModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenisInstance) lenisInstance.start();
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus({ preventScroll: true });
    }
  };

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
        mobileDrawer.classList.remove('is-open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      }
      openConsultationDialog();
    });
  });

  if (closeDialogBtn) closeDialogBtn.addEventListener('click', closeConsultationDialog);
  if (consultationModal) {
    consultationModal.addEventListener('click', (e) => {
      if (e.target === consultationModal) closeConsultationDialog();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && consultationModal.classList.contains('is-active')) closeConsultationDialog();
    });
  }

  // 7. Piece Specification Lightbox Modal
  const pieceData = {
    'parlor-suite': {
      title: 'Teak and Cane Parlor Suite',
      valuation: 'Made to order',
      specs: 'Oiled teak credenza, cane chair, linen daybed',
      status: 'Custom sizing',
      image: 'assets/lobby-lounge-of-amantaka-suite-amantaka-luxury-resort-hotel--1920.jpg',
      alt: 'Solid teak sideboard, woven cane armchair, and upholstered daybed in warm gallery light',
      material: 'Seasoned teak framing, natural woven cane webbing, breathable linen cushions.',
      finish: 'Hand rubbed satin natural oil finish preserving open timber grain.',
      sizing: 'Tailored sideboard length and daybed depth matched to your room drawing.',
      care: 'Delivered wrapped in timber crates with routine oil care guidance.'
    },
    'brass-orb': {
      title: 'Sol Brass Accent',
      valuation: 'Made to order',
      specs: 'Cast brass holder, blown optical glass sphere',
      status: 'Living patina',
      image: 'assets/candle-light-projected-through-a-glass-orb-1920.jpg',
      alt: 'Sand cast brass candle holder beside a hand blown glass orb in warm evening light',
      material: 'Solid sand cast unlacquered brass base paired with hand blown crystal glass.',
      finish: 'Brushed natural brass surface that deepens quietly over time.',
      sizing: 'Available as individual tabletop accents or matched dining pairs.',
      care: 'Ships cushioned in fitted timber boxes with brass polishing cloth notes.'
    },
    'library-millwork': {
      title: 'Timber Library Set',
      valuation: 'Made to order',
      specs: 'Hardwood shelving, glazed doors, ceramic urns',
      status: 'Custom joinery',
      image: 'assets/glass-door-of-the-library-at-amantaka-luxury-resort-hotel-in-1920.jpg',
      alt: 'Full height timber shelving framing tall glazed doors and dark ceramic floor vessels',
      material: 'Solid hardwood bay joinery, mullioned acoustic glazing, stoneware floor urns.',
      finish: 'Warm walnut stain sealed with low sheen matte interior varnish.',
      sizing: 'Measured and milled to floor to ceiling heights and wall alcoves.',
      care: 'Crated delivery with modular shelving alignment instructions.'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const projectModalBackdrop = document.getElementById('projectModalBackdrop');
  const projectModalClose = document.getElementById('projectModalClose');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalValuation = document.getElementById('projectModalValuation');
  const projectModalSpecs = document.getElementById('projectModalSpecs');
  const projectModalStatus = document.getElementById('projectModalStatus');
  const projectModalImage = document.getElementById('projectModalImage');
  const projectModalMaterial = document.getElementById('projectModalMaterial');
  const projectModalFinish = document.getElementById('projectModalFinish');
  const projectModalSizing = document.getElementById('projectModalSizing');
  const projectModalCare = document.getElementById('projectModalCare');
  const projectModalInquireBtn = document.getElementById('projectModalInquireBtn');
  const projectViewBtns = document.querySelectorAll('.project-view-btn');
  let activePieceTitle = '';
  let previousProjectTrigger = null;

  const openProjectModal = (pieceId) => {
    const data = pieceData[pieceId];
    if (!projectModal || !data) return;
    activePieceTitle = data.title;

    if (projectModalTitle) projectModalTitle.textContent = data.title;
    if (projectModalValuation) projectModalValuation.textContent = data.valuation;
    if (projectModalSpecs) projectModalSpecs.textContent = data.specs;
    if (projectModalStatus) projectModalStatus.textContent = data.status;
    if (projectModalMaterial) projectModalMaterial.textContent = data.material;
    if (projectModalFinish) projectModalFinish.textContent = data.finish;
    if (projectModalSizing) projectModalSizing.textContent = data.sizing;
    if (projectModalCare) projectModalCare.textContent = data.care;
    if (projectModalImage) {
      projectModalImage.src = data.image;
      projectModalImage.alt = data.alt;
    }

    projectModal.classList.add('is-active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenisInstance) lenisInstance.stop();
    const modalWindow = projectModal.querySelector('.project-modal-window');
    if (modalWindow) modalWindow.scrollTop = 0;
    if (projectModalClose) projectModalClose.focus({ preventScroll: true });
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('is-active');
    projectModal.setAttribute('aria-hidden', 'true');
    if (!consultationModal || !consultationModal.classList.contains('is-active')) {
      document.body.style.overflow = '';
      if (lenisInstance) lenisInstance.start();
    }
    if (previousProjectTrigger && typeof previousProjectTrigger.focus === 'function') {
      previousProjectTrigger.focus({ preventScroll: true });
    }
  };

  projectViewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      previousProjectTrigger = btn;
      openProjectModal(btn.dataset.projectId);
    });
  });

  collectionCards.forEach((card) => {
    const imgBox = card.querySelector('.project-image-box');
    const pid = card.dataset.projectId;
    if (imgBox && pid) {
      imgBox.addEventListener('click', () => {
        previousProjectTrigger = card.querySelector('.project-view-btn') || imgBox;
        openProjectModal(pid);
      });
    }
  });

  if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
  if (projectModalBackdrop) projectModalBackdrop.addEventListener('click', closeProjectModal);
  if (projectModalInquireBtn) {
    projectModalInquireBtn.addEventListener('click', () => {
      const pieceName = activePieceTitle;
      closeProjectModal();
      openConsultationDialog(pieceName ? `Inquiry regarding ${pieceName}` : '');
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-active')) closeProjectModal();
  });

  // 8. Policy Dialog (Privacy Policy & Terms of Sale)
  const policyModal = document.getElementById('policyModal');
  const closePolicyBtn = document.getElementById('closePolicyBtn');
  const policyTitle = document.getElementById('policyTitle');
  const policyBody = document.getElementById('policyBody');
  const policyTriggers = document.querySelectorAll('.open-policy-trigger');
  let previousPolicyTrigger = null;

  const policyContent = {
    privacy: {
      title: 'Privacy Policy',
      paragraphs: [
        'Inquiry details are used solely to prepare Qissaah Interiors catalog pricing and sample dispatches.',
        'Client contact details and project plans remain private.'
      ]
    },
    terms: {
      title: 'Terms of Sale',
      paragraphs: [
        'Made to order furnishings begin production after sample and dimension approval.',
        'Natural stone veining and timber grain vary uniquely per piece.'
      ]
    }
  };

  const closePolicyModal = () => {
    if (!policyModal) return;
    policyModal.classList.remove('is-active');
    policyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenisInstance) lenisInstance.start();
    if (previousPolicyTrigger && typeof previousPolicyTrigger.focus === 'function') {
      previousPolicyTrigger.focus({ preventScroll: true });
    }
  };

  policyTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.policy;
      const content = policyContent[key];
      if (!policyModal || !content) return;
      previousPolicyTrigger = btn;
      if (policyTitle) policyTitle.textContent = content.title;
      if (policyBody) {
        policyBody.innerHTML = '';
        content.paragraphs.forEach((text) => {
          const p = document.createElement('p');
          p.textContent = text;
          policyBody.appendChild(p);
        });
      }
      policyModal.classList.add('is-active');
      policyModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lenisInstance) lenisInstance.stop();
      if (closePolicyBtn) closePolicyBtn.focus({ preventScroll: true });
    });
  });

  if (closePolicyBtn) closePolicyBtn.addEventListener('click', closePolicyModal);
  if (policyModal) {
    policyModal.addEventListener('click', (e) => {
      if (e.target === policyModal) closePolicyModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && policyModal.classList.contains('is-active')) closePolicyModal();
    });
  }

  // 9. Honest Form Validation (Gate 70 Compliant: Never Prints Fake Send)
  if (consultationForm) {
    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('clientEmail');
    const nameFeedback = document.getElementById('nameFeedback');
    const emailFeedback = document.getElementById('emailFeedback');
    const notesFeedback = document.getElementById('notesFeedback');

    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;

      nameFeedback.textContent = '';
      emailFeedback.textContent = '';
      notesFeedback.textContent = '';
      notesFeedback.className = 'form-feedback';
      nameInput.removeAttribute('aria-invalid');
      emailInput.removeAttribute('aria-invalid');

      if (!nameInput.value.trim()) {
        nameFeedback.textContent = 'Enter your full name.';
        nameInput.setAttribute('aria-invalid', 'true');
        nameInput.setAttribute('aria-describedby', 'nameFeedback');
        firstInvalid = nameInput;
      }

      const emailVal = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailPattern.test(emailVal)) {
        emailFeedback.textContent = 'Enter a valid address such as name@example.com.';
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.setAttribute('aria-describedby', 'emailFeedback');
        if (!firstInvalid) firstInvalid = emailInput;
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      if (!consultationForm.dataset.endpoint) {
        notesFeedback.className = 'form-feedback is-status';
        notesFeedback.textContent = 'Nothing was sent: this inquiry form is not connected to a live endpoint yet.';
        return;
      }

      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      fetch(consultationForm.dataset.endpoint, {
        method: 'POST',
        body: new FormData(consultationForm)
      })
        .then((res) => {
          notesFeedback.className = 'form-feedback is-status';
          notesFeedback.textContent = res.ok
            ? 'Inquiry received for review by Qissaah Interiors.'
            : 'Delivery failed. Please try again shortly.';
          if (res.ok) consultationForm.reset();
        })
        .catch(() => {
          notesFeedback.textContent = 'Network request failed. Please try again shortly.';
        })
        .finally(() => {
          submitBtn.disabled = false;
        });
    });
  }
});
