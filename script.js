/* Dependency-free progressive enhancements. */
(() => {
  'use strict';
  document.documentElement.classList.add('enhanced');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-menu');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');
  function setMenu(open, restoreFocus = false) {
    toggle?.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
    header?.classList.toggle('menu-open', open);
    if (restoreFocus) toggle?.focus();
  }
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') setMenu(false, true);
  });
  document.addEventListener('click', (event) => { if (!header?.contains(event.target)) setMenu(false); });
  header?.addEventListener('focusout', () => {
    requestAnimationFrame(() => { if (!header.contains(document.activeElement)) setMenu(false); });
  });
  mobile.addEventListener('change', () => setMenu(false));
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  document.querySelectorAll('[data-current-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
  let observer;
  function setupReveals() {
    observer?.disconnect();
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('motion-ready');
      return;
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.classList.add('is-visible');
        observer.unobserve(target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    document.documentElement.classList.add('motion-ready');
  }
  setupReveals();
  reducedMotion.addEventListener('change', setupReveals);
  const video = document.querySelector('.hero-video');
  const videoButton = document.querySelector('.video-toggle');
  if (video && videoButton) {
    videoButton.hidden = false;
    let userPaused = reducedMotion.matches;
    const syncButton = () => {
      videoButton.textContent = video.paused ? '▷ Play ambience' : 'Ⅱ Pause ambience';
      videoButton.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
    };
    const play = () => video.play().catch(syncButton);
    video.addEventListener('play', syncButton);
    video.addEventListener('pause', syncButton);
    video.addEventListener('error', () => { videoButton.hidden = true; });
    videoButton.addEventListener('click', () => {
      userPaused = !video.paused;
      if (userPaused) video.pause(); else play();
    });
    reducedMotion.addEventListener('change', () => {
      userPaused = reducedMotion.matches;
      if (userPaused) video.pause(); else play();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) video.pause(); else if (!userPaused) play();
    });
    if (userPaused) video.pause(); else play();
    syncButton();
  }
})();
