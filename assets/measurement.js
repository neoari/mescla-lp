(function (scope) {
  'use strict';
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];
  const CLICK_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid'];
  const SEGMENTS = ['home', 'empreendedores', 'creators', 'consultorias', 'agencias', 'advocacia'];
  const ATTR_KEY = 'mescla.attribution.v1';
  const TTL = 30 * 60 * 1000;
  function clean(value, limit = 120) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, limit);
  }
  function attribution(search, stored, now) {
    const params = new URLSearchParams(search);
    const fresh = UTM_KEYS.concat(CLICK_KEYS).some(key => params.has(key));
    if (!fresh && stored && Number.isFinite(stored.at) && now >= stored.at && now - stored.at < TTL) {
      return attribution(new URLSearchParams(stored.values || {}).toString(), null, stored.at);
    }
    const values = {};
    UTM_KEYS.concat(CLICK_KEYS).forEach(key => {
      const value = clean(params.get(key), CLICK_KEYS.includes(key) ? 256 : 120);
      if (value) values[key] = value;
    });
    return { at: now, values };
  }
  function tagLink(href, base, attr) {
    const url = new URL(href, base);
    if (url.origin !== new URL(base).origin || !/^https?:$/.test(url.protocol)) return href;
    Object.entries(attr.values).forEach(([key, value]) => url.searchParams.set(key, value));
    return url.pathname + url.search + url.hash;
  }
  function message(base, label, answers, attr, version) {
    const lines = [clean(base, 500), '', 'Segmento: ' + clean(label)];
    if (answers.team) lines.push('Equipe: ' + clean(answers.team));
    if (answers.interest) lines.push('Apoio desejado: ' + clean(answers.interest));
    if (answers.goal) lines.push('Resultado desejado: ' + clean(answers.goal, 500));
    const refs = UTM_KEYS.filter(key => attr.values[key]).map(key => key + '=' + attr.values[key]);
    lines.push('', 'Referência da página: ' + clean(version));
    if (refs.length) lines.push('Origem: ' + refs.join(' | '));
    return lines.join('\n');
  }
  function contactUrl(text) {
    const url = new URL('https://wa.me/5561993973584');
    url.searchParams.set('text', text);
    return url.toString();
  }
  const api = { attribution, tagLink, message, contactUrl, TTL };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (!scope.document) return;
  const doc = scope.document;
  const segment = doc.body.dataset.segment;
  if (!SEGMENTS.includes(segment)) return;
  const label = doc.body.dataset.segmentLabel || 'Mescla';
  const version = doc.body.dataset.pageVersion || '2026-09-v1';
  const config = scope.MESCLA_CONFIG || {};
  let stored = null;
  try { stored = JSON.parse(scope.sessionStorage.getItem(ATTR_KEY)); } catch (_) { /* Storage may be unavailable. */ }
  const attr = attribution(scope.location.search, stored, Date.now());
  try { scope.sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr)); } catch (_) { /* Contact remains available. */ }
  scope.dataLayer = scope.dataLayer || [];
  function emit(name, properties = {}) {
    const id = scope.crypto && scope.crypto.randomUUID ? scope.crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
    const event = { event: name, event_id: id, segment, page_path: scope.location.pathname, page_version: version, ...properties };
    UTM_KEYS.forEach(key => { if (attr.values[key]) event[key] = attr.values[key]; });
    scope.dataLayer.push(event);
  }
  const contacts = doc.querySelectorAll('a[data-contact]');
  contacts.forEach(link => {
    const base = segment === 'home' ? 'Quero conversar sobre como a Mescla pode ampliar minha capacidade de entrega.' : 'Quero combinar uma conversa sobre um time de IA para o meu trabalho.';
    link.href = contactUrl(message(base, label, {}, attr, version));
    link.addEventListener('click', () => emit('mescla_whatsapp_open', { placement: link.dataset.placement || 'contact' }));
  });
  doc.querySelectorAll('a[data-attribution-link]').forEach(link => {
    link.href = tagLink(link.getAttribute('href'), scope.location.href, attr);
    if (link.dataset.segmentLink) link.addEventListener('click', () => emit('mescla_segment_open', { destination_segment: link.dataset.segmentLink }));
  });
  doc.querySelectorAll('[data-intent]').forEach(link => link.addEventListener('click', () => emit('mescla_contact_intent', { placement: 'hero' })));
  const form = doc.querySelector('.qualifier');
  if (form) {
    let started = false;
    form.addEventListener('change', () => { if (!started) { started = true; emit('mescla_qualification_start'); } });
    form.addEventListener('submit', () => {
      const team = form.querySelector('#team-size');
      const interest = form.querySelector('#interest');
      const goal = form.querySelector('#goal');
      const answers = { team: team.selectedOptions[0].textContent, interest: interest.selectedOptions[0].textContent, goal: goal.value };
      form.querySelector('[name="text"]').value = message('Quero combinar uma conversa sobre um time de IA para o meu trabalho.', label, answers, attr, version);
      // A WhatsApp handoff is not a submitted lead, booked meeting or completed interview.
      emit('mescla_whatsapp_open', { placement: 'qualification', team_size: team.value, interest_code: interest.value });
    });
    form.hidden = false;
    const fallback = doc.querySelector('.contact-fallback');
    if (fallback) fallback.hidden = true;
  }
  // Basic consent gating: no GTM request occurs until consent is granted.
  // Only activate after the existing container and its tags have been checked.
  if (/^GTM-[A-Z0-9]+$/.test(config.gtmId || '')) {
    let loaded = false;
    const consentKey = 'mescla.measurement-consent.' + clean(config.consentVersion || 'v1');
    function loadGtm() {
      if (loaded) return;
      loaded = true;
      scope.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const script = doc.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(config.gtmId);
      doc.head.appendChild(script);
    }
    let choice = null;
    try { choice = scope.localStorage.getItem(consentKey); } catch (_) { /* Use the choice only in this view. */ }
    if (choice === 'yes') loadGtm();
    const notice = doc.createElement('aside');
    notice.className = 'measurement-consent';
    notice.setAttribute('aria-label', 'Preferências de medição');
    const copy = doc.createElement('p');
    copy.textContent = 'Podemos usar ferramentas de analytics e anúncios para entender quais páginas ajudam você? O contato funciona com qualquer escolha.';
    const accept = doc.createElement('button'); accept.type = 'button'; accept.textContent = 'Permitir medição';
    const decline = doc.createElement('button'); decline.type = 'button'; decline.textContent = 'Continuar sem medição';
    const more = doc.createElement('a'); more.href = '/privacidade/'; more.textContent = 'Como usamos os dados';
    function choose(value) {
      try { scope.localStorage.setItem(consentKey, value); } catch (_) { /* No persistence is required. */ }
      notice.hidden = true;
      if (value === 'yes') loadGtm();
      else if (loaded) scope.location.reload();
    }
    accept.addEventListener('click', () => choose('yes'));
    decline.addEventListener('click', () => choose('no'));
    notice.append(copy, accept, decline, more);
    notice.hidden = choice === 'yes' || choice === 'no';
    doc.body.appendChild(notice);
    const manage = doc.createElement('button');
    manage.type = 'button'; manage.className = 'manage-consent'; manage.textContent = 'Preferências de medição';
    manage.addEventListener('click', () => { notice.hidden = false; accept.focus(); });
    doc.querySelector('.footer .wrap').appendChild(manage);
  }
  emit(segment === 'home' ? 'mescla_home_view' : 'mescla_landing_view');
})(typeof window !== 'undefined' ? window : {});
