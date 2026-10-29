/*
  Interactive architectural canvas. This renderer deliberately uses the browser's
  built-in Canvas 2D API so the experience remains available when offline.
*/
(function () {
  'use strict';

  const container = document.getElementById('hero-3d-canvas-container');
  const canvas = document.getElementById('hero-3d-canvas');
  if (!container || !canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const model = [
    { x: 0, y: 0, z: 0, w: 22, h: 0.8, d: 18, color: '#d9e2ec' },
    { x: -4, y: 0.6, z: 5, w: 10, h: 0.45, d: 5, color: '#38bdf8' },
    { x: 2, y: 2.7, z: -1, w: 12, h: 3.8, d: 8, color: '#f8fafc' },
    { x: 2, y: 2.7, z: -4.5, w: 8, h: 3.6, d: 0.32, color: '#c49a6c' },
    { x: 1, y: 4.9, z: 0, w: 16, h: 0.6, d: 12, color: '#ffffff' },
    { x: 0, y: 6.9, z: 1.5, w: 10, h: 3.4, d: 7, color: '#b98d60' },
    { x: 0, y: 8.85, z: 1.5, w: 12, h: 0.5, d: 9, color: '#f8fafc' },
    { x: -6, y: 2.65, z: 5, w: 0.35, h: 4.5, d: 0.35, color: '#1e293b' },
    { x: 7, y: 2.65, z: 5, w: 0.35, h: 4.5, d: 0.35, color: '#1e293b' }
  ];

  const state = {
    yaw: -0.72,
    pitch: 0.42,
    zoom: 1,
    wireframe: false,
    dragging: false,
    lastX: 0,
    lastY: 0,
    hasInteracted: false
  };

  function shade(hex, amount) {
    const value = hex.replace('#', '');
    const num = parseInt(value, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + amount));
    const b = Math.max(0, Math.min(255, (num & 255) + amount));
    return `rgb(${r}, ${g}, ${b})`;
  }

  function rotate(point) {
    const cosY = Math.cos(state.yaw);
    const sinY = Math.sin(state.yaw);
    const cosP = Math.cos(state.pitch);
    const sinP = Math.sin(state.pitch);
    const x = point.x * cosY - point.z * sinY;
    const z = point.x * sinY + point.z * cosY;
    return { x, y: point.y * cosP - z * sinP, z: point.y * sinP + z * cosP };
  }

  function project(point) {
    const cameraDistance = 38;
    const depth = Math.max(4, cameraDistance - point.z);
    const scale = Math.min(canvas.width, canvas.height) * 1.25 * state.zoom / depth;
    return {
      x: canvas.width / 2 + point.x * scale,
      y: canvas.height * 0.64 - point.y * scale,
      depth
    };
  }

  function cube(box) {
    const x = box.x;
    const y = box.y;
    const z = box.z;
    const hw = box.w / 2;
    const hh = box.h / 2;
    const hd = box.d / 2;
    const corners = [
      { x: x - hw, y: y - hh, z: z - hd }, { x: x + hw, y: y - hh, z: z - hd },
      { x: x + hw, y: y + hh, z: z - hd }, { x: x - hw, y: y + hh, z: z - hd },
      { x: x - hw, y: y - hh, z: z + hd }, { x: x + hw, y: y - hh, z: z + hd },
      { x: x + hw, y: y + hh, z: z + hd }, { x: x - hw, y: y + hh, z: z + hd }
    ].map((point) => project(rotate(point)));
    const faces = [
      { indices: [0, 1, 2, 3], color: shade(box.color, -14) },
      { indices: [1, 5, 6, 2], color: shade(box.color, 8) },
      { indices: [4, 0, 3, 7], color: shade(box.color, -30) },
      { indices: [3, 2, 6, 7], color: shade(box.color, 18) },
      { indices: [4, 5, 1, 0], color: shade(box.color, -4) }
    ];
    return faces.map((face) => ({
      points: face.indices.map((index) => corners[index]),
      color: face.color,
      depth: face.indices.reduce((total, index) => total + corners[index].depth, 0) / face.indices.length
    }));
  }

  function drawFace(face) {
    context.beginPath();
    face.points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.closePath();
    if (!state.wireframe) {
      context.fillStyle = face.color;
      context.fill();
    }
    context.strokeStyle = state.wireframe ? '#1d4ed8' : 'rgba(51, 65, 85, .62)';
    context.lineWidth = state.wireframe ? 1.5 : 0.75;
    context.stroke();
  }

  function render() {
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#e0f2fe');
    gradient.addColorStop(0.62, '#f8fafc');
    gradient.addColorStop(1, '#cbd5e1');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const faces = model.flatMap(cube).sort((a, b) => b.depth - a.depth);
    faces.forEach(drawFace);
    context.fillStyle = 'rgba(15, 23, 42, .72)';
    context.font = `${Math.max(10, canvas.width / 70)}px Arial`;
    context.fillText(state.wireframe ? 'MODO CAD — ARRASTE PARA ORBITAR' : 'MODELO 3D — ARRASTE PARA ORBITAR', 18, 28);
  }

  function resize() {
    const bounds = container.getBoundingClientRect();
    const width = Math.max(320, Math.round(bounds.width || 800));
    const height = Math.max(240, Math.round(bounds.height || 520));
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    canvas.width = width;
    canvas.height = height;
    render();
  }

  function startDrag(event) {
    state.dragging = true;
    state.hasInteracted = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  }

  function drag(event) {
    if (!state.dragging) return;
    state.yaw += (event.clientX - state.lastX) * 0.012;
    state.pitch = Math.max(-0.08, Math.min(1.15, state.pitch + (event.clientY - state.lastY) * 0.01));
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    render();
  }

  canvas.addEventListener('pointerdown', startDrag);
  canvas.addEventListener('pointermove', drag);
  canvas.addEventListener('pointerup', () => { state.dragging = false; });
  canvas.addEventListener('pointercancel', () => { state.dragging = false; });
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    state.zoom = Math.max(0.65, Math.min(1.8, state.zoom - event.deltaY * 0.001));
    state.hasInteracted = true;
    render();
  }, { passive: false });

  const wireButton = document.getElementById('btn-hero-wireframe');
  const isoButton = document.getElementById('btn-hero-iso');
  if (wireButton) {
    wireButton.addEventListener('click', () => {
      state.wireframe = !state.wireframe;
      wireButton.classList.toggle('active', state.wireframe);
      render();
    });
  }
  if (isoButton) {
    isoButton.addEventListener('click', () => {
      state.yaw = -Math.PI / 4;
      state.pitch = 0.62;
      state.zoom = 1;
      state.hasInteracted = true;
      render();
    });
  }

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    if (!state.dragging && !state.hasInteracted && container.classList.contains('is-visible')) {
      state.yaw += 0.0025;
      render();
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
