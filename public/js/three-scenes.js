/* ==========================================================================
   NEXUS ARCHITECTURAL ATELIER — THREE.JS 3D SCENES
   Scene 1: Interactive Hero Architectural Villa
   Scene 2: Axonometria Explodida (Real-Time Structural Layer Separation)
   ========================================================================== */

(function () {
  'use strict';

  // Check if THREE is loaded
  if (typeof THREE === 'undefined') {
    console.error('Three.js library is not loaded');
    return;
  }

  /* ==========================================================================
     SCENE 1: HERO ARCHITECTURAL VILLA
     ========================================================================== */

  const heroContainer = document.getElementById('hero-3d-canvas-container');
  let heroRenderer, heroScene, heroCamera, heroControls;
  let heroBuildingGroup = new THREE.Group();
  let heroMaterials = {
    concrete: null,
    darkStone: null,
    glass: null,
    steel: null,
    accentYellow: null,
    wireframe: null,
    pool: null
  };
  let heroRenderMode = 'solid'; // 'solid' or 'wireframe'

  function initHeroScene() {
    if (!heroContainer) return;

    // Dimensions
    const width = heroContainer.clientWidth;
    const height = heroContainer.clientHeight;

    // Scene & Fog
    heroScene = new THREE.Scene();
    heroScene.background = null; // Transparent to see body background
    heroScene.fog = new THREE.FogExp2(0x101114, 0.025);

    // Camera
    heroCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    heroCamera.position.set(22, 14, 26);

    // Renderer
    heroRenderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('hero-3d-canvas'),
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    heroRenderer.setSize(width, height);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    heroRenderer.toneMappingExposure = 1.2;

    // Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      heroControls = new THREE.OrbitControls(heroCamera, heroRenderer.domElement);
      heroControls.enableDamping = true;
      heroControls.dampingFactor = 0.05;
      heroControls.enableZoom = true;
      heroControls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below floor
      heroControls.minDistance = 10;
      heroControls.maxDistance = 50;
      heroControls.target.set(0, 3, 0);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    heroScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8e7, 1.8);
    dirLight.position.set(20, 35, 20);
    heroScene.add(dirLight);

    const blueFillLight = new THREE.DirectionalLight(0x4a6984, 0.8);
    blueFillLight.position.set(-20, 15, -20);
    heroScene.add(blueFillLight);

    // Warm Interior Pointlights
    const interiorLight1 = new THREE.PointLight(0xf5d829, 2.5, 18);
    interiorLight1.position.set(0, 3, 0);
    heroScene.add(interiorLight1);

    const interiorLight2 = new THREE.PointLight(0xffeedd, 1.8, 15);
    interiorLight2.position.set(3, 7, 2);
    heroScene.add(interiorLight2);

    // Materials
    heroMaterials.concrete = new THREE.MeshStandardMaterial({
      color: 0x38393e,
      roughness: 0.65,
      metalness: 0.1
    });

    heroMaterials.darkStone = new THREE.MeshStandardMaterial({
      color: 0x1a1b1f,
      roughness: 0.8,
      metalness: 0.2
    });

    heroMaterials.glass = new THREE.MeshPhysicalMaterial({
      color: 0x0a141e,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.5
    });

    heroMaterials.steel = new THREE.MeshStandardMaterial({
      color: 0x111215,
      roughness: 0.4,
      metalness: 0.8
    });

    heroMaterials.accentYellow = new THREE.MeshBasicMaterial({
      color: 0xf5d829
    });

    heroMaterials.wireframe = new THREE.MeshBasicMaterial({
      color: 0xf5d829,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });

    heroMaterials.pool = new THREE.MeshStandardMaterial({
      color: 0x0d2b3a,
      roughness: 0.05,
      metalness: 0.3
    });

    // Build the Villa Geometry
    buildHeroVilla();
    heroScene.add(heroBuildingGroup);

    // Subtle Ground Grid
    const gridHelper = new THREE.GridHelper(60, 40, 0xf5d829, 0x24262d);
    gridHelper.position.y = -0.01;
    heroScene.add(gridHelper);

    // Event Listeners
    window.addEventListener('resize', onHeroResize);

    // Setup Canvas UI Controls
    setupHeroControls();

    // Start Loop
    animateHero();
  }

  function buildHeroVilla() {
    heroBuildingGroup.clear();

    // Base podium / terrace slab
    const podiumGeo = new THREE.BoxGeometry(22, 0.8, 18);
    const podium = new THREE.Mesh(podiumGeo, heroMaterials.darkStone);
    podium.position.set(0, 0.4, 0);
    heroBuildingGroup.add(podium);

    // Infinity Pool
    const poolGeo = new THREE.BoxGeometry(10, 0.6, 5);
    const pool = new THREE.Mesh(poolGeo, heroMaterials.pool);
    pool.position.set(-4, 0.5, 5);
    heroBuildingGroup.add(pool);

    // Pool glowing border line
    const poolBorderGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-9, 0.85, 2.5),
      new THREE.Vector3(1, 0.85, 2.5),
      new THREE.Vector3(1, 0.85, 7.5),
      new THREE.Vector3(-9, 0.85, 7.5),
      new THREE.Vector3(-9, 0.85, 2.5)
    ]);
    const poolBorder = new THREE.Line(poolBorderGeo, new THREE.LineBasicMaterial({ color: 0xf5d829, linewidth: 2 }));
    heroBuildingGroup.add(poolBorder);

    // Ground Floor Main Box (Living Pavilion)
    const gfWallsGeo = new THREE.BoxGeometry(12, 3.8, 8);
    const gfWalls = new THREE.Mesh(gfWallsGeo, heroMaterials.concrete);
    gfWalls.position.set(2, 2.7, -1);
    heroBuildingGroup.add(gfWalls);

    // Large Glass Curtain Wall Ground Floor
    const gfGlassGeo = new THREE.BoxGeometry(11.8, 3.6, 0.2);
    const gfGlass = new THREE.Mesh(gfGlassGeo, heroMaterials.glass);
    gfGlass.position.set(2, 2.7, 3.01);
    heroBuildingGroup.add(gfGlass);

    // First Floor Intermediate Cantilevered Slab
    const slab1Geo = new THREE.BoxGeometry(16, 0.6, 12);
    const slab1 = new THREE.Mesh(slab1Geo, heroMaterials.concrete);
    slab1.position.set(1, 4.9, 0);
    heroBuildingGroup.add(slab1);

    // First Floor Upper Volume (Cantilevered Suite)
    const ffVolGeo = new THREE.BoxGeometry(10, 3.4, 7);
    const ffVol = new THREE.Mesh(ffVolGeo, heroMaterials.darkStone);
    ffVol.position.set(0, 6.9, 1.5);
    heroBuildingGroup.add(ffVol);

    // First Floor Glass Balcony & Bedroom
    const ffGlassGeo = new THREE.BoxGeometry(9.8, 3.2, 0.15);
    const ffGlass = new THREE.Mesh(ffGlassGeo, heroMaterials.glass);
    ffGlass.position.set(0, 6.9, 5.01);
    heroBuildingGroup.add(ffGlass);

    // Balcony Glass Railing
    const railGeo = new THREE.BoxGeometry(15.6, 1.1, 0.1);
    const rail = new THREE.Mesh(railGeo, heroMaterials.glass);
    rail.position.set(1, 5.65, 5.9);
    heroBuildingGroup.add(rail);

    // Structural Steel Columns
    const colGeo = new THREE.BoxGeometry(0.35, 4.5, 0.35);
    const colPositions = [
      [-6, 2.65, 5],
      [-6, 2.65, -3],
      [7, 2.65, 5],
      [7, 2.65, -3]
    ];
    colPositions.forEach((pos) => {
      const col = new THREE.Mesh(colGeo, heroMaterials.steel);
      col.position.set(pos[0], pos[1], pos[2]);
      heroBuildingGroup.add(col);
    });

    // Roof Slab
    const roofGeo = new THREE.BoxGeometry(12, 0.5, 9);
    const roof = new THREE.Mesh(roofGeo, heroMaterials.concrete);
    roof.position.set(0, 8.85, 1.5);
    heroBuildingGroup.add(roof);

    // Architectural Linear Highlight (Yellow LED Strip along Cantilever)
    const ledPoints = [
      new THREE.Vector3(-7, 4.6, 6),
      new THREE.Vector3(9, 4.6, 6),
      new THREE.Vector3(9, 4.6, -6),
      new THREE.Vector3(-7, 4.6, -6),
      new THREE.Vector3(-7, 4.6, 6)
    ];
    const ledGeo = new THREE.BufferGeometry().setFromPoints(ledPoints);
    const ledLine = new THREE.Line(ledGeo, new THREE.LineBasicMaterial({ color: 0xf5d829, linewidth: 3 }));
    heroBuildingGroup.add(ledLine);

    // Add Wireframe overlay edges to all meshes
    heroBuildingGroup.traverse((child) => {
      if (child.isMesh && child.geometry && child !== pool) {
        const wireGeo = new THREE.EdgesGeometry(child.geometry);
        const wireMat = new THREE.LineBasicMaterial({ color: 0x6e7078, transparent: true, opacity: 0.35 });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        child.add(wire);
      }
    });
  }

  function setupHeroControls() {
    const btnWire = document.getElementById('btn-hero-wireframe');
    const btnReset = document.getElementById('btn-hero-reset');
    const btnIso = document.getElementById('btn-hero-iso');

    if (btnWire) {
      btnWire.addEventListener('click', () => {
        heroRenderMode = heroRenderMode === 'solid' ? 'wireframe' : 'solid';
        btnWire.classList.toggle('active', heroRenderMode === 'wireframe');
        btnWire.querySelector('.mode-state').textContent = heroRenderMode.toUpperCase();

        heroBuildingGroup.traverse((child) => {
          if (child.isMesh) {
            child.material.wireframe = heroRenderMode === 'wireframe';
          }
        });
      });
    }

    if (btnReset && heroControls) {
      btnReset.addEventListener('click', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(heroCamera.position, {
            x: 22,
            y: 14,
            z: 26,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => heroControls.update()
          });
        } else {
          heroCamera.position.set(22, 14, 26);
          heroControls.target.set(0, 3, 0);
          heroControls.update();
        }
      });
    }

    if (btnIso && heroControls) {
      btnIso.addEventListener('click', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(heroCamera.position, {
            x: 28,
            y: 22,
            z: 28,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => heroControls.update()
          });
        }
      });
    }
  }

  function onHeroResize() {
    if (!heroContainer || !heroCamera || !heroRenderer) return;
    const width = heroContainer.clientWidth;
    const height = heroContainer.clientHeight;
    heroCamera.aspect = width / height;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(width, height);
  }

  function animateHero() {
    requestAnimationFrame(animateHero);

    if (heroControls) {
      heroControls.update();
    }

    // Slow ambient rotation when not dragging
    if (heroBuildingGroup && heroControls && !heroControls.state) {
      heroBuildingGroup.rotation.y += 0.0015;
    }

    heroRenderer.render(heroScene, heroCamera);
  }

  /* ==========================================================================
     SCENE 2: AXONOMETRIA EXPLODIDA: DECOMPOSIÇÃO ESTRUTURAL
     ========================================================================== */

  const axonContainer = document.getElementById('axon-canvas-wrap');
  let axonRenderer, axonScene, axonCamera, axonControls;
  let axonLayers = {
    layer6_foundation: null,
    layer5_walls: null,
    layer4_glazing: null,
    layer3_slab: null,
    layer2_truss: null,
    layer1_roof: null
  };
  let explosionFactor = 0.55; // Default 55% separated
  let isAxonWireframe = false;

  function initAxonScene() {
    if (!axonContainer) return;

    const width = axonContainer.clientWidth;
    const height = axonContainer.clientHeight || 560;

    axonScene = new THREE.Scene();
    axonScene.background = new THREE.Color(0x0e0f13);

    // Isometric Camera setup for architectural axonometry
    const aspect = width / height;
    const d = 16;
    axonCamera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    axonCamera.position.set(24, 28, 24);
    axonCamera.lookAt(0, 5, 0);

    // Renderer
    axonRenderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('axon-3d-canvas'),
      antialias: true
    });
    axonRenderer.setSize(width, height);
    axonRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      axonControls = new THREE.OrbitControls(axonCamera, axonRenderer.domElement);
      axonControls.enableDamping = true;
      axonControls.dampingFactor = 0.08;
      axonControls.target.set(0, 5, 0);
    }

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    axonScene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xfffaed, 1.4);
    dirLight1.position.set(30, 40, 20);
    axonScene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7085a0, 0.8);
    dirLight2.position.set(-20, 20, -20);
    axonScene.add(dirLight2);

    // Build Structural Layers
    buildAxonometricLayers();

    // Subtle Ground Grid
    const axonGrid = new THREE.GridHelper(40, 20, 0xf5d829, 0x24262d);
    axonGrid.position.y = -1;
    axonScene.add(axonGrid);

    // Attach Interactive Controls
    setupAxonControls();

    // Window resize
    window.addEventListener('resize', onAxonResize);

    // Start loop
    animateAxon();
  }

  function createLayerMesh(geometry, color, wireColor = 0xf5d829, opacity = 1.0) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.5,
      metalness: 0.2,
      transparent: opacity < 1.0,
      opacity: opacity
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // Edge wireframe for architectural CAD precision
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: wireColor, linewidth: 2 });
    const wire = new THREE.LineSegments(edges, lineMat);
    group.add(wire);

    return group;
  }

  function buildAxonometricLayers() {
    // LAYER 6: FUNDAÇÃO EM RADIER & VIGAS (Base)
    const foundationGeo = new THREE.BoxGeometry(16, 1.2, 12);
    axonLayers.layer6_foundation = createLayerMesh(foundationGeo, 0x26272b, 0x8e8f94);
    axonLayers.layer6_foundation.baseY = 0;
    axonScene.add(axonLayers.layer6_foundation);

    // LAYER 5: ALVENARIAS, PAREDES & DIVISÓRIAS INTERIORES
    const wallsGroup = new THREE.Group();
    const wall1 = createLayerMesh(new THREE.BoxGeometry(0.5, 3.2, 11), 0x3d3f47, 0xf5d829);
    wall1.position.set(-7, 1.6, 0);
    const wall2 = createLayerMesh(new THREE.BoxGeometry(14, 3.2, 0.5), 0x3d3f47, 0xf5d829);
    wall2.position.set(0, 1.6, -5.5);
    const partition1 = createLayerMesh(new THREE.BoxGeometry(6, 3.2, 0.4), 0x5a4a32, 0xf5d829); // Wood partition
    partition1.position.set(0, 1.6, 1);
    wallsGroup.add(wall1);
    wallsGroup.add(wall2);
    wallsGroup.add(partition1);
    axonLayers.layer5_walls = wallsGroup;
    axonLayers.layer5_walls.baseY = 2;
    axonScene.add(axonLayers.layer5_walls);

    // LAYER 4: CAIXILHARIA OCULTA & PAINÉIS DE VIDRO
    const glassGroup = new THREE.Group();
    const glass1 = createLayerMesh(new THREE.BoxGeometry(15, 3.2, 0.15), 0x1e3345, 0x8be9fd, 0.5);
    glass1.position.set(0, 1.6, 5.5);
    const glass2 = createLayerMesh(new THREE.BoxGeometry(0.15, 3.2, 10), 0x1e3345, 0x8be9fd, 0.5);
    glass2.position.set(7.5, 1.6, 0);
    glassGroup.add(glass1);
    glassGroup.add(glass2);
    axonLayers.layer4_glazing = glassGroup;
    axonLayers.layer4_glazing.baseY = 4;
    axonScene.add(axonLayers.layer4_glazing);

    // LAYER 3: LAJE INTERMÉDIA DE BETÃO ARMADO
    const slabGeo = new THREE.BoxGeometry(17, 0.7, 13);
    axonLayers.layer3_slab = createLayerMesh(slabGeo, 0x2e3037, 0xf5d829);
    axonLayers.layer3_slab.baseY = 6;
    axonScene.add(axonLayers.layer3_slab);

    // LAYER 2: TRELIÇA METÁLICA & ESTRUTURA METÁLICA DE COBERTURA
    const trussGroup = new THREE.Group();
    for (let i = -7; i <= 7; i += 2.5) {
      const truss = createLayerMesh(new THREE.BoxGeometry(0.2, 0.8, 12), 0x1a1a1e, 0xf5d829);
      truss.position.set(i, 0.4, 0);
      trussGroup.add(truss);
    }
    axonLayers.layer2_truss = trussGroup;
    axonLayers.layer2_truss.baseY = 8;
    axonScene.add(axonLayers.layer2_truss);

    // LAYER 1: COBERTURA VERDE & ISOLAMENTO TÉRMICO (Top)
    const roofGeo = new THREE.BoxGeometry(17.5, 0.8, 13.5);
    axonLayers.layer1_roof = createLayerMesh(roofGeo, 0x2c3b28, 0x5af78e); // Green sedum roof
    axonLayers.layer1_roof.baseY = 10;
    axonScene.add(axonLayers.layer1_roof);

    // Apply initial explosion separation
    updateLayerExplosion(explosionFactor);
  }

  function updateLayerExplosion(factor) {
    explosionFactor = factor;
    // Multipliers for vertical explosion displacement
    const separationDistance = 4.2 * factor;

    if (axonLayers.layer6_foundation) {
      axonLayers.layer6_foundation.position.y = 0;
    }
    if (axonLayers.layer5_walls) {
      axonLayers.layer5_walls.position.y = 1.2 + separationDistance * 0.7;
    }
    if (axonLayers.layer4_glazing) {
      axonLayers.layer4_glazing.position.y = 2.4 + separationDistance * 1.5;
    }
    if (axonLayers.layer3_slab) {
      axonLayers.layer3_slab.position.y = 4.0 + separationDistance * 2.5;
    }
    if (axonLayers.layer2_truss) {
      axonLayers.layer2_truss.position.y = 5.2 + separationDistance * 3.6;
    }
    if (axonLayers.layer1_roof) {
      axonLayers.layer1_roof.position.y = 6.4 + separationDistance * 4.8;
    }
  }

  function setupAxonControls() {
    const slider = document.getElementById('axon-explosion-slider');
    const readout = document.getElementById('axon-slider-readout');
    const btnWire = document.getElementById('btn-axon-wire');
    const btnIso = document.getElementById('btn-axon-iso');
    const btnPersp = document.getElementById('btn-axon-persp');
    const btnFallback = document.getElementById('btn-axon-toggle-fallback');
    const staticLayer = document.querySelector('.axon-static-layer');

    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        updateLayerExplosion(val);
        if (readout) {
          readout.textContent = `${Math.round(val * 100)}%`;
        }
      });
    }

    if (btnWire) {
      btnWire.addEventListener('click', () => {
        isAxonWireframe = !isAxonWireframe;
        btnWire.classList.toggle('active', isAxonWireframe);

        axonScene.traverse((child) => {
          if (child.isMesh) {
            child.material.wireframe = isAxonWireframe;
          }
        });
      });
    }

    if (btnIso && axonControls) {
      btnIso.addEventListener('click', () => {
        btnIso.classList.add('active');
        if (btnPersp) btnPersp.classList.remove('active');

        if (typeof gsap !== 'undefined') {
          gsap.to(axonCamera.position, {
            x: 24,
            y: 28,
            z: 24,
            duration: 1,
            ease: 'power2.inOut',
            onUpdate: () => {
              axonCamera.lookAt(0, 5, 0);
              axonControls.update();
            }
          });
        }
      });
    }

    if (btnPersp && axonControls) {
      btnPersp.addEventListener('click', () => {
        btnPersp.classList.add('active');
        if (btnIso) btnIso.classList.remove('active');

        if (typeof gsap !== 'undefined') {
          gsap.to(axonCamera.position, {
            x: 28,
            y: 8,
            z: 26,
            duration: 1,
            ease: 'power2.inOut',
            onUpdate: () => {
              axonCamera.lookAt(0, 5, 0);
              axonControls.update();
            }
          });
        }
      });
    }

    // Toggle between interactive 3D WebGL vs 2D CAD Blueprint render
    if (btnFallback && staticLayer) {
      btnFallback.addEventListener('click', () => {
        const isStatic = staticLayer.classList.toggle('active');
        btnFallback.classList.toggle('active', isStatic);
        btnFallback.textContent = isStatic ? '3D INTERATIVO (WEBGL)' : 'CAD ESQUEMÁTICO (2D)';
      });
    }

    // Layer Highlight Pills
    const layerPills = document.querySelectorAll('.layer-pill');
    layerPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        layerPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        const layerKey = pill.getAttribute('data-layer');
        if (axonLayers[layerKey] && typeof gsap !== 'undefined') {
          gsap.fromTo(
            axonLayers[layerKey].scale,
            { x: 1.05, y: 1.05, z: 1.05 },
            { x: 1.0, y: 1.0, z: 1.0, duration: 0.6, ease: 'elastic.out(1, 0.4)' }
          );
        }
      });
    });
  }

  function onAxonResize() {
    if (!axonContainer || !axonCamera || !axonRenderer) return;
    const width = axonContainer.clientWidth;
    const height = axonContainer.clientHeight || 560;
    const aspect = width / height;
    const d = 16;

    axonCamera.left = -d * aspect;
    axonCamera.right = d * aspect;
    axonCamera.top = d;
    axonCamera.bottom = -d;
    axonCamera.updateProjectionMatrix();
    axonRenderer.setSize(width, height);
  }

  function animateAxon() {
    requestAnimationFrame(animateAxon);

    if (axonControls) {
      axonControls.update();
    }

    axonRenderer.render(axonScene, axonCamera);
  }

  // Auto-init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initHeroScene();
    initAxonScene();
  });
})();
