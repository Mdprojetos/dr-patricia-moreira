/* ==========================================================================
   Dra. Patrícia Moreira · interações do site
   Sem dependências. Cada bloco é independente e só roda se o elemento existir.
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var WHATSAPP = '5561992871031';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Menu mobile acessível ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  var label = document.querySelector('[data-menu-label]');
  var desktop = window.matchMedia('(min-width: 1024px)');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Fechar menu' : 'Abrir menu';
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) {
      var first = menu.querySelector('a');
      if (first) first.focus();
    }
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    // Fecha ao clicar em um link do menu
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') && !desktop.matches) setMenu(false);
    });
    // Esc fecha e devolve o foco ao botão; Tab fica preso dentro do menu aberto
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setMenu(false); toggle.focus(); return; }
      if (e.key === 'Tab') {
        var items = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
        var firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    });
    // Ao ir para o desktop, garante o menu "fechado" (estado neutro)
    desktop.addEventListener('change', function () { if (desktop.matches) setMenu(false); });
  }

  /* ---------- Header com borda ao rolar ---------- */
  var header = document.querySelector('[data-header]');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  if (header) { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); }

  /* ---------- Animações de entrada com IntersectionObserver ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    // Pequeno atraso escalonado entre irmãos para um efeito de cascata sutil
    reveals.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); });
      el.style.setProperty('--delay', Math.min(siblings.indexOf(el), 5) * 0.07 + 's');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Destaque do link ativo no menu ---------- */
  if ('IntersectionObserver' in window) {
    var links = document.querySelectorAll('.nav-list a');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (link && entry.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Comparador antes/depois ---------- */
  var compare = document.querySelector('[data-compare]');
  var range = document.querySelector('[data-compare-range]');
  if (compare && range) {
    var update = function () { compare.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', update);
    update();
  }

  /* ---------- Horários: destaca o dia de hoje e mostra se está aberto ---------- */
  // Horários no formato [abre, fecha] em minutos; null = fechado. Índice 0 = domingo.
  var HOURS = [null, [480, 1260], [480, 1080], [480, 1260], [480, 1080], [480, 1260], [480, 1080]];
  var status = document.querySelector('[data-open-status]');
  try {
    // Usa o fuso de Brasília independente do fuso de quem acessa
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    var mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    var row = document.querySelector('.hours-table tr[data-day="' + day + '"]');
    if (row) row.classList.add('is-today');
    if (status && day > -1) {
      var h = HOURS[day];
      var open = h && mins >= h[0] && mins < h[1];
      var fmt = function (m) { return String(Math.floor(m / 60)).padStart(2, '0') + 'h'; };
      status.textContent = open ? 'Aberto agora · até as ' + fmt(h[1]) : 'Fechado agora · chame no WhatsApp para agendar';
      status.classList.toggle('is-open', !!open);
    }
  } catch (err) { /* navegadores antigos: a tabela continua visível normalmente */ }

  /* ---------- Formulário → WhatsApp ---------- */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var showError = function (input, show) {
      var msg = document.getElementById(input.id + '-erro');
      input.setAttribute('aria-invalid', show ? 'true' : 'false');
      if (show) input.setAttribute('aria-describedby', msg.id); else input.removeAttribute('aria-describedby');
      msg.hidden = !show;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = form.nome, tel = form.telefone;
      var nomeOk = nome.value.trim().length >= 2;
      var telOk = tel.value.replace(/\D/g, '').length >= 10;
      showError(nome, !nomeOk);
      showError(tel, !telOk);
      if (!nomeOk) { nome.focus(); return; }
      if (!telOk) { tel.focus(); return; }

      var text = 'Olá, Dra. Patrícia! Gostaria de agendar uma consulta.\n\n' +
        'Nome: ' + nome.value.trim() + '\n' +
        'Telefone: ' + tel.value.trim() + '\n' +
        'Interesse: ' + form.tratamento.value + '\n' +
        'Melhor período: ' + form.periodo.value +
        (form.mensagem.value.trim() ? '\nMensagem: ' + form.mensagem.value.trim() : '');

      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }

  /* ---------- Ano automático no rodapé ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
