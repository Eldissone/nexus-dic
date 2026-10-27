/* ==========================================================================
   ORTHOGONAL / NEXUS ARCHITECTURAL ATELIER — THREE.JS 3D SCENES
   Scene 1: Interactive Hero Architectural Villa (Bright Sunny Daylight)
   Scene 2: Axonometria Explodida (Light Theme CAD Assembly)
   ========================================================================== */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error('Three.js library is not loaded');
    return;
  }

  /* ==========================================================================
     SCENE 1: HERO ARCHITECTURAL VILLA (SUNNY DAYLIGHT)
     ========================================================================== */

  const heroContainer = document.getElementById('hero-3d-canvas-container');
  let heroRenderer, heroScene, heroCamera, heroControls;
  let heroBuildingGroup = new THREE.Group();
  let heroMaterials = {
    whitePlaster: null,
    oakWood: null,
    concrete: null,
    darkFrame: null,
    glass: null,
    poolWater: null
  };
  let heroRenderMode = 'solid';

  function initHeroScene() {
    if (!heroContainer) return;

    const width = heroContainer.clientWidth || 800;
    const height = heroContainer.clientHeight || 520;

    heroScene = new THREE.Scene();
    heroScene.background = null; // Transparent to inherit background

    heroCamera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    heroCamera.position.set(24, 14, 26);

    heroRenderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('hero-3d-canvas'),
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    heroRenderer.setSize(width, height);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    heroRenderer.toneMappingExposure = 1.25;

    if (typeof THREE.OrbitControls !== 'undefined') {
      heroControls = new THREE.OrbitControls(heroCamera, heroRenderer.domElement);
      heroControls.enableDamping = true;
      heroControls.dampingFactor = 0.05;
      heroControls.enableZoom = true;
      heroControls.maxPolarAngle = Math.PI / 2 - 0.02;
      heroControls.minDistance = 10;
      heroControls.maxDistance = 50;
      heroControls.target.set(0, 3.5, 0);
    }

    // Sunny Daylight Lighting
    const hemiLight = new THREE.HemisphereLight(0x7bb0f5, 0xf1f5f9, 1.3);
    heroScene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(25, 45, 20);
    heroScene.add(sunLight);

    const fillSunLight = new THREE.DirectionalLight(0xb0d4ff, 0.8);
    fillSunLight.position.set(-25, 20, -20);
    heroScene.add(fillSunLight);

    // Materials — Clean White Concrete, Warm Oak Slat, Crystal Glass & Cyan Pool
    heroMaterials.whitePlaster = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.35,
      metalness: 0.05
    });

    heroMaterials.oakWood = new THREE.MeshStandardMaterial({
      color: 0xc49a6c, // Natural warm architectural oak
      roughness: 0.45,
      metalness: 0.05
    });

    heroMaterials.concrete = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.6,
      metalness: 0.1
    });

    heroMaterials.darkFrame = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.7
    });

    heroMaterials.glass = new THREE.MeshPhysicalMaterial({
      color: 0xdff2fc,
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.52
    });

    heroMaterials.poolWater = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.05,
      metalness: 0.2
    });

    buildDaylightVilla();
    heroScene.add(heroBuildingGroup);

    // Subtle Ground Grid (Clean white & sky blue)
    const gridHelper = new THREE.GridHelper(60, 40, 0x3b82f6, 0xe2e8f0);
    gridHelper.position.y = -0.01;
    heroScene.add(gridHelper);

    window.addEventListener('resize', onHeroResize);
    setupHeroControls();
    animateHero();
  }

  function buildDaylightVilla() {
    heroBuildingGroup.clear();

    // Base podium / terrace slab
    const podiumGeo = new THREE.BoxGeometry(22, 0.8, 18);
    const podium = new THREE.Mesh(podiumGeo, heroMaterials.concrete);
    podium.position.set(0, 0.4, 0);
    heroBuildingGroup.add(podium);

    // Pool
    const poolGeo = new THREE.BoxGeometry(10, 0.6, 5);
    const pool = new THREE.Mesh(poolGeo, heroMaterials.poolWater);
    pool.position.set(-4, 0.55, 5);
    heroBuildingGroup.add(pool);

    // Ground Floor Living Room
    const gfWallsGeo = new THREE.BoxGeometry(12, 3.8, 8);
    const gfWalls = new THREE.Mesh(gfWallsGeo, heroMaterials.whitePlaster);
    gfWalls.position.set(2, 2.7, -1);
    heroBuildingGroup.add(gfWalls);

    // Oak feature wall inside living room
    const woodFeatureGeo = new THREE.BoxGeometry(8, 3.6, 0.3);
    const woodFeature = new THREE.Mesh(woodFeatureGeo, heroMaterials.oakWood);
    woodFeature.position.set(2, 2.7, -4.5);
    heroBuildingGroup.add(woodFeature);

    // Floor-to-ceiling glass facade
    const gfGlassGeo = new THREE.BoxGeometry(11.8, 3.6, 0.2);
    const gfGlass = new THREE.Mesh(gfGlassGeo, heroMaterials.glass);
    gfGlass.position.set(2, 2.7, 3.01);
    heroBuildingGroup.add(gfGlass);

    // First Floor Intermediate Cantilevered Slab (White)
    const slab1Geo = new THREE.BoxGeometry(16, 0.6, 12);
    const slab1 = new THREE.Mesh(slab1Geo, heroMaterials.whitePlaster);
    slab1.position.set(1, 4.9, 0);
    heroBuildingGroup.add(slab1);

    // First Floor Upper Volume (Oak Wood Cladding Soffit)
    const ffVolGeo = new THREE.BoxGeometry(10, 3.4, 7);
    const ffVol = new THREE.Mesh(ffVolGeo, heroMaterials.oakWood);
    ffVol.position.set(0, 6.9, 1.5);
    heroBuildingGroup.add(ffVol);

    // First Floor Glass Balcony
    const ffGlassGeo = new THREE.BoxGeometry(9.8, 3.2, 0.15);
    const ffGlass = new THREE.Mesh(ffGlassGeo, heroMaterials.glass);
    ffGlass.position.set(0, 6.9, 5.01);
    heroBuildingGroup.add(ffGlass);

    // Balcony Glass Railing
    const railGeo = new THREE.BoxGeometry(15.6, 1.1, 0.1);
    const rail = new THREE.Mesh(railGeo, heroMaterials.glass);
    rail.position.set(1, 5.65, 5.9);
    heroBuildingGroup.add(rail);

    // Structural Dark Aluminum Mullions
    const colGeo = new THREE.BoxGeometry(0.3, 4.5, 0.3);
    const colPositions = [
      [-6, 2.65, 5],
      [-6, 2.65, -3],
      [7, 2.65, 5],
      [7, 2.65, -3]
    ];
    colPositions.forEach((pos) => {
      const col = new THREE.Mesh(colGeo, heroMaterials.darkFrame);
      col.position.set(pos[0], pos[1], pos[2]);
      heroBuildingGroup.add(col);
    });

    // Roof Slab (Clean White Cantilever)
    const roofGeo = new THREE.BoxGeometry(12, 0.5, 9);
    const roof = new THREE.Mesh(roofGeo, heroMaterials.whitePlaster);
    roof.position.set(0, 8.85, 1.5);
    heroBuildingGroup.add(roof);

    // Wireframe overlay lines
    heroBuildingGroup.traverse((child) => {
      if (child.isMesh && child.geometry && child !== pool) {
        const wireGeo = new THREE.EdgesGeometry(child.geometry);
        const wireMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.4 });
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
            x: 24,
            y: 14,
            z: 26,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => heroControls.update()
          });
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
    if (heroControls) heroControls.update();
    if (heroBuildingGroup && heroControls && !heroControls.state) {
      heroBuildingGroup.rotation.y += 0.001;
    }
    heroRenderer.render(heroScene, heroCamera);
  }

  /* ==========================================================================
     SCENE 2: AXONOMETRIA EXPLODIDA (LIGHT THEME)
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
  let explosionFactor = 0.55;

  function initAxonScene() {
    if (!axonContainer) return;

    const width = axonContainer.clientWidth;
    const height = axonContainer.clientHeight || 580;

    axonScene = new THREE.Scene();
    axonScene.background = new THREE.Color(0xf8fafc); // Crisp light background

    const aspect = width / height;
    const d = 16;
    axonCamera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    axonCamera.position.set(24, 28, 24);
    axonCamera.lookAt(0, 5, 0);

    axonRenderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('axon-3d-canvas'),
      antialias: true
    });
    axonRenderer.setSize(width, height);
    axonRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (typeof THREE.OrbitControls !== 'undefined') {
      axonControls = new THREE.OrbitControls(axonCamera, axonRenderer.domElement);
      axonControls.enableDamping = true;
      axonControls.dampingFactor = 0.08;
      axonControls.target.set(0, 5, 0);
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    axonScene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(30, 40, 20);
    axonScene.add(dirLight1);

    buildAxonometricLayers();

    const axonGrid = new THREE.GridHelper(40, 20, 0x2563eb, 0xcfd8dc);
    axonGrid.position.y = -1;
    axonScene.add(axonGrid);

    setupAxonControls();
    window.addEventListener('resize', onAxonResize);
    animateAxon();
  }

  function createLayerMesh(geometry, color, wireColor = 0x2563eb, opacity = 1.0) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.45,
      metalness: 0.1,
      transparent: opacity < 1.0,
      opacity: opacity
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: wireColor, linewidth: 2 });
    const wire = new THREE.LineSegments(edges, lineMat);
    group.add(wire);

    return group;
  }

  function buildAxonometricLayers() {
    // Foundation
    const foundationGeo = new THREE.BoxGeometry(16, 1.2, 12);
    axonLayers.layer6_foundation = createLayerMesh(foundationGeo, 0xcfd8dc, 0x64748b);
    axonScene.add(axonLayers.layer6_foundation);

    // Walls & Wood partitions (Interior Design)
    const wallsGroup = new THREE.Group();
    const wall1 = createLayerMesh(new THREE.BoxGeometry(0.5, 3.2, 11), 0xffffff, 0x2563eb);
    wall1.position.set(-7, 1.6, 0);
    const wall2 = createLayerMesh(new THREE.BoxGeometry(14, 3.2, 0.5), 0xffffff, 0x2563eb);
    wall2.position.set(0, 1.6, -5.5);
    const partition1 = createLayerMesh(new THREE.BoxGeometry(6, 3.2, 0.4), 0xc49a6c, 0xd97706);
    partition1.position.set(0, 1.6, 1);
    wallsGroup.add(wall1);
    wallsGroup.add(wall2);
    wallsGroup.add(partition1);
    axonLayers.layer5_walls = wallsGroup;
    axonScene.add(axonLayers.layer5_walls);

    // Glazing
    const glassGroup = new THREE.Group();
    const glass1 = createLayerMesh(new THREE.BoxGeometry(15, 3.2, 0.15), 0x38bdf8, 0x0284c7, 0.4);
    glass1.position.set(0, 1.6, 5.5);
    const glass2 = createLayerMesh(new THREE.BoxGeometry(0.15, 3.2, 10), 0x38bdf8, 0x0284c7, 0.4);
    glass2.position.set(7.5, 1.6, 0);
    glassGroup.add(glass1);
    glassGroup.add(glass2);
    axonLayers.layer4_glazing = glassGroup;
    axonScene.add(axonLayers.layer4_glazing);

    // Intermediate Slab
    const slabGeo = new THREE.BoxGeometry(17, 0.7, 13);
    axonLayers.layer3_slab = createLayerMesh(slabGeo, 0xe2e8f0, 0x2563eb);
    axonScene.add(axonLayers.layer3_slab);

    // Steel Trusses
    const trussGroup = new THREE.Group();
    for (let i = -7; i <= 7; i += 2.5) {
      const truss = createLayerMesh(new THREE.BoxGeometry(0.2, 0.8, 12), 0x1e293b, 0x2563eb);
      truss.position.set(i, 0.4, 0);
      trussGroup.add(truss);
    }
    axonLayers.layer2_truss = trussGroup;
    axonScene.add(axonLayers.layer2_truss);

    // Green Roof
    const roofGeo = new THREE.BoxGeometry(17.5, 0.8, 13.5);
    axonLayers.layer1_roof = createLayerMesh(roofGeo, 0x4ade80, 0x16a34a);
    axonScene.add(axonLayers.layer1_roof);

    updateLayerExplosion(explosionFactor);
  }

  function updateLayerExplosion(factor) {
    explosionFactor = factor;
    const separationDistance = 4.2 * factor;

    if (axonLayers.layer6_foundation) axonLayers.layer6_foundation.position.y = 0;
    if (axonLayers.layer5_walls) axonLayers.layer5_walls.position.y = 1.2 + separationDistance * 0.7;
    if (axonLayers.layer4_glazing) axonLayers.layer4_glazing.position.y = 2.4 + separationDistance * 1.5;
    if (axonLayers.layer3_slab) axonLayers.layer3_slab.position.y = 4.0 + separationDistance * 2.5;
    if (axonLayers.layer2_truss) axonLayers.layer2_truss.position.y = 5.2 + separationDistance * 3.6;
    if (axonLayers.layer1_roof) axonLayers.layer1_roof.position.y = 6.4 + separationDistance * 4.8;
  }

  function setupAxonControls() {
    const slider = document.getElementById('axon-explosion-slider');
    const readout = document.getElementById('axon-slider-readout');
    const btnWire = document.getElementById('btn-axon-wire');
    const btnFallback = document.getElementById('btn-axon-toggle-fallback');
    const staticLayer = document.querySelector('.axon-static-layer');

    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        updateLayerExplosion(val);
        if (readout) readout.textContent = `${Math.round(val * 100)}%`;
      });
    }

    if (btnWire) {
      let isWire = false;
      btnWire.addEventListener('click', () => {
        isWire = !isWire;
        btnWire.classList.toggle('active', isWire);
        axonScene.traverse((child) => {
          if (child.isMesh) child.material.wireframe = isWire;
        });
      });
    }

    if (btnFallback && staticLayer) {
      btnFallback.addEventListener('click', () => {
        const isStatic = staticLayer.classList.toggle('active');
        btnFallback.classList.toggle('active', isStatic);
        btnFallback.textContent = isStatic ? '3D INTERATIVO (WEBGL)' : 'CAD ESQUEMÁTICO (2D)';
      });
    }
  }

  function onAxonResize() {
    if (!axonContainer || !axonCamera || !axonRenderer) return;
    const width = axonContainer.clientWidth;
    const height = axonContainer.clientHeight || 580;
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
    if (axonControls) axonControls.update();
    axonRenderer.render(axonScene, axonCamera);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeroScene();
    initAxonScene();
  });
})();
