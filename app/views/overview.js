// StatVeridia - Executive Overview View Module
// Standard: UN SNA 2008 & IMF SDDS Plus Compliant

import {
  FORECAST_SCENARIOS,
  GDP_BY_SECTOR,
  HISTORICAL_SERIES,
  MACRO_KPI,
  NATIONAL_META,
  STATISTICAL_BULLETINS,
} from '../data.js';

import {
  renderDonutChart,
  renderLineChart,
  renderProjectionChart,
  renderSparklineSVG,
} from '../charts.js';

let activeScenarioKey = 'baseline';
let clockInterval = null;

export function renderOverview(container) {
  // Clear any existing timer
  if (clockInterval) clearInterval(clockInterval);

  let html = `
    <div class="view-container">
      <!-- Executive Masthead Strip with Live Population Clock -->
      <section class="hero-strip">
        <div class="hero-strip-left">
          <div class="hero-pill-row">
            <span class="hero-pill">OFFICIAL 2024 STATISTICAL BULLETIN</span>
            <span class="live-pulse-badge"><span class="pulse-dot"></span> LIVE CENSUS FEED</span>
            <span class="cert-pill">UN SNA 2008 &bull; IMF SDDS Plus</span>
          </div>
          <h2 class="hero-title">${NATIONAL_META.country} &bull; Sovereign Economic Observatory</h2>
          <p class="hero-desc">
            Official statistical release by the ${NATIONAL_META.agency}. Real GDP expands at 2.8% YoY ($1.42T), headline inflation stabilizes at 2.4%, and unemployment remains at 3.9% full-employment benchmark.
          </p>
        </div>
        <div class="hero-strip-right">
          <div class="live-clock-card">
            <span class="live-clock-label">Simulated Live National Population</span>
            <strong class="live-clock-val font-mono" id="live-pop-clock">58,428,540</strong>
            <span class="live-clock-sub">&bull; +1 citizen net growth every ~92s</span>
          </div>
          <div class="hero-actions-inline">
            <button class="btn btn-primary btn-sm" id="btn-goto-data">Explore Open Data (CSV/JSON)</button>
            <button class="btn btn-outline btn-sm" id="btn-open-bulletin">Official Gazette (PDF)</button>
          </div>
        </div>
      </section>

      <!-- 4 Core High-Impact National Indicators (Above the fold) -->
      <section class="kpi-compact-strip">
        <div class="kpi-grid-4">
  `;

  // Render top 4 core KPIs with large bold typography and sparklines
  const topKpis = MACRO_KPI.slice(0, 4);
  topKpis.forEach((kpi) => {
    html += `
      <div class="kpi-card" tabindex="0">
        <div class="kpi-top">
          <span class="kpi-title">${kpi.title}</span>
          <span class="kpi-year">${kpi.year}</span>
        </div>
        <div class="kpi-val-row">
          <strong class="kpi-val">${kpi.value}</strong>
          <span class="kpi-delta ${kpi.isPositive ? 'pos' : 'neg'}">${kpi.delta}</span>
        </div>
        <div class="kpi-spark">
          ${renderSparklineSVG(kpi.sparkline, kpi.isPositive ? '#10b981' : '#2563eb')}
        </div>
        <div class="kpi-footer">
          <span class="kpi-source">${kpi.source}</span>
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </section>

      <!-- TWO PROMINENT CHARTS SIDE-BY-SIDE (ABOVE THE FOLD, FULLY VISIBLE IN COVER) -->
      <section class="charts-grid-2col top-charts-row">
        <div class="chart-card" id="chart-gdp-trend"></div>
        <div class="chart-card" id="chart-sector-share"></div>
      </section>

      <!-- Interactive 10-Year Forward Projections & Scenario Simulator -->
      <section class="scenario-section card">
        <div class="scenario-header">
          <div>
            <h3>10-Year Macroeconomic Forecasting &amp; Transition Simulator (2025&ndash;2035)</h3>
            <span class="section-sub">Dynamic macroeconomic projections under alternative policy and global trade pathways</span>
          </div>
          <div class="scenario-btn-group" id="scenario-selector">
            <button class="btn-scenario ${activeScenarioKey === 'baseline' ? 'active' : ''}" data-key="baseline">
              Consensus Baseline (+2.7%)
            </button>
            <button class="btn-scenario ${activeScenarioKey === 'green_tech' ? 'active' : ''}" data-key="green_tech">
              Green Acceleration (+3.7%)
            </button>
            <button class="btn-scenario ${activeScenarioKey === 'headwinds' ? 'active' : ''}" data-key="headwinds">
              Global Headwinds (+1.3%)
            </button>
          </div>
        </div>

        <div class="scenario-body">
          <div class="scenario-kpi-bar" id="scenario-kpi-bar"></div>
          <div id="chart-projections-container"></div>
        </div>
      </section>

      <!-- Official Statistical Releases & Gazettes -->
      <section class="bulletins-section card">
        <div class="section-title-row">
          <div>
            <h3>Recent Official Statistical Releases &amp; Bulletins</h3>
            <span class="section-sub">Public releases published pursuant to the National Statistics Act</span>
          </div>
        </div>
        <div class="bulletins-grid">
  `;

  STATISTICAL_BULLETINS.forEach((b) => {
    html += `
      <div class="bulletin-card">
        <div class="bulletin-top">
          <span class="badge badge-blue">${b.badge}</span>
          <span class="bulletin-date font-mono">${b.date}</span>
        </div>
        <h4 class="bulletin-title">${b.title}</h4>
        <p class="bulletin-summary">${b.summary}</p>
        <span class="bulletin-cat text-muted">Category: ${b.category} &bull; ID: ${b.id}</span>
      </div>
    `;
  });

  html += `
        </div>
      </section>
    </div>
  `;

  container.innerHTML = html;

  // Mount Interactive SVG Charts
  const gdpContainer = document.getElementById('chart-gdp-trend');
  if (gdpContainer) {
    renderLineChart(gdpContainer, {
      title: '10-Year National GDP & Trade Balance Trajectory (2015&ndash;2024)',
      subtitle: 'Nominal GDP ($B) and Merchandise Trade Balance ($B) &bull; SNA 2008 Chained Series',
      labels: HISTORICAL_SERIES.years,
      series: [
        { name: 'Nominal GDP ($B)', data: HISTORICAL_SERIES.gdpNominal, color: '#2563eb' },
        { name: 'Trade Surplus ($B)', data: HISTORICAL_SERIES.tradeBalance, color: '#10b981' },
      ],
      yUnit: 'B',
      height: 270,
    });
  }

  const sectorContainer = document.getElementById('chart-sector-share');
  if (sectorContainer) {
    renderDonutChart(sectorContainer, {
      title: 'Gross Domestic Product Output by Industry Sector (2024)',
      subtitle: 'Total Value Added: $1,420.5 Billion &bull; National Accounts Division',
      data: GDP_BY_SECTOR,
      height: 270,
    });
  }

  renderScenarioSimulator();

  // Navigation handlers
  const btnData = document.getElementById('btn-goto-data');
  if (btnData) btnData.addEventListener('click', () => (window.location.hash = '#/data'));

  const btnBulletin = document.getElementById('btn-open-bulletin');
  if (btnBulletin) btnBulletin.addEventListener('click', showBulletinModal);

  // Scenario Buttons Handler
  const scenarioBtns = document.querySelectorAll('.btn-scenario');
  scenarioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeScenarioKey = btn.getAttribute('data-key');
      renderScenarioSimulator();
    });
  });

  // Simulated Population Clock Ticking
  initPopulationClock();
}

function renderScenarioSimulator() {
  const kpiBar = document.getElementById('scenario-kpi-bar');
  const chartContainer = document.getElementById('chart-projections-container');
  const sc = FORECAST_SCENARIOS[activeScenarioKey];
  if (!sc) return;

  if (kpiBar) {
    const endGdp = sc.gdpNominal[sc.gdpNominal.length - 1];
    const endEnergy = sc.cleanEnergyShare[sc.cleanEnergyShare.length - 1];
    const endDebt = sc.debtToGdp[sc.debtToGdp.length - 1];
    const endPop = sc.populationM[sc.populationM.length - 1];

    kpiBar.innerHTML = `
      <div class="sc-kpi-item">
        <span class="sc-lbl">Projected 2035 GDP</span>
        <strong class="sc-val font-mono" style="color: ${sc.color};">$${endGdp.toFixed(0)}B</strong>
        <span class="sc-sub">${sc.avgGrowth}</span>
      </div>
      <div class="sc-kpi-item">
        <span class="sc-lbl">Clean Energy Share (2035)</span>
        <strong class="sc-val font-mono text-emerald">${endEnergy}%</strong>
        <span class="sc-sub">+${(endEnergy - 42.8).toFixed(1)}% vs today</span>
      </div>
      <div class="sc-kpi-item">
        <span class="sc-lbl">Debt-to-GDP Ceiling</span>
        <strong class="sc-val font-mono">${endDebt}%</strong>
        <span class="sc-sub">Statutory target &lt;50%</span>
      </div>
      <div class="sc-kpi-item">
        <span class="sc-lbl">Population 2035</span>
        <strong class="sc-val font-mono">${endPop}M</strong>
        <span class="sc-sub">+${(endPop - 58.43).toFixed(2)}M citizens</span>
      </div>
    `;
  }

  if (chartContainer) {
    renderProjectionChart(chartContainer, {
      historicalYears: HISTORICAL_SERIES.years,
      historicalGdp: HISTORICAL_SERIES.gdpNominal,
      scenario: sc,
      height: 280,
    });
  }
}

function initPopulationClock() {
  const el = document.getElementById('live-pop-clock');
  if (!el) return;

  let basePop = NATIONAL_META.populationClockBase;
  const startMs = Date.now();

  const update = () => {
    const elapsedSec = (Date.now() - startMs) / 1000;
    const added = Math.floor(elapsedSec * (NATIONAL_META.populationClockRatePerMin / 60));
    const current = basePop + added;
    el.textContent = current.toLocaleString('en-US');
  };

  update();
  clockInterval = setInterval(update, 2000);
}

function showBulletinModal() {
  const existing = document.getElementById('bulletin-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'bulletin-modal';
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <div>
          <h3>Republic of Veridia &bull; Official Gazette Extract</h3>
          <span class="text-muted font-mono">Bulletin: ${NATIONAL_META.bulletinId} &bull; Series 2024</span>
        </div>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <p><strong>Executive Summary &amp; Statistical Certification:</strong></p>
        <p>Pursuant to Section 14 of the National Statistics Act, the Central Statistical Institute (StatVeridia) hereby promulgates the certified National Accounts and Macroeconomic Aggregates for the third quarter of 2024.</p>
        <div class="modal-notice">
          <strong>Methodological Compliance:</strong>
          All estimates are compiled strictly under the United Nations System of National Accounts (SNA 2008) and adhere to the International Monetary Fund Special Data Dissemination Standard Plus (IMF SDDS Plus).
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" id="modal-ok-btn">Acknowledge</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  document.getElementById('modal-close-btn')?.addEventListener('click', close);
  document.getElementById('modal-ok-btn')?.addEventListener('click', close);
}
