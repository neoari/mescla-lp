import * as THREE from './vendor/three-0.185.1/three.module.min.js';

export function mountRibbon(host, motionPreference) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .88;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.className = 'ribbon-canvas';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 30);
  camera.position.set(0, .25, 8.9);
  camera.lookAt(0, .05, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x332747, .95));
  // A small HDR light field gives the satin surface broad studio reflections.
  const lightPixels = new Float32Array(128 * 64 * 4);
  for (let y = 0; y < 64; y++) for (let x = 0; x < 128; x++) {
    const u = x / 128, v = y / 64;
    const softbox = Math.exp(-(((u - .24) / .07) ** 2) - ((v - .35) / .32) ** 2) * 3.8;
    const rimbox = Math.exp(-(((u - .73) / .11) ** 2) - ((v - .48) / .2) ** 2) * 2.5;
    const index = (y * 128 + x) * 4, base = .18 + (1 - v) * .32;
    lightPixels.set([base + softbox + rimbox * .84, base + softbox * .97 + rimbox, base + softbox * .92 + rimbox * .96, 1], index);
  }
  const studioLight = new THREE.DataTexture(lightPixels, 128, 64, THREE.RGBAFormat, THREE.FloatType);
  studioLight.mapping = THREE.EquirectangularReflectionMapping;
  studioLight.needsUpdate = true;
  scene.environment = studioLight;
  scene.environmentIntensity = .42;
  const key = new THREE.DirectionalLight(0xfff3db, 2.3);
  key.position.set(-3, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.camera.left = -4; key.shadow.camera.right = 4;
  key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
  key.shadow.normalBias = .035;
  key.shadow.bias = -.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc7fff3, 1.6);
  rim.position.set(4, 2, -1); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, .75);
  fill.position.set(1, -2, 5); scene.add(fill);

  const paths = [];
  const weave = new THREE.Group();
  scene.add(weave);
  // Rounded rectangular cross-sections give each strand a physical ribbon edge.
  function ribbon(points, color, width) {
    const shape = new THREE.Shape();
    const x = -width / 2, y = -.062, w = width, h = .124, r = .047;
    shape.moveTo(x + r, y); shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r); shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h); shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
    const path = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, 'centripetal');
    const geometry = new THREE.ExtrudeGeometry(shape, { steps: 160, bevelEnabled: false, extrudePath: path, curveSegments: 5 });
    const material = new THREE.MeshPhysicalMaterial({ color, metalness: .12, roughness: .38, clearcoat: .45, clearcoatRoughness: .32, anisotropy: .35 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true; mesh.receiveShadow = true;
    weave.add(mesh);
    paths.push(path);
  }
  // Warp and weft alternate above and below, following the Trama symbol.
  ribbon([[-.5,-1.15,0],[-.5,-.5,-.16],[-.5,0,0],[-.5,.5,.16],[-.5,1.15,0]], 0xf2b84b, .38);
  ribbon([[.5,-1.15,0],[.5,-.5,.16],[.5,0,0],[.5,.5,-.16],[.5,1.15,0]], 0xf2b84b, .38);
  ribbon([[-1.15,.5,0],[-.5,.5,-.16],[0,.5,0],[.5,.5,.16],[1.15,.5,0]], 0x6fd9c9, .38);
  ribbon([[-1.15,-.5,0],[-.5,-.5,.16],[0,-.5,0],[.5,-.5,-.16],[1.15,-.5,0]], 0x6fd9c9, .38);
  const flow = new THREE.Group();
  weave.add(flow);
  // Lucide user-round and bot linework, matching the adjacent participant icons.
  function flowIcon(kind) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const context = canvas.getContext('2d');
    context.scale(128 / 28, 128 / 28);
    context.translate(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    const drawing = new Path2D();
    if (kind === 'human') {
      drawing.arc(12, 8, 5, 0, Math.PI * 2);
      drawing.addPath(new Path2D('M20 21a8 8 0 0 0-16 0'));
    } else {
      drawing.addPath(new Path2D('M12 8V4H8 M6 8H18Q20 8 20 10V18Q20 20 18 20H6Q4 20 4 18V10Q4 8 6 8Z M2 14H4 M20 14H22 M15 13V15 M9 13V15'));
    }
    // A narrow light contour keeps the glyph legible across both ribbon colors.
    context.strokeStyle = '#FBFAFD';
    context.lineWidth = 4;
    context.stroke(drawing);
    context.strokeStyle = '#1B1930';
    context.lineWidth = 2.2;
    context.stroke(drawing);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
  const flowTextures = [flowIcon('human'), flowIcon('agent')];
  paths.forEach((path, index) => {
    const marker = new THREE.Sprite(new THREE.SpriteMaterial({
      map: flowTextures[index >= 2 ? 1 : 0],
      transparent: true, toneMapped: false, depthTest: false, depthWrite: false,
    }));
    marker.scale.set(.52, .52, 1);
    marker.renderOrder = 2;
    marker.userData.path = path;
    marker.userData.offset = index * .48;
    flow.add(marker);
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.ShadowMaterial({ opacity: .115 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.3; floor.receiveShadow = true;
  scene.add(floor);

  let visible = true, paused = motionPreference.matches, frame = 0, last = 0, elapsed = 0;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, destroyed = false;
  const stage = host.closest('.ribbon-stage');
  const control = stage.querySelector('[data-motion-toggle]');
  const pauseIcon = control?.querySelector('svg');
  const initialIcon = pauseIcon?.innerHTML;
  function updateControl() {
    if (!control) return;
    control.hidden = false;
    control.setAttribute('aria-pressed', String(paused));
    control.setAttribute('aria-label', paused ? 'Ativar animação' : 'Pausar animação');
    if (pauseIcon) pauseIcon.innerHTML = paused ? '<polygon points="8 5 19 12 8 19 8 5" />' : initialIcon;
  }
  function render(time = 0) {
    frame = 0;
    if (destroyed) return;
    if (last) elapsed += Math.min((time - last) / 1000, .05);
    last = time;
    currentX += (targetX - currentX) * .055;
    currentY += (targetY - currentY) * .055;
    weave.rotation.set(-.12 + currentY, .12 + currentX + (paused ? 0 : Math.sin(elapsed * .9) * .22), -.075 + (paused ? 0 : Math.sin(elapsed * .7) * .06));
    weave.position.y = paused ? 0 : Math.sin(elapsed * 1.5) * .09;
    flow.children.forEach(marker => {
      marker.position.copy(marker.userData.path.getPointAt(((paused ? 3 : elapsed) * .2 + marker.userData.offset) % 1));
      marker.position.z += .1;
    });
    try { renderer.render(scene, camera); } catch { cleanup(); return; }
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(render);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    if (visible && !document.hidden) render();
  }
  function resize() {
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 1 ? 8.9 / camera.aspect : 8.9;
    camera.updateProjectionMatrix();
    sync();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { rootMargin: '60px' });
  intersectionObserver.observe(host);
  const visibilityChange = () => sync();
  const preferenceChange = () => { paused = motionPreference.matches; targetX = 0; targetY = 0; currentX = 0; currentY = 0; updateControl(); sync(); };
  document.addEventListener('visibilitychange', visibilityChange);
  motionPreference.addEventListener('change', preferenceChange);
  stage.addEventListener('pointermove', event => {
    if (paused || event.pointerType === 'touch') return;
    const box = host.getBoundingClientRect();
    targetX = ((event.clientX - box.left) / box.width - .5) * .24;
    targetY = ((event.clientY - box.top) / box.height - .5) * .14;
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });
  control?.addEventListener('click', () => { paused = !paused; targetX = 0; targetY = 0; updateControl(); sync(); });
  function cleanup() {
    if (destroyed) return;
    destroyed = true; cancelAnimationFrame(frame);
    resizeObserver.disconnect(); intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', visibilityChange);
    motionPreference.removeEventListener('change', preferenceChange);
    scene.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
    flowTextures.forEach(texture => texture.dispose());
    studioLight.dispose();
    renderer.dispose();
    host.classList.remove('ribbon-ready');
    if (control) control.hidden = true;
  }
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); cleanup(); }, { once: true });
  window.addEventListener('pagehide', event => { if (!event.persisted) cleanup(); });
  updateControl(); resize(); if (!destroyed) host.classList.add('ribbon-ready');
}
