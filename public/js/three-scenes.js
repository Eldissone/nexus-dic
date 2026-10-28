
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

  document.addEventListener('DOMContentLoaded', () => {
    initHeroScene();
  });
})();
