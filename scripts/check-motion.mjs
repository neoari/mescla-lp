/* Check geometry bounds and motion lifecycle with real Three.js geometry.
   No browser or GPU rendering: this does not claim to test visual appearance. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../assets/vendor/three-0.185.1/three.module.min.js';

const source = readFileSync(new URL('../assets/ribbon-scene.js', import.meta.url), 'utf8')
  .replace(/^import .*;\n/, '').replace('export function', 'function');
function fixture({ reduced = false, fail = false } = {}) {
  const events = new Map(), frames = new Map(), classes = new Set();
  let rendered = 0, scene, camera, resizeObserver, intersectionObserver, sequence = 0;
  const icon = { innerHTML: '<pause />' }, text = { textContent: '' };
  const control = { hidden: true, setAttribute() {}, querySelector: key => key === 'svg' ? icon : text,
    addEventListener: (key, fn) => events.set('control:' + key, fn) };
  const stage = { querySelector: () => control, addEventListener: (key, fn) => events.set('stage:' + key, fn) };
  const host = { clientWidth: 540, clientHeight: 506, appendChild() {}, closest: () => stage,
    classList: { add: value => classes.add(value), remove: value => classes.delete(value) },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: host.clientWidth, height: host.clientHeight }) };
  const preference = { matches: reduced, addEventListener: (key, fn) => events.set('preference:' + key, fn), removeEventListener() {} };
  const document = { hidden: false, addEventListener: (key, fn) => events.set('document:' + key, fn), removeEventListener() {} };
  class Renderer {
    constructor() {
      if (fail) throw Error('WebGL unavailable');
      this.shadowMap = {};
      this.domElement = { setAttribute() {}, addEventListener: (key, fn) => events.set('canvas:' + key, fn) };
    }
    setPixelRatio(value) { assert(value <= 1.6); }
    setSize(width, height) { assert(width > 0 && height > 0); }
    render(value, view) { rendered++; scene = value; camera = view; scene.updateMatrixWorld(true); camera.updateMatrixWorld(true); }
    dispose() {}
  }
  const context = vm.createContext({ THREE: { ...THREE, WebGLRenderer: Renderer },
    window: { devicePixelRatio: 3, addEventListener: (key, fn) => events.set('window:' + key, fn) }, document,
    requestAnimationFrame: fn => { frames.set(++sequence, fn); return sequence; }, cancelAnimationFrame: id => frames.delete(id),
    ResizeObserver: class { constructor(fn) { resizeObserver = fn; } observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(fn) { intersectionObserver = fn; } observe() {} disconnect() {} }
  });
  vm.runInContext(source + '\nthis.mountRibbon = mountRibbon;', context);
  context.mountRibbon(host, preference);
  return { host, control, preference, document, events, frames, classes,
    resize: () => resizeObserver(), visibility: value => intersectionObserver([{ isIntersecting: value }]),
    get rendered() { return rendered; }, get scene() { return scene; }, get camera() { return camera; } };
}
const active = fixture();
assert(active.classes.has('ribbon-ready'));
assert.equal(active.frames.size, 1);
assert.equal(active.control.hidden, false);
const ribbons = active.scene.children.find(object => object.isGroup);
assert.equal(ribbons.children.filter(mesh=>mesh.isMesh).length, 2);
for (const mesh of ribbons.children.filter(mesh=>mesh.isMesh)) {
  for (const attribute of ['position', 'normal']) assert([...mesh.geometry.attributes[attribute].array].every(Number.isFinite));
  mesh.geometry.computeBoundingBox();
  assert(mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x > 2);
}
// Keep the sculpture in frame across narrow and wide layouts.
for (const [width, height] of [[540,506],[288,322],[680,391]]) {
  active.host.clientWidth = width; active.host.clientHeight = height; active.resize();
  const bounds = new THREE.Box3().setFromObject(ribbons);
  for (const x of [bounds.min.x,bounds.max.x]) for (const y of [bounds.min.y,bounds.max.y]) for (const z of [bounds.min.z,bounds.max.z]) {
    const point = new THREE.Vector3(x,y,z).project(active.camera);
    assert(Math.abs(point.x)<1 && Math.abs(point.y)<1, `Sculpture outside the camera view: ${width}x${height}, ${point.x}, ${point.y}; bounds ${JSON.stringify(bounds)}`);
  }
}
// Test the stronger idle orbit and pointer response at the narrowest layout.
active.host.clientWidth=288;active.host.clientHeight=322;active.resize();
let time=0;
for(const [clientX,clientY] of [[0,0],[288,322],[288,0],[0,322]]) {
  active.events.get('stage:pointermove')({pointerType:'mouse',clientX,clientY});
  for(let tick=0;tick<160;tick++) {
    const [id,callback]=active.frames.entries().next().value;
    active.frames.delete(id);callback(time+=50);
    if(tick%20!==0)continue;
    const bounds=new THREE.Box3().setFromObject(ribbons);
    for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]) {
      const point=new THREE.Vector3(x,y,z).project(active.camera);
      assert(Math.abs(point.x)<1 && Math.abs(point.y)<1,'Moving sculpture outside camera view');
    }
  }
}
active.visibility(false); assert.equal(active.frames.size,0);
active.visibility(true); assert.equal(active.frames.size,1);
active.events.get('control:click')(); assert.equal(active.frames.size,0);
active.events.get('control:click')(); assert.equal(active.frames.size,1);
active.document.hidden = true; active.events.get('document:visibilitychange')(); assert.equal(active.frames.size,0);
active.document.hidden = false; active.events.get('document:visibilitychange')(); assert.equal(active.frames.size,1);
active.preference.matches = true; active.events.get('preference:change')(); assert.equal(active.frames.size,0);
active.events.get('canvas:webglcontextlost')({ preventDefault() {} });
assert.equal(active.frames.size,0); assert.equal(active.control.hidden,true); assert(!active.classes.has('ribbon-ready'));
const reduced = fixture({ reduced:true });
assert(reduced.rendered>0); assert.equal(reduced.frames.size,0);
const fallback = fixture({ fail:true });
assert.equal(fallback.rendered,0); assert.equal(fallback.frames.size,0); assert(!fallback.classes.has('ribbon-ready'));
console.log('Motion checks passed: finite ribbon geometry, camera bounds, reduced motion, pause, background/offscreen suspension and WebGL fallback.');
