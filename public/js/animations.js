/* ==========================================================================
   NEXUS ARCHITECTURAL ATELIER — GSAP ANIMATIONS & INTERACTIVE AUDIO
   GSAP 3 + ScrollTrigger: Staggered Reveals, Parallax, KPI Counter, Audio FX
   ========================================================================== */

(function () {
  'use strict';

  // Check GSAP availability
  if (typeof gsap === 'undefined') {
    console.warn('GSAP library not detected');
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ==========================================================================
     AUDIO SYNTHESIZER (Web Audio API - Architectural Tactile Feedback)
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

  function playTactileClick(frequency = 800, duration = 0.035) {
    if (!audioEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {
      console.warn('Audio error', err);
    }
  }

  function setupSoundToggle() {
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      soundBtn.classList.toggle('active', audioEnabled);
      soundBtn.innerHTML = audioEnabled
        ? 'AUDIO: <strong>ATIVO</strong>'
        : 'AUDIO: <strong>MUDO</strong>';
      if (audioEnabled) {
        playTactileClick(900, 0.05);
      }
    });

    // Attach click feedback to all interactive elements
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, .nav-link, .cam-btn, .mat-filter-btn, .layer-pill, .faq-question-btn');
      if (target && audioEnabled) {
        playTactileClick(700, 0.03);
      }
    });
  }

  /* ==========================================================================
     GSAP ENTRANCE & SCROLLTRIGGER REVEALS
     ========================================================================== */

  function initScrollAnimations() {
    // 1. Hero Reveal Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl.from('.hero-cad-tag', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.2
    });

    heroTl.from('.hero-title', {
      y: 35,
      opacity: 0,
      duration: 1.1,
      ease: 'power4.out'
    }, '-=0.5');

    heroTl.from('.hero-description', {
      y: 25,
      opacity: 0,
      duration: 0.9
    }, '-=0.7');

    heroTl.from('.hero-buttons a', {
      y: 20,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15
    }, '-=0.6');

    heroTl.from('.hero-case-callout', {
      x: -30,
      opacity: 0,
      duration: 0.8
    }, '-=0.4');

    heroTl.from('.hero-stat-card', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1
    }, '-=0.4');

    // 2. Animate KPI numbers
    animateCounters();

    // 3. Stagger section headers
    gsap.utils.toArray('.section-header-block').forEach((block) => {
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
    });

    // 4. Bento Grid Reveal
    gsap.from('.bento-card', {
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // 5. Methodology Cards Reveal
    gsap.from('.method-card', {
      scrollTrigger: {
        trigger: '.methodology-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    });

    // 6. Materials Cards Reveal
    gsap.from('.material-card', {
      scrollTrigger: {
        trigger: '.materials-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // 7. Process Step Rows Reveal
    gsap.from('.process-step-row', {
      scrollTrigger: {
        trigger: '.process-timeline',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: -30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // 8. Deliverable Cards Reveal
    gsap.from('.deliverable-card', {
      scrollTrigger: {
        trigger: '.deliverables-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // 9. BIM Table Rows Reveal
    gsap.from('.bim-table tbody tr', {
      scrollTrigger: {
        trigger: '.bim-table',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 15,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out'
    });
  }

  /* ==========================================================================
     STAT COUNTERS ANIMATION
     ========================================================================== */

  function animateCounters() {
    const stat1 = document.getElementById('stat-counter-1'); // 98.4%
    const stat2 = document.getElementById('stat-counter-2'); // 120400 m²
    const stat3 = document.getElementById('stat-counter-3'); // 10 Anos
    const stat4 = document.getElementById('stat-counter-4'); // Level 3

    if (stat1 && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '.hero-telemetry-strip',
        start: 'top 95%',
        onEnter: () => {
          const obj1 = { val: 0 };
          gsap.to(obj1, {
            val: 98.4,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              stat1.textContent = `${obj1.val.toFixed(1)}%`;
            }
          });

          const obj2 = { val: 0 };
          gsap.to(obj2, {
            val: 120400,
            duration: 2.5,
            ease: 'power3.out',
            onUpdate: () => {
              stat2.textContent = `+${Math.round(obj2.val).toLocaleString('pt-AO')} M²`;
            }
          });
        }
      });
    }
  }

  /* ==========================================================================
     MAGNETIC BUTTONS (Subtle Architectural Micro-Interaction)
     ========================================================================== */

  function setupMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-ghost, .telemetry-btn');
    if (window.innerWidth < 1024) return;

    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      });
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
      const scrollPos = window.pageYOffset + 180;

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

  // Init all on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    setupSoundToggle();
    setupMagneticButtons();
    setupNavTracking();
  });
})();
