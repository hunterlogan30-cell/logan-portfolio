/**
 * LOGAN O'NEILL — GRAPHIC DESIGN PORTFOLIO
 * High-Performance Native Stacking Cards & Interactive Mechanics
 */

// Immediate scroll position management before layout
(function() {
  try {
    const isReturning = sessionStorage.getItem('portfolio_is_returning') === 'true';
    const savedY = sessionStorage.getItem('portfolio_return_scrollY');
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (isReturning && savedY) {
      const targetY = parseFloat(savedY);
      if (!isNaN(targetY)) {
        window.scrollTo(0, targetY);
      }
    } else {
      // Default visit or refresh: start at top on LOGAN O'NEILL hero
      window.scrollTo(0, 0);
    }
  } catch (err) {}
})();

document.addEventListener('DOMContentLoaded', () => {

  // 1. Smooth Navigation Anchor Scrolling (Native instant wheel/trackpad, smooth on click)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 2. Custom Fluid Cursor & Magnetic Elements
  const cursorDot = document.getElementById('customCursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }
  }, { passive: true });

  function renderCursor() {
    followerX += (mouseX - followerX) * 0.2;
    followerY += (mouseY - followerY) * 0.2;
    if (cursorFollower) {
      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();
  document.addEventListener('mouseleave', () => {
    if (cursorDot) cursorDot.style.opacity = '0';
    if (cursorFollower) cursorFollower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (cursorDot) cursorDot.style.opacity = '1';
    if (cursorFollower) cursorFollower.style.opacity = '1';
  });

  // Universal Hover states and Magnetic Pull Engine
  function bindMagneticAndCursor(scope = document) {
    const interactiveEls = scope.querySelectorAll('a, button, .email-copy-pill, .back-to-top, [data-magnetic]');
    interactiveEls.forEach((el) => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    const magneticEls = scope.querySelectorAll('[data-magnetic], .card-action-btn, .cs-back-btn, .cs-back-btn-large, .email-copy-pill, .back-to-top');
    magneticEls.forEach((el) => {
      if (el.dataset.magneticBound) return;
      el.dataset.magneticBound = 'true';
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { el.style.transition = ''; }, 400);
      });
    });
  }
  bindMagneticAndCursor();

  // 3. Header Scroll Glassmorphic Background & Full Navigation Highlights
  const siteHeader = document.getElementById('siteHeader');
  const navItems = [
    { id: 'about', section: document.getElementById('about'), link: document.querySelector('.nav-link[href="#about"]') },
    { id: 'projects', section: document.getElementById('projects'), link: document.querySelector('.nav-link[href="#projects"]') },
    { id: 'contact', section: document.getElementById('contact'), link: document.querySelector('.nav-link[href="#contact"]') }
  ];

  function handleScroll() {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }

    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const atBottom = (windowH + scrollY >= docH - 80);

    let activeLink = null;

    if (atBottom) {
      activeLink = document.querySelector('.nav-link[href="#contact"]');
    } else {
      // Find section whose content is currently occupying the active viewing zone
      for (const item of navItems) {
        if (!item.section) continue;
        const rect = item.section.getBoundingClientRect();
        // Section is considered active when its top is above 55% of the viewport and its bottom is still below 15%
        if (rect.top <= windowH * 0.55 && rect.bottom >= windowH * 0.15) {
          activeLink = item.link;
        }
      }
    }

    navItems.forEach(item => {
      if (item.link) {
        if (item.link === activeLink) {
          item.link.classList.add('active');
        } else {
          item.link.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Instant active link update on click
  navItems.forEach(item => {
    if (item.link) {
      item.link.addEventListener('click', () => {
        navItems.forEach(i => i.link?.classList.remove('active'));
        item.link.classList.add('active');
      });
    }
  });

  // 4. GSAP Page Transitions: Fade in & fade out depending on if each page is in frame
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero title initial entrance
    gsap.from('.title-line', {
      y: 60,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
      ease: 'power4.out',
      delay: 0.15
    });

    // Nav initial entrance
    gsap.from('.site-nav a, .brand-title', {
      y: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.3
    });

    // Page sections fade in & fade out based on viewport visibility
    const pages = [
      { id: 'hero', trigger: '#hero', target: '.hero-content' },
      { id: 'about', trigger: '#about', target: '.about-container' },
      { id: 'projects', trigger: '#projects', target: '.stack-pinned-wrapper' },
      { id: 'contact', trigger: '#contact', target: '.contact-container' }
    ];

    pages.forEach((page) => {
      const triggerEl = document.querySelector(page.trigger);
      const targetEl = document.querySelector(page.target);
      if (!triggerEl || !targetEl) return;

      // Set initial states: Hero starts visible, other sections start hidden until scrolled into view
      if (page.id !== 'hero') {
        gsap.set(targetEl, { opacity: 0, y: 36 });
      }

      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top 82%',
        end: 'bottom 18%',
        onEnter: () => {
          gsap.to(targetEl, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        },
        onLeave: () => {
          gsap.to(targetEl, {
            opacity: 0,
            y: -28,
            duration: 0.65,
            ease: 'power3.inOut',
            overwrite: 'auto'
          });
        },
        onEnterBack: () => {
          gsap.to(targetEl, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        },
        onLeaveBack: () => {
          if (page.id === 'hero') {
            gsap.to(targetEl, { opacity: 1, y: 0, duration: 0.5, overwrite: 'auto' });
          } else {
            gsap.to(targetEl, {
              opacity: 0,
              y: 36,
              duration: 0.65,
              ease: 'power3.inOut',
              overwrite: 'auto'
            });
          }
        }
      });
    });

    // Refresh ScrollTrigger calculations after initial layout rendering
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // 5. RESPONSIVE STACKING CARDS ENGINE
  // "the more you scroll the website stays on the same level but more cards
  // slide up on top of one another then once they all load you continue scrolling"
  const deckCards = document.querySelectorAll('.deck-card');

  function updateDeckCards() {
    const triggerY = window.innerHeight * 0.4;
    let activeIdx = 0;

    deckCards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      if (rect.top <= triggerY + (idx * 24)) {
        activeIdx = idx;
      }
    });

    // Apply real physical card deck depth to cards under the top card
    deckCards.forEach((card, idx) => {
      if (idx < activeIdx) {
        const diff = activeIdx - idx;
        card.style.transform = `scale(${1 - diff * 0.03}) translateY(${diff * -6}px)`;
        card.style.filter = `brightness(${1 - diff * 0.12})`;
      } else {
        card.style.transform = 'scale(1) translateY(0)';
        card.style.filter = 'brightness(1)';
      }
    });
  }

  window.addEventListener('scroll', updateDeckCards, { passive: true });
  updateDeckCards();

  // 6. Case Study Full-Page Turn System & Template Data Engine
  const projectsData = {
    'car-wrap': {
      code: 'PRJ // 05',
      clientTop: 'PORSCHE CAYMAN GT4',
      client: 'Motorsport Racing Team',
      year: '2026',
      role: 'Livery Designer',
      tools: 'Blender / Illustrator / HTML5 Canvas',
      category: 'Car Wrap Design',
      categories: ['Car Wrap Design', '3D Visualization', 'Motorsport Livery'],
      title: 'Race Car Liveries — #20 Porsche Cayman GT4',
      subtitle: 'Car Wrap Design · 3D Visualization',
      summary: 'A multi-vehicle motorsport wrap identity and interactive 3D visualization suite for competition track cars.',
      heroImg: 'car-frames/frame_001.webp',
      metaColumns: [
        { label: 'Car', value: 'Porsche 718 Cayman GT4' },
        { label: 'Category', value: 'Car Wrap Design' },
        { label: 'Medium', value: 'Vinyl Livery & 3D WebP' },
        { label: 'Year', value: '2026' }
      ]
    },
    toga: {
      code: 'PRJ // 03',
      clientTop: 'TOGA APP',
      client: 'Toga Mobile Platforms',
      year: '2026',
      role: 'Lead Designer',
      tools: 'Figma',
      category: 'UX/UI Concept',
      categories: ['UX/UI Design', 'Product Design', 'Interaction Design'],
      title: 'TOGA',
      subtitle: '',
      summary: 'An early-stage RSVP and event management concept for Greek life organizations.',
      heroImg: '',
      metaColumns: [
        { label: 'Role', value: 'Lead Designer' },
        { label: 'Tools', value: 'Figma' },
        { label: 'Category', value: 'UX/UI Concept' },
        { label: 'Year', value: '2026' }
      ],
      sectionLabels: {
        overview: '',
        overviewHeading: 'PROJECT OVERVIEW',
        process: '',
        processHeading: 'DESIGN PROCESS',
        deliverables: '',
        deliverablesHeading: 'FINAL DELIVERABLES'
      },
      pullQuote: '',
      overviewImage: null,
      overviewParas: [
        "Toga started with a pretty simple observation: rush week is chaotic if you don't already know someone. Events get passed around by word of mouth, flyers get torn down, and if you're new to campus and genuinely curious about Greek life, there's no real place to just see what's going on or who each chapter actually is.",
        "The idea was to give that experience a home. A place where chapters could show their personality beyond a flyer stapled to a bulletin board, and where someone going through rush could actually keep track of where they're supposed to be and when.",
        "The calendar became the center of it because that's the real problem. Greek life runs on a schedule that lives in ten different places at once. Toga brings that into one view, designed to make the week feel manageable instead of overwhelming.",
        "A close friend studying finance became an early sounding board, someone who thought about the organizational side of chapters in a way I didn't. Those conversations pushed the designs past the surface and into questions about what different people actually need to see.",
        "From there the concept found its way into conversations with startup investors interested in campus social infrastructure. Those conversations confirmed the problem was real and worth solving. The designs are what came out of that process."
      ],
      processSteps: [
        {
          phaseNum: 'Phase 1',
          title: 'Problem Definition & Domain Research',
          intro: 'Toga is a concept prototype, four screens designed to high fidelity to explore what this product could be. The process was treated as if it were going to ship.',
          bullets: [
            "Collaborated closely with a finance major to understand the organizational layer beneath the social one, event costs, chapter treasury workflows, and accountability structures.",
            "Identified the core tension: Greek life is social but event coordination is logistical, and nothing was designed to bridge both for someone trying to find their place in it.",
            "Focused on a single user: someone going through rush who doesn't know where to be, who each chapter is, or how to keep track of the week."
          ]
        },
        {
          phaseNum: 'Phase 2',
          title: 'UI & Interaction Design',
          bullets: [
            "Mapped the full UI across three zones: Home Feed, Explore, and Events, each with a distinct job and none overlapping.",
            "Built low-fidelity wireframes for all primary screens with speed of use as the primary constraint.",
            "Designed a collapsible calendar interaction on the Events tab, a scroll list by default that expands into a full monthly view on tap, balancing screen real estate with temporal context. Showing both states side by side in Figma was how the interaction logic was resolved before touching high fidelity.",
            "Drew direct inspiration from Apple's Dynamic Island: the idea that a UI element can shift its shape and context fluidly based on what the user needs in the moment, without navigating away."
          ]
        },
        {
          phaseNum: 'Phase 3',
          title: 'Visual Design',
          bullets: [
            "Committed to a single strong blue and held it across every touchpoint: the bottom nav, CTAs, active states, badges, and calendar highlights, so every element reads as part of one system.",
            "Brought four screens to high fidelity: Home Feed, Explore, Events List, and Calendar View."
          ]
        },
        {
          phaseNum: 'Phase 4',
          title: 'Concept Validation',
          bullets: [
            'Presented designs to Greek life members and chapter leadership for informal feedback',
            'Took the concept into early conversations with investors in the campus social infrastructure space',
            'Used that feedback to understand what the product would need to become — and to confirm the problem space was worth solving'
          ]
        }
      ],
      deliverables: [
        {
          type: 'iframe',
          span: 'full',
          src: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/nNsfrA0xkB7jIpYww5LYGJ/Untitled?node-id=0-1&t=8ZcdKcJsQt2LMwmi-1',
          title: 'Toga Figma Design File',
          caption: 'Figma file — pan and zoom to explore all screens.',
          extraFrameClass: 'cs-figma-frame'
        },
        {
          span: 'full',
          img: 'toga-hero-phones.jpg',
          alt: 'Toga Application Screens Showcase',
          caption: 'Core application screens showcase',
          extraFrameClass: 'cs-screens-frame',
          extraImgClass: 'cs-screens-img'
        },
        {
          span: 'full',
          img: 'toga-calendar-collapse.png',
          alt: 'Collapsible calendar interaction with Dynamic Island effect',
          caption: 'Collapsible calendar interaction — inspired by Apple’s Dynamic Island, the calendar surface expands seamlessly into a monthly view and collapses back into a focused schedule without navigating away',
          extraFrameClass: 'cs-calendar-frame',
          extraImgClass: 'cs-calendar-img'
        },
        {
          span: 'full',
          img: 'toga-hand-mockup.png',
          alt: 'Toga mobile app in-hand mockup',
          caption: 'Toga mobile app in-hand mockup',
          extraFrameClass: 'cs-overview-frame',
          extraImgClass: 'cs-overview-img'
        }
      ],
      closingTitle: 'TOGA • 2026',
      closingSubtitle: 'CONCEPT · UX/UI · LOGAN O\'NEILL'
    },
  };

  const portfolioRoot = document.getElementById('portfolioRoot');
  const caseStudyPage = document.getElementById('caseStudyPage');
  const csBackBtnTop = document.getElementById('csBackBtnTop');
  const csBackBtnBottom = document.getElementById('csBackBtnBottom');

  let currentOpenProjectId = null;
  let caseStudyObserver = null;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dynamic template populator for Case Study
  function renderCaseStudy(projectId) {
    const data = projectsData[projectId] || projectsData.toga;
    currentOpenProjectId = projectId;

    // Top Bar Meta
    const codeEl = document.getElementById('csTopProjectCode');
    const clientTopEl = document.getElementById('csTopClient');
    if (codeEl) codeEl.textContent = data.code;
    if (clientTopEl) clientTopEl.textContent = data.clientTop;

    // Category Pills
    const catRow = document.getElementById('csCategoryRow');
    if (catRow) {
      catRow.innerHTML = data.categories.map(cat => `<span class="cs-pill">${cat}</span>`).join('');
    }

    // Hero Meta
    const heroTitleEl = document.getElementById('csHeroTitle');
    const heroSubtitleEl = document.getElementById('csHeroSubtitle');
    const heroSummaryEl = document.getElementById('csHeroSummary');
    const metaGridEl = document.getElementById('csMetaGrid');

    if (heroTitleEl) heroTitleEl.textContent = data.title;
    if (heroSummaryEl) {
      heroSummaryEl.textContent = data.summary || '';
      heroSummaryEl.style.display = data.summary ? 'block' : 'none';
    }
    if (heroSubtitleEl) {
      heroSubtitleEl.textContent = data.subtitle || '';
      heroSubtitleEl.style.display = data.subtitle ? 'block' : 'none';
    }

    const heroImgEl = document.getElementById('csHeroImg');
    const heroMediaEl = document.getElementById('csHeroMedia');
    if (heroMediaEl) {
      if (data.heroImg && heroImgEl) {
        heroImgEl.src = data.heroImg;
        heroMediaEl.style.display = 'flex';
      } else {
        heroMediaEl.style.display = 'none';
      }
    }

    if (metaGridEl) {
      metaGridEl.innerHTML = data.metaColumns.map(col => `
        <div class="cs-meta-cell">
          <span class="cs-cell-label">${col.label}</span>
          <span class="cs-cell-value">${col.value}</span>
        </div>
      `).join('');
    }

    // Section Labels
    const ovNum = document.getElementById('csOverviewNum');
    const ovHead = document.getElementById('csOverviewHeading');
    const procNum = document.getElementById('csProcessNum');
    const procHead = document.getElementById('csProcessHeading');
    const delivNum = document.getElementById('csDeliverablesNum');
    const delivHead = document.getElementById('csDeliverablesHeading');

    if (data.sectionLabels) {
      if (ovNum) ovNum.textContent = data.sectionLabels.overview;
      if (ovHead) ovHead.textContent = data.sectionLabels.overviewHeading;
      if (procNum) procNum.textContent = data.sectionLabels.process;
      if (procHead) procHead.textContent = data.sectionLabels.processHeading;
      if (delivNum) delivNum.textContent = data.sectionLabels.deliverables;
      if (delivHead) delivHead.textContent = data.sectionLabels.deliverablesHeading;
    }

    // Overview Section
    const overviewGridEl = document.getElementById('csOverviewGrid');
    const leadQuoteEl = document.getElementById('csLeadQuote');
    const para1El = document.getElementById('csOverviewPara1');
    const para2El = document.getElementById('csOverviewPara2');

    if (data.overviewParas && data.overviewParas.length > 0) {
      if (overviewGridEl) {
        if (data.overviewImage) {
          overviewGridEl.className = 'cs-overview-layout';
          overviewGridEl.innerHTML = `
            <div class="cs-overview-story">
              ${data.overviewParas.map(p => `<p class="cs-narrative-p">${p}</p>`).join('')}
            </div>
            <div class="cs-overview-media">
              <div class="cs-image-frame cs-overview-frame">
                <img src="${data.overviewImage}" alt="Project overview mockup" class="cs-deliv-img cs-overview-img" loading="lazy">
              </div>
            </div>
          `;
        } else {
          overviewGridEl.className = 'cs-overview-story';
          overviewGridEl.innerHTML = data.overviewParas.map(p => `
            <p class="cs-narrative-p">${p}</p>
          `).join('');
        }
      }
    } else {
      if (overviewGridEl) {
        overviewGridEl.className = 'cs-overview-grid';
      }
      if (leadQuoteEl) leadQuoteEl.textContent = data.pullQuote || '';
      if (para1El) para1El.textContent = data.overviewPara1 || '';
      if (para2El) para2El.textContent = data.overviewPara2 || '';
    }

    // Process Steps Grid
    const stepsGrid = document.getElementById('csProcessSteps');
    if (stepsGrid) {
      stepsGrid.innerHTML = data.processSteps.map(step => `
        <div class="cs-step-card">
          <div class="cs-step-top">
            <span class="cs-step-badge">${step.phaseNum}</span>
          </div>
          <h3 class="cs-step-title">${step.title}</h3>
          ${step.intro ? `<p class="cs-step-desc">${step.intro}</p>` : ''}
          <ul class="cs-step-bullets">
            ${step.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `).join('');
    }

    // Style Guide Container (for Toga or projects with style guide)
    const styleGuideContainer = document.getElementById('csStyleGuideContainer');
    if (styleGuideContainer) {
      if (projectId === 'toga') {
        styleGuideContainer.innerHTML = `
          <div class="cs-styleguide-wrapper">
            <div class="cs-color-ticker" aria-label="Brand colors ticker banner">
              <div class="cs-ticker-track">
                <div class="cs-ticker-group">
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #196FF0;"></span>
                    <span class="cs-ticker-hex">#196FF0</span>
                    <span class="cs-ticker-name">Primary</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #5E9AF5;"></span>
                    <span class="cs-ticker-hex">#5E9AF5</span>
                    <span class="cs-ticker-name">Sky Blue</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #FF6EAA;"></span>
                    <span class="cs-ticker-hex">#FF6EAA</span>
                    <span class="cs-ticker-name">Pink</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #FFFFFF; border: 1px solid rgba(255,255,255,0.4);"></span>
                    <span class="cs-ticker-hex">#FFFFFF</span>
                    <span class="cs-ticker-name">White</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #9CA3AF;"></span>
                    <span class="cs-ticker-hex">#9CA3AF</span>
                    <span class="cs-ticker-name">Slate</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #000000; border: 1px solid rgba(255,255,255,0.25);"></span>
                    <span class="cs-ticker-hex">#000000</span>
                    <span class="cs-ticker-name">Black</span>
                  </div>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #196FF0;"></span>
                    <span class="cs-ticker-hex">#196FF0</span>
                    <span class="cs-ticker-name">Primary</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #5E9AF5;"></span>
                    <span class="cs-ticker-hex">#5E9AF5</span>
                    <span class="cs-ticker-name">Sky Blue</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #FF6EAA;"></span>
                    <span class="cs-ticker-hex">#FF6EAA</span>
                    <span class="cs-ticker-name">Pink</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #FFFFFF; border: 1px solid rgba(255,255,255,0.4);"></span>
                    <span class="cs-ticker-hex">#FFFFFF</span>
                    <span class="cs-ticker-name">White</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #9CA3AF;"></span>
                    <span class="cs-ticker-hex">#9CA3AF</span>
                    <span class="cs-ticker-name">Slate</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #000000; border: 1px solid rgba(255,255,255,0.25);"></span>
                    <span class="cs-ticker-hex">#000000</span>
                    <span class="cs-ticker-name">Black</span>
                  </div>
                </div>
                <div class="cs-ticker-group" aria-hidden="true">
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #196FF0;"></span>
                    <span class="cs-ticker-hex">#196FF0</span>
                    <span class="cs-ticker-name">Primary</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #5E9AF5;"></span>
                    <span class="cs-ticker-hex">#5E9AF5</span>
                    <span class="cs-ticker-name">Sky Blue</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #FF6EAA;"></span>
                    <span class="cs-ticker-hex">#FF6EAA</span>
                    <span class="cs-ticker-name">Pink</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #FFFFFF; border: 1px solid rgba(255,255,255,0.4);"></span>
                    <span class="cs-ticker-hex">#FFFFFF</span>
                    <span class="cs-ticker-name">White</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #9CA3AF;"></span>
                    <span class="cs-ticker-hex">#9CA3AF</span>
                    <span class="cs-ticker-name">Slate</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #000000; border: 1px solid rgba(255,255,255,0.25);"></span>
                    <span class="cs-ticker-hex">#000000</span>
                    <span class="cs-ticker-name">Black</span>
                  </div>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #196FF0;"></span>
                    <span class="cs-ticker-hex">#196FF0</span>
                    <span class="cs-ticker-name">Primary</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #5E9AF5;"></span>
                    <span class="cs-ticker-hex">#5E9AF5</span>
                    <span class="cs-ticker-name">Sky Blue</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #FF6EAA;"></span>
                    <span class="cs-ticker-hex">#FF6EAA</span>
                    <span class="cs-ticker-name">Pink</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #FFFFFF; border: 1px solid rgba(255,255,255,0.4);"></span>
                    <span class="cs-ticker-hex">#FFFFFF</span>
                    <span class="cs-ticker-name">White</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #9CA3AF;"></span>
                    <span class="cs-ticker-hex">#9CA3AF</span>
                    <span class="cs-ticker-name">Slate</span>
                  </div>
                  <span class="cs-ticker-divider">/</span>
                  <div class="cs-ticker-item">
                    <span class="cs-ticker-swatch" style="background: #000000; border: 1px solid rgba(255,255,255,0.25);"></span>
                    <span class="cs-ticker-hex">#000000</span>
                    <span class="cs-ticker-name">Black</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="cs-deliverable-item cs-styleguide-card">
              <div class="cs-image-frame cs-styleguide-frame">
                <img src="toga-style-guide.png" alt="Toga Brand Style Guide &amp; Design System" class="cs-deliv-img cs-styleguide-img" loading="lazy">
              </div>
              <p class="cs-deliv-caption">Toga Brand Style Guide — Typography hierarchy, UI navigation, and color palette</p>
            </div>
          </div>
        `;
      } else {
        styleGuideContainer.innerHTML = '';
      }
    }

    // Deliverables Gallery Grid (Alternating full and half width with captions below)
    const delivGrid = document.getElementById('csDeliverablesGrid');
    if (delivGrid) {
      delivGrid.innerHTML = data.deliverables.map(item => {
        if (item.type === 'iframe') {
          return `
            <div class="cs-deliverable-item cs-deliv-${item.span}">
              <div class="cs-image-frame ${item.extraFrameClass || ''}">
                <iframe src="${item.src}" title="${item.title || 'Figma Embed'}" class="cs-figma-iframe" allowfullscreen></iframe>
              </div>
              <p class="cs-deliv-caption">${item.caption}</p>
            </div>
          `;
        }
        return `
          <div class="cs-deliverable-item cs-deliv-${item.span}">
            <div class="cs-image-frame ${item.extraFrameClass || ''}">
              <img src="${item.img}" alt="${item.alt || item.caption}" class="cs-deliv-img ${item.extraImgClass || ''}">
            </div>
            <p class="cs-deliv-caption">${item.caption}</p>
          </div>
        `;
      }).join('');
    }

    // Closing Card with Typewriter/Word by Word Title
    const exitTitleEl = document.getElementById('csExitTitle');
    const exitSubtitleEl = document.getElementById('csExitSubtitle');

    if (exitTitleEl) {
      const words = data.closingTitle.split(' ');
      exitTitleEl.innerHTML = words.map((w, idx) => `<span class="type-word" style="transition-delay: ${idx * 80}ms;">${w}</span>`).join(' ');
      exitTitleEl.classList.remove('is-revealed');
    }
    if (exitSubtitleEl) {
      exitSubtitleEl.textContent = data.closingSubtitle;
    }

    // Setup intersection observer for smooth scroll reveals
    initCaseStudyScrollReveals();

    if (caseStudyPage) {
      bindMagneticAndCursor(caseStudyPage);
    }
  }

  // IntersectionObserver Scroll Reveals Engine
  function initCaseStudyScrollReveals() {
    if (caseStudyObserver) {
      caseStudyObserver.disconnect();
    }

    if (isReducedMotion) {
      document.querySelectorAll('.cs-reveal-section, .cs-step-card, .cs-image-frame, .cs-exit-title, .cs-exit-card').forEach(el => {
        el.classList.add('is-revealed');
      });
      return;
    }

    // Ensure all image frames are immediately visible
    document.querySelectorAll('.cs-image-frame').forEach(el => {
      el.classList.add('is-revealed');
    });

    // Reset initial states for cards & titles
    document.querySelectorAll('.cs-reveal-section, .cs-step-card, .cs-exit-title, .cs-exit-card').forEach(el => {
      el.classList.remove('is-revealed');
    });

    caseStudyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('is-revealed');

          // If it's a section, stagger its immediate children
          if (target.classList.contains('cs-reveal-section')) {
            const childCards = target.querySelectorAll('.cs-step-card, .cs-image-frame');
            childCards.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('is-revealed');
              }, index * 60);
            });
          }

          // If exit card, trigger title word typing
          if (target.id === 'csExitCard' || target.id === 'csExitSection') {
            const exitTitle = document.getElementById('csExitTitle');
            if (exitTitle) exitTitle.classList.add('is-revealed');
          }
        }
      });
    }, {
      root: caseStudyPage,
      rootMargin: '100px 0px',
      threshold: 0.05
    });

    document.querySelectorAll('.cs-reveal-section, .cs-step-card, .cs-image-frame, #csExitCard').forEach(el => {
      caseStudyObserver.observe(el);
    });
  }

  let isCaseStudyOpen = false;
  let savedScrollY = 0;

  // Full-Page Turn Swipe Trigger
  function openCaseStudy(projectId) {
    if (!caseStudyPage) return;
    renderCaseStudy(projectId);

    savedScrollY = window.scrollY;
    isCaseStudyOpen = true;

    // Reset scroll position inside the new page
    caseStudyPage.scrollTop = 0;

    // Page-Turn Swipe Animation:
    // 1. Portfolio root pushes back slightly, scales down, and dims
    if (portfolioRoot) {
      portfolioRoot.classList.add('page-turned');
    }
    // 2. Case study page slides in from the right edge like turning a sheet
    caseStudyPage.classList.add('active');
    caseStudyPage.setAttribute('aria-hidden', 'false');

    // Prevent body background scroll while viewing case study
    document.body.style.overflow = 'hidden';
    document.body.classList.add('case-study-open');

    // Trigger initial reveal on hero items
    if (!isReducedMotion) {
      setTimeout(() => {
        initCaseStudyScrollReveals();
      }, 500);
    }
  }

  // Reverse Page-Turn Swipe
  function closeCaseStudy() {
    if (!caseStudyPage || !isCaseStudyOpen) return;
    isCaseStudyOpen = false;

    // Reverse swipe animation
    caseStudyPage.classList.remove('active');
    caseStudyPage.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('case-study-open');

    if (portfolioRoot) {
      portfolioRoot.classList.remove('page-turned');
    }

    // Smooth return to the project card
    setTimeout(() => {
      document.body.style.overflow = '';
      if (currentOpenProjectId === 'toga') {
        const togaCard = document.getElementById('cardToga');
        if (togaCard) {
          togaCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo(0, savedScrollY);
        }
      } else {
        window.scrollTo(0, savedScrollY);
      }
    }, 750);
  }

  // Helper to record portfolio scroll position before navigating to a case study
  function recordPortfolioScroll(btnOrLink, projectId) {
    const currentY = window.pageYOffset || document.documentElement.scrollTop;
    sessionStorage.setItem('portfolio_return_scrollY', String(currentY));
    sessionStorage.setItem('portfolio_from_index', 'true');
    const card = btnOrLink ? btnOrLink.closest('.deck-card') : null;
    let cardId = card ? card.id : '';
    if (!cardId && projectId) {
      if (projectId === 'toga') cardId = 'cardToga';
      else if (projectId === 'car-wrap' || projectId === 'carWrap') cardId = 'cardCarWrap';
      else if (projectId === 'air-pollution' || projectId === 'airPollution') cardId = 'cardAirPollution';
      else if (projectId === 'garbage-gala' || projectId === 'garbageGala') cardId = 'cardGarbageGala';
      else if (projectId === 'undrdawg' || projectId === 'undrdawgAthletics') cardId = 'cardUndrdawg';
    }
    if (cardId) {
      sessionStorage.setItem('portfolio_return_cardId', cardId);
    }
  }

  // Intercept all clicks on any links to case studies to store exact scroll position
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="case-study-"]');
    if (link) {
      const card = link.closest('.deck-card');
      const projectId = link.getAttribute('data-project') || (card ? card.getAttribute('data-project') : '');
      recordPortfolioScroll(link, projectId);
    }
  }, { capture: true });

  // Wire up "View Case Study" buttons
  const caseStudyBtns = document.querySelectorAll('.view-case-study');
  caseStudyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const projectId = btn.getAttribute('data-project');
      recordPortfolioScroll(btn, projectId);
      if (projectId === 'toga' || projectId === 'car-wrap' || projectId === 'carWrap' || projectId === 'air-pollution' || projectId === 'airPollution' || projectId === 'garbage-gala' || projectId === 'garbageGala' || projectId === 'undrdawg') {
        // Direct seamless navigation to full-page case studies
        if (projectId === 'toga') {
          window.location.href = 'case-study-toga.html';
          return;
        }
        if (projectId === 'car-wrap' || projectId === 'carWrap') {
          window.location.href = 'case-study-car-wrap.html';
          return;
        }
        if (projectId === 'air-pollution' || projectId === 'airPollution') {
          window.location.href = 'case-study-air-pollution.html';
          return;
        }
        if (projectId === 'garbage-gala' || projectId === 'garbageGala') {
          window.location.href = 'case-study-garbage-gala.html';
          return;
        }
        if (projectId === 'undrdawg' || projectId === 'undrdawgAthletics') {
          window.location.href = 'case-study-undrdawg.html';
          return;
        }
        e.stopPropagation();
        openCaseStudy(projectId);
      }
    });
  });

  // Wire up Back Buttons (Top and Bottom)
  if (csBackBtnTop) csBackBtnTop.addEventListener('click', closeCaseStudy);
  if (csBackBtnBottom) csBackBtnBottom.addEventListener('click', closeCaseStudy);

  // Swipe right gesture to navigate back (Mobile & Trackpad)
  let touchStartX = 0;
  let touchStartY = 0;

  if (caseStudyPage) {
    caseStudyPage.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    caseStudyPage.addEventListener('touchend', (e) => {
      if (!isCaseStudyOpen) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = Math.abs(touchEndY - touchStartY);

      // Swipe right gesture detection: horizontal delta > 85px with minimal vertical angle
      if (diffX > 85 && diffY < 60 && touchStartX < 100) {
        closeCaseStudy();
      }
    }, { passive: true });
  }

  // Close with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isCaseStudyOpen) {
      closeCaseStudy();
    }
  });

  // 7. Copy Email to Clipboard with View-Project Button Style
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastNotification = document.getElementById('toastNotification');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'hunterlogan30@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const copyBtnText = document.getElementById('copyBtnText');
        if (copyBtnText) copyBtnText.textContent = 'COPIED!';
        if (toastNotification) {
          toastNotification.classList.add('active');
          setTimeout(() => {
            toastNotification.classList.remove('active');
          }, 2400);
        }
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'CLICK TO COPY';
        }, 2000);
      });
    });
  }

  // 8. Live Local Time Display (Retired)
  const localTimeDisplay = document.getElementById('localTimeDisplay');

  // 9. Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 10. Mobile Navigation Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      const isOpen = mobileNav.classList.contains('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 11. Seamless Scroll Position Restoration (only when returning from case studies)
  function restorePortfolioScroll() {
    const isReturning = sessionStorage.getItem('portfolio_is_returning') === 'true';
    const savedY = sessionStorage.getItem('portfolio_return_scrollY');

    if (isReturning && savedY !== null && savedY !== undefined) {
      const targetY = parseFloat(savedY);
      if (!isNaN(targetY)) {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, targetY);

        const syncState = () => {
          window.scrollTo(0, targetY);
          if (typeof updateDeckCards === 'function') updateDeckCards();
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        };

        requestAnimationFrame(syncState);
        setTimeout(syncState, 50);
        setTimeout(syncState, 150);
        setTimeout(() => {
          syncState();
          sessionStorage.removeItem('portfolio_is_returning');
          sessionStorage.removeItem('portfolio_return_scrollY');
          sessionStorage.removeItem('portfolio_return_cardId');
          if (window.location.hash && window.location.hash.startsWith('#card')) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }, 400);
        return;
      }
    }

    // Default: not returning, ensure at top (LOGAN O'NEILL)
    sessionStorage.removeItem('portfolio_is_returning');
    sessionStorage.removeItem('portfolio_return_scrollY');
    sessionStorage.removeItem('portfolio_return_cardId');
    if (window.location.hash && window.location.hash.startsWith('#card')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }

  window.addEventListener('pageshow', restorePortfolioScroll);
  restorePortfolioScroll();
});