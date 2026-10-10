'use strict';
(() => {
  const config = window.DIFERENCIAL_CONFIG || {};
  const phone = String(config.whatsapp || '').replace(/\D/g, '');
  const hasPhone = /^\d{10,15}$/.test(phone);
  const message = config.message || 'Olá! Quero conhecer o Diferencial Capoeira e saber como participar dos treinos.';
  const whatsappUrl = hasPhone ? 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message) : '';
  const menu = document.getElementById('mobile-nav');
  const toggle = document.querySelector('.menu-toggle');
  const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); menu.hidden = true; };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); menu.hidden = !open;
  });
  menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); }, {passive:true});
  if (hasPhone) {
    document.querySelectorAll('.contact-cta').forEach(link => { link.href = whatsappUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; });
    document.getElementById('start-contact').innerHTML = 'Falar com o grupo no WhatsApp <span aria-hidden="true">↗</span>';
    document.getElementById('start-contact').href = whatsappUrl;
    document.querySelector('.contact-status').textContent = 'WhatsApp: (31) 99363-9073 · Uma conversa simples.';
    const individualUrl = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Olá! Quero conversar com o Mestre Carcará sobre treino individual.');
    document.querySelectorAll('.individual-cta').forEach(link => { link.href = individualUrl; });
  }
  if (config.address || config.schedule) {
    document.querySelector('.location-text').textContent = config.address ? 'Local: ' + config.address : '';
    document.querySelector('.schedule-text').textContent = config.schedule ? 'Horários: ' + config.schedule : '';
    document.getElementById('faq-location').textContent = [config.address, config.schedule].filter(Boolean).join(' · ') + '. Confirme com o grupo antes de ir.';
  }
  if (config.mapUrl && /^https:\/\//.test(config.mapUrl)) document.querySelectorAll('.map-link').forEach(link => { link.href = config.mapUrl; });
  const dialog = document.getElementById('contact-dialog');
  const messageInput = document.getElementById('contact-message');
  messageInput.value = message;
  document.getElementById('start-contact').addEventListener('click', (e) => {
    if (hasPhone) return;
    e.preventDefault();
    if (typeof dialog.showModal === 'function') { dialog.showModal(); document.body.classList.add('dialog-open'); }
    else { dialog.setAttribute('open',''); dialog.scrollIntoView({block:'center'}); }
  });
  const closeDialog = () => { dialog.close(); document.body.classList.remove('dialog-open'); };
  document.querySelector('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', e => { const box = dialog.getBoundingClientRect(); if (e.target === dialog && (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom)) closeDialog(); });
  document.getElementById('copy-message').addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(messageInput.value);
      else { messageInput.focus(); messageInput.select(); if (!document.execCommand('copy')) throw new Error('copy'); }
      status.textContent = 'Mensagem copiada. Você já pode colar na conversa com o grupo.';
    } catch (_) { messageInput.focus(); messageInput.select(); status.textContent = 'Selecione e copie a mensagem acima.'; }
  });
  const mobileCta = document.querySelector('.mobile-cta');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { mobileCta.classList.toggle('is-hidden', entries[0].isIntersecting); }, {threshold:0.18}).observe(document.querySelector('.start'));
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rootsSection = document.querySelector('.roots');
  const emotionalSection = document.querySelector('.belonging');
  const emotionalPhoto = document.querySelector('.belonging-photo');
  const clamp = value => Math.max(0, Math.min(1, value));
  const revealTargets = document.querySelectorAll('.roots-copy > *, .masters-heading, .circle-heading');
  let revealObserver;
  if ('IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!reduceMotion.matches) {
          const siblings = Array.from(entry.target.parentElement.children);
          const delay = entry.target.parentElement.classList.contains('roots-copy') ? Math.min(siblings.indexOf(entry.target) * 75, 225) : 0;
          entry.target.animate([
            {opacity:0, transform:'translateY(16px)', offset:0},
            {opacity:.65, transform:'translateY(4px)', offset:.5},
            {opacity:1, transform:'translateY(0)', offset:1}
          ], {duration:850, delay, easing:'cubic-bezier(.22,1,.36,1)', fill:'backwards'});
        }
        revealObserver.unobserve(entry.target);
      });
    }, {threshold:0.12, rootMargin:'0px 0px -35px 0px'});
    revealTargets.forEach(target => revealObserver.observe(target));
  }
  const header = document.querySelector('.header');
  const motionState = {shift:0, counter:0, turn:0, scale:1};
  const motionTarget = {...motionState};
  let measureQueued = false;
  let motionFrame = 0;
  let previousTime = 0;
  function clearMotion() {
    if (motionFrame) cancelAnimationFrame(motionFrame);
    motionFrame = 0;
    previousTime = 0;
    rootsSection.style.removeProperty('--archive-shift');
    rootsSection.style.removeProperty('--archive-counter');
    rootsSection.style.removeProperty('--archive-turn');
    emotionalPhoto.style.transform = '';
    Object.assign(motionState, {shift:0, counter:0, turn:0, scale:1});
    Object.assign(motionTarget, motionState);
    revealTargets.forEach(target => { if (typeof target.getAnimations === 'function') target.getAnimations().forEach(animation => animation.cancel()); });
  }
  function animateMotion(now) {
    motionFrame = 0;
    if (reduceMotion.matches) { clearMotion(); return; }
    const dt = previousTime ? Math.min(now - previousTime, 64) : 16;
    previousTime = now;
    const smoothing = 1 - Math.exp(-dt / 95);
    let settled = true;
    Object.keys(motionState).forEach(key => {
      const difference = motionTarget[key] - motionState[key];
      const tolerance = key === 'scale' ? .00015 : .02;
      if (Math.abs(difference) > tolerance) { motionState[key] += difference * smoothing; settled = false; }
      else motionState[key] = motionTarget[key];
    });
    rootsSection.style.setProperty('--archive-shift', motionState.shift.toFixed(2) + 'px');
    rootsSection.style.setProperty('--archive-counter', motionState.counter.toFixed(2) + 'px');
    rootsSection.style.setProperty('--archive-turn', motionState.turn.toFixed(2) + 'deg');
    emotionalPhoto.style.transform = 'scale(' + motionState.scale.toFixed(4) + ')';
    if (!settled) motionFrame = requestAnimationFrame(animateMotion);
    else previousTime = 0;
  }
  function measureMotion() {
    measureQueued = false;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    if (reduceMotion.matches) {
      clearMotion();
      return;
    }
    const rootsBounds = rootsSection.getBoundingClientRect();
    if (rootsBounds.top < window.innerHeight && rootsBounds.bottom > 0) {
      const progress = clamp((window.innerHeight - rootsBounds.top) / (window.innerHeight + rootsBounds.height));
      const amplitude = window.innerWidth > 800 ? 48 : 24;
      motionTarget.shift = (.5 - progress) * amplitude;
      motionTarget.counter = (progress - .5) * amplitude * .65;
      motionTarget.turn = (progress - .5) * 1.4;
    }
    const bounds = emotionalSection.getBoundingClientRect();
    if (window.innerWidth > 540 && bounds.top < window.innerHeight && bounds.bottom > 0) {
      const progress = clamp((window.innerHeight - bounds.top) / (window.innerHeight + bounds.height));
      motionTarget.scale = 1 + progress * .035;
    }
    if (window.innerWidth <= 540) motionTarget.scale = 1;
    if (!motionFrame) motionFrame = requestAnimationFrame(animateMotion);
  }
  function scheduleMeasurement() { if (!measureQueued) { measureQueued = true; requestAnimationFrame(measureMotion); } }
  window.addEventListener('scroll', scheduleMeasurement, {passive:true});
  window.addEventListener('resize', scheduleMeasurement, {passive:true});
  reduceMotion.addEventListener('change', measureMotion);
  measureMotion();
})();
