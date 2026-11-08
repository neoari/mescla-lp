/* Mescla · home · comportamento da página. A medição e o consentimento ficam em measurement.js. */
(function () {
  'use strict';
  const M = window.Mescla, $ = (q, r = document) => r.querySelector(q), $$ = (q, r = document) => Array.from(r.querySelectorAll(q));
  const REDUZ = M.REDUZ;
  const cenas = {};

  // ---------- topo fixo e menu do celular ----------
  const topo = $('#topo'), menuBt = $('.menu-botao');
  menuBt.addEventListener('click', () => { const ab = topo.classList.toggle('aberto'); menuBt.setAttribute('aria-expanded', ab); });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { topo.classList.remove('aberto'); menuBt.setAttribute('aria-expanded', 'false'); }));
  const marcaRolagem = () => topo.classList.toggle('rolou', scrollY > 8);
  addEventListener('scroll', marcaRolagem, { passive: true }); marcaRolagem();

  // ---------- sequência (cenas feitas de HTML: conversa, matriz) ----------
  function Sequencia(alvo, passos, { dur, reinicia, limiar = 0.3, observa }) {
    let i = 0;
    return M.Cena(alvo, {
      dur, limiar, observa,
      quadro(t) { while (i < passos.length && passos[i][0] <= t) { passos[i][1](); i++; } },
      reinicia() { i = 0; reinicia && reinicia(); }
    });
  }

  // ---------- 3 · o pedido das 21h47 ----------
  function montaPedido() {
    const sim = $('#sim-pedido'), cel = $('#celular'), hora = $('#cel-hora');
    const abas = $$('.abas [data-aba]', sim);
    let digitando = false;
    const painel = n => { $$('.painel', sim).forEach(p => p.classList.toggle('is-ativo', p.dataset.painel == n)); abas.forEach(b => b.setAttribute('aria-pressed', b.dataset.aba == n)); };
    const rola = p => { const c = $('.chat', p); c.scrollTop = c.scrollHeight; };
    const m = n => () => { const li = $(`[data-m="${n}"]`, sim), p = li.closest('.painel'); $('.digitando', p).classList.remove('is-on'); digitando = false; li.classList.add('is-on'); hora.textContent = li.dataset.hora; rola(p); };
    const dig = n => () => { const p = $(`[data-painel="${n}"]`, sim); $('.digitando', p).classList.add('is-on'); digitando = true; rola(p); };
    const b = n => () => $(`[data-b="${n}"]`, sim).classList.add('is-on');
    const pt = n => () => $(`[data-p="${n}"]`, sim).classList.add('is-on');
    // cerca de 15 s do pedido ao "Recebi!": digitação e pausas curtas, mensagens ficam na tela
    const passos = [
      [0.4, m(1)], [0.8, dig(1)], [1.7, m(2)], [1.9, pt(1)],
      [3.0, m(3)], [3.4, m(4)], [3.8, dig(1)], [4.7, m(5)], [5.3, m(6)],
      [5.7, b(1)], [6.0, b(2)], [6.1, pt(2)], [6.3, b(3)], [6.6, b(4)], [6.7, pt(3)],
      [7.2, () => cel.classList.add('is-noite')], [7.9, () => { painel(2); hora.textContent = '07:58'; }], [8.6, () => cel.classList.remove('is-noite')],
      [8.8, dig(2)], [9.5, m(7)], [10.5, m(8)], [10.8, () => $('#carimbo').classList.add('is-on')],
      [11.1, dig(2)], [11.8, m(9)], [12.0, b(5)], [12.2, b(6)], [12.3, pt(4)],
      [12.9, () => painel(3)], [13.1, dig(3)], [13.6, m(10)], [14.0, m(11)], [14.6, m(12)],
    ];
    const reset = () => {
      $$('.msg, .digitando, .bast-lista li, .pontos li', sim).forEach(e => e.classList.remove('is-on'));
      $('#carimbo').classList.remove('is-on'); cel.classList.remove('is-noite'); painel(1); hora.textContent = '21:47'; digitando = false;
    };
    reset();
    const cena = Sequencia(sim, passos, { dur: 15, reinicia: reset, limiar: 0.45, observa: cel });
    abas.forEach(bt => bt.addEventListener('click', () => { cena.finaliza(); painel(bt.dataset.aba); const p = $(`[data-painel="${bt.dataset.aba}"]`, sim); hora.textContent = $$('.msg', p).pop().dataset.hora; rola(p); }));
    cenas.pedido = cena;
    // o fiandeiro do Atendimento nos bastidores
    const svg = $('#fiandeiro-atendimento'), F = M.fiandeiro(svg, 'atendimento');
    M.Cena($('.bastidores'), { dur: 1, idle: true, limiar: 0.1, quadro: t => F.update(t, { typing: digitando, look: digitando ? [-0.8, 0.2] : [0, 0], off: 0.4 }) });
  }

  // ---------- 4 · a matriz se montando ----------
  function montaMatriz() {
    const pn = $('#diag-painel'), abas = $$('[data-etapa]', pn);
    const etapa = n => { $$('.diag-etapa', pn).forEach(p => p.classList.toggle('is-ativo', p.dataset.etapaPainel == n)); abas.forEach(b => b.setAttribute('aria-pressed', b.dataset.etapa == n)); };
    const on = q => () => $(q, pn).classList.add('is-on');
    const passos = [[0.4, on('[data-d="1"]')], [1.8, on('[data-d="2"]')], [3.6, on('[data-d="3"]')], [6.4, () => etapa(2)]];
    for (let r = 1; r <= 6; r++) passos.push([6.7 + r * 0.28, on(`[data-r="${r}"]`)]);
    passos.push([10.4, () => etapa(3)]);
    for (let q = 1; q <= 4; q++) passos.push([10.7 + q * 0.4, on(`.q-item[data-q="${q}"]`)]);
    passos.push([12.8, on('.recomendacao')]);
    const reset = () => { $$('.msg, .rotinas li, .q-item, .recomendacao', pn).forEach(e => e.classList.remove('is-on')); etapa(1); };
    reset();
    const cena = Sequencia(pn, passos, { dur: 13.5, reinicia: reset, limiar: 0.3 });
    abas.forEach(bt => bt.addEventListener('click', () => { cena.finaliza(); etapa(bt.dataset.etapa); }));
    cenas.matriz = cena;
  }

  // ---------- 5 · os fios de cada etapa (cruzam uma vez a mais a cada etapa) ----------
  function fioSVG(n, horiz) {
    const W = 240, H = horiz ? 76 : 56, c = H / 2, amp = horiz ? 12 : 10, map = (x, y) => horiz ? [x, y] : [y, x];
    const vb = horiz ? `0 0 ${W} ${H}` : `0 0 ${H} ${W}`;
    const s = [1, -1, -1, 1, 1][n - 1];
    const ve = 'vector-effect="non-scaling-stroke" fill="none" stroke-linecap="round"';
    const curva = (sg, x0, x1) => { let d = ''; for (let i = 0; i <= 40; i++) { const x = x0 + (x1 - x0) * i / 40, y = c - sg * s * amp * Math.cos(Math.PI * n * x / W); const [X, Y] = map(x, y); d += (i ? 'L' : 'M') + X.toFixed(1) + ' ' + Y.toFixed(1); } return d; };
    const linha = (x0, y0, x1, y1) => { const [a, b] = map(x0, y0), [cc, d] = map(x1, y1); return `M${a} ${b} L${cc} ${d}`; };
    let o = `<svg class="${horiz ? 'h' : 'v'}" viewBox="${vb}" preserveAspectRatio="none">`;
    if (n < 5) {
      o += `<path class="tr" pathLength="1" d="${curva(1, 0, W)}" stroke="#F2B84B" stroke-width="5" ${ve}/>`;
      o += `<path class="tr" pathLength="1" d="${curva(-1, 0, W)}" stroke="#6FD9C9" stroke-width="5" ${ve}/>`;
      for (let k = 0; k < n; k += 2) { const xk = (k + .5) * W / n, d = curva(1, xk - 10, xk + 10); o += `<path class="sobre" d="${d}" stroke="#FBFAFD" stroke-width="10" ${ve}/><path class="sobre" d="${d}" stroke="#F2B84B" stroke-width="5" ${ve}/>`; }
    } else {
      o += `<path class="tr" pathLength="1" d="${linha(0, c - amp, 40, c - amp)}" stroke="#F2B84B" stroke-width="5" ${ve}/>`;
      o += `<path class="tr" pathLength="1" d="${linha(0, c + amp, 40, c + amp)}" stroke="#6FD9C9" stroke-width="5" ${ve}/>`;
      let t = '<g class="tecido">';
      const rows = horiz ? [c - 18, c - 6, c + 6, c + 18] : [c - 15, c - 5, c + 5, c + 15], top = horiz ? c - 26 : c - 22, bot = horiz ? c + 26 : c + 22;
      rows.forEach(y => t += `<path d="${linha(44, y, 232, y)}" stroke="#6FD9C9" stroke-width="5" ${ve}/>`);
      const cols = []; for (let x = 52; x <= 226; x += 16) cols.push(x);
      cols.forEach(x => t += `<path d="${linha(x, top, x, bot)}" stroke="#F2B84B" stroke-width="6" ${ve}/>`);
      rows.forEach((y, i) => cols.forEach((x, j) => { if ((i + j) % 2 === 0) { t += `<path d="${linha(x - 6, y, x + 6, y)}" stroke="#FBFAFD" stroke-width="9" ${ve} stroke-linecap="butt"/><path d="${linha(x - 8, y, x + 8, y)}" stroke="#6FD9C9" stroke-width="5" ${ve} stroke-linecap="butt"/>`; } }));
      o += t + '</g>';
    }
    return o + '</svg>';
  }
  function montaEtapas() {
    $$('.fio-etapa').forEach(d => { const n = +d.dataset.n; d.innerHTML = fioSVG(n, true) + fioSVG(n, false); });
    const lista = $('#etapas');
    if (REDUZ) { lista.classList.add('is-in'); return; }
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { lista.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.25 }).observe(lista);
  }

  // ---------- 7 · cards: no celular, os pontos acendem ao entrar na tela ----------
  function montaCards() {
    const c = $('#cards');
    if (!matchMedia('(hover: none)').matches) return;
    if (REDUZ) { c.classList.add('is-in'); return; }
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { c.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.15 }).observe(c);
  }

  // ---------- 6 · a etiqueta e o "segure para dar o ponto" ----------
  function montaEtiqueta() {
    const etq = $('#etiqueta'), bt = $('#segure'), txt = $('.segure-txt', bt), status = $('.segure-feito'), cos = $('#costura');
    etq.dataset.estado = 'pendente';
    $$('.etq-linhas > div', etq).forEach((d, i) => d.style.transitionDelay = (i * 0.12) + 's');
    if (REDUZ) etq.classList.add('revelada');
    else new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { etq.classList.add('revelada'); io.disconnect(); } }, { threshold: 0.3 }).observe(etq);
    // costura: pontos em cruz e a agulha
    const NS = 'http://www.w3.org/2000/svg', N = 15, x0 = 16, x1 = 284, pontos = [];
    M.el('line', { x1: x0, y1: 15, x2: x1, y2: 15, stroke: '#DDDAE5', 'stroke-width': 1.5, 'stroke-dasharray': '3 5' }, cos);
    for (let i = 0; i < N; i++) { const x = x0 + (i + .5) * (x1 - x0) / N, g = M.el('g', { opacity: 0, stroke: '#116C60', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, cos); M.el('line', { x1: x - 5, y1: 10, x2: x + 5, y2: 20 }, g); M.el('line', { x1: x + 5, y1: 10, x2: x - 5, y2: 20 }, g); pontos.push(g); }
    const ag = M.el('g', {}, cos); M.el('line', { x1: 0, y1: -2, x2: 16, y2: 22, stroke: '#625F72', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, ag); M.el('ellipse', { cx: 2, cy: 1, rx: 1.4, ry: 3, fill: '#FBFAFD', transform: 'rotate(-34 2 1)' }, ag);
    let p = 0, segurando = false, feito = false, raf = 0, last = 0;
    const desenha = () => {
      bt.style.setProperty('--p', p.toFixed(3));
      pontos.forEach((g, i) => g.setAttribute('opacity', p >= (i + 1) / N ? 1 : 0));
      const x = x0 + p * (x1 - x0); ag.setAttribute('transform', `translate(${x - 8} ${segurando ? Math.sin(performance.now() / 70) * 3 : 0})`);
    };
    const loop = now => {
      raf = 0; const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
      if (feito) return;
      p = segurando ? Math.min(1, p + dt / 1.4) : Math.max(0, p - dt / 0.6);
      desenha();
      if (p >= 1) return conclui();
      if (segurando || p > 0) raf = requestAnimationFrame(loop); else last = 0;
    };
    const selo = $('.selo-aprovado', etq), linhaAprov = $('.etq-aprov', etq);
    const poeSelo = () => { selo.style.top = (linhaAprov.offsetTop - 8) + 'px'; };
    poeSelo(); addEventListener('resize', poeSelo);
    const conclui = () => {
      feito = true; segurando = false; etq.classList.add('carimbando'); etq.dataset.estado = 'aprovado'; bt.classList.add('feito'); txt.textContent = 'Ponto dado. Aprovado.'; $('.segure-txt2', bt).textContent = txt.textContent; poeSelo();
      status.textContent = 'Agora sim: a proposta sai para a Marina, com recibo.'; if (navigator.vibrate) try { navigator.vibrate(30); } catch (_) { }
    };
    const comeca = () => { if (feito) return; segurando = true; if (!raf) { last = 0; raf = requestAnimationFrame(loop); } };
    const solta = () => { segurando = false; if (!raf && !feito) { last = 0; raf = requestAnimationFrame(loop); } };
    bt.addEventListener('pointerdown', e => { e.preventDefault(); try { bt.setPointerCapture(e.pointerId); } catch (_) { } comeca(); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => bt.addEventListener(ev, solta));
    bt.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); comeca(); } else if (e.key === ' ' || e.key === 'Enter') e.preventDefault(); });
    bt.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); solta(); } });
    bt.addEventListener('contextmenu', e => e.preventDefault());
    desenha();
  }

  // ---------- a espinha: dois fios descem pela página e viram o logo no fechamento ----------
  function montaEspinha() {
    const caixa = $('.espinha'), svg = $('#espinha');
    let A, B, sobre = [], tabA = [], tabB = [], LA = 1, LB = 1, pronto = false;
    function constroi() {
      caixa.style.height = '0px';
      const H = document.documentElement.scrollHeight, vw = document.documentElement.clientWidth;
      caixa.style.height = H + 'px'; svg.setAttribute('viewBox', `0 0 ${vw} ${H}`); svg.setAttribute('width', vw); svg.setAttribute('height', H);
      const pad = vw >= 980 ? 40 : vw >= 600 ? 32 : 20, esq = Math.max(pad, (vw - 1200) / 2);
      const lane = vw >= 980 ? Math.max(18, esq / 2) : Math.max(7, esq / 2), amp = vw >= 980 ? Math.min(6, esq / 6) : 3, sw = vw >= 980 ? 3.2 : 2.4;
      const top = el => el.getBoundingClientRect().top + scrollY;
      const secs = $$('main > section').map(s => top(s)).slice(1);
      const fech = $('#fechamento'), alvo = $('#cena-fechamento');
      const r = alvo.getBoundingClientRect(), ax = r.left + scrollX, ay = r.top + scrollY, k = r.height / 300;
      const yIni = top($('#principal')) + 30, yF = top(fech) + Math.min(46, (ay - top(fech)) * 0.5);
      const fronts = secs.filter(y => y < yF - 110);
      let sA = -1, dA = `M${lane + sA * amp} ${yIni}`, dB = `M${lane - sA * amp} ${yIni}`; sobre = [];
      fronts.forEach((y, i) => {
        const y0 = y - 70, y1 = y + 70, xa0 = lane + sA * amp, xa1 = lane - sA * amp;
        dA += ` L${xa0} ${y0} C${xa0} ${y} ${xa1} ${y} ${xa1} ${y1}`; dB += ` L${xa1} ${y0} C${xa1} ${y} ${xa0} ${y} ${xa0} ${y1}`;
        const mid = (xa0 + xa1) / 2, dd = (xa0 - xa1) * .3 * (i % 2 ? -1 : 1);
        sobre.push({ y, fio: i % 2 ? 'B' : 'A', d: `M${mid + dd} ${y - 14} L${mid - dd} ${y + 14}` });
        sA = -sA;
      });
      // o fim: os fios saem da margem e entram no logo do fechamento
      // pelo alto da faixa de fechamento (acima do texto) e descendo até as pontas que entram no logo
      const xa = lane + sA * amp, xb = lane - sA * amp, R = 22;
      const curva = (x, yh, tx) => ` L${x} ${yh - R} Q${x} ${yh} ${x + R} ${yh} L${tx - R} ${yh} Q${tx} ${yh} ${tx} ${yh + R} L${tx} ${ay + 6}`;
      dA += curva(xa, yF, ax + 118.9 * k); dB += curva(xb, yF + 10, ax + 70.6 * k);
      svg.replaceChildren();
      const cor = { A: '#F2B84B', B: '#6FD9C9' };
      A = M.el('path', { d: dA, fill: 'none', stroke: cor.A, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .95 }, svg);
      B = M.el('path', { d: dB, fill: 'none', stroke: cor.B, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .95 }, svg);
      sobre = sobre.map(s => ({ y: s.y, e: M.el('path', { d: s.d, fill: 'none', stroke: cor[s.fio], 'stroke-width': sw, 'stroke-linecap': 'round', opacity: 0 }, svg) }));
      LA = A.getTotalLength(); LB = B.getTotalLength();
      const tab = (p, L) => { const t = []; for (let i = 0; i <= 400; i++) { const l = L * i / 400; t.push([p.getPointAtLength(l).y, l]); } return t; };
      tabA = tab(A, LA); tabB = tab(B, LB);
      [A, B].forEach((p, i) => { const L = i ? LB : LA; p.style.strokeDasharray = L; });
      pronto = true; atualiza();
    }
    const ate = (tab, y) => { let l = 0; for (const [yy, ll] of tab) { if (yy <= y) l = ll; else break; } return l; };
    function atualiza() {
      if (!pronto) return;
      const y = REDUZ ? 1e9 : scrollY + innerHeight * 0.78;
      A.style.strokeDashoffset = LA - ate(tabA, y); B.style.strokeDashoffset = LB - ate(tabB, y);
      sobre.forEach(s => s.e.setAttribute('opacity', s.y + 14 < y ? 1 : 0));
    }
    let rq = 0; addEventListener('scroll', () => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; atualiza(); }); }, { passive: true });
    let tm = 0; const agenda = () => { clearTimeout(tm); tm = setTimeout(constroi, 150); };
    addEventListener('resize', agenda);
    if ('ResizeObserver' in window) new ResizeObserver(agenda).observe($('main'));
    constroi();
  }

  // ---------- celular: botão fixo depois da primeira dobra (o aviso de medição fica abaixo dele, em #fixos) ----------
  function montaFixos() {
    const fixos = $('#fixos'), cta = $('#cta-fixo');
    let heroFora = false, zona = new Set();
    const upd = () => { const v = heroFora && zona.size === 0; fixos.classList.toggle('mostra-cta', v); cta.setAttribute('aria-hidden', !v); cta.tabIndex = v ? 0 : -1; };
    new IntersectionObserver(es => { for (const e of es) heroFora = !e.isIntersecting && e.boundingClientRect.top < 0; upd(); }).observe($('#acoes-topo'));
    const io = new IntersectionObserver(es => { for (const e of es) e.isIntersecting ? zona.add(e.target) : zona.delete(e.target); upd(); }, { threshold: 0.1 });
    [$('.diag-cta'), $('#fechamento'), $('.rodape')].forEach(e => io.observe(e));
  }

  // ---------- cenas desenhadas (esperam as fontes para medir o texto) ----------
  function montaCenas() {
    const logo = M.cenaLogo($('#cena-topo'), { modo: 'topo' });
    cenas.topo = M.Cena($('.topo-cena'), { dur: 6.6, idle: true, limiar: 0.15, quadro: logo.quadro });
    const nov = M.cenaNovelo($('#cena-novelo'), $('.cena-legenda'));
    cenas.novelo = M.Cena($('.leitura-cena'), { dur: 7.4, limiar: 0.35, quadro: nov.quadro });
    const fe = M.cenaLogo($('#cena-fechamento'), { modo: 'fechamento' });
    cenas.fechamento = M.Cena($('#fechamento'), { dur: 6, idle: true, limiar: 0.2, quadro: fe.quadro });
    const el = M.cenaElenco($$('.fiandeiro'), $('#faixa-tecido'));
    cenas.elenco = M.Cena($('#elenco'), { dur: 4, idle: true, limiar: 0.15, quadro: el.quadro });
    let tm = 0; addEventListener('resize', () => { clearTimeout(tm); tm = setTimeout(() => ['topo', 'novelo', 'fechamento'].forEach(k => cenas[k].redesenha()), 150); });
  }

  $$('[data-de-novo]').forEach(b => b.addEventListener('click', () => { const c = cenas[b.dataset.deNovo]; if (c) c.reinicia(); }));

  // links como /#diagnostico (bio, YouTube, links antigos): as fontes mudam a altura do texto depois do salto inicial,
  // então a página volta a alinhar a seção quando tudo está pronto, se o visitante ainda não rolou por conta própria
  let mexeu = false;
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(ev => addEventListener(ev, () => { mexeu = true; }, { once: true, passive: true }));
  const realinha = () => { const id = decodeURIComponent(location.hash.slice(1)), alvo = id && document.getElementById(id); if (alvo && !mexeu) alvo.scrollIntoView(); };

  montaPedido(); montaMatriz(); montaEtapas(); montaCards(); montaEtiqueta(); montaFixos();
  const pronto = () => { montaCenas(); montaEspinha(); requestAnimationFrame(realinha); };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(pronto, pronto);
})();
