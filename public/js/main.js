/* ==========================================================================
   NEXUS ARCHITECTURAL ATELIER — MAIN CLIENT CONTROLLER
   Before/After Slider, Spatial Visualizer HUD, Materials Filter & Modal,
   BIM Filter, Technical Dossier PDF Preview, Project Scope Estimator
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     1. BEFORE / AFTER COMPARISON SLIDER
     ========================================================================== */

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
    const camBtns = document.querySelectorAll('.cam-btn');
    const lightBtns = document.querySelectorAll('.light-btn');
    const btnZoomIn = document.getElementById('btn-viewer-zoom-in');
    const btnZoomOut = document.getElementById('btn-viewer-zoom-out');
    const btnFullscreen = document.getElementById('btn-viewer-fullscreen');
    const viewerFrame = document.querySelector('.viewer-viewport-frame');
    const readoutFov = document.getElementById('viewer-telemetry-fov');

    if (!mainImg) return;

    let currentZoom = 1.0;

    // Camera viewpoints database
    const cameraViews = {
      'cam-ext-twilight': {
        src: '/assets/images/i1.jpg',
        title: 'FACHADA PRINCIPAL (CREPÚSCULO)',
        fov: '42°',
        exposure: '+0.2 EV',
        lat: '-8.83833°'
      },
      'cam-living-fire': {
        src: '/assets/images/i5.jpg',
        title: 'LIVING & LAREIRA CENTRAL',
        fov: '54°',
        exposure: '-0.1 EV',
        lat: '-8.83830°'
      },
      'cam-living-garden': {
        src: '/assets/images/i2.jpg',
        title: 'SALA MINIMALISTA & JARDIM',
        fov: '48°',
        exposure: '+0.0 EV',
        lat: '-8.83832°'
      },
      'cam-ext-night': {
        src: '/assets/images/i4.jpg',
        title: 'VISTA AÉREA & PISCINA',
        fov: '38°',
        exposure: '+0.4 EV',
        lat: '-8.83835°'
      },
      'cam-cad-plan': {
        src: '/assets/images/i3.jpg',
        title: 'ESTUDO CAD & IMPLANTAÇÃO',
        fov: 'ORTHO 1:100',
        exposure: 'CAD 2D',
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
          mainImg.style.opacity = '0';
          setTimeout(() => {
            mainImg.src = viewData.src;
            mainImg.style.opacity = '1';
          }, 200);

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
        mainImg.className = 'viewer-main-img';
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
      title: 'Latão Acabamento Escovado',
      code: 'NEX-MAT-BR01',
      category: 'Metais Nobres',
      img: '/assets/images/mat_latao.jpg',
      specs: [
        { label: 'Liga Metálica', value: 'CuZn37 (63% Cobre / 37% Zinco)' },
        { label: 'Espessura Nominal', value: '2.5 mm com reforço posterior em alumínio' },
        { label: 'Tratamento de Superfície', value: 'Escovagem direcional acetinada + Verniz eletrostático mate' },
        { label: 'Resistência à Corrosão', value: 'Ensaio Salt-Spray ASTM B117 (> 720h ambiente salino Luanda)' },
        { label: 'Aplicação Principal', value: 'Revestimento de pórticos interiores, sancas de luz e nichos decorativos' }
      ]
    },
    'carvalho': {
      title: 'Madeira Carvalho Natural',
      code: 'NEX-MAT-WO02',
      category: 'Madeiras Maciças',
      img: '/assets/images/mat_carvalho.jpg',
      specs: [
        { label: 'Espécie Botânica', value: 'Quercus robur (Carvalho Europeu certificado FSC)' },
        { label: 'Seção dos Ripados', value: '30 x 40 mm com espaçamento de 15 mm' },
        { label: 'Tratamento Protetor', value: '3 demãos de óleo mineral UV hidrofóbico classe A+' },
        { label: 'Absorção Acústica', value: 'NRC 0.75 com manta de lã de rocha interior 40 kg/m³' },
        { label: 'Aplicação Principal', value: 'Painéis acústicos de sala de estar, forros de teto e marcenaria integrada' }
      ]
    },
    'aco': {
      title: 'Aço Primário Estrutural',
      code: 'NEX-MAT-ST03',
      category: 'Estruturas Metálicas',
      img: '/assets/images/mat_aco.jpg',
      specs: [
        { label: 'Classificação Estrutural', value: 'Aço S355JR segundo EN 10025-2' },
        { label: 'Seções Perfiladas', value: 'Tubulares quadrados RHS 250x250x12 mm & Vigas HEB 300' },
        { label: 'Tratamento Anticorrosivo', value: 'Decapagem Sa 2.5 + Metalização a zinco + Pintura epóxi C5M Luanda' },
        { label: 'Capacidade de Carga', value: 'Consolas em balanço livre até 4.80 metros' },
        { label: 'Aplicação Principal', value: 'Pilares em consolas de varanda, pérgulas de cobertura e reforço de vãos' }
      ]
    },
    'caixilharia': {
      title: 'Caixilharia Oculta & Vidro Duplo',
      code: 'NEX-MAT-GL04',
      category: 'Envolvente Térmica',
      img: '/assets/images/mat_caixilharia.jpg',
      specs: [
        { label: 'Sistema de Caixilharia', value: 'Alumínio extrudido termolacado preto mate com corte térmico 34mm' },
        { label: 'Composição do Vidro', value: '10 mm Sunguard Solar + 16 mm Gás Argónio + 10 mm Laminado Acústico' },
        { label: 'Desempenho Térmico (Ug)', value: '1.1 W/(m²·K) com controle solar fator g = 0.28' },
        { label: 'Isolamento Acústico', value: 'Atenuação acústica certificada Rw = 44 dB' },
        { label: 'Aplicação Principal', value: 'Panos de vidro de piso ao teto (altura 3.40 m) com embutimento perimétrico' }
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
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
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
                <div style="border-bottom: 1px solid var(--color-border); padding: 0.6rem 0; display: flex; justify-content: space-between; gap: 1rem; font-family: var(--font-mono); font-size: 11px;">
                  <span style="color: var(--tertiary-blueprint); text-transform: uppercase;">${s.label}:</span>
                  <span style="color: var(--color-white); font-weight: 600; text-align: right;">${s.value}</span>
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
        row.style.display = text.includes(query) ? '' : 'none';
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
          panel.style.display = panel.getAttribute('data-page') === pageId ? 'block' : 'none';
        });
      });
    });
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
        const is3DActive = container3D.style.display !== 'none';
        if (is3DActive) {
          container3D.style.display = 'none';
          imgDisplay.style.display = 'block';
          btnToggle.textContent = '3D INTERATIVO (WEBGL)';
          btnToggle.classList.remove('active');
        } else {
          container3D.style.display = 'block';
          imgDisplay.style.display = 'none';
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
