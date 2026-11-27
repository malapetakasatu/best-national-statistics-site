// StatVeridia - Main Application Router & Dynamic Loader
// Standard: UN SNA 2008 & IMF SDDS Plus Compliant

const routes = {
  '#/': () => import('./views/overview.js').then((m) => m.renderOverview),
  '#/economy': () => import('./views/economy.js').then((m) => m.renderEconomy),
  '#/demographics': () => import('./views/demographics.js').then((m) => m.renderDemographics),
  '#/regional': () => import('./views/regional.js').then((m) => m.renderRegional),
  '#/data': () => import('./views/data.js').then((m) => m.renderDataExplorer),
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

export async function navigate() {
  const currentRoute = getNormalizedHash();
  const root = document.getElementById('app-root');
  if (!root) return;

  const loader = routes[currentRoute] || routes['#/'];
  try {
    const renderFn = await loader();
    renderFn(root);
  } catch (err) {
    console.error('Route navigation error:', err);
  }
  updateActiveNav(currentRoute);

  window.scrollTo({ top: 0, behavior: 'instant' });
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
