// StatVeridia - Main Application Router & Controller
import {
  renderOverview,
  renderEconomy,
  renderDemographics,
  renderRegional,
  renderDataExplorer
} from './views.js';

const routes = {
  '#/': renderOverview,
  '#/economy': renderEconomy,
  '#/demographics': renderDemographics,
  '#/regional': renderRegional,
  '#/data': renderDataExplorer,
};

function getNormalizedHash() {
  const hash = window.location.hash || '#/';
  if (!hash || hash === '#' || hash === '#!') return '#/';
  return hash;
}

function updateActiveNav(currentRoute) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    const route = link.getAttribute('data-route');
    if (route === currentRoute || (currentRoute === '#/' && route === '#/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

export function navigate() {
  const currentRoute = getNormalizedHash();
  const root = document.getElementById('app-root');
  if (!root) return;

  const renderFn = routes[currentRoute] || routes['#/'];
  renderFn(root);
  updateActiveNav(currentRoute);

  window.scrollTo({ top: 0, behavior: 'instant' });

  // Mark page ready for screenshot / test tooling
  window.__shotReady = true;
}

// Global button handler for cross-view navigation
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target && target.id === 'btn-goto-data') {
    window.location.hash = '#/data';
  }
});

window.addEventListener('hashchange', () => {
  window.__shotReady = false;
  navigate();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', navigate);
} else {
  navigate();
}
