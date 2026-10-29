
(function () {
  'use strict';

  function initBeforeAfterSlider() {
    const stage = document.querySelector('.before-after-stage');
    const beforeWrap = document.querySelector('.stage-image-wrap-before');
    const handle = document.querySelector('.split-handle');
    const readout = document.getElementById('split-percentage-readout');

    if (!stage || !beforeWrap || !handle) return;

    let isDragging = false;

    function setSplitPosition(clientX) {
      const rect = stage.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      let percentage = (offsetX / rect.width) * 100;

      // Clamp between 2% and 98%
      percentage = Math.max(2, Math.min(98, percentage));

      beforeWrap.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;

      if (readout) {
        readout.textContent = `${Math.round(percentage)}% / ${Math.round(100 - percentage)}%`;
      }
    }

    // Mouse Events
    stage.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSplitPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSplitPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch Events
    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        setSplitPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length === 0) return;
      setSplitPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  /* ==========================================================================
     2. SPATIAL VISUALIZER 3D HUD (Attachment 1)
     ========================================================================== */

  function initSpatialVisualizer() {
    const mainImg = document.getElementById('viewer-img-target');
    const camBtns = document.querySelectorAll('.cam-pill[data-camera]');
    const lightBtns = document.querySelectorAll('.light-btn');
    const btnZoomIn = document.getElementById('btn-viewer-zoom-in');
    const btnZoomOut = document.getElementById('btn-viewer-zoom-out');
    const btnFullscreen = document.getElementById('btn-viewer-fullscreen');
    const viewerFrame = document.querySelector('.viewer-viewport-box');
    const readoutFov = document.getElementById('viewer-telemetry-fov');

    if (!mainImg) return;

    let currentZoom = 1.0;

    // Camera viewpoints database
    const cameraViews = {
      'cam-ext-twilight': {
        src: '/assets/images/projeto1/10.jpeg',
        title: 'JARDIM FRONTAL',
        fov: '42°',
        exposure: '+0.1 EV',
        lat: '-8.83833°'
      },
      'cam-living-fire': {
        src: '/assets/images/projeto1/12.jpeg',
        title: 'SALA INTEGRADA',
        fov: '50°',
        exposure: '+0.0 EV',
        lat: '-8.83830°'
      },
      'cam-living-garden': {
        src: '/assets/images/projeto1/1.jpeg',
        title: 'ENTRADA PRINCIPAL',
        fov: '45°',
        exposure: '+0.0 EV',
        lat: '-8.83832°'
      },
      'cam-ext-night': {
        src: '/assets/images/projeto1/14.jpeg',
        title: 'PISCINA & DECK',
        fov: '38°',
        exposure: '+0.2 EV',
        lat: '-8.83835°'
      },
      'cam-cad-plan': {
        src: '/assets/images/projeto1/4.jpeg',
        title: 'PÁTIO PRIVATIVO',
        fov: '48°',
        exposure: '+0.1 EV',
        lat: '-8.83833°'
      }
    };

    // Camera Switch Handler
    camBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        camBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const camKey = btn.getAttribute('data-camera');
        const viewData = cameraViews[camKey];

        if (viewData) {
          mainImg.classList.add('is-changing');
          mainImg.onload = () => mainImg.classList.remove('is-changing');
          mainImg.onerror = () => {
            mainImg.classList.remove('is-changing');
            console.error(`Unable to load visualizer image: ${viewData.src}`);
          };
          mainImg.src = viewData.src;
          if (mainImg.complete && mainImg.naturalWidth > 0) {
            mainImg.classList.remove('is-changing');
          }
          mainImg.alt = viewData.title;

          const hudTitle = document.getElementById('viewer-active-view-title');
          if (hudTitle) hudTitle.textContent = viewData.title;

          if (readoutFov) readoutFov.textContent = viewData.fov;
        }
      });
    });

    // Lighting Temperature Mode (Day, Twilight, Night)
    lightBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        lightBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.getAttribute('data-light-mode');
        mainImg.classList.remove('light-mode-day', 'light-mode-twilight', 'light-mode-night');
        if (mode === 'day') {
          mainImg.classList.add('light-mode-day');
        } else if (mode === 'twilight') {
          mainImg.classList.add('light-mode-twilight');
        } else if (mode === 'night') {
          mainImg.classList.add('light-mode-night');
        }
      });
    });

    // Zoom Lens Controls
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        if (currentZoom < 2.2) {
          currentZoom += 0.25;
          mainImg.style.transform = `scale(${currentZoom})`;
        }
      });
    }

    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        if (currentZoom > 1.0) {
          currentZoom -= 0.25;
          mainImg.style.transform = `scale(${currentZoom})`;
        }
      });
    }

    // Fullscreen API
    if (btnFullscreen && viewerFrame) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          viewerFrame.requestFullscreen().catch((err) => console.log(err));
        } else {
          document.exitFullscreen();
        }
      });
    }
  }

  /* ==========================================================================
     3. CADERNO DE MATERIAIS — FILTER & DETAIL MODAL
     ========================================================================== */

  const materialsData = {
    'latao': {
      title: 'Pedra Natural & Perfis Escuros',
      code: 'NEX-ARQ01',
      category: 'Fachada contemporânea',
      img: '/assets/images/projeto1/1.jpeg',
      specs: [
        { label: 'Revestimento', value: 'Pedra natural escura em planos verticais de destaque' },
        { label: 'Perfis', value: 'Elementos metálicos em grafite com acabamento mate' },
        { label: 'Iluminação', value: 'Linhas embutidas que valorizam a textura da fachada' }
      ]
    },
    'carvalho': {
      title: 'Deck de Madeira & Área de Lazer',
      code: 'NEX-EXT02',
      category: 'Área exterior',
      img: '/assets/images/projeto1/4.jpeg',
      specs: [
        { label: 'Pavimento', value: 'Deck em madeira tratada para uso exterior' },
        { label: 'Complementos', value: 'Pedra escura e vegetação integrada ao espaço de lazer' },
        { label: 'Aplicação', value: 'Zona de piscina, descanso e circulação exterior' }
      ]
    },
    'aco': {
      title: 'Volumes Minerais & Caixilharia',
      code: 'NEX-ARQ03',
      category: 'Envolvente arquitetónica',
      img: '/assets/images/projeto1/8.jpeg',
      specs: [
        { label: 'Volumes', value: 'Revestimentos minerais claros e planos em grafite' },
        { label: 'Vãos', value: 'Caixilharia escura com grandes superfícies de vidro' },
        { label: 'Aplicação', value: 'Fachadas que maximizam a luz natural e a privacidade' }
      ]
    },
    'caixilharia': {
      title: 'Paleta Interior Neutra',
      code: 'NEX-INT04',
      category: 'Interiores',
      img: '/assets/images/projeto1/12.jpeg',
      specs: [
        { label: 'Tons', value: 'Areia, bege e cinza quente para uma atmosfera serena' },
        { label: 'Elementos', value: 'Madeira natural, estofos suaves e superfícies minerais' },
        { label: 'Iluminação', value: 'Luz indireta integrada para conforto visual noturno' }
      ]
    }
  };

  function initMaterialsSection() {
    const filterBtns = document.querySelectorAll('.mat-filter-btn');
    const cards = document.querySelectorAll('.material-card');
    const modal = document.getElementById('modal-material-detail');

    if (!cards.length) return;

    // Filter Buttons
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach((card) => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
              card.classList.remove('is-filtered-out');
          } else {
              card.classList.add('is-filtered-out');
          }
        });
      });
    });

    // Open Material Detail Modal
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const matKey = card.getAttribute('data-material-key');
        const data = materialsData[matKey];

        if (data && modal) {
          const imgElem = modal.querySelector('.modal-mat-img');
          const titleElem = modal.querySelector('.modal-mat-title');
          const codeElem = modal.querySelector('.modal-mat-code');
          const specsWrap = modal.querySelector('.modal-mat-specs-list');

          if (imgElem) imgElem.src = data.img;
          if (titleElem) titleElem.textContent = data.title;
          if (codeElem) codeElem.textContent = `${data.code} // ${data.category}`;

          if (specsWrap) {
            specsWrap.innerHTML = data.specs
              .map(
                (s) => `
                <div class="material-spec-row">
                  <span class="material-spec-label">${s.label}:</span>
                  <span class="material-spec-value">${s.value}</span>
                </div>
              `
              )
              .join('');
          }

          modal.classList.add('active');
        }
      });
    });
  }

  /* ==========================================================================
     4. BIM TABLE SEARCH & FILTER
     ========================================================================== */

  function initBimTable() {
    const searchInput = document.getElementById('bim-search-input');
    const rows = document.querySelectorAll('.bim-table tbody tr');

    if (!searchInput || !rows.length) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.classList.toggle('is-filtered-out', !text.includes(query));
      });
    });
  }

  /* ==========================================================================
     5. FAQ ACCORDION (Attachment 3)
     ========================================================================== */

  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
      const btn = item.querySelector('.faq-question-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          faqItems.forEach((other) => other.classList.remove('active'));

          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  /* ==========================================================================
     6. CADERNO TÉCNICO PDF PREVIEW MODAL
     ========================================================================== */

  function initCadernoPdfModal() {
    const openBtns = document.querySelectorAll('.btn-open-caderno-modal');
    const modal = document.getElementById('modal-caderno-preview');
    const pageTabs = document.querySelectorAll('.caderno-page-tab');
    const pagePanels = document.querySelectorAll('.caderno-page-view');

    if (!modal) return;

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
      });
    });

    // Page Switching inside PDF simulation
    pageTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        pageTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const pageId = tab.getAttribute('data-page');
        pagePanels.forEach((panel) => {
          panel.classList.toggle('is-active', panel.getAttribute('data-page') === pageId);
        });
      });
    });

    const printButton = modal.querySelector('.btn-print-page');
    if (printButton) {
      printButton.addEventListener('click', () => window.print());
    }
  }

  /* ==========================================================================
     7. TECHNICAL STUDY APPOINTMENT / ESTIMATOR MODAL
     ========================================================================== */

  function initAppointmentModal() {
    const openBtns = document.querySelectorAll('.btn-open-appointment-modal');
    const modal = document.getElementById('modal-technical-appointment');
    const areaInput = document.getElementById('calc-area-range');
    const areaVal = document.getElementById('calc-area-display');
    const projectType = document.getElementById('calc-project-type');
    const estTime = document.getElementById('calc-est-time');
    const estDocs = document.getElementById('calc-est-docs');

    if (!modal) return;

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
      });
    });

    function updateCalculations() {
      if (!areaInput || !areaVal) return;
      const area = parseInt(areaInput.value, 10);
      areaVal.textContent = `${area} m²`;

      const type = projectType ? projectType.value : 'residencial';
      let weeks = 6;
      let renders = 12;

      if (type === 'residencial') {
        weeks = Math.round(4 + area / 150);
        renders = Math.round(8 + area / 50);
      } else if (type === 'comercial') {
        weeks = Math.round(6 + area / 200);
        renders = Math.round(14 + area / 60);
      } else if (type === 'requalificacao') {
        weeks = Math.round(5 + area / 120);
        renders = Math.round(10 + area / 40);
      }

      if (estTime) estTime.textContent = `~ ${weeks} semanas`;
      if (estDocs) estDocs.textContent = `${renders} renders 8K + Dossier BIM IFC`;
    }

    if (areaInput) {
      areaInput.addEventListener('input', updateCalculations);
    }
    if (projectType) {
      projectType.addEventListener('change', updateCalculations);
    }
    updateCalculations();

    const form = document.getElementById('appointment-form');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        window.alert('Solicitação de orçamento registada com sucesso! A equipa do Nexus Design de Interiores e Construção entrará em contacto nas próximas 24 horas.');
        modal.classList.remove('active');
      });
    }
  }

  /* ==========================================================================
     8. GLOBAL MODALS CLOSE LOGIC
     ========================================================================== */

  function initModalsClose() {
    const allModals = document.querySelectorAll('.modal-backdrop');

    allModals.forEach((modal) => {
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('active');
        });
      }

      // Close on backdrop click outside window
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        allModals.forEach((modal) => modal.classList.remove('active'));
      }
    });
  }

  /* ==========================================================================
     9. REAL-TIME LUANDA CLOCK & MOUSE CAD CROSSHAIR
     ========================================================================== */

  function initTelemetryClockAndCursor() {
    const clockElem = document.getElementById('ticker-clock-readout');
    const cursor = document.querySelector('.custom-cursor');
    const coordElem = document.querySelector('.cursor-coords');

    // Update Luanda Time (WAT is UTC+1)
    function updateClock() {
      if (!clockElem) return;
      const now = new Date();
      // Calculate UTC+1
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const luandaTime = new Date(utc + 3600000);
      const hours = String(luandaTime.getHours()).padStart(2, '0');
      const minutes = String(luandaTime.getMinutes()).padStart(2, '0');
      const seconds = String(luandaTime.getSeconds()).padStart(2, '0');
      clockElem.textContent = `${hours}:${minutes}:${seconds} WAT (LUANDA)`;
    }

    setInterval(updateClock, 1000);
    updateClock();

    // Scale Switcher on top bar
    const scaleBtn = document.getElementById('btn-scale-toggle');
    if (scaleBtn) {
      scaleBtn.addEventListener('click', () => {
        const is100 = scaleBtn.textContent.includes('1:100');
        scaleBtn.innerHTML = is100 ? 'ESCALA: <strong>1:50</strong>' : 'ESCALA: <strong>1:100</strong>';
      });
    }

    // Cursor Follower
    if (cursor && coordElem) {
      window.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        const cadX = (e.clientX * 0.42).toFixed(2).padStart(6, '0');
        const cadY = (e.clientY * 0.42).toFixed(2).padStart(6, '0');
        coordElem.textContent = `CAD X:${cadX} Y:${cadY}`;
      });
    }
  }

    // Hero 3D WebGL / 8K Render Mode Toggle
    function initHero3dToggle() {
      const btnToggle = document.getElementById('btn-toggle-hero-3d');
      const container3D = document.getElementById('hero-3d-canvas-container');
      const imgDisplay = document.getElementById('hero-display-img');

      if (!btnToggle || !container3D || !imgDisplay) return;

      btnToggle.addEventListener('click', () => {
        const is3DActive = container3D.classList.contains('is-visible');
        if (is3DActive) {
          container3D.classList.remove('is-visible');
          imgDisplay.classList.remove('is-hidden');
          btnToggle.textContent = '3D INTERATIVO (WEBGL)';
          btnToggle.classList.remove('active');
        } else {
          container3D.classList.add('is-visible');
          imgDisplay.classList.add('is-hidden');
          btnToggle.textContent = 'RENDER FOTORREALISTA';
          btnToggle.classList.add('active');
          window.dispatchEvent(new Event('resize'));
        }
      });
    }

    /* ==========================================================================
       INIT ALL
       ========================================================================== */

    document.addEventListener('DOMContentLoaded', () => {
      initBeforeAfterSlider();
      initSpatialVisualizer();
      initMaterialsSection();
      initBimTable();
      initFaqAccordion();
      initCadernoPdfModal();
      initAppointmentModal();
      initModalsClose();
      initTelemetryClockAndCursor();
      initHero3dToggle();
    });
  })();
