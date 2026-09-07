/* Motion is progressive enhancement: every page works without it. */
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const scene = document.querySelector('[data-ribbon-scene]');

if (scene && !navigator.connection?.saveData) {
  const load = () => import('./ribbon-scene.js?v=d99d1457d6fe').then(module => module.mountRibbon(scene, preference)).catch(() => {
    // Keep the original brand asset visible if WebGL or the module is unavailable.
  });
  if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 1200 });
  else window.setTimeout(load, 100);
}

// A small response to the pointer gives the illustrated work surfaces depth.
// No scrolling interception, automatic section reveals or hidden content.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.segment-surface').forEach(surface => {
    const reset = () => {
      surface.style.removeProperty('--tilt-x');
      surface.style.removeProperty('--tilt-y');
    };
    surface.addEventListener('pointermove', event => {
      if (preference.matches) return reset();
      const bounds = surface.getBoundingClientRect();
      surface.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - .5) * 5}deg`);
      surface.style.setProperty('--tilt-x', `${((event.clientY - bounds.top) / bounds.height - .5) * -4}deg`);
    }, { passive: true });
    surface.addEventListener('pointerleave', reset);
    preference.addEventListener('change', reset);
  });
}

// Load one Remotion island only when its explanation approaches the viewport.
const explanation = document.querySelector('[data-motion-scene]');
if (explanation && !navigator.connection?.saveData) {
  const loadExplanation = () => import('./infographics.js?v=429e8a328daf').catch(() => {
    // The complete static explanation remains visible if loading fails.
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      loadExplanation();
    }, { rootMargin: '480px' });
    observer.observe(explanation);
  } else loadExplanation();
}
