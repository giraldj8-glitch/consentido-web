/* ConSentido · interacciones (vanilla JS, sin dependencias)
   Compartido por la home, /para-ti y /para-equipos: cada bloque se activa solo si su sección existe. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const base = document.body.dataset.base || '';

  /* ── Nav: borde al hacer scroll ── */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Menú móvil ── */
  const burger = $('#burger');
  const menu = $('#mobileMenu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = !open;
  };
  burger.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ── Reveal al entrar en pantalla ── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: .18 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ── Tres escalas: el avance del scroll en la pista elige la escala activa ── */
  const scales = $('[data-scales]');
  if (scales) {
    const cards = $$('.vcard', scales);
    const stories = $$('.story-card', scales);
    const screens = $$('.screen', scales);
    const dots = $$('.scales__progress li', scales);
    const sticky = $('.scales__sticky', scales);
    let step = -1;

    const setStep = (n) => {
      if (n === step) return;
      step = n;
      cards.forEach((c, i) => {
        c.classList.toggle('is-active', i === n);
        c.classList.toggle('is-future', i > n);
      });
      stories.forEach((s, i) => s.classList.toggle('is-on', i === n));
      screens.forEach((s, i) => s.classList.toggle('is-on', i === n));
      dots.forEach((d, i) => {
        d.classList.toggle('is-on', i === n);
        d.classList.toggle('is-done', i < n);
      });
    };

    // Escritorio: escenario fijo, cada tercio de la pista es una escala.
    const fromScroll = () => {
      if (getComputedStyle(sticky).position !== 'sticky') return;
      const r = scales.getBoundingClientRect();
      const p = -r.top / (r.height - window.innerHeight);
      setStep(Math.max(0, Math.min(cards.length - 1, Math.floor(p * cards.length))));
    };
    // Móvil: sin escenario fijo, manda la tarjeta que está en pantalla.
    const scaleIO = new IntersectionObserver((entries) => {
      if (getComputedStyle(sticky).position === 'sticky') return;
      entries.forEach(e => { if (e.isIntersecting) setStep(Number(e.target.dataset.step)); });
    }, { rootMargin: '-55% 0px -35% 0px' });
    [...cards, ...stories].forEach(el => scaleIO.observe(el));

    setStep(0);
    fromScroll();
    window.addEventListener('scroll', fromScroll, { passive: true });
    window.addEventListener('resize', fromScroll);
  }

  /* ── "¿Has dicho alguna de estas frases?": la frase elegida muestra su respuesta ── */
  const mirror = $('[data-mirror]');
  if (mirror) {
    const phrases = $$('[data-i]', mirror);
    const answers = $$('[data-answer]', mirror);
    const pick = (i) => {
      phrases.forEach((b, j) => b.setAttribute('aria-selected', j === i));
      answers.forEach((a, j) => a.classList.toggle('is-on', j === i));
    };
    phrases.forEach((b, i) => {
      b.addEventListener('click', () => pick(i));
      b.addEventListener('mouseenter', () => pick(i));
      b.addEventListener('focus', () => pick(i));
    });
    pick(0);
  }

  /* ── Marquee de historias: duplicar para bucle continuo ── */
  $$('[data-marquee] .marquee__track').forEach(track => {
    $$(':scope > *', track).forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  /* ── Carrusel de categorías ── */
  const catsTrack = $('#catsTrack');
  if (catsTrack) {
    $$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
      catsTrack.scrollBy({ left: Number(btn.dataset.scroll) * 280, behavior: 'smooth' });
    }));
  }

  /* ── Secciones expandibles: un enlace con data-open abre su <details> ── */
  $$('[data-open]').forEach(a => a.addEventListener('click', () => {
    const target = $(a.dataset.open);
    if (target) target.open = true;
  }));

  /* ── El Método ConSentido: 6 pasos ── */
  const dotsWrap = $('.method__dots');
  if (dotsWrap) {
    const steps = [
      { t: 'Entendimiento del reto', d: 'Mapeamos el problema con quienes lo viven: dónde se tranca, a quién afecta y qué duele más. No proponemos soluciones antes de entender.', take: 'Un diagnóstico claro, con cuellos de botella identificados y priorizados.', ti: 'Tus fugas de tiempo', eq: 'El ruido operativo del equipo' },
      { t: 'Definición y enfoque', d: 'Acotamos el problema a algo abordable: qué atacamos primero, qué objetivo buscamos y cómo sabremos que mejoró.', take: 'Un reto bien definido, con métrica de éxito y alcance acordado.', ti: 'Tus prioridades reales', eq: 'El proceso que va primero' },
      { t: 'Ideación de la solución', d: 'Co-creamos opciones con todas las voces: la de quien lidera y la de quien opera cada día.', take: 'Varias rutas de solución evaluadas contigo, no impuestas desde afuera.', ti: 'Tu forma de trabajar', eq: 'Todas las voces del equipo' },
      { t: 'Diseño de la idea', d: 'Diseñamos y materializamos el modelo de solución que co-creamos, listo para probar.', take: 'La arquitectura concreta del nuevo flujo, sistema y herramientas.', ti: 'Tu sede digital personal', eq: 'La sede digital del equipo' },
      { t: 'Prototipado y aprendizaje', d: 'Probamos en pequeño, medimos el efecto y ajustamos antes de escalar. Fallar en pequeño es barato y a tiempo.', take: 'Un prototipo probado en la vida real y ajustado con evidencia.', ti: 'Tu semana de prueba', eq: 'Un piloto con parte del equipo' },
      { t: 'Entrega para la transformación', d: 'Documentamos, formamos y transferimos, para que el cambio se sostenga sin depender de nosotros.', take: 'Autonomía: un sistema vivo que funciona cuando nos vamos.', ti: 'Tu autonomía', eq: 'Equipo formado y documentación viva' },
    ];
    const panel = $('#methodPanel');
    let current = 0;

    steps.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'mdot';
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Paso ${i + 1}: ${s.t}`);
      b.setAttribute('aria-controls', 'methodPanel');
      b.textContent = i + 1;
      b.addEventListener('click', () => renderStep(i));
      dotsWrap.appendChild(b);
    });

    function renderStep(i) {
      current = i;
      const s = steps[i];
      $$('.mdot', dotsWrap).forEach((d, j) => {
        d.setAttribute('aria-selected', j === i);
        d.tabIndex = j === i ? 0 : -1;
        d.classList.toggle('is-done', j < i);
      });
      panel.innerHTML = `
        <div class="mp-anim">
          <div class="mp__progress"><i style="width:${((i + 1) / steps.length) * 100}%"></i></div>
          <p class="mp__num">0${i + 1}</p>
          <h3 class="mp__title">${s.t}</h3>
          <p class="mp__text">${s.d}</p>
          <div class="mp__take"><b>Te llevas</b>${s.take}</div>
          <div class="mp__scale"><span>Para ti · ${s.ti}</span><span>Para tu equipo · ${s.eq}</span></div>
        </div>`;
    }
    dotsWrap.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const next = (current + (e.key === 'ArrowRight' ? 1 : -1) + steps.length) % steps.length;
      renderStep(next);
      $$('.mdot', dotsWrap)[next].focus();
    });
    renderStep(0);
  }

  /* ── Planes: Para ti / Para tu equipo ── */
  const toggle = $('.toggle');
  function setTab(name) {
    if (!toggle) return;
    toggle.dataset.active = name;
    $$('[data-tab]', toggle).forEach(b => b.setAttribute('aria-selected', b.dataset.tab === name));
    $('#panel-ti').hidden = name !== 'ti';
    $('#panel-equipo').hidden = name !== 'equipo';
  }
  if (toggle) {
    $$('[data-tab]', toggle).forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
    $$('[data-tab-link]').forEach(a => a.addEventListener('click', () => setTab(a.dataset.tabLink)));
  }
  $$('.weeks li').forEach((li, i) => li.style.setProperty('--i', i));

  /* ── Formulario: la intención elegida cambia el botón (data-btn) y muestra la organización (data-org) ── */
  const form = $('#contactForm');
  function setIntent(v) {
    if (!form) return;
    const radio = $(`input[name="intent"][value="${v}"]`, form);
    if (!radio) return;
    radio.checked = true;
    $('#formBtn').textContent = radio.dataset.btn;
    $('.field--org', form).hidden = !('org' in radio.dataset);
  }
  if (form) {
    const radios = $$('input[name="intent"]', form);
    radios.forEach(r => r.addEventListener('change', () => setIntent(r.value)));
    $$('[data-intent]').forEach(a => a.addEventListener('click', () => setIntent(a.dataset.intent)));
    if (radios.length) setIntent(radios.find(r => r.checked).value);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = $('#formMsg');
      let ok = true;
      $$('input[required], select[required]', form).forEach(inp => {
        const valid = inp.checkValidity() && inp.value.trim() !== '';
        inp.setAttribute('aria-invalid', !valid);
        if (!valid) ok = false;
      });
      if (!ok) { msg.textContent = 'Revisa los campos marcados.'; return; }
      // PENDIENTE: conectar con la herramienta real (newsletter, Notion, Make o n8n).
      const nombre = form.nombre.value.trim().split(' ')[0];
      msg.textContent = `¡Gracias, ${nombre}! Te escribimos muy pronto.`;
      form.reset();
      if (radios.length) setIntent(radios[0].value);
    });
  }

  /* ── Newsletter: formulario corto de solo correo ── */
  $$('[data-news]').forEach(nf => nf.addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('input', nf);
    const msg = $('.news-form__msg', nf);
    const valid = inp.checkValidity() && inp.value.trim() !== '';
    inp.setAttribute('aria-invalid', !valid);
    if (!valid) { msg.textContent = 'Escribe un correo válido.'; return; }
    // PENDIENTE: conectar con la herramienta de newsletter.
    msg.textContent = '¡Listo! Te llega la próxima carta.';
    nf.reset();
  }));

  /* ── Buscador tipo Platzi ── */
  const index = [
    { k: 'tiempo fugas prioridades agenda semana vida', t: 'ConSentido para ti', s: 'Página', h: 'para-ti/' },
    { k: 'notion plantilla sede digital personal cerebro digital orden curso método', t: 'Curso del Método + plantilla Notion', s: '$300.000', h: 'para-ti/#sede' },
    { k: '1:1 1a1 acompañamiento personal sesiones instalación', t: 'Acompañamiento 1:1 de 5 semanas', s: '$1.500.000', h: 'para-ti/#sede' },
        { k: 'newsletter correo novedades gratis', t: 'Newsletter semanal', s: 'Gratis', h: 'para-ti/#aprende' },
    { k: 'equipo empresa organización', t: 'ConSentido para tu equipo', s: 'Página', h: 'para-equipos/' },
    { k: 'diagnóstico operativo', t: 'Diagnóstico operativo de 2 semanas', s: 'Para tu equipo', h: 'para-equipos/#formas' },
    { k: 'procesos operación flujos ruido operativo', t: 'Procesos ConSentido', s: 'Para tu equipo', h: 'para-equipos/#procesos' },
    { k: 'cultura propósito valores', t: 'Cultura ConSentido', s: 'Para tu equipo', h: 'para-equipos/#cultura' },
    { k: 'sede digital equipo onboarding conocimiento', t: 'La sede digital de tu equipo', s: 'Para tu equipo', h: 'para-equipos/#sede' },
    { k: 'automatización ia inteligencia artificial make n8n', t: 'Automatización e IA', s: 'Para tu equipo', h: 'para-equipos/#procesos' },
    { k: 'método pasos metodología', t: 'El Método ConSentido', s: '6 pasos', h: '#metodo' },
    { k: 'precio costo pagar cuotas planes', t: 'Precios y formas de pago', s: 'Planes', h: '#planes' },
    { k: 'contacto hablar whatsapp correo', t: 'Hablemos', s: 'Contacto', h: '#hablemos', here: true },
  ];
  // Rutas relativas a la raíz del sitio; "here" apunta a la página actual.
  const hrefOf = (item) => item.here ? item.h : base + item.h;
  const search = $('#search');
  const sInput = $('#searchInput');
  const sList = $('#searchResults');
  let active = 0;
  let lastFocus = null;
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function renderResults() {
    const q = norm(sInput.value.trim());
    const hits = q ? index.filter(i => norm(i.k + ' ' + i.t).includes(q)) : index.slice(0, 6);
    active = 0;
    sList.innerHTML = hits.length
      ? hits.map((h, i) => `<li><a href="${hrefOf(h)}" data-i="${index.indexOf(h)}" class="${i === 0 ? 'is-active' : ''}" role="option"><b>${h.t}</b><small>${h.s}</small></a></li>`).join('')
      : '<li class="empty">No encontramos eso todavía. Escríbenos en Hablemos.</li>';
  }
  function openSearch() {
    lastFocus = document.activeElement;
    search.hidden = false;
    sInput.value = '';
    renderResults();
    sInput.focus();
  }
  function closeSearch() {
    search.hidden = true;
    lastFocus?.focus();
  }
  function go(a) {
    const item = index[a.dataset.i];
    if (item.intent) setIntent(item.intent);
    const target = $(new URL(a.href).hash || '#_');
    if (target?.tagName === 'DETAILS') target.open = true;
    search.hidden = true;
  }
  $('#openSearch').addEventListener('click', openSearch);
  search.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeSearch();
    const a = e.target.closest('a[data-i]');
    if (a) go(a);
  });
  sInput.addEventListener('input', renderResults);
  sInput.addEventListener('keydown', (e) => {
    const links = $$('a[data-i]', sList);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!links.length) return;
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links.forEach((l, i) => l.classList.toggle('is-active', i === active));
      links[active].scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter' && links[active]) {
      e.preventDefault();
      go(links[active]);
      location.href = links[active].href;
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !search.hidden) closeSearch();
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (e.key === '/' && search.hidden && !typing) { e.preventDefault(); openSearch(); }
  });

  /* ── Al llegar con #ancla a un <details>, abrirlo ── */
  const fromHash = location.hash && $(location.hash);
  if (fromHash?.tagName === 'DETAILS') fromHash.open = true;
})();
