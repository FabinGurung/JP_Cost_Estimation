(() => {
  'use strict';
  const key = 'jp-estimation-appearance-v1';
  let choice = 'light';
  try {
    const remembered = localStorage.getItem(key);
    if (remembered === 'light' || remembered === 'dark') choice = remembered;
  } catch (_) { /* Browser storage may be unavailable; light remains the default. */ }
  const root = document.documentElement;
  root.dataset.theme = choice;
  function reflect() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.textContent = root.dataset.theme === 'dark' ? 'Light mode' : 'Dark mode';
    toggle.setAttribute('aria-label', 'Switch to ' + (root.dataset.theme === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  }
  document.addEventListener('DOMContentLoaded', () => {
    reflect();
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem(key, next); } catch (_) {}
      reflect();
    });
  });
})();