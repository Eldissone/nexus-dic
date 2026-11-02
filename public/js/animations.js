/* ==========================================================================
   ORTHOGONAL / NEXUS ARCHITECTURAL STUDIO — GSAP ANIMATIONS & INTERACTIVE AUDIO
   GSAP 3 + ScrollTrigger: Hero Sky Entrance, Parallax, KPI Counters, Card Staggers
   ========================================================================== */

(function () {
  'use strict';

  function initProcessStepReveals() {
    const processRows = document.querySelectorAll('.process-light-row');

    if (!processRows.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    function revealVisibleRows() {
      const revealThreshold = window.innerHeight * 0.9;

      processRows.forEach((row) => {
        if (!row.classList.contains('is-revealed') &&
            row.getBoundingClientRect().top < revealThreshold) {
          row.classList.add('is-revealed');
        }
      });
    }

    processRows.forEach((row) => {
      row.classList.add('has-reveal-animation');
    });
    window.addEventListener('scroll', revealVisibleRows, { passive: true });
    window.addEventListener('resize', revealVisibleRows);
    revealVisibleRows();
  }

  function initEditorialScrollSections() {
    const steps = document.querySelectorAll('.scroll-story-step');
    const featureImage = document.getElementById('story-feature-image');
    const featureLabel = document.getElementById('story-feature-label');
    const reveals = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
      reveals.forEach((element) => element.classList.add('is-prepared'));
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      }, { threshold: 0.18 });
      reveals.forEach((element) => revealObserver.observe(element));

      const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          steps.forEach((step) => step.classList.toggle('is-active', step === entry.target));
          if (featureImage && entry.target.dataset.storyImage) {
            featureImage.style.opacity = '0';
            window.setTimeout(() => {
              featureImage.src = entry.target.dataset.storyImage;
              featureImage.style.opacity = '1';
            }, 180);
            featureLabel.textContent = entry.target.dataset.storyLabel || '';
          }
        });
      }, { threshold: 0.58 });
      steps.forEach((step) => storyObserver.observe(step));
    } else {
      reveals.forEach((element) => element.classList.add('is-visible'));
    }
  }

  function initShowreel() {
    const canvas = document.getElementById('showreel-canvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = canvas.getContext('2d');
    const duration = 15000;
    let width = 0;
    let height = 0;
    let scale = 1;

    function resize() {
      const box = canvas.getBoundingClientRect();
      scale = Math.min(window.devicePixelRatio || 1, 2);
      width = box.width; height = box.height;
      canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
    }
    function clamp(value) { return Math.max(0, Math.min(1, value)); }
    function ease(value) { return value * value * (3 - 2 * value); }
    function phase(time, start, end) { return ease(clamp((time - start) / (end - start))); }
    function text(textValue, x, y, size, alpha, align) {
      context.globalAlpha = alpha; context.font = `700 ${size}px Space Grotesk, sans-serif`; context.textAlign = align || 'left'; context.fillStyle = '#f7f7f4'; context.fillText(textValue, x, y); context.globalAlpha = 1;
    }
    function draw(now) {
      const time = now % duration;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#090a0b'; context.fillRect(0, 0, width, height);
      const yellow = '#f0e638'; const cx = width / 2; const cy = height / 2;
      const a = phase(time, 0, 2900); const b = phase(time, 2800, 5800); const c = phase(time, 5700, 9000); const d = phase(time, 8900, 12000); const e = phase(time, 11900, 15000);

      // Act I: blueprint rhythm
      context.strokeStyle = `rgba(240,230,56,${.7 * a})`; context.lineWidth = 1;
      for (let index = -6; index < 7; index++) { const pos = cx + index * (width / 12); context.beginPath(); context.moveTo(pos, cy - height * .31 * a); context.lineTo(pos, cy + height * .31 * a); context.stroke(); }
      text('SPACE', cx, cy + 22, Math.min(width * .17, 180), a, 'center');

      // Act II: geometry becomes an architectural frame
      const frame = Math.min(width, height) * (.12 + .23 * b); context.strokeStyle = `rgba(247,247,244,${b})`; context.lineWidth = 3;
      context.strokeRect(cx - frame * 1.6, cy - frame, frame * 3.2, frame * 2);
      context.fillStyle = `rgba(240,230,56,${.92 * b})`; context.fillRect(cx - frame * 1.6, cy - frame, frame * 1.1, frame * 2);
      text('LIGHT', cx, cy + 18, Math.min(width * .14, 150), b, 'center');

      // Act III: kinetic material stripes
      context.save(); context.translate(cx, cy); context.rotate((c - .5) * .45); context.globalAlpha = c;
      for (let index = 0; index < 13; index++) { context.fillStyle = index % 2 ? '#f0e638' : '#f7f7f4'; context.fillRect(-width * .4 + index * width * .065, -height * .5, width * .027, height); }
      context.restore(); text('MATTER', cx, cy + 18, Math.min(width * .12, 132), c, 'center');

      // Act IV: editorial black & white lockup
      context.fillStyle = `rgba(247,247,244,${d})`; context.fillRect(0, 0, width * d, height);
      context.fillStyle = '#090a0b'; context.globalAlpha = d; context.font = `700 ${Math.min(width * .15, 170)}px Space Grotesk, sans-serif`; context.textAlign = 'center'; context.fillText('NEXUS', cx, cy + 22); context.globalAlpha = 1;
      context.strokeStyle = `rgba(9,10,11,${d})`; context.strokeRect(width*.12, height*.18, width*.76, height*.64);

      // Act V: final resume card
      context.fillStyle = `rgba(9,10,11,${e})`; context.fillRect(0, 0, width, height);
      text('MOTION DESIGNER', cx, cy - 28, Math.min(width * .058, 68), e, 'center');
      context.fillStyle = `rgba(240,230,56,${e})`; context.fillRect(cx - 58, cy + 6, 116 * e, 6);
      context.font = '600 12px JetBrains Mono, monospace'; context.textAlign = 'center'; context.fillStyle = `rgba(247,247,244,${e})`; context.fillText('SPACE / LIGHT / MATTER / FORM', cx, cy + 48);
      requestAnimationFrame(draw);
    }
    resize(); window.addEventListener('resize', resize); requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProcessStepReveals, { once: true });
  } else {
    initProcessStepReveals();
  }

  if (typeof gsap === 'undefined') {
    initNativeAnimations();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initEditorialScrollSections();
        initShowreel();
      }, { once: true });
    } else {
      initEditorialScrollSections();
      initShowreel();
    }
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* Fallback offline: does not require GSAP or any external script. */
  function initNativeAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = document.querySelectorAll(
      '.hero-main-title, .hero-description-text, .hero-cta-pill, .hero-villa-frame, ' +
      '.section-header-block, .interior-spotlight-card, .pillar-card, .service-card, .mat-light-card'
    );
    elements.forEach((element) => element.classList.add('native-reveal'));

    const reveal = (element) => element.classList.add('is-in-view');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            activeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -5%' });
      elements.forEach((element) => observer.observe(element));
    } else {
      elements.forEach(reveal);
    }



    const clouds = document.querySelector('.hero-clouds-layer');
    if (clouds) {
      window.addEventListener('scroll', () => {
        clouds.style.transform = `translateY(${Math.min(window.scrollY, 1200) * 0.25}px)`;
      }, { passive: true });
    }
  }

  /* ==========================================================================
     AUDIO SYNTHESIZER (Web Audio API - Subtle Soft Tactile Clicks)
     ========================================================================== */

  let audioCtx = null;
  let audioEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSoftClick(frequency = 750, duration = 0.03) {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {
      console.warn('Audio error', err);
    }
  }

  /* ==========================================================================
     GSAP ENTRANCE & SCROLLTRIGGER REVEALS
     ========================================================================== */

  function initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // 1. Hero Reveal Timeline (Smooth Sky Blue Stagger)
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (document.querySelector('.hero-badge-pill')) {
      heroTl.from('.hero-badge-pill', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        delay: 0.2
      });
    }

    if (document.querySelector('.hero-main-title')) {
      heroTl.from('.hero-main-title', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power4.out',
        delay: 0.2
      });
    }

    if (document.querySelector('.hero-description-text')) {
      heroTl.from('.hero-description-text', {
        y: 25,
        opacity: 0,
        duration: 0.9
      }, '-=0.7');
    }

    if (document.querySelector('.hero-cta-pill')) {
      heroTl.from('.hero-cta-pill', {
        y: 20,
        scale: 0.95,
        duration: 0.7
      }, '-=0.6');
    }

    if (document.querySelector('.hero-villa-frame')) {
      heroTl.from('.hero-villa-frame', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      }, '-=0.5');
    }

    // 2. Animate KPI numbers
    animateCounters();

    // 3. Stagger section headers
    gsap.utils.toArray('.section-header-block').forEach((block) => {
      if (block.children && block.children.length > 0) {
        gsap.from(block.children, {
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out'
        });
      }
    });

    // 4. Interior Spotlight Card Reveal
    if (document.querySelector('.interior-spotlight-card')) {
      gsap.from('.interior-spotlight-card', {
        scrollTrigger: {
          trigger: '.interior-spotlight-card',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 40,
        duration: 0.9,
        ease: 'power3.out'
      });
    }

    // 5. Pillars Stagger
    if (document.querySelector('.pillar-card') && document.querySelector('.pillars-light-grid')) {
      gsap.from('.pillar-card', {
        scrollTrigger: {
          trigger: '.pillars-light-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 35,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

    // 6. Services Bento Grid Reveal
    if (document.querySelector('.service-card') && document.querySelector('.services-bento-grid')) {
      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: '.services-bento-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 40,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }

    // 7. Materials Cards Reveal
    if (document.querySelector('.mat-light-card') && document.querySelector('.materials-light-grid')) {
      gsap.from('.mat-light-card', {
        scrollTrigger: {
          trigger: '.materials-light-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 35,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }

    // 8. Floating Cloud Parallax Effect
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      const clouds = document.querySelector('.hero-clouds-layer');
      if (clouds && scrollY < 1200) {
        clouds.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
    });
  }



  /* ==========================================================================
     ACTIVE NAVIGATION TRACKING ON SCROLL
     ========================================================================== */

  function setupNavTracking() {
    const sections = document.querySelectorAll('section[id], #hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let currentSection = '';
      const scrollPos = window.pageYOffset + 200;

      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSection = sec.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    setupNavTracking();
    initEditorialScrollSections();
    initShowreel();
  });
})();
