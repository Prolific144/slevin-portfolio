/* ==========================================================================
   Slevin Onono — Portfolio
   Application script: navigation, hero effects, skills, projects, modals.
   ========================================================================== */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initAOS();
    initCustomCursor();
    initMobileMenu();
    initHeaderScroll();
    initScrollProgress();
    initActiveNavLink();
    initTypingAnimation();
    initHeroImageRotator();
    initLazyImages();
    initContactModal();
    initDynamicEmail();
    initPortfolio();
    initBackToTop();
    initSkillBars();
    initSkillsPreview();
    initDarkMode();
    initSmoothScroll();
    initRippleButtons();
    initContactForm();
  }

  /* ------------------------------------------------------------------ */
  /* AOS (scroll animations)                                            */
  /* ------------------------------------------------------------------ */
  function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic',
      disable: prefersReducedMotion,
    });
  }

  /* ------------------------------------------------------------------ */
  /* Custom cursor (desktop / pointer devices only)                     */
  /* ------------------------------------------------------------------ */
  function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    let raf = null;
    document.addEventListener('mousemove', (e) => {
      cursor.style.opacity = '1';
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });
    });

    document.addEventListener('mouseleave', () => (cursor.style.opacity = '0'));

    const interactiveSelector = 'a, button, .portfolio-item, .skill-item, input, textarea';
    document.body.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) cursor.classList.add('active');
    });
    document.body.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) cursor.classList.remove('active');
    });
  }

  /* ------------------------------------------------------------------ */
  /* Mobile menu                                                        */
  /* ------------------------------------------------------------------ */
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const navLinks = document.querySelector('.nav-links');
    const backdrop = document.getElementById('nav-backdrop');

    if (!menuToggle || !closeMenu || !navLinks) return;

    function openMenu() {
      navLinks.classList.add('active');
      navLinks.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-expanded', 'true');
      backdrop?.classList.add('active');
      document.body.style.overflow = 'hidden';
      closeMenu.focus();
    }

    function closeMenuFn() {
      navLinks.classList.remove('active');
      navLinks.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-expanded', 'false');
      backdrop?.classList.remove('active');
      document.body.style.overflow = '';
      menuToggle.focus();
    }

    menuToggle.addEventListener('click', openMenu);
    closeMenu.addEventListener('click', closeMenuFn);
    backdrop?.addEventListener('click', closeMenuFn);

    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', closeMenuFn);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) closeMenuFn();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Sticky header + scroll progress                                    */
  /* ------------------------------------------------------------------ */
  function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      bar.style.width = progress + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------ */
  /* Highlight active nav link based on visible section                 */
  /* ------------------------------------------------------------------ */
  function initActiveNavLink() {
    const sections = document.querySelectorAll('main section[id], footer[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navAnchors.length) return;

    const map = new Map();
    navAnchors.forEach((a) => map.set(a.getAttribute('href').substring(1), a));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = map.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ------------------------------------------------------------------ */
  /* Typing animation for hero role text                                */
  /* ------------------------------------------------------------------ */
  function initTypingAnimation() {
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    if (!typedTextSpan || !cursorSpan) return;

    const textArray = ['Statistician', 'Web Developer', 'Data Storyteller', 'Analytical Strategist', 'Tax Consultant'];
    const typingDelay = 90;
    const erasingDelay = 45;
    const newTextDelay = 1800;

    if (prefersReducedMotion) {
      typedTextSpan.textContent = textArray[0];
      cursorSpan.style.display = 'none';
      return;
    }

    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        cursorSpan.classList.add('typing');
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        cursorSpan.classList.remove('typing');
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        cursorSpan.classList.add('typing');
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        cursorSpan.classList.remove('typing');
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(type, typingDelay + 600);
      }
    }

    setTimeout(type, newTextDelay);
  }

  /* ------------------------------------------------------------------ */
  /* Hero profile photo rotator (fade / glass / shake)                  */
  /* ------------------------------------------------------------------ */
  function initHeroImageRotator() {
    const profileImage = document.querySelector('.hero-image img');
    const imageWrapper = document.querySelector('.image-wrapper');
    const fallbackImage = 'static/images/profile.jpg';
    if (!profileImage || !imageWrapper || prefersReducedMotion) return;

    let currentImage = 1;
    profileImage.addEventListener('error', () => {
      if (profileImage.src.indexOf(fallbackImage) === -1) profileImage.src = fallbackImage;
    });

    setInterval(() => {
      imageWrapper.classList.add('glass-effect', 'fade-out');
      setTimeout(() => {
        profileImage.src = currentImage === 1 ? 'static/images/profile2.jpg' : 'static/images/profile.jpg';
        currentImage = currentImage === 1 ? 2 : 1;
        imageWrapper.classList.remove('fade-out');
        imageWrapper.classList.add('shake');
        setTimeout(() => {
          imageWrapper.classList.remove('glass-effect', 'shake');
        }, 500);
      }, 500);
    }, 8000);
  }

  /* ------------------------------------------------------------------ */
  /* Lazy-load images with IntersectionObserver                         */
  /* ------------------------------------------------------------------ */
  function initLazyImages() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    if (!lazyImages.length) return;

    if (!('IntersectionObserver' in window)) {
      lazyImages.forEach((img) => img.classList.add('loaded'));
      return;
    }

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '80px' }
    );

    lazyImages.forEach((img) => {
      if (img.complete) img.classList.add('loaded');
      imageObserver.observe(img);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Generic modal open/close helpers (shared, with focus trapping)     */
  /* ------------------------------------------------------------------ */
  let lastFocusedElement = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('input, textarea, button, a[href]');
    (focusable || modal).focus();
    trapFocus(modal);
  }

  function closeModalEl(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function trapFocus(modal) {
    const focusableEls = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableEls.length) return;
    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];

    function handler(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    modal.addEventListener('keydown', handler);
  }

  /* ------------------------------------------------------------------ */
  /* Contact modal                                                      */
  /* ------------------------------------------------------------------ */
  function initContactModal() {
    const contactModal = document.getElementById('contactModal');
    const contactButtons = document.querySelectorAll('.contact-btn');
    const closeContactModal = contactModal?.querySelector('.close-modal');
    if (!contactModal || !contactButtons.length) return;

    contactButtons.forEach((button) => {
      button.addEventListener('click', () => openModal(contactModal));
    });

    closeContactModal?.addEventListener('click', () => closeModalEl(contactModal));

    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModalEl(contactModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && contactModal.classList.contains('show')) closeModalEl(contactModal);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Contact form (client-side validation + graceful mailto fallback)   */
  /* ------------------------------------------------------------------ */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        status.textContent = 'Please fill in every field before sending.';
        status.className = 'form-status error';
        return;
      }
      if (!emailPattern.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.className = 'form-status error';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Opening your email client…';

      // No backend is configured for this static site, so the message is
      // handed off to the visitor's email client as a mailto link. This
      // keeps the flow fully functional without requiring a server.
      const to = 'nekoslevin@gmail.com';
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

      status.textContent = 'Your email client should now open with your message ready to send.';
      status.className = 'form-status success';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        form.reset();
      }, 1200);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Dynamic email (basic spam obfuscation)                             */
  /* ------------------------------------------------------------------ */
  function initDynamicEmail() {
    const emailUser = 'nekoslevin';
    const emailDomain = 'gmail.com';
    const email = `${emailUser}@${emailDomain}`;

    const aboutEmailInput = document.getElementById('about-email');
    if (aboutEmailInput) aboutEmailInput.placeholder = email;

    const footerEmail = document.getElementById('footer-email');
    if (footerEmail) {
      footerEmail.href = `mailto:${email}`;
      footerEmail.textContent = email;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Portfolio: render, filter, and project modal                       */
  /* ------------------------------------------------------------------ */
  function initPortfolio() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const projectModal = document.getElementById('projectModal');
    const closeProjectModal = projectModal?.querySelector('.close-modal');
    const fallbackImage = 'static/images/profile.jpg';
    let projectsData = [];

    if (!portfolioGrid) return;

    function webpSrc(jpgPath) {
      return jpgPath.replace(/\.(jpe?g|png)$/i, '.webp');
    }

    function renderProjects(projects) {
      portfolioGrid.innerHTML = '';

      if (!projects.length) {
        portfolioGrid.innerHTML = '<p class="error-message">No projects to display yet — check back soon.</p>';
        return;
      }

      projects.forEach((project, index) => {
        const item = document.createElement('article');
        item.className = 'portfolio-item';
        item.style.animationDelay = `${Math.min(index, 6) * 60}ms`;
        item.setAttribute('data-category', project.category);
        item.setAttribute('data-project-id', project.id);

        const hasLive = project.liveLink && project.liveLink !== '#';
        const hasCode = project.codeLink && project.codeLink !== '#';
        const techPreview = project.technologies.slice(0, 3);

        item.innerHTML = `
          <div class="portfolio-thumb">
            <picture>
              <source srcset="${webpSrc(project.image)}" type="image/webp">
              <img src="${project.image}" alt="${escapeHtml(project.title)} preview" loading="lazy" width="400" height="220">
            </picture>
            <span class="portfolio-category-tag">${labelForCategory(project.category)}</span>
          </div>
          <div class="portfolio-body">
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <div class="portfolio-tech-preview">
              ${techPreview.map((t) => `<span>${escapeHtml(t)}</span>`).join('')}
            </div>
            <div class="portfolio-footer-row">
              <div class="portfolio-link">
                ${hasLive ? `<a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" aria-label="View live project: ${escapeHtml(project.title)}"><i class="fas fa-external-link-alt" aria-hidden="true"></i></a>` : ''}
                ${hasCode ? `<a href="${project.codeLink}" target="_blank" rel="noopener noreferrer" aria-label="View source code for ${escapeHtml(project.title)}"><i class="fas fa-code" aria-hidden="true"></i></a>` : ''}
              </div>
              <button type="button" class="view-details-btn" aria-label="View details for ${escapeHtml(project.title)}">Details <i class="fas fa-arrow-right" aria-hidden="true"></i></button>
            </div>
          </div>
        `;

        const img = item.querySelector('img');
        img.addEventListener('error', () => {
          if (img.src.indexOf(fallbackImage) === -1) img.src = fallbackImage;
        });

        portfolioGrid.appendChild(item);
      });

      portfolioGrid.querySelectorAll('.view-details-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
          const projectId = e.target.closest('.portfolio-item').getAttribute('data-project-id');
          const project = projectsData.find((p) => p.id === projectId);
          if (project && projectModal) openProjectModal(project);
        });
      });
    }

    function openProjectModal(project) {
      const modalImage = document.getElementById('projectModalImage');
      modalImage.src = project.image || fallbackImage;
      modalImage.alt = `${project.title} preview`;
      modalImage.addEventListener(
        'error',
        () => {
          if (modalImage.src.indexOf(fallbackImage) === -1) modalImage.src = fallbackImage;
        },
        { once: true }
      );

      document.getElementById('projectModalTitle').textContent = project.title;
      document.getElementById('projectModalDescription').textContent = project.description;

      const techList = document.getElementById('projectModalTechnologies');
      techList.innerHTML = project.technologies.map((tech) => `<li>${escapeHtml(tech)}</li>`).join('');

      const liveLink = document.getElementById('projectModalLiveLink');
      const hasLive = project.liveLink && project.liveLink !== '#';
      liveLink.href = project.liveLink || '#';
      liveLink.style.display = hasLive ? 'inline-flex' : 'none';

      const codeLink = document.getElementById('projectModalCodeLink');
      const hasCode = project.codeLink && project.codeLink !== '#';
      codeLink.href = project.codeLink || '#';
      codeLink.style.display = hasCode ? 'inline-flex' : 'none';

      openModal(document.getElementById('projectModal'));
    }

    function labelForCategory(category) {
      const map = { data: 'Data Analysis', financial: 'Financial Analytics', tax: 'Tax Services' };
      return map[category] || category;
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function initializeFilters() {
      filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
          filterButtons.forEach((btn) => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
          });
          button.classList.add('active');
          button.setAttribute('aria-pressed', 'true');

          const filterValue = button.getAttribute('data-filter');
          document.querySelectorAll('.portfolio-item').forEach((item) => {
            const match = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
            item.classList.toggle('is-hidden', !match);
          });
        });
      });
    }

    fetch('projects.json')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((projects) => {
        projectsData = projects;
        renderProjects(projects);
        initializeFilters();
      })
      .catch(() => {
        portfolioGrid.innerHTML =
          '<p class="error-message">Unable to load projects right now. Please refresh the page or try again shortly.</p>';
      });

    if (closeProjectModal && projectModal) {
      closeProjectModal.addEventListener('click', () => closeModalEl(projectModal));
      projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeModalEl(projectModal);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('show')) closeModalEl(projectModal);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Back to top                                                        */
  /* ------------------------------------------------------------------ */
  function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

    window.addEventListener(
      'scroll',
      () => backToTopButton.classList.toggle('active', window.pageYOffset > 400),
      { passive: true }
    );

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Linear skill bars                                                  */
  /* ------------------------------------------------------------------ */
  function initSkillBars() {
    const skillsSection = document.querySelector('.skills-section');
    const bars = document.querySelectorAll('.progress-line');
    if (!skillsSection || !bars.length) return;

    const targetWidth = { design: '95%', frontend: '90%', backend: '85%' };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          bars.forEach((bar) => {
            const span = bar.querySelector('span');
            const key = ['design', 'frontend', 'backend'].find((k) => bar.classList.contains(k));
            const width = targetWidth[key] || '80%';
            span.style.width = width;
            bar.setAttribute('aria-valuenow', parseInt(width, 10));
          });
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(skillsSection);
  }

  /* ------------------------------------------------------------------ */
  /* Circular skill chips + modal                                       */
  /* ------------------------------------------------------------------ */
  function initSkillsPreview() {
    const skillItems = document.querySelectorAll('.skill-item');
    const skillModal = document.getElementById('skill-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalPercentage = document.getElementById('modal-percentage');
    const modalDetails = document.getElementById('modal-details');
    const closeSkillModal = skillModal?.querySelector('.close-modal');
    const closeSkillModalBtn = skillModal?.querySelector('[data-close-skill]');
    if (!skillItems.length) return;

    const circumference = 226.2; // 2 * PI * r(36)

    const circularObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target;
          const percentage = parseInt(item.getAttribute('data-percentage'), 10);
          const progressCircle = item.querySelector('.progress-circle');
          const percentageText = item.querySelector('.percentage-text');
          const offset = circumference * (1 - percentage / 100);

          progressCircle.style.strokeDashoffset = offset;
          progressCircle.setAttribute('aria-valuenow', percentage);

          if (prefersReducedMotion) {
            percentageText.textContent = `${percentage}%`;
            item.setAttribute('data-current-percentage', percentage);
          } else {
            let current = 0;
            const interval = setInterval(() => {
              if (current <= percentage) {
                percentageText.textContent = `${current}%`;
                item.setAttribute('data-current-percentage', current);
                current++;
              } else {
                clearInterval(interval);
              }
            }, 14);
          }

          circularObserver.unobserve(item);
        });
      },
      { threshold: 0.5 }
    );

    function showSkillModal(item) {
      const percentage = parseInt(item.getAttribute('data-percentage'), 10);
      const skillName = item.querySelector('span').textContent;
      const details = item.getAttribute('data-details');
      if (!modalTitle || !modalPercentage || !modalDetails || !skillModal) return;

      modalTitle.textContent = skillName;
      modalPercentage.textContent = `${item.getAttribute('data-current-percentage') || percentage}% Proficiency`;
      modalDetails.textContent = details;
      openModal(skillModal);
    }

    skillItems.forEach((item) => {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      circularObserver.observe(item);

      item.addEventListener('click', () => showSkillModal(item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showSkillModal(item);
        }
      });
    });

    function closeSkill() {
      closeModalEl(skillModal);
    }

    closeSkillModal?.addEventListener('click', closeSkill);
    closeSkillModalBtn?.addEventListener('click', closeSkill);
    skillModal?.addEventListener('click', (e) => {
      if (e.target === skillModal) closeSkill();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && skillModal?.classList.contains('show')) closeSkill();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Dark mode                                                          */
  /* ------------------------------------------------------------------ */
  function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (!darkModeToggle) return;

    function applyMode(isDark) {
      document.body.classList.toggle('dark-mode', isDark);
      darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
      darkModeToggle.setAttribute('aria-pressed', String(isDark));
      darkModeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    let stored = null;
    try {
      stored = localStorage.getItem('darkMode');
    } catch (e) {
      /* localStorage unavailable (private mode, etc.) — fall back silently */
    }

    applyMode(stored === 'enabled');

    darkModeToggle.addEventListener('click', () => {
      const isDark = !document.body.classList.contains('dark-mode');
      applyMode(isDark);
      try {
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
      } catch (e) {
        /* ignore write failures */
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Smooth scrolling for in-page anchors                                */
  /* ------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.length < 2) return;
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        window.scrollTo({
          top: targetElement.offsetTop - headerHeight,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
        history.pushState(null, '', targetId);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Ripple button micro-interaction                                    */
  /* ------------------------------------------------------------------ */
  function initRippleButtons() {
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn.ripple');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`);
      btn.classList.remove('rippling');
      // Force reflow so the animation can restart on rapid clicks
      void btn.offsetWidth;
      btn.classList.add('rippling');
    });
  }

  /* ------------------------------------------------------------------ */
  /* CV download tracking (Cloudflare Web Analytics, if present)        */
  /* ------------------------------------------------------------------ */
  window.trackCVDownload = function trackCVDownload() {
    if (typeof window.cfAnalytics !== 'undefined' && window.cfAnalytics.logEvent) {
      window.cfAnalytics.logEvent({ name: 'cv_download', properties: { file: 'Slevin_Resume.pdf' } });
    }
  };
})();
