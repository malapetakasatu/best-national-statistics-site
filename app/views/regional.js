// StatVeridia - Regional Provinces View Module
// Standard: UN SNA 2008 & IMF SDDS Plus Compliant

import {
  REGIONAL_PROVINCES,
} from '../data.js';

import {
  renderComparisonBarChart,
  renderProvincialMapSVG,
} from '../charts.js';

let selectedProvinceA = REGIONAL_PROVINCES[0]; // Aethelgard
let selectedProvinceB = REGIONAL_PROVINCES[1]; // Western Coast
let activeMapMetric = 'gdpCapitaRaw';

export function renderRegional(container) {
  let html = `
    <div class="view-container">
      <div class="page-header">
        <div class="header-breadcrumbs"><a href="#/">Home</a> / <span>Provinces &amp; Regional Atlas</span></div>
        <h2 class="page-title">Regional Socioeconomic Atlas &amp; Province Benchmarking</h2>
        <p class="page-desc">Interactive geographic territorial grid, regional GDP output, clean energy generation, and side-by-side comparative benchmarking.</p>
      </div>

      <!-- Regional Map & Comparison Split -->
      <section class="charts-grid-2col">
        <!-- Interactive Territory Map -->
        <div class="chart-card">
          <div class="map-controls-row">
            <div>
              <h4>Veridia Territorial Grid &amp; Choropleth</h4>
              <span class="chart-sub">Click a province tile to inspect details</span>
            </div>
            <div class="metric-toggle-group">
              <button class="btn-metric ${activeMapMetric === 'gdpCapitaRaw' ? 'active' : ''}" data-metric="gdpCapitaRaw">GDP/Capita</button>
              <button class="btn-metric ${activeMapMetric === 'popRaw' ? 'active' : ''}" data-metric="popRaw">Population</button>
              <button class="btn-metric ${activeMapMetric === 'cleanEnergyRaw' ? 'active' : ''}" data-metric="cleanEnergyRaw">Clean Energy</button>
              <button class="btn-metric ${activeMapMetric === 'unemploymentRaw' ? 'active' : ''}" data-metric="unemploymentRaw">Unemployment</button>
            </div>
          </div>
          <div id="provincial-map-container"></div>
        </div>

        <!-- Comparative Benchmarking Tool -->
        <div class="chart-card">
          <div class="comp-tool-header">
            <h4>Bilateral Province Benchmarking Matrix</h4>
            <span class="chart-sub">Select two provinces to compare structural indicators</span>
          </div>
          <div class="comp-selectors-row">
            <select class="form-control" id="select-prov-a">
              ${REGIONAL_PROVINCES.map((p) => `<option value="${p.id}" ${p.id === selectedProvinceA.id ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
            <span class="vs-text">vs</span>
            <select class="form-control" id="select-prov-b">
              ${REGIONAL_PROVINCES.map((p) => `<option value="${p.id}" ${p.id === selectedProvinceB.id ? 'selected' : ''}>${p.name}</option>`).join('')}
            </select>
          </div>
          <div id="comp-bars-container"></div>
        </div>
      </section>

      <!-- Full Provincial Cards Grid -->
      <div class="provinces-grid">
  `;

  REGIONAL_PROVINCES.forEach((p) => {
    html += `
      <div class="province-card ${p.id === selectedProvinceA.id ? 'selected-card' : ''}" id="card-${p.id}" tabindex="0">
        <div class="p-card-header">
          <div class="p-id">${p.code}</div>
          <h3 class="p-name">${p.name}</h3>
          <span class="p-cap">Capital: ${p.capital}</span>
        </div>
        <div class="p-metrics">
          <div class="p-metric-item">
            <span class="p-lbl">Population</span>
            <strong class="p-val font-mono">${p.population}</strong>
          </div>
          <div class="p-metric-item">
            <span class="p-lbl">Regional Output</span>
            <strong class="p-val font-mono text-cyan">$${p.gdpBillion.toFixed(1)}B</strong>
          </div>
          <div class="p-metric-item">
            <span class="p-lbl">GDP / Capita</span>
            <strong class="p-val font-mono text-emerald">${p.gdpCapita}</strong>
          </div>
          <div class="p-metric-item">
            <span class="p-lbl">Clean Energy</span>
            <strong class="p-val font-mono text-emerald">${p.cleanEnergyShare}</strong>
          </div>
          <div class="p-metric-item">
            <span class="p-lbl">Unemployment</span>
            <strong class="p-val font-mono">${p.unemployment}</strong>
          </div>
          <div class="p-metric-item">
            <span class="p-lbl">Key Industry</span>
            <strong class="p-val p-ind">${p.specialization}</strong>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Mount Map and Comparator
  renderTerritoryMap();
  renderComparisonTool();

  // Metric Toggle Buttons Handler
  const metricBtns = document.querySelectorAll('.btn-metric');
  metricBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      metricBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeMapMetric = btn.getAttribute('data-metric');
      renderTerritoryMap();
    });
  });

  // Selector handlers
  const selA = document.getElementById('select-prov-a');
  const selB = document.getElementById('select-prov-b');
  if (selA) {
    selA.addEventListener('change', (e) => {
      selectedProvinceA = REGIONAL_PROVINCES.find((p) => p.id === e.target.value) || REGIONAL_PROVINCES[0];
      renderComparisonTool();
    });
  }
  if (selB) {
    selB.addEventListener('change', (e) => {
      selectedProvinceB = REGIONAL_PROVINCES.find((p) => p.id === e.target.value) || REGIONAL_PROVINCES[1];
      renderComparisonTool();
    });
  }
}

function renderTerritoryMap() {
  const mapContainer = document.getElementById('provincial-map-container');
  if (!mapContainer) return;

  renderProvincialMapSVG(mapContainer, {
    provinces: REGIONAL_PROVINCES,
    activeMetric: activeMapMetric,
    onSelect: (prov) => {
      selectedProvinceA = prov;
      const selA = document.getElementById('select-prov-a');
      if (selA) selA.value = prov.id;
      renderComparisonTool();

      document.querySelectorAll('.province-card').forEach((c) => c.classList.remove('selected-card'));
      const targetCard = document.getElementById(`card-${prov.id}`);
      if (targetCard) targetCard.classList.add('selected-card');
    },
  });
}

function renderComparisonTool() {
  const container = document.getElementById('comp-bars-container');
  if (!container) return;

  renderComparisonBarChart(container, {
    provinceA: selectedProvinceA,
    provinceB: selectedProvinceB,
    height: 300,
  });
}
