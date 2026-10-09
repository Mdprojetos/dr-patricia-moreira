/* ==========================================================================
   Odonto Prime · interações do site
   Menu, entrada do topo, sol que sobe com a rolagem, revelar ao rolar,
   abas, passos, carrossel, "aberto agora", horários, formulário para WhatsApp.
   ========================================================================== */
(() => {
  'use strict';

  // TROCAR: número do WhatsApp da clínica (55 + DDD + número, só dígitos)
  const WHATSAPP = '5561000000000';
  // TROCAR: horário em minutos desde 0h, por dia da semana (0 = domingo). Edite junto com a tabela no HTML.
  const HOURS = {
    0: null,
    1: [8 * 60, 18 * 60], 2: [8 * 60, 18 * 60], 3: [8 * 60, 18 * 60],
    4: [8 * 60, 18 * 60], 5: [8 * 60, 18 * 60],
    6: [8 * 60, 12 * 60],
  };
  const DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // Todos os links de WhatsApp usam o mesmo número
  $$('[data-wa-link]').forEach((a) => { a.href = `https://wa.me/${WHATSAPP}`; });

  /* ---------- Entrada do topo ---------- */
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-loaded')));

  /* ---------- Rolagem: header, WhatsApp flutuante, sol e passos ---------- */
  const header = $('[data-header]');
  const waFloat = $('[data-wa-float]');
  const hero = $('[data-hero]');
  const stepList = $('[data-steps]');
  let ticking = false;
  let introDone = false;
  setTimeout(() => { introDone = true; }, 1900); // deixa a animação de entrada do sol terminar

  const onScroll = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    header.classList.toggle('is-scrolled', y > 8);
    if (waFloat && hero) waFloat.classList.toggle('is-visible', y > hero.offsetHeight * 0.7);

    // O sol sobe enquanto o hero sai da tela
    if (hero && !reduceMotion) {
      const p = Math.min(1, Math.max(0, y / hero.offsetHeight));
      hero.style.setProperty('--sun', p.toFixed(3));
      if (introDone) root.classList.add('is-scrolling');
    }

    // A linha dos passos se preenche conforme a seção passa
    if (stepList) {
      const r = stepList.getBoundingClientRect();
      const p = reduceMotion ? 1 : Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.3)));
      stepList.style.setProperty('--p', p.toFixed(3));
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Menu mobile acessível ---------- */
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const label = $('[data-menu-label]');
  const desktop = window.matchMedia('(min-width: 1024px)');

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Fechar menu' : 'Abrir menu';
    menu.classList.toggle('is-open', open);
    root.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(() => $('a', menu).focus(), 80);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a') && !desktop.matches) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (e.key === 'Escape') { setMenu(false); toggle.focus(); }
    // Mantém o foco dentro do menu aberto
    if (e.key === 'Tab') {
      const items = [toggle, ...$$('a', menu)];
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  desktop.addEventListener('change', () => setMenu(false));

  /* ---------- Link ativo no menu conforme a seção ---------- */
  const navLinks = $$('.nav-list a');
  if ('IntersectionObserver' in window) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          const active = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean).forEach((s) => navObs.observe(s));
  }

  /* ---------- Revelar ao rolar, em cascata entre irmãos ---------- */
  const reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    reveals.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
      const i = siblings.indexOf(el);
      if (i > 0) el.style.setProperty('--delay', `${Math.min(i, 5) * 0.08}s`);
    });
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach((el) => revealObs.observe(el));
  }

  /* ---------- Abas de tratamentos (padrão WAI-ARIA tabs) ---------- */
  const tabsRoot = $('[data-tabs]');
  if (tabsRoot) {
    const tabs = $$('[role="tab"]', tabsRoot);
    const select = (tab, focus = true) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !selected;
        if (selected && !reduceMotion) {
          panel.classList.remove('is-entering');
          void panel.offsetWidth; // reinicia a animação
          panel.classList.add('is-entering');
        }
      });
      if (focus) tab.focus();
      // Mantém a aba visível na lista rolável do celular, sem mover a página
      const list = tab.parentElement;
      if (list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: tab.offsetLeft - list.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        let next = null;
        if (e.key in keys) next = tabs[(i + keys[e.key] + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next); }
      });
    });
  }

  /* ---------- Carrossel de depoimentos (scroll-snap + botões) ---------- */
  const carousel = $('[data-carousel]');
  if (carousel) {
    const track = $('[data-carousel-track]', carousel);
    const items = $$('.quote', track);
    const prev = $('[data-carousel-prev]');
    const next = $('[data-carousel-next]');
    const status = $('[data-carousel-status]');
    let current = 0;

    const step = () => (items[1] ? items[1].offsetLeft - items[0].offsetLeft : track.clientWidth);
    const update = () => {
      current = Math.round(track.scrollLeft / step());
      const perView = Math.max(1, Math.round(track.clientWidth / step()));
      items.forEach((it, i) => it.classList.toggle('is-current', i >= current && i < current + perView));
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    const go = (dir) => track.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    let t;
    track.addEventListener('scroll', () => {
      update();
      clearTimeout(t);
      t = setTimeout(() => { status.textContent = `Depoimento ${current + 1} de ${items.length}`; }, 250);
    }, { passive: true });
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Fotos provisórias: se não carregarem, fica um bloco na cor da marca ---------- */
  $$('img[src*="unsplash"]').forEach((img) => {
    const fail = () => img.parentElement.classList.add('img-failed');
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail);
  });

  /* ---------- Horário de Brasília: "aberto agora" e dia de hoje ---------- */
  const nowInBrasilia = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
  };
  const fmt = (m) => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`;

  const { day, minutes } = nowInBrasilia();
  $$('.hours tr[data-days]').forEach((tr) => {
    if (tr.dataset.days.split(',').map(Number).includes(day)) tr.classList.add('is-today');
  });

  const statusEl = $('[data-status]');
  if (statusEl) {
    const text = $('[data-status-text]', statusEl);
    const today = HOURS[day];
    if (today && minutes >= today[0] && minutes < today[1]) {
      statusEl.classList.add('is-open');
      text.textContent = `Aberto agora, até as ${fmt(today[1])}`;
    } else {
      let msg = '';
      if (today && minutes < today[0]) msg = `Abre hoje às ${fmt(today[0])}`;
      else {
        for (let i = 1; i <= 7; i++) {
          const d = (day + i) % 7;
          if (HOURS[d]) { msg = `Abre ${i === 1 ? 'amanhã' : DAY_NAMES[d]} às ${fmt(HOURS[d][0])}`; break; }
        }
      }
      text.textContent = `Fechado agora. ${msg}`;
    }
    statusEl.hidden = false;
  }

  /* ---------- Formulário: valida e abre o WhatsApp com a mensagem ---------- */
  const form = $('[data-form]');
  if (form) {
    const fields = {
      nome: { el: form.nome, err: $('#nome-erro'), ok: (v) => v.trim().length >= 2 },
      telefone: { el: form.telefone, err: $('#tel-erro'), ok: (v) => v.replace(/\D/g, '').length >= 10 },
    };
    const check = (f) => {
      const valid = f.ok(f.el.value);
      f.el.setAttribute('aria-invalid', String(!valid));
      f.err.hidden = valid;
      return valid;
    };
    Object.values(fields).forEach((f) => f.el.addEventListener('blur', () => { if (f.el.value) check(f); }));

    // Máscara simples de telefone: (61) 99999-9999
    form.telefone.addEventListener('input', () => {
      const d = form.telefone.value.replace(/\D/g, '').slice(0, 11);
      let out = d;
      if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
      form.telefone.value = out;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.values(fields).map(check);
      if (results.includes(false)) {
        Object.values(fields).find((f) => f.el.getAttribute('aria-invalid') === 'true').el.focus();
        return;
      }
      const data = new FormData(form);
      const lines = [
        `Olá, Odonto Prime! Meu nome é ${data.get('nome').trim()}.`,
        `Gostaria de agendar: ${data.get('tratamento')}.`,
        `Melhor período: ${data.get('periodo')}.`,
        `Telefone: ${data.get('telefone')}.`,
      ];
      const msg = data.get('mensagem').trim();
      if (msg) lines.push('', msg);
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
      $('[data-form-note]').textContent = 'Mensagem pronta no WhatsApp. Confirme o envio por lá.';
    });
  }

  /* ---------- Ano no rodapé ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
