/* ==========================================================================
   ORTHOGONAL / NEXUS ARCHITECTURAL STUDIO — GSAP ANIMATIONS & INTERACTIVE AUDIO
   GSAP 3 + ScrollTrigger: Hero Sky Entrance, Parallax, KPI Counters, Card Staggers
   ========================================================================== */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') {
    console.warn('GSAP library not detected');
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
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

    // 8. Process Step Rows Reveal
    if (document.querySelector('.process-light-row') && document.querySelector('.process-steps-list')) {
      gsap.from('.process-light-row', {
        scrollTrigger: {
          trigger: '.process-steps-list',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        x: -30,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

    // 9. Floating Cloud Parallax Effect
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      const clouds = document.querySelector('.hero-clouds-layer');
      if (clouds && scrollY < 1200) {
        clouds.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
    });
  }

  /* ==========================================================================
     STAT COUNTERS ANIMATION
     ========================================================================== */

  function animateCounters() {
    const stat1 = document.getElementById('stat-counter-1'); // 98.4%
    const stat2 = document.getElementById('stat-counter-2'); // 5000 m²

    if (stat1 && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '.metrics-light-strip',
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
            val: 5000,
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
  });
})();
