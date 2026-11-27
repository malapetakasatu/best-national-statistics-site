// StatVeridia - Demographics View Module
// Standard: UN SNA 2008 & IMF SDDS Plus Compliant

import {
  POPULATION_PYRAMID,
} from '../data.js';

import {
  renderPopulationPyramid,
} from '../charts.js';

export function renderDemographics(container) {
  let html = `
    <div class="view-container">
      <div class="page-header">
        <div class="header-breadcrumbs"><a href="#/">Home</a> / <span>Demographics</span></div>
        <h2 class="page-title">National Population Structure &amp; Census Atlas</h2>
        <p class="page-desc">Official 2024 Census findings: age pyramids, demographic dependency ratios, urbanization, life expectancy, and labor force participation.</p>
      </div>

      <div class="kpi-grid-4">
        <div class="kpi-card">
          <span class="kpi-title">Total Population</span>
          <strong class="kpi-val">58,428,500</strong>
          <span class="kpi-delta pos">+0.58% annual growth</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-title">Urbanization Rate</span>
          <strong class="kpi-val">78.4%</strong>
          <span class="kpi-delta pos">+0.4% YoY</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-title">Median Population Age</span>
          <strong class="kpi-val">39.2 yrs</strong>
          <span class="kpi-delta text-muted">Stable labor cohort</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-title">Fertility Rate</span>
          <strong class="kpi-val">1.68</strong>
          <span class="kpi-delta text-muted">Births per woman</span>
        </div>
      </div>

      <div class="chart-card" id="chart-pyramid"></div>

      <div class="table-card">
        <div class="table-header">
          <h3>Age Cohort Population Breakdown (2024 Official Census)</h3>
          <span class="source-tag">National Census Office, Volume 1 &bull; Released Nov 2024</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Age Cohort</th>
                <th class="text-right">Male (M)</th>
                <th class="text-right">Female (M)</th>
                <th class="text-right">Total (M)</th>
                <th class="text-right">% of Population</th>
                <th>Labor Status</th>
              </tr>
            </thead>
            <tbody>
  `;

  POPULATION_PYRAMID.forEach((p) => {
    const total = (p.male + p.female).toFixed(2);
    const pct = (((p.male + p.female) / 58.43) * 100).toFixed(1);
    let status = 'Dependent';
    if (parseInt(p.cohort.split('-')[0]) >= 20 && parseInt(p.cohort.split('-')[0]) <= 64) {
      status = 'Active Workforce';
    } else if (parseInt(p.cohort.split('-')[0]) >= 65) {
      status = 'Pension Eligible';
    }

    html += `
      <tr>
        <td><strong>${p.cohort} Years</strong></td>
        <td class="text-right font-mono">${p.male.toFixed(2)}M</td>
        <td class="text-right font-mono">${p.female.toFixed(2)}M</td>
        <td class="text-right font-mono font-bold">${total}M</td>
        <td class="text-right font-mono">${pct}%</td>
        <td><span class="badge ${status === 'Active Workforce' ? 'badge-blue' : 'badge-amber'}">${status}</span></td>
      </tr>
    `;
  });

  html += `
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  const pyrContainer = document.getElementById('chart-pyramid');
  if (pyrContainer) {
    renderPopulationPyramid(pyrContainer, POPULATION_PYRAMID);
  }
}
