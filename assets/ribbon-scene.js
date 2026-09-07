import * as THREE from './vendor/three-0.185.1/three.module.min.js';

export function mountRibbon(host, motionPreference) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.className = 'ribbon-canvas';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 30);
  camera.position.set(0, .25, 8.9);
  camera.lookAt(0, .05, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x5e526f, 1.65));
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
  scene.environmentIntensity = .8;
  const key = new THREE.DirectionalLight(0xfff3db, 3.2);
  key.position.set(-3, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.camera.left = -4; key.shadow.camera.right = 4;
  key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
  key.shadow.normalBias = .035;
  key.shadow.bias = -.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc7fff3, 2.2);
  rim.position.set(4, 2, -1); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 1.2);
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
    const material = new THREE.MeshPhysicalMaterial({ color, metalness: .28, roughness: .27, clearcoat: 1, clearcoatRoughness: .23, anisotropy: .45 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true; mesh.receiveShadow = true;
    weave.add(mesh);
    paths.push(path);
  }
  ribbon([[-1.95,-.65,.03],[-1.47,.5,.1],[-.94,1.12,.12],[-.4,.56,.2],[.25,-.57,.18],[.95,-1.05,.1],[1.52,-.47,-.3],[1.48,.56,-.4]], 0xf2b84b, .48);
  ribbon([[-1.3,-.53,-.32],[-1.1,-.96,-.24],[-.49,-.45,-.22],[.16,.66,-.18],[.7,1.16,.12],[1.12,.74,.36],[1.28,-.16,.43],[1.07,-.86,.29]], 0x6fd9c9, .48);
  const flow = new THREE.Group();
  weave.add(flow);
  paths.forEach((path, index) => {
    const marker = new THREE.Mesh(new THREE.SphereGeometry(.049, 12, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: index ? 0x6fd9c9 : 0xf2b84b, emissiveIntensity: .8, roughness: .2 }));
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
    control.querySelector('span').textContent = paused ? 'Animar' : 'Pausar';
    if (pauseIcon) pauseIcon.innerHTML = paused ? '<polygon points="8 5 19 12 8 19 8 5" />' : initialIcon;
  }
  function render(time = 0) {
    frame = 0;
    if (destroyed) return;
    if (last) elapsed += Math.min((time - last) / 1000, .05);
    last = time;
    currentX += (targetX - currentX) * .055;
    currentY += (targetY - currentY) * .055;
    weave.rotation.set(-.12 + currentY, .12 + currentX + (paused ? 0 : Math.sin(elapsed * .35) * .15), -.075 + (paused ? 0 : Math.sin(elapsed * .24) * .035));
    weave.position.y = paused ? 0 : Math.sin(elapsed * .6) * .065;
    flow.children.forEach(marker => {
      marker.position.copy(marker.userData.path.getPointAt(((paused ? 3 : elapsed) * .075 + marker.userData.offset) % 1));
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
    studioLight.dispose();
    renderer.dispose();
    host.classList.remove('ribbon-ready');
    if (control) control.hidden = true;
  }
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); cleanup(); }, { once: true });
  window.addEventListener('pagehide', event => { if (!event.persisted) cleanup(); });
  updateControl(); resize(); if (!destroyed) host.classList.add('ribbon-ready');
}
