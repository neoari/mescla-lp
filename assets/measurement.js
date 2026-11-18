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
    const lines = [clean(String(base || '').replace(/[\r\n]+/g, ' '), 500), '', 'Segmento: ' + clean(label)];
    if (answers.team) lines.push('Equipe: ' + clean(answers.team));
    if (answers.interest) lines.push('Apoio desejado: ' + clean(answers.interest));
    if (answers.goal) lines.push('Resultado desejado: ' + clean(answers.goal, 500));
    const refs = UTM_KEYS.filter(key => attr.values[key]).map(key => key + '=' + attr.values[key]);
    lines.push('', 'Referência da página: ' + clean(version));
    if (refs.length) lines.push('Origem: ' + refs.join(' | '));
    return lines.join('\n');
  }
  function contactUrl(text) {
    const url = new URL('https://wa.me/5511978221510');
    url.searchParams.set('text', text);
    return url.toString();
  }
  const LEAD_UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const LEAD_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  function buildLeadPayload(fields, segment, pathname, attr) {
    const nome = String(fields.nome || '').trim();
    const telefone = String(fields.telefone || '').trim();
    if (!nome || nome.length > 120) throw new Error('Informe seu nome.');
    const digits = telefone.replace(/\D/g, '');
    if (!telefone || telefone.length > 32 || !/^[+\d() .-]+$/.test(telefone) || digits.length < 8 || digits.length > 15) {
      throw new Error('Confira seu WhatsApp, incluindo o DDD.');
    }
    if (!SEGMENTS.includes(segment) || segment === 'home') throw new Error('Página de contato inválida.');
    const payload = { nome, telefone, segmento: segment, pagina: pathname, privacy_version: '2026-11-18' };
    for (const key of ['interesse', 'equipe', 'trabalho']) {
      const value = String(fields[key] || '').trim();
      if (value.length > (key === 'trabalho' ? 500 : 120)) throw new Error('Revise o tamanho das informações do pedido.');
      if (value) payload[key] = value;
    }
    LEAD_UTM_KEYS.forEach(key => {
      const value = clean(attr && attr.values && attr.values[key]);
      if (value) payload[key] = value;
    });
    return payload;
  }
  function createLeadCapture(options) {
    let state = { status: 'idle', reference: null };
    let busy = false;
    let submissionId = null;
    const storage = options.storage;
    const storageKey = options.storageKey;
    function notify(status, reference = null, reason = null) {
      state = { status, reference, reason };
      options.onState({ ...state });
    }
    function id() {
      if (submissionId) return submissionId;
      try { submissionId = storage && storage.getItem(storageKey); } catch (_) { /* Storage is optional. */ }
      if (!LEAD_UUID.test(submissionId || '')) submissionId = options.uuid();
      if (!LEAD_UUID.test(submissionId || '')) throw new Error('UUID unavailable');
      try { if (storage) storage.setItem(storageKey, submissionId); } catch (_) { /* Retry still works in memory. */ }
      return submissionId;
    }
    return {
      getState: () => ({ ...state, busy }),
      async submit(payload) {
        if (busy || state.status === 'success') return { ignored: true };
        busy = true;
        notify('pending');
        let timer;
        let timedOut = false;
        const controller = new options.AbortController();
        try {
          const data = { submission_id: id(), ...payload };
          const operation = (async () => {
            const response = await options.fetch('/api/lead', {
              method: 'POST', credentials: 'same-origin', redirect: 'error', cache: 'no-store',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify(data), signal: controller.signal,
            });
            if (response.status !== 200 && response.status !== 201) throw new Error('response');
            const result = await response.json();
            if (!result || result.ok !== true || typeof result.reference !== 'string' ||
                !result.reference.trim() || result.reference.length > 200 || /[\u0000-\u001f\u007f]/.test(result.reference)) {
              throw new Error('response');
            }
            return result.reference;
          })();
          const timeout = new Promise((_, reject) => {
            timer = (options.setTimeout || setTimeout)(() => {
              timedOut = true;
              controller.abort();
              reject(new Error('timeout'));
            }, options.timeoutMs || 15000);
          });
          const reference = await Promise.race([operation, timeout]);
          notify('success', reference);
          return { ok: true, reference };
        } catch (_) {
          notify('error', null, timedOut ? 'timeout' : 'unconfirmed');
          return { ok: false };
        } finally {
          (options.clearTimeout || clearTimeout)(timer);
          busy = false;
        }
      },
      newRequest() {
        if (busy || state.status !== 'success') return false;
        submissionId = null;
        try { if (storage) storage.removeItem(storageKey); } catch (_) { /* In-memory reset is sufficient. */ }
        notify('idle');
        return true;
      },
    };
  }

  const api = { attribution, tagLink, message, contactUrl, TTL, buildLeadPayload, createLeadCapture };
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
    const event = { event: name, event_id: id, segment, page_path: scope.location.pathname, page_version: version,
      destination_segment: null, placement: null, team_size: null, interest_code: null, ...properties };
    UTM_KEYS.forEach(key => { if (attr.values[key]) event[key] = attr.values[key]; });
    scope.dataLayer.push(event);
  }
  // Without a page-specific message, every contact starts as a request for the free diagnosis.
  const DEFAULT_MESSAGE = 'Quero o diagnóstico da Mescla.';
  const contacts = doc.querySelectorAll('a[data-contact]');
  contacts.forEach(link => {
    const base = link.dataset.contactMessage || DEFAULT_MESSAGE;
    link.href = contactUrl(message(base, label, {}, attr, version));
    link.addEventListener('click', () => emit('mescla_whatsapp_open', { placement: link.dataset.placement || 'contact' }));
  });
  doc.querySelectorAll('a[data-attribution-link]').forEach(link => {
    link.href = tagLink(link.getAttribute('href'), scope.location.href, attr);
    if (link.dataset.segmentLink) link.addEventListener('click', () => emit('mescla_segment_open', { destination_segment: link.dataset.segmentLink }));
  });
  doc.querySelectorAll('[data-intent]').forEach(link => link.addEventListener('click', () => emit('mescla_contact_intent', { placement: 'hero' })));
  const form = doc.querySelector('.qualifier');
  // Without the required browser APIs the original WhatsApp link stays visible.
  if (form && scope.fetch && scope.AbortController && scope.crypto && scope.crypto.randomUUID) {
    const fields = form.querySelector('[data-lead-fields]');
    const submit = form.querySelector('[data-lead-submit]');
    const status = form.querySelector('[data-lead-status]');
    const success = form.querySelector('[data-lead-success]');
    const whatsapp = form.querySelector('[data-lead-whatsapp]');
    const fresh = form.querySelector('[data-lead-new]');
    const fallback = doc.querySelector('.contact-fallback');
    let storage = null;
    try { storage = scope.sessionStorage; } catch (_) { /* Storage is optional. */ }
    const capture = createLeadCapture({
      fetch: scope.fetch.bind(scope), AbortController: scope.AbortController,
      uuid: () => scope.crypto.randomUUID(), storage,
      storageKey: 'mescla.lead-submission.v1.' + segment,
      onState(state) {
        form.dataset.state = state.status;
        form.setAttribute('aria-busy', state.status === 'pending' ? 'true' : 'false');
        fields.disabled = state.status === 'pending' || state.status === 'success';
        submit.disabled = state.status === 'pending' || state.status === 'success';
        submit.hidden = state.status === 'success';
        success.hidden = state.status !== 'success';
        if (fallback) fallback.hidden = state.status !== 'error';
        if (state.status === 'pending') {
          submit.textContent = 'Salvando pedido…';
          status.textContent = 'Enviando seu pedido.';
        } else if (state.status === 'success') {
          status.textContent = 'Pedido recebido. Referência: ' + state.reference;
          whatsapp.href = contactUrl('Quero conversar sobre meu pedido à Mescla. Referência: ' + state.reference);
          // Receipt is a server-confirmed lead, never a sale or a WhatsApp send.
          emit('mescla_lead_received', { placement: 'qualification' });
          status.focus();
        } else if (state.status === 'error') {
          submit.textContent = 'Tentar salvar novamente';
          status.textContent = 'Não foi possível confirmar o recebimento. Seus dados continuam no formulário. Tente novamente ou fale com a Mescla pelo WhatsApp.';
        } else {
          submit.textContent = 'Salvar meu pedido';
          status.textContent = '';
          whatsapp.href = contactUrl('Quero o diagnóstico da Mescla.');
        }
      },
    });
    let started = false;
    form.addEventListener('change', () => { if (!started) { started = true; emit('mescla_qualification_start'); } });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (capture.getState().busy || capture.getState().status === 'success') return;
      if (!form.reportValidity()) return;
      try {
        const payload = buildLeadPayload({
          nome: form.querySelector('#lead-name').value,
          telefone: form.querySelector('#lead-phone').value,
          interesse: form.querySelector('#interest').value,
          equipe: form.querySelector('#team-size').value,
          trabalho: form.querySelector('#goal').value,
        }, segment, scope.location.pathname, attr);
        // The ID is retained on retry; the server must reject an ID reused with different data.
        void capture.submit(payload);
      } catch (error) {
        status.textContent = error.message;
      }
    });
    whatsapp.addEventListener('click', () => emit('mescla_whatsapp_open', { placement: 'lead_received' }));
    fresh.addEventListener('click', () => {
      if (!capture.newRequest()) return;
      form.reset();
      started = false;
      form.querySelector('#lead-name').focus();
    });
    form.hidden = false;
    form.dataset.state = 'idle';
    if (fallback) fallback.hidden = true;
  }
  // Basic consent gating: no GTM request occurs until consent is granted.
  // The container sends only the reviewed analytics events; advertising stays denied.
  if (/^GTM-[A-Z0-9]+$/.test(config.gtmId || '')) {
    let loaded = false;
    const consentKey = 'mescla.measurement-consent.' + clean(config.consentVersion || 'v1');
    function loadGtm() {
      if (loaded) return;
      loaded = true;
      function gtag() { scope.dataLayer.push(arguments); }
      gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      gtag('set', { allow_google_signals: false, allow_ad_personalization_signals: false });
      scope.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const script = doc.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(config.gtmId);
      doc.head.appendChild(script);
    }
    function clearAnalyticsCookies() {
      doc.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (!/^_ga(?:_|$)/.test(name)) return;
        [undefined, scope.location.hostname, '.mescla.ai'].forEach(domain => {
          doc.cookie = name + '=; Max-Age=0; Path=/' + (domain ? '; Domain=' + domain : '');
        });
      });
    }
    let choice = null;
    try { choice = scope.localStorage.getItem(consentKey); } catch (_) { /* Use the choice only in this view. */ }
    if (choice === 'yes') loadGtm();
    // GA may renew its session cookie while the previous page unloads.
    if (choice === 'no') clearAnalyticsCookies();
    // A page may provide its own compact notice ([data-measurement-consent] with [data-consent="yes|no"])
    // and footer button ([data-measurement-manage]); the choice, storage key and loading stay here.
    let notice = doc.querySelector('[data-measurement-consent]');
    let accept = notice && notice.querySelector('[data-consent="yes"]');
    let decline = notice && notice.querySelector('[data-consent="no"]');
    const ownNotice = !!(accept && decline);
    if (!ownNotice) {
      notice = doc.createElement('aside');
      notice.className = 'measurement-consent';
      notice.setAttribute('aria-label', 'Preferências de medição');
      const copy = doc.createElement('p');
      copy.textContent = 'Podemos usar o Google Analytics e cookies para entender as visitas e os cliques no site? O contato funciona com qualquer escolha.';
      accept = doc.createElement('button'); accept.type = 'button'; accept.textContent = 'Permitir medição';
      decline = doc.createElement('button'); decline.type = 'button'; decline.textContent = 'Continuar sem medição';
      const more = doc.createElement('a'); more.href = '/privacidade/'; more.textContent = 'Como usamos os dados';
      notice.append(copy, accept, decline, more);
    }
    function choose(value) {
      try { scope.localStorage.setItem(consentKey, value); } catch (_) { /* No persistence is required. */ }
      notice.hidden = true;
      if (value === 'yes') loadGtm();
      else {
        // Remove this site's GA cookies when permission is withdrawn.
        clearAnalyticsCookies();
        if (loaded) scope.location.reload();
      }
    }
    accept.addEventListener('click', () => choose('yes'));
    decline.addEventListener('click', () => choose('no'));
    notice.hidden = choice === 'yes' || choice === 'no';
    if (!ownNotice) doc.body.appendChild(notice);
    let manage = doc.querySelector('[data-measurement-manage]');
    if (!manage) {
      manage = doc.createElement('button');
      manage.type = 'button'; manage.className = 'manage-consent'; manage.textContent = 'Preferências de medição';
      const footer = doc.querySelector('.footer .wrap');
      if (footer) footer.appendChild(manage);
    }
    manage.hidden = false;
    manage.addEventListener('click', () => { notice.hidden = false; accept.focus(); });
  }
  emit(segment === 'home' ? 'mescla_home_view' : 'mescla_landing_view');
})(typeof window !== 'undefined' ? window : {});
