/* Mescla · os fiandeiros (home, 08/11/2026)
   Personagens e cenas em SVG desenhados em código, na textura de lã aprovada.
   Cada cena começa ao entrar na tela, pausa fora dela e, com movimento reduzido, mostra o último quadro. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const COR = { mare: '#6FD9C9', sol: '#F2B84B', noite: '#1B1930', branco: '#FBFAFD', nevoa: '#ECEBF1', roma: '#CF3E27', verde: '#116C60', ambar: '#7B5209', linha: '#DDDAE5', cinza: '#625F72' };
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const lerp = (a, b, e) => a + (b - a) * e;
  const easeOut = x => 1 - Math.pow(1 - x, 3);
  const easeIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const back = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const bounce = x => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + .75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + .9375; return n * (x -= 2.625 / d) * x + .984375; };
  const REDUZ = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, a, p) { const e = document.createElementNS(NS, tag); if (a) for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function tx(s, a, p) { const e = el('text', a, p); e.textContent = s; return e; }
  function set(e, a) { for (const k in a) e.setAttribute(k, a[k]); }

  // ---------- piscar: fecha por ~0,13 s a cada ~4 s (determinístico) ----------
  function piscar(t, off) { if (REDUZ) return 1; const P = 4.1, ph = (((t + off) % P) + P) % P; return ph < 0.13 ? 0.12 : 1; }

  // ---------- rosto: dois olhos ovais, brilho, sorriso e bochecha ----------
  function face(p, cx, cy, s, { look = [0, 0], blink = 1, smile = 1, wink = false, blush = true } = {}) {
    const g = el('g', {}, p), dx = s * 0.62;
    [-1, 1].forEach(k => {
      const closed = (wink && k === 1) ? 0.1 : blink;
      const ex = cx + k * dx / 2 + look[0] * s * 0.12, ey = cy + look[1] * s * 0.1;
      if (closed < 0.3) el('path', { d: `M${ex - s * 0.17} ${ey} q${s * 0.17} ${s * 0.12} ${s * 0.34} 0`, fill: 'none', stroke: COR.noite, 'stroke-width': s * 0.08, 'stroke-linecap': 'round' }, g);
      else { el('ellipse', { cx: ex, cy: ey, rx: s * 0.15, ry: s * 0.21 * closed, fill: COR.noite }, g); el('circle', { cx: ex + s * 0.05, cy: ey - s * 0.07, r: s * 0.05, fill: '#fff' }, g); }
    });
    if (smile > 0) el('path', { d: `M${cx - s * 0.16} ${cy + s * 0.3} q${s * 0.16} ${s * 0.16 * smile} ${s * 0.32} 0`, fill: 'none', stroke: COR.noite, 'stroke-width': s * 0.07, 'stroke-linecap': 'round' }, g);
    if (blush) { el('circle', { cx: cx - dx * 0.95, cy: cy + s * 0.24, r: s * 0.09, fill: COR.roma, opacity: .28 }, g); el('circle', { cx: cx + dx * 0.95, cy: cy + s * 0.24, r: s * 0.09, fill: COR.roma, opacity: .28 }, g); }
    return g;
  }

  // ---------- pano de lã: a cápsula vira imagem SVG (rasterizada uma vez e reaproveitada) ----------
  const PANO = {};
  function panoURL(w, h, rx, col, horiz) {
    const key = [w, h, rx, col, horiz].join('|'); if (PANO[key]) return PANO[key];
    const m = 6, W = w + 2 * m, H = h + 2 * m, R = `x="${m}" y="${m}" width="${w}" height="${h}"`;
    const fz = '<filter id="f" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="4.5" xChannelSelector="R" yChannelSelector="G"/></filter>';
    const kn = `<pattern id="k" width="10" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(${horiz ? 90 : 0})"><path d="M0 0 C1 6 4 9 5 12 M10 0 C9 6 6 9 5 12" fill="none" stroke="rgba(27,25,48,.20)" stroke-width="2.4" stroke-linecap="round"/><path d="M1.4 0 C2.2 5.4 4.6 8.4 5.4 11 M8.6 0 C7.8 5.4 5.6 8.4 4.6 11" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="1.1" stroke-linecap="round"/></pattern>`;
    const grain = `<filter id="g" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.38"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
    const shade = '<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".30"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1B1930" stop-opacity=".20"/></linearGradient>';
    const body = `<rect ${R} fill="${col}"/><rect ${R} fill="url(#k)"/><rect ${R} fill="#1B1930" filter="url(#g)" opacity=".16"/><rect ${R} fill="url(#s)"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${kn}${grain}${shade}${fz}<clipPath id="c"><rect ${R} rx="${rx}"/></clipPath></defs><g filter="url(#f)"><g clip-path="url(#c)">${body}</g></g></svg>`;
    return PANO[key] = { url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), m };
  }
  function pano(p, x, y, w, h, rx, col, horiz) {
    const f = panoURL(w, h, rx, col, horiz);
    return el('image', { href: f.url, x: x - f.m, y: y - f.m, width: w + 2 * f.m, height: h + 2 * f.m, preserveAspectRatio: 'none' }, p);
  }
  function brilho(p) { return el('path', { d: 'M0 -10 C1 -2 2 -1 10 0 C2 1 1 2 0 10 C-1 2 -2 1 -10 0 C-2 -1 -1 -2 0 -10Z', fill: COR.sol, opacity: 0 }, p); }
  function poeBrilho(e, x, y, r, o) { if (o <= 0.01) { e.setAttribute('opacity', 0); return; } set(e, { opacity: o, transform: `translate(${x} ${y}) scale(${r})` }); }

  // ---------- acessórios de função (do esboço do elenco) ----------
  function acc(g, a, t, typing) {
    const st = { fill: 'none', stroke: COR.noite, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    if (a === 'fone') { el('path', { d: 'M-36 -18 C-36 -64 36 -64 36 -18', ...st }, g); el('rect', { x: -42, y: -26, width: 12, height: 22, rx: 5, fill: COR.noite }, g); el('rect', { x: 30, y: -26, width: 12, height: 22, rx: 5, fill: COR.noite }, g); el('path', { d: 'M-36 -6 C-36 14 -20 22 -8 22', ...st, 'stroke-width': 3 }, g); el('circle', { cx: -6, cy: 22, r: 4, fill: COR.noite }, g); }
    if (a === 'oculos') {
      el('circle', { cx: -10, cy: -22, r: 11, ...st, 'stroke-width': 3 }, g); el('circle', { cx: 12, cy: -22, r: 11, ...st, 'stroke-width': 3 }, g);
      const c = el('g', { transform: `translate(40 ${18 + Math.sin(t * 4) * 3})` }, g); el('circle', { r: 12, fill: COR.sol, stroke: COR.ambar, 'stroke-width': 2.5 }, c); tx('$', { x: 0, y: 5, 'text-anchor': 'middle', style: `font:700 14px 'Instrument Sans',sans-serif;fill:${COR.ambar}` }, c);
    }
    if (a === 'boina') {
      el('path', { d: 'M-34 -44 C-30 -64 30 -66 36 -46 C20 -40 -20 -40 -34 -44Z', fill: COR.roma }, g); el('circle', { cx: 2, cy: -62, r: 4, fill: COR.roma }, g);
      const s = el('g', { transform: `translate(40 22) rotate(${Math.sin(t * 6) * 12})` }, g); el('circle', { cx: -6, cy: 8, r: 5, ...st, 'stroke-width': 3 }, s); el('circle', { cx: 6, cy: 8, r: 5, ...st, 'stroke-width': 3 }, s); el('path', { d: 'M-3 4 L8 -14 M3 4 L-8 -14', ...st, 'stroke-width': 3 }, s);
    }
    if (a === 'agulha') {
      const n = el('g', { transform: `translate(40 -6) rotate(${-30 + Math.sin(t * 3) * 10})` }, g); el('path', { d: 'M0 -34 L0 30', stroke: COR.cinza, 'stroke-width': 4, 'stroke-linecap': 'round' }, n); el('ellipse', { cx: 0, cy: -26, rx: 2, ry: 5, fill: COR.branco }, n);
      el('path', { d: 'M0 -26 C20 -40 30 -10 18 10', fill: 'none', stroke: COR.verde, 'stroke-width': 2.5 }, n);
      const k = el('g', { transform: 'translate(-38 18) rotate(-8)' }, g); el('rect', { x: -16, y: -11, width: 32, height: 22, rx: 4, fill: '#fff', stroke: COR.verde, 'stroke-width': 2.5 }, k); el('path', { d: 'M-7 0 L-2 5 L8 -5', fill: 'none', stroke: COR.verde, 'stroke-width': 3, 'stroke-linecap': 'round' }, k);
    }
    if (a === 'balao') {
      const sc = typing ? 1 + Math.abs(Math.sin(t * 7)) * 0.08 : 1 + Math.sin(t * 5) * 0.04;
      const b = el('g', { transform: `translate(30 -70) scale(${sc})` }, g); el('path', { d: 'M-24 -16 H24 A10 10 0 0 1 34 -6 V8 A10 10 0 0 1 24 18 H-8 L-18 28 L-16 18 H-24 A10 10 0 0 1 -34 8 V-6 A10 10 0 0 1 -24 -16Z', fill: '#fff', stroke: COR.noite, 'stroke-width': 3 }, b);
      [-12, 0, 12].forEach((x, i) => el('circle', { cx: x, cy: 1, r: 3.5, fill: typing ? COR.verde : COR.noite, opacity: .35 + .65 * ((Math.floor(t * (typing ? 6 : 3)) % 3) === i) }, b));
    }
    if (a === 'lupa') { const l = el('g', { transform: `translate(${38 + Math.sin(t * 2.5) * 5} 14)` }, g); el('circle', { cx: 0, cy: 0, r: 14, fill: 'rgba(255,255,255,.55)', stroke: COR.noite, 'stroke-width': 4 }, l); el('path', { d: 'M10 10 L22 22', stroke: COR.noite, 'stroke-width': 6, 'stroke-linecap': 'round' }, l); }
  }

  // ---------- motor de cena: começa ao entrar na tela, pausa fora dela ----------
  function Cena(alvo, { dur = 6, idle = false, quadro, reinicia, limiar = 0.2, aoFim, observa }) {
    let t = 0, last = null, vis = false, raf = 0, acabou = false, parado = false;
    const api = { get t() { return t; } };
    function tick(now) {
      raf = 0; if (!vis || document.hidden || parado) { last = null; return; }
      const dt = last == null ? 0 : Math.min(.1, (now - last) / 1000); last = now; t += dt;
      if (t >= dur && !acabou) { alvo.classList.add('acabou'); if (!idle) { t = dur; quadro(t); acabou = true; aoFim && aoFim(); return; } acabou = true; aoFim && aoFim(); }
      quadro(t); raf = requestAnimationFrame(tick);
    }
    function liga() { if (!raf && !parado && vis && !document.hidden && (idle || !acabou)) { last = null; raf = requestAnimationFrame(tick); } }
    api.reinicia = () => { t = 0; acabou = false; parado = false; alvo.classList.remove('acabou'); reinicia && reinicia(); quadro(0); liga(); };
    api.finaliza = () => { parado = true; if (raf) cancelAnimationFrame(raf); raf = 0; t = dur; quadro(dur); acabou = true; alvo.classList.add('acabou'); };
    api.redesenha = () => quadro(t);
    api.visivel = () => vis;
    if (REDUZ) { t = dur; quadro(dur); acabou = true; alvo.classList.add('acabou'); parado = true; return api; }
    const io = new IntersectionObserver(es => { for (const e of es) vis = e.isIntersecting; liga(); }, { threshold: limiar });
    io.observe(observa || alvo);
    document.addEventListener('visibilitychange', liga);
    quadro(0);
    return api;
  }

  // =====================================================================
  // CENA 1 (topo) e fechamento: as 4 cápsulas do logo chegam, se abraçam e soltam os fios
  // =====================================================================
  function cenaLogo(svg, { modo = 'topo' } = {}) {
    let G, N, ultimoLayout = '';
    const fundo = modo === 'fechamento' ? COR.noite : COR.branco;
    const CH = [['Comece aqui', COR.mare, COR.mare], ['Aposta', COR.sol, COR.sol], ['Quando sobrar tempo', COR.nevoa, COR.linha], ['Evitar por ora', '#F7DDD7', '#E8A99B']];
    const BARS = [
      { id: 'p1', col: COR.sol, v: true, x: 25, y: 10, t0: 0.3, de: 'cima', look: [0.6, 0.3] },
      { id: 'a1', col: COR.mare, v: false, x: 10, y: 25, t0: 0.75, de: 'esq', look: [1, 0] },
      { id: 'p2', col: COR.sol, v: true, x: 59, y: 10, t0: 1.2, de: 'baixo', look: [-0.5, 0.3] },
      { id: 'a2', col: COR.mare, v: false, x: 10, y: 59, t0: 1.65, de: 'dir', look: [-1, 0] },
    ];
    function escolhe() {
      if (modo === 'fechamento') return { nome: 'f', vb: [300, 300], K: 2.3, C: [158, 150], ini: 'esq' };
      // computador: composição larga ao lado do título; celular e tablet: faixa compacta acima do título
      return matchMedia('(min-width: 980px)').matches ? { nome: 'l', vb: [660, 500], K: 2.5, C: [250, 240], ini: 'dir' } : { nome: 'c', vb: [360, 206], K: 1.4, C: [84, 92], ini: 'baixo' };
    }
    function monta() {
      G = escolhe(); ultimoLayout = G.nome; svg.replaceChildren();
      const [VW, VH] = G.vb; svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
      const K = G.K, U = (x, y) => [G.C[0] + (x - 50) * K, G.C[1] + (y - 50) * K];
      G.U = U; G.k = K / 2.7; G.gap = Math.max(2, K * 1.1);
      N = { bars: {}, patches: [], fios: [], chips: [], brilhos: [] };
      const gFios = el('g', {}, svg), gBars = el('g', {}, svg), gPatch = el('g', {}, svg), gFaces = el('g', {}, svg), gFx = el('g', {}, svg);
      N.gBars = gBars;
      // fios até os quadrantes
      if (modo === 'topo') CH.forEach((c, i) => {
        const L = G.nome === 'l';
        N.fios.push(el('path', { fill: 'none', stroke: c[2], 'stroke-width': L ? 8 : 5, 'stroke-linecap': 'round', opacity: 0 }, gFios));
        const g = el('g', { opacity: 0 }, svg); const fs = L ? 15 : 13.5;
        const r = el('rect', { x: 0, y: L ? -20 : -17, height: L ? 40 : 34, rx: L ? 20 : 17, fill: c[1], stroke: c[1] === COR.nevoa ? COR.linha : 'none', 'stroke-width': 1.5 }, g);
        const t = tx(c[0], { x: 0, y: 5, 'text-anchor': 'middle', style: `font:700 ${fs}px 'Instrument Sans',sans-serif;fill:${COR.noite}` }, g);
        const w = L ? Math.max(90, (t.getComputedTextLength ? t.getComputedTextLength() : c[0].length * 8.5) + 34) : 160;
        set(r, { width: w }); set(t, { x: w / 2 });
        // posições: no computador, coluna à direita; no celular, coluna compacta à direita do logo
        const pos = L ? [450, 118 + i * 88] : [192, 30 + i * 40];
        N.chips.push({ g, w, pos });
      });
      if (modo === 'fechamento') {
        // pontas da espinha entrando no logo
        N.stubs = [el('path', { fill: 'none', stroke: COR.sol, 'stroke-width': 5, 'stroke-linecap': 'round' }, gFios), el('path', { fill: 'none', stroke: COR.mare, 'stroke-width': 5, 'stroke-linecap': 'round' }, gFios)];
        set(N.stubs[0], { d: `M${U(33, 0)[0]} -20 L${U(33, 0)[0]} ${U(0, 14)[1]}` });
        set(N.stubs[1], { d: `M${U(12, 0)[0]} -20 L${U(12, 0)[0]} ${U(0, 31)[1]}` });
      }
      BARS.forEach(b => {
        const w = (b.v ? 16 : 80) * K, h = (b.v ? 80 : 16) * K, [x, y] = U(b.x, b.y);
        const g = el('g', {}, gBars); pano(g, -w / 2, -h / 2, w, h, 8 * K, b.col, !b.v);
        const gaps = el('g', { opacity: 0 }, g);
        N.bars[b.id] = { b, g, gaps, w, h, rx: x + w / 2, ry: y + h / 2, face: el('g', {}, gFaces) };
      });
      // por cima/por baixo, como no logo: maré por cima da âmbar em a1×p2 e a2×p1
      [['a1', 59], ['a2', 25]].forEach(([id, xx]) => {
        const d = N.bars[id], lx = (xx - 50) * K, cid = 'cl' + modo + id + Math.random().toString(36).slice(2, 7);
        const g = el('g', { opacity: 0 }, gPatch); const cp = el('clipPath', { id: cid }, g); el('rect', { x: lx - 1, y: -d.h / 2 - 14, width: 16 * K + 2, height: d.h + 28 }, cp);
        const gg = el('g', { 'clip-path': `url(#${cid})` }, g); pano(gg, -d.w / 2, -d.h / 2, d.w, d.h, 8 * K, COR.mare, true);
        el('rect', { x: lx, y: -d.h / 2 - G.gap, width: 16 * K, height: G.gap, fill: fundo }, g); el('rect', { x: lx, y: d.h / 2, width: 16 * K, height: G.gap, fill: fundo }, g);
        N.patches.push({ id, g });
      });
      // âmbar por cima da maré em p1×a1 e p2×a2: corte na maré dos dois lados
      [['p1', 25], ['p2', 59]].forEach(([id, yy]) => {
        const d = N.bars[id], ly = (yy - 50) * K;
        el('rect', { x: -d.w / 2 - G.gap, y: ly, width: G.gap, height: 16 * K, fill: fundo }, d.gaps); el('rect', { x: d.w / 2, y: ly, width: G.gap, height: 16 * K, fill: fundo }, d.gaps);
      });
      for (let i = 0; i < 7; i++) N.brilhos.push(brilho(gFx));
      // rótulos
      if (modo === 'topo') {
        const est = (c) => `font:500 ${G.nome === 'l' ? 12 : 11}px 'JetBrains Mono',monospace;letter-spacing:${G.nome === 'l' ? 2 : 1.5}px;fill:${c}`;
        if (G.nome === 'l') {
          N.rot = el('g', { opacity: 0 }, svg);
          tx('PESSOAS', { x: U(50, 0)[0], y: U(0, 10)[1] - 22, 'text-anchor': 'middle', style: est(COR.ambar) }, N.rot);
          tx('AGENTES DE IA', { x: U(10, 0)[0] - 14, y: U(0, 33)[1] + 4, 'text-anchor': 'end', style: est(COR.verde) }, N.rot);
          N.leg = tx('FIOS DIFERENTES · UM TRABALHO SÓ', { x: 330, y: 486, 'text-anchor': 'middle', style: est(COR.cinza), opacity: 0 }, svg);
        } else {
          N.rot = el('g', { opacity: 0 }, svg);
          el('circle', { cx: 22, cy: 192, r: 5, fill: COR.sol }, N.rot); tx('PESSOAS', { x: 32, y: 196, style: est(COR.ambar) }, N.rot);
          el('circle', { cx: 112, cy: 192, r: 5, fill: COR.mare }, N.rot); tx('AGENTES DE IA', { x: 122, y: 196, style: est(COR.verde) }, N.rot);
          N.leg = null;
        }
      }
    }
    let woven = null;
    function quadro(t) {
      if (!G || escolhe().nome !== ultimoLayout) { monta(); woven = null; }
      const [VW, VH] = G.vb, K = G.K, U = G.U, k = G.k;
      // ordem de desenho: depois do abraço vira trama
      const w = t >= 3.2;
      if (w !== woven) { woven = w; (w ? ['a1', 'a2', 'p1', 'p2'] : ['p1', 'p2', 'a1', 'a2']).forEach(id => N.gBars.appendChild(N.bars[id].g)); N.patches.forEach(p => p.g.setAttribute('opacity', w ? 1 : 0)); BARS.forEach(b => N.bars[b.id].gaps.setAttribute('opacity', w && b.v ? 1 : 0)); }
      const hug = Math.sin(seg(t, 2.9, 3.5) * Math.PI) * 0.06;
      const pulso = t > 8 ? Math.max(0, Math.sin(((t - 8) % 9) / 0.7 * Math.PI)) * ((t - 8) % 9 < 0.7 ? 0.035 : 0) : 0;
      const tr = {};
      BARS.forEach(b => {
        const d = N.bars[b.id];
        const kk = seg(t, b.t0, b.t0 + 0.9), e = (b.de === 'cima' || b.de === 'baixo') ? bounce(kk) : back(kk);
        const from = b.de === 'cima' ? [0, -VH] : b.de === 'baixo' ? [0, VH] : b.de === 'esq' ? [-VW, 0] : [VW, 0];
        const off = [from[0] * (1 - e), from[1] * (1 - e)];
        const land = seg(t, b.t0 + 0.55, b.t0 + 0.95), sq = Math.sin(land * Math.PI) * 0.12;
        const sx = b.v ? 1 + sq : 1 - sq * 0.5, sy = b.v ? 1 - sq : 1 + sq;
        const bob = REDUZ ? 0 : Math.sin((t - b.t0) * 3 + b.x) * 1.5 * seg(t, 4, 4.5);
        const cx = d.rx + off[0], cy = d.ry + off[1] + bob, s = 1 - hug - pulso;
        const T = `translate(${cx} ${cy}) scale(${sx * s} ${sy * s})`; d.g.setAttribute('transform', T); tr[b.id] = { T, cx, cy };
        // rosto
        d.face.replaceChildren();
        let look = b.look;
        if (t > 4.0) look = modo === 'topo' ? [1, 0.2] : [Math.sin(t * 0.7 + b.x) * 0.5, 0.1];
        const fx = b.v ? cx : cx + (b.id === 'a1' ? -d.w / 2 + 19 * k : d.w / 2 - 19 * k), fy = b.v ? cy - d.h / 2 + 21 * k : cy - 2 * k;
        const wink = b.id === 'a2' && t > 6 && ((t - 6) % 8) < 0.45;
        face(d.face, fx, fy, 20 * k, { look, blink: piscar(t, b.x * 0.037), wink, smile: seg(t, b.t0 + 0.6, b.t0 + 1) });
      });
      N.patches.forEach(p => p.g.setAttribute('transform', tr[p.id].T));
      // fios e quadrantes
      if (modo === 'topo') {
        const S = U(92, 50), ctl = G.nome === 'l' ? [60, 80] : [26, 30];
        N.chips.forEach((c, i) => {
          const e = easeOut(seg(t, 3.8 + i * 0.15, 4.8 + i * 0.15)); const f = N.fios[i];
          if (e <= 0) { f.setAttribute('opacity', 0); c.g.setAttribute('opacity', 0); return; }
          let ex, ey, d;
          ex = lerp(S[0], c.pos[0], e); ey = lerp(S[1], c.pos[1], e); d = `M${S[0]} ${S[1]} C${S[0] + ctl[0]} ${S[1]} ${ex - ctl[1]} ${ey} ${ex} ${ey}`;
          set(f, { d, opacity: 1 });
          const ch = seg(t, 4.6 + i * 0.15, 5.0 + i * 0.15);
          if (ch > 0) set(c.g, { opacity: ch, transform: `translate(${c.pos[0]} ${c.pos[1]}) scale(${lerp(.6, 1, back(ch))})` }); else c.g.setAttribute('opacity', 0);
        });
        N.rot.setAttribute('opacity', seg(t, 4.2, 4.8));
        if (N.leg) N.leg.setAttribute('opacity', seg(t, 5.8, 6.4));
      }
      // brilhos: quando cada um pousa e no abraço
      BARS.forEach((b, i) => { const o = Math.sin(seg(t, b.t0 + 0.6, b.t0 + 1.1) * Math.PI); const [x, y] = U(b.x + (b.v ? 8 : 40), b.y + (b.v ? 0 : 8)); poeBrilho(N.brilhos[i], x + (b.v ? 28 * k : 0), y - (b.v ? 6 : 26) * k, 1.2 * k, o); });
      const hs = Math.sin(seg(t, 3.0, 3.8) * Math.PI);
      poeBrilho(N.brilhos[4], G.C[0] - 150 * k, G.C[1] - 140 * k, 1.6 * k, hs); poeBrilho(N.brilhos[5], G.C[0] + 150 * k, G.C[1] + 120 * k, 1.1 * k, hs); poeBrilho(N.brilhos[6], G.C[0] + 130 * k, G.C[1] - 150 * k, 0.9 * k, hs);
    }
    return { quadro, monta: () => { G = null; } };
  }

  // =====================================================================
  // CENA 2 (a leitura): o novelo de ferramentas se desembola e vira trama
  // =====================================================================
  function cenaNovelo(svg, legenda) {
    const TOOLS = ['WhatsApp', 'planilha', 'e-mail', 'ChatGPT', 'Drive'];
    let G = null, nome = '';
    function escolhe() {
      // mesma regra do CSS (aspect-ratio de #cena-novelo), para a altura não mudar depois do carregamento
      if (matchMedia('(min-width: 600px)').matches) return { nome: 'l', W: 720, H: 420, X0: 210, X1: 650, ROWS: 7, Y0: 66, DY: 48, c: [440, 210], R: 118, fs: 14, ch: 28, colStep: 40, ww: 8, mw: 5 };
      return { nome: 'e', W: 360, H: 400, X0: 122, X1: 340, ROWS: 7, Y0: 70, DY: 44, c: [210, 205], R: 96, fs: 13, ch: 26, colStep: 34, ww: 6, mw: 4.5 };
    }
    function prepara() {
      G = escolhe(); nome = G.nome; svg.setAttribute('viewBox', `0 0 ${G.W} ${G.H}`);
      const RT = G.DY / 2, P = []; P.push({ k: 'line', a: [-30, G.Y0], b: [G.X0, G.Y0] });
      for (let i = 0; i < G.ROWS; i++) { const y = G.Y0 + i * G.DY, ltr = i % 2 === 0; P.push({ k: 'line', a: [ltr ? G.X0 : G.X1, y], b: [ltr ? G.X1 : G.X0, y] }); if (i < G.ROWS - 1) P.push({ k: 'arc', cx: ltr ? G.X1 : G.X0, cy: y + RT, dir: ltr ? 1 : -1 }); }
      const yl = G.Y0 + (G.ROWS - 1) * G.DY; const endL = (G.ROWS - 1) % 2 === 0; P.push({ k: 'line', a: [endL ? G.X1 : G.X0, yl], b: [endL ? G.W + 30 : -30, yl] });
      let L = 0; for (const p of P) { p.len = p.k === 'line' ? Math.hypot(p.b[0] - p.a[0], p.b[1] - p.a[1]) : Math.PI * RT; p.s0 = L; L += p.len; } P.total = L; G.P = P; G.RT = RT;
      G.COLS = []; for (let x = G.X0 + 20; x <= G.X1 - 16; x += G.colStep) G.COLS.push(x);
    }
    function core(u, t) {
      const s = 2 * Math.PI * u, ph = t * 0.35;
      const x = Math.sin(7 * s + ph) + 0.55 * Math.sin(13 * s - 0.7 + ph * 1.3) + 0.25 * Math.cos(23 * s);
      const y = Math.cos(9 * s - ph * 0.8) + 0.55 * Math.cos(11 * s + 1.1) + 0.25 * Math.sin(19 * s + ph);
      return [G.c[0] + G.R * x / 1.8, G.c[1] + G.R * y / 1.8];
    }
    function tangle(u, t) {
      if (u < 0.04) { const e = u / 0.04, q = core(0.04, t); return [lerp(-30, q[0], e), lerp(G.c[1], q[1], e)]; }
      if (u > 0.96) { const e = (u - 0.96) / 0.04, q = core(0.96, t); return [lerp(q[0], G.W - 26, e), lerp(q[1], G.c[1] + 26, e)]; }
      return core(u, t);
    }
    function weave(u) {
      const d = u * G.P.total; const p = G.P.find(q => d <= q.s0 + q.len) || G.P[G.P.length - 1]; const f = clamp((d - p.s0) / p.len);
      if (p.k === 'line') return [lerp(p.a[0], p.b[0], f), lerp(p.a[1], p.b[1], f)];
      const ang = -Math.PI / 2 + Math.PI * f; return [p.cx + p.dir * G.RT * Math.cos(ang), p.cy + G.RT * Math.sin(ang)];
    }
    function quadro(t) {
      if (!G || escolhe().nome !== nome) prepara();
      svg.replaceChildren();
      const S = svg, NOITE = COR.noite;
      const e = easeIO(seg(t, 3.6, 6.4)), tt = Math.min(t, 3.6), Nn = 900;
      let d = ''; for (let i = 0; i <= Nn; i++) { const u = i / Nn, a = tangle(u, tt), b = weave(u); d += (i ? 'L' : 'M') + lerp(a[0], b[0], e).toFixed(1) + ' ' + lerp(a[1], b[1], e).toFixed(1); }
      const drawn = easeIO(seg(t, 0.15, 2.2));
      el('path', { d, fill: 'none', stroke: COR.mare, 'stroke-width': G.mw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 - drawn }, S);
      // ponta desfiando enquanto é IA solta
      const fray = (1 - seg(t, 3.6, 4.4)) * seg(t, 2.0, 2.3);
      if (fray > 0) { const g = el('g', { opacity: fray, stroke: COR.mare, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, S); const x = G.W - 26, y = G.c[1] + 26; for (let k = 0; k < 6; k++) el('line', { x1: x, y1: y, x2: x + 18, y2: y + (k - 2.5) * 5 }, g); }
      // urdidura âmbar (pessoas) desce coluna por coluna, com o por cima/por baixo
      const top = G.Y0 - 34, bot = G.Y0 + (G.ROWS - 1) * G.DY + 34;
      G.COLS.forEach((x, j) => {
        const g = easeIO(seg(t, 5.4 + j * 0.06, 6.6 + j * 0.06)); if (g <= 0) return; const yEnd = lerp(top, bot, g);
        el('line', { x1: x, y1: top, x2: x, y2: yEnd, stroke: COR.sol, 'stroke-width': G.ww, 'stroke-linecap': 'round' }, S);
        for (let i = 0; i < G.ROWS; i++) { const y = G.Y0 + i * G.DY; if ((i + j) % 2 === 0 && yEnd > y + 6) { el('line', { x1: x - G.ww - 3, y1: y, x2: x + G.ww + 3, y2: y, stroke: NOITE, 'stroke-width': G.mw + 4 }, S); el('line', { x1: x - G.ww - 5, y1: y, x2: x + G.ww + 5, y2: y, stroke: COR.mare, 'stroke-width': G.mw }, S); } }
      });
      // ferramentas: presas no novelo, depois cada uma no seu fio
      TOOLS.forEach((name, k) => {
        const show = seg(t, 1.0 + k * 0.16, 1.5 + k * 0.16); if (show <= 0) return;
        const a = tangle(0.18 + k * 0.16, tt), b = [G.X0 - G.RT - 6, G.Y0 + (k + 1) * G.DY];
        const p = [lerp(a[0], b[0], e), lerp(a[1], b[1], e)]; const w = name.length * (G.fs * 0.6) + 22;
        const x = e > 0.5 ? p[0] - w : p[0] - w / 2; const claro = e > 0.5;
        const g = el('g', { opacity: show }, S);
        el('rect', { x, y: p[1] - G.ch / 2, width: w, height: G.ch, rx: G.ch / 2, fill: claro ? COR.nevoa : '#2A2745', stroke: claro ? 'none' : COR.mare, 'stroke-opacity': .5 }, g);
        tx(name, { x: x + w / 2, y: p[1] + G.fs * 0.35, 'text-anchor': 'middle', style: `font:600 ${G.fs}px 'Instrument Sans',sans-serif;fill:${claro ? NOITE : COR.nevoa}` }, g);
      });
      const lb = seg(t, 6.4, 7.0);
      if (lb > 0) { const g = el('g', { opacity: lb, style: `font:500 ${G.nome === 'l' ? 12 : 11}px 'JetBrains Mono',monospace;letter-spacing:1.6px` }, S); tx('PESSOAS', { x: G.COLS[0] - 6, y: top - 12, fill: COR.sol }, g); tx('AGENTES DE IA', { x: G.X1 + 4, y: top - 12, 'text-anchor': 'end', fill: COR.mare }, g); }
      if (legenda) legenda.className = 'cena-legenda ' + (t < 0.4 ? '' : t < 4.3 ? 'solta' : 'trabalho');
    }
    return { quadro };
  }

  // =====================================================================
  // um fiandeiro avulso (elenco e bastidores)
  // =====================================================================
  const ELENCO = {
    comercial: { col: COR.mare, acc: 'fone' }, financeiro: { col: COR.mare, acc: 'oculos' }, conteudo: { col: COR.mare, acc: 'boina' },
    voce: { col: COR.sol, acc: 'agulha' }, atendimento: { col: COR.mare, acc: 'balao' }, pesquisa: { col: COR.mare, acc: 'lupa' },
  };
  function fiandeiro(svg, nome) {
    const f = ELENCO[nome]; svg.replaceChildren();
    const root = el('g', { transform: 'translate(80 112)' }, svg);
    const sombra = el('ellipse', { cx: 0, cy: 70, rx: 30, ry: 6, fill: COR.noite, opacity: .1 }, root);
    const corpo = el('g', {}, root); pano(corpo, -34, -60, 68, 120, 34, f.col, false);
    const vivo = el('g', {}, corpo);
    return {
      f, update(t, { drop = 0, hop = 0, sq = 0, look = [0, 0], wink = false, typing = false, off = 0 } = {}) {
        set(corpo, { transform: `translate(0 ${drop - hop}) scale(${1 + sq} ${1 - sq})` });
        set(sombra, { rx: 30 * (1 - hop / 40), opacity: drop < -40 ? 0.03 : .1 });
        vivo.replaceChildren(); face(vivo, 0, -20, 24, { look, blink: piscar(t, off), wink }); acc(vivo, f.acc, t, typing);
      }
    };
  }

  function cenaElenco(svgs, faixa) {
    const fs = svgs.map(s => fiandeiro(s, s.dataset.f));
    let faixaG = null;
    function quadro(t) {
      fs.forEach((F, i) => {
        const k = seg(t, 0.2 + i * 0.16, 1.0 + i * 0.16);
        const drop = (1 - bounce(k)) * -260;
        const ph = REDUZ ? 9 : ((t - 2.2 - i * 0.7) % 5.5 + 5.5) % 5.5; const hop = t > 2.2 && ph < 0.6 ? Math.sin(ph / 0.6 * Math.PI) * 9 : 0;
        const sq = Math.sin(seg(t, 0.62 + i * 0.16, 1.0 + i * 0.16) * Math.PI) * 0.1;
        F.update(t, { drop, hop, sq, look: REDUZ ? [0, 0] : [Math.sin(t * 0.9 + i) * 0.6, 0], off: i * 0.61, wink: F.f.acc === 'agulha' && t > 3 && ((t - 3) % 7) < 0.45 });
      });
      if (faixa) {
        if (!faixaG) faixaG = el('g', {}, faixa);
        faixaG.replaceChildren(); const wv = easeIO(seg(t, 1.6, 3.6)); if (wv <= 0) return;
        const w = 1000 * wv, x = 500 - w / 2;
        for (let r = 0; r < 3; r++) el('rect', { x, y: 14 + r * 13, width: w, height: 7, rx: 3.5, fill: r === 1 ? COR.sol : COR.mare }, faixaG);
        for (let kk = 0; kk * 22 < w - 8; kk++) el('rect', { x: x + kk * 22 + 6, y: 8 + (kk % 2) * 2, width: 8, height: 42 - (kk % 2) * 4, rx: 4, fill: kk % 2 ? COR.mare : COR.sol, opacity: .92 }, faixaG);
      }
    }
    return { quadro };
  }

  window.Mescla = { COR, REDUZ, Cena, cenaLogo, cenaNovelo, cenaElenco, fiandeiro, el, set, seg, clamp, lerp, easeIO, easeOut, piscar };
})();
