// StatVeridia - Application View Templates & Content Renderers
// Standard: UN SNA 2008 & IMF SDDS Plus Compliant

import {
  FORECAST_SCENARIOS,
  GDP_BY_SECTOR,
  HISTORICAL_SERIES,
  MACRO_KPI,
  NATIONAL_META,
  POPULATION_PYRAMID,
  REGIONAL_PROVINCES,
  STATISTICAL_BULLETINS,
  TRADE_PARTNERS,
} from './data.js';

import {
  renderComparisonBarChart,
  renderDonutChart,
  renderHorizontalBarChart,
  renderLineChart,
  renderPopulationPyramid,
  renderProjectionChart,
  renderProvincialMapSVG,
  renderSparklineSVG,
} from './charts.js';

let activeScenarioKey = 'baseline';
let selectedProvinceA = REGIONAL_PROVINCES[0]; // Aethelgard
let selectedProvinceB = REGIONAL_PROVINCES[1]; // Western Coast
let activeMapMetric = 'gdpCapitaRaw';

export function renderOverview(container) {
  let html = `
    <div class="view-container">
      <!-- Executive Welcome & Summary Banner with Live Clock -->
      <section class="hero-banner">
        <div class="hero-text">
          <div class="hero-pill-row">
            <span class="hero-pill">OFFICIAL 2024 STATISTICAL BULLETIN</span>
            <span class="live-pulse-badge"><span class="pulse-dot"></span> LIVE CENSUS FEED</span>
          </div>
          <h2 class="hero-title">${NATIONAL_META.country} Economic & Social State</h2>
          <p class="hero-desc">
            Official statistics published by the ${NATIONAL_META.agency}. Real GDP reached $1.42T (+2.8% YoY), anchored by precision robotics and green energy generation. Inflation cooled to 2.4%, with unemployment at full-employment benchmark of 3.9%.
          </p>
          <div class="live-clock-card">
            <span class="live-clock-label">Simulated Live National Population:</span>
            <strong class="live-clock-val font-mono" id="live-pop-clock">58,428,524</strong>
            <span class="live-clock-sub">&bull; +1 citizen net growth every ~92s</span>
          </div>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" id="btn-goto-data">Explore Open Data (CSV/JSON)</button>
          <button class="btn btn-outline" id="btn-open-bulletin">Official Gazette Release (PDF)</button>
        </div>
      </section>

      <!-- Key Macro KPI Strip -->
      <section class="kpi-section">
        <div class="section-title-row">
          <div>
            <h3>Core National Indicators (2024 Series)</h3>
            <span class="section-sub">Verified against UN Fundamental Principles of Official Statistics</span>
          </div>
          <span class="source-tag">Series Q3 2024 Verified</span>
        </div>
        <div class="kpi-grid">
  `;

  MACRO_KPI.forEach((kpi) => {
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

      <!-- Interactive 10-Year Forward Projections & Scenario Simulator -->
      <section class="scenario-section card">
        <div class="scenario-header">
          <div>
            <h3>10-Year Macroeconomic Forecasting & Transition Simulator (2025-2035)</h3>
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
          <div class="scenario-kpi-bar" id="scenario-kpi-bar">
            <!-- Dynamic KPI Bar -->
          </div>
          <div id="chart-projections-container"></div>
        </div>
      </section>

      <!-- Historical Trajectory & Sector Share 2-Col Grid -->
      <section class="charts-grid-2col">
        <div class="chart-card" id="chart-gdp-trend"></div>
        <div class="chart-card" id="chart-sector-share"></div>
      </section>

      <!-- Official Bulletins & Gazettes -->
      <section class="bulletins-section card">
        <div class="section-title-row">
          <div>
            <h3>Recent Official Statistical Releases & Bulletins</h3>
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

  // Mount Interactive SVG Charts & Simulator
  setTimeout(() => {
    renderScenarioSimulator();

    const gdpContainer = document.getElementById('chart-gdp-trend');
    if (gdpContainer) {
      renderLineChart(gdpContainer, {
        title: '10-Year National GDP & Trade Balance Trajectory (2015-2024)',
        subtitle: 'Nominal GDP ($B) and Merchandise Trade Balance ($B)',
        labels: HISTORICAL_SERIES.years,
        series: [
          { name: 'Nominal GDP ($B)', data: HISTORICAL_SERIES.gdpNominal, color: '#2563eb' },
          { name: 'Trade Balance ($B)', data: HISTORICAL_SERIES.tradeBalance, color: '#10b981' },
        ],
        yUnit: 'B',
        height: 290,
      });
    }

    const sectorContainer = document.getElementById('chart-sector-share');
    if (sectorContainer) {
      renderDonutChart(sectorContainer, {
        title: 'Gross Domestic Product Output by Industry Sector (2024)',
        data: GDP_BY_SECTOR,
        height: 290,
      });
    }

    // Navigation and Action Handlers
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
  }, 10);
}

function renderScenarioSimulator() {
  const kpiBar = document.getElementById('scenario-kpi-bar');
  const chartContainer = document.getElementById('chart-projections-container');
  const sc = FORECAST_SCENARIOS[activeScenarioKey];

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
      projectionYears: FORECAST_SCENARIOS.years,
      scenario: sc,
      allScenarios: FORECAST_SCENARIOS,
      height: 300,
    });
  }
}

let popInterval = null;
function initPopulationClock() {
  if (popInterval) clearInterval(popInterval);
  let count = NATIONAL_META.populationClockBase;
  const clockEl = document.getElementById('live-pop-clock');

  popInterval = setInterval(() => {
    if (!document.getElementById('live-pop-clock')) {
      clearInterval(popInterval);
      return;
    }
    count += 1;
    if (clockEl) {
      clockEl.innerText = count.toLocaleString();
    }
  }, 2200);
}

export function renderEconomy(container) {
  let html = `
    <div class="view-container">
      <div class="page-header">
        <div class="header-breadcrumbs"><a href="#/">Home</a> / <span>Economy &amp; Trade</span></div>
        <h2 class="page-title">National Economic Accounts, Trade &amp; Monetary Policy</h2>
        <p class="page-desc">System of National Accounts (SNA 2008), balance of payments, bilateral merchandise trade, inflation indices, and sovereign fiscal ratios.</p>
      </div>

      <div class="charts-grid-2col">
        <div class="chart-card" id="chart-trade-balance"></div>
        <div class="chart-card" id="chart-inflation-interest"></div>
      </div>

      <!-- Bilateral Trade Partners & Fiscal Overview -->
      <section class="charts-grid-2col">
        <div class="chart-card" id="chart-trade-partners"></div>
        <div class="table-card">
          <div class="table-header">
            <h3>Sovereign Fiscal Balance &amp; Treasury Yields (2024)</h3>
            <span class="source-tag">Ministry of Finance &bull; Treasury</span>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fiscal Indicator</th>
                  <th class="text-right">Amount (2024)</th>
                  <th class="text-right">% of GDP</th>
                  <th>Statutory Benchmark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>General Government Revenue</strong></td>
                  <td class="text-right font-mono">$542.8B</td>
                  <td class="text-right font-mono">38.2%</td>
                  <td class="text-muted">Target: &gt;37.5%</td>
                </tr>
                <tr>
                  <td><strong>General Government Expenditure</strong></td>
                  <td class="text-right font-mono">$565.4B</td>
                  <td class="text-right font-mono">39.8%</td>
                  <td class="text-muted">Appropriated Budget</td>
                </tr>
                <tr>
                  <td><strong>Primary Fiscal Deficit</strong></td>
                  <td class="text-right font-mono text-emerald">-$22.6B</td>
                  <td class="text-right font-mono text-emerald">-1.6%</td>
                  <td class="text-emerald">Compliant (&lt;3.0%)</td>
                </tr>
                <tr>
                  <td><strong>10-Year Sovereign Bond Yield</strong></td>
                  <td class="text-right font-mono text-cyan">3.15%</td>
                  <td class="text-right font-mono">-0.45% YoY</td>
                  <td class="text-muted">AAA Sovereign Rating</td>
                </tr>
                <tr>
                  <td><strong>Foreign Exchange Reserves</strong></td>
                  <td class="text-right font-mono">$188.4B</td>
                  <td class="text-right font-mono">13.3%</td>
                  <td class="text-muted">4.9 months import cover</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Sector Table -->
      <div class="table-card">
        <div class="table-header">
          <h3>Industrial Output &amp; Value-Added by Sector (2024)</h3>
          <span class="source-tag">Source: National Accounts Division, Table E-104</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Economic Sector</th>
                <th class="text-right">Share of GDP (%)</th>
                <th class="text-right">Output (USD Billion)</th>
                <th class="text-right">Real YoY Growth</th>
                <th>Primary Growth Drivers</th>
              </tr>
            </thead>
            <tbody>
  `;

  GDP_BY_SECTOR.forEach((s) => {
    html += `
      <tr>
        <td><strong>${s.sector}</strong></td>
        <td class="text-right font-mono">${s.share}%</td>
        <td class="text-right font-mono">$${s.gdpBillion.toFixed(1)}B</td>
        <td class="text-right font-mono text-emerald">${s.growth}</td>
        <td class="text-muted">EUV lithography, robotics exports, sovereign bond liquidity</td>
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

  setTimeout(() => {
    const tradeContainer = document.getElementById('chart-trade-balance');
    if (tradeContainer) {
      renderLineChart(tradeContainer, {
        title: 'Merchandise Trade: Exports vs Imports (2015-2024)',
        subtitle: 'Annual trade volume in billions USD',
        labels: HISTORICAL_SERIES.years,
        series: [
          { name: 'Exports ($B)', data: HISTORICAL_SERIES.exportsBillion, color: '#10b981' },
          { name: 'Imports ($B)', data: HISTORICAL_SERIES.importsBillion, color: '#f59e0b' },
        ],
        yUnit: 'B',
        height: 280,
      });
    }

    const inflContainer = document.getElementById('chart-inflation-interest');
    if (inflContainer) {
      renderLineChart(inflContainer, {
        title: 'Monetary Policy: CPI Inflation vs Central Bank Policy Rate',
        subtitle: 'Annual rate percentages',
        labels: HISTORICAL_SERIES.years,
        series: [
          { name: 'CPI Inflation (%)', data: HISTORICAL_SERIES.inflationCPI, color: '#ef4444' },
          { name: 'Central Bank Rate (%)', data: HISTORICAL_SERIES.interestRate, color: '#6366f1' },
        ],
        yUnit: '%',
        height: 280,
      });
    }

    const partnersContainer = document.getElementById('chart-trade-partners');
    if (partnersContainer) {
      renderHorizontalBarChart(partnersContainer, {
        title: 'Top Bilateral Trading Partners (2024 Total Volume)',
        data: TRADE_PARTNERS.map((tp) => ({
          label: tp.partner,
          val: tp.totalBillion,
          formatted: `$${tp.totalBillion}B (${tp.balance})`,
          color: tp.balance.startsWith('+') ? '#10b981' : '#38bdf8',
        })),
        height: 260,
      });
    }
  }, 10);
}

export function renderDemographics(container) {
  let html = `
    <div class="view-container">
      <div class="page-header">
        <div class="header-breadcrumbs"><a href="#/">Home</a> / <span>Demographics</span></div>
        <h2 class="page-title">National Population Structure &amp; Census Atlas</h2>
        <p class="page-desc">Official 2024 Census findings: age pyramids, demographic dependency ratios, urbanization, life expectancy, and labor force participation.</p>
      </div>

      <div class="kpi-grid">
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
          <span class="source-tag">National Census Office, Volume 1</span>
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

  setTimeout(() => {
    const pyrContainer = document.getElementById('chart-pyramid');
    if (pyrContainer) {
      renderPopulationPyramid(pyrContainer, POPULATION_PYRAMID);
    }
  }, 10);
}

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
            <strong class="p-val font-mono text-emerald">${p.cleanEnergy}</strong>
          </div>
          <div class="p-metric-item">
            <span class="p-lbl">Human Dev (HDI)</span>
            <strong class="p-val font-mono">${p.hdi}</strong>
          </div>
          <div class="p-metric-item">
            <span class="p-lbl">Fiber Coverage</span>
            <strong class="p-val font-mono text-cyan">${p.fiberCoverage}</strong>
          </div>
        </div>
        <div class="p-sectors">
          <span class="p-sec-label">Economic Pillars:</span>
          <p class="p-sec-text">${p.primarySectors}</p>
        </div>
        <div class="p-notes">${p.highlights}</div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;

  setTimeout(() => {
    renderMapAndComp();

    // Metric Toggle Handlers
    document.querySelectorAll('.btn-metric').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-metric').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeMapMetric = btn.getAttribute('data-metric');
        renderMapAndComp();
      });
    });

    // Dropdown Handlers
    const selA = document.getElementById('select-prov-a');
    const selB = document.getElementById('select-prov-b');

    if (selA) {
      selA.addEventListener('change', (e) => {
        selectedProvinceA = REGIONAL_PROVINCES.find((p) => p.id === e.target.value) || REGIONAL_PROVINCES[0];
        renderMapAndComp();
      });
    }

    if (selB) {
      selB.addEventListener('change', (e) => {
        selectedProvinceB = REGIONAL_PROVINCES.find((p) => p.id === e.target.value) || REGIONAL_PROVINCES[1];
        renderMapAndComp();
      });
    }
  }, 10);
}

function renderMapAndComp() {
  const mapContainer = document.getElementById('provincial-map-container');
  if (mapContainer) {
    renderProvincialMapSVG(mapContainer, {
      provinces: REGIONAL_PROVINCES,
      activeMetric: activeMapMetric,
      selectedId: selectedProvinceA.id,
      onSelect: (id) => {
        selectedProvinceA = REGIONAL_PROVINCES.find((p) => p.id === id) || REGIONAL_PROVINCES[0];
        const selA = document.getElementById('select-prov-a');
        if (selA) selA.value = selectedProvinceA.id;
        renderMapAndComp();
        const card = document.getElementById(`card-${id}`);
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      },
    });
  }

  const compContainer = document.getElementById('comp-bars-container');
  if (compContainer) {
    renderComparisonBarChart(compContainer, selectedProvinceA, selectedProvinceB);
  }
}

export function renderDataExplorer(container) {
  let html = `
    <div class="view-container">
      <div class="page-header">
        <div class="header-breadcrumbs"><a href="#/">Home</a> / <span>Open Data Center</span></div>
        <h2 class="page-title">National Open Data Explorer &amp; Export Center</h2>
        <p class="page-desc">Query, filter, and export verified national statistical series. Direct client-side CSV, JSON, and official printable summary available.</p>
      </div>

      <div class="explorer-toolbar">
        <div class="search-input-wrap">
          <input type="text" id="table-search" placeholder="Filter by indicator, keyword, source, or province..." class="form-control" />
        </div>
        <div class="category-filter-chips">
          <button class="chip active" data-cat="all">All Records (24)</button>
          <button class="chip" data-cat="Macroeconomic">Macroeconomic</button>
          <button class="chip" data-cat="Industry">Industry Sectors</button>
          <button class="chip" data-cat="Regional">Regional Atlas</button>
          <button class="chip" data-cat="Trade">Trade Partners</button>
        </div>
        <div class="toolbar-buttons">
          <button class="btn btn-primary" id="btn-dl-csv">Export CSV</button>
          <button class="btn btn-outline" id="btn-dl-json">Export JSON</button>
          <button class="btn btn-secondary" id="btn-open-gazette">Print Gazette</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table" id="master-data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Indicator / Territory</th>
                <th class="text-right">Latest Value (2024)</th>
                <th>Unit / Scale</th>
                <th>YoY Trend</th>
                <th>Official Source</th>
              </tr>
            </thead>
            <tbody id="master-table-body">
  `;

  MACRO_KPI.forEach((kpi) => {
    html += `
      <tr data-cat="Macroeconomic">
        <td><span class="badge badge-blue">Macroeconomic</span></td>
        <td><strong>${kpi.title}</strong></td>
        <td class="font-mono font-bold text-right">${kpi.value}</td>
        <td class="text-muted">${kpi.unit}</td>
        <td class="${kpi.isPositive ? 'text-emerald' : 'text-red'} font-mono">${kpi.delta}</td>
        <td class="text-muted">${kpi.source}</td>
      </tr>
    `;
  });

  GDP_BY_SECTOR.forEach((sec) => {
    html += `
      <tr data-cat="Industry">
        <td><span class="badge badge-purple">Industry Sector</span></td>
        <td><strong>${sec.sector}</strong></td>
        <td class="font-mono font-bold text-right">$${sec.gdpBillion}B</td>
        <td class="text-muted">${sec.share}% of GDP</td>
        <td class="text-emerald font-mono">${sec.growth}</td>
        <td class="text-muted">National Accounts Division</td>
      </tr>
    `;
  });

  REGIONAL_PROVINCES.forEach((prov) => {
    html += `
      <tr data-cat="Regional">
        <td><span class="badge badge-amber">Regional Atlas</span></td>
        <td><strong>${prov.name}</strong></td>
        <td class="font-mono font-bold text-right">${prov.population}</td>
        <td class="text-muted">GDP $${prov.gdpBillion}B (${prov.gdpCapita}/cap)</td>
        <td class="text-emerald font-mono">${prov.unemployment} unemp</td>
        <td class="text-muted">Regional Census Office</td>
      </tr>
    `;
  });

  TRADE_PARTNERS.forEach((tp) => {
    html += `
      <tr data-cat="Trade">
        <td><span class="badge badge-cyan">Bilateral Trade</span></td>
        <td><strong>${tp.partner}</strong></td>
        <td class="font-mono font-bold text-right">$${tp.totalBillion}B</td>
        <td class="text-muted">Balance: ${tp.balance}</td>
        <td class="text-emerald font-mono">${tp.exportShare}% Exp / ${tp.importShare}% Imp</td>
        <td class="text-muted">Customs Bureau</td>
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

  setTimeout(() => {
    const searchInput = document.getElementById('table-search');
    const tbody = document.getElementById('master-table-body');
    const chips = document.querySelectorAll('.category-filter-chips .chip');

    let activeCat = 'all';

    const filterTable = () => {
      const query = (searchInput?.value || '').toLowerCase().trim();
      const rows = tbody.querySelectorAll('tr');
      rows.forEach((row) => {
        const rowCat = row.getAttribute('data-cat');
        const matchesCat = activeCat === 'all' || rowCat === activeCat;
        const matchesText = row.innerText.toLowerCase().includes(query);
        row.style.display = matchesCat && matchesText ? '' : 'none';
      });
    };

    if (searchInput) searchInput.addEventListener('input', filterTable);

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        activeCat = chip.getAttribute('data-cat');
        filterTable();
      });
    });

    const btnCsv = document.getElementById('btn-dl-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => {
        let csv = 'Category,Indicator,Value,Unit,Trend,Source\n';
        MACRO_KPI.forEach((k) => (csv += `Macroeconomic,"${k.title}","${k.value}","${k.unit}","${k.delta}","${k.source}"\n`));
        GDP_BY_SECTOR.forEach((s) => (csv += `Industry,"${s.sector}","$${s.gdpBillion}B","${s.share}%","${s.growth}","National Accounts"\n`));
        REGIONAL_PROVINCES.forEach((p) => (csv += `Regional,"${p.name}","${p.population}","GDP $${p.gdpBillion}B","${p.unemployment}","Regional Census"\n`));
        TRADE_PARTNERS.forEach((t) => (csv += `Trade,"${t.partner}","$${t.totalBillion}B","${t.balance}","${t.exportShare}%","Customs"\n`));

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `StatVeridia_Master_Dataset_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
      });
    }

    const btnJson = document.getElementById('btn-dl-json');
    if (btnJson) {
      btnJson.addEventListener('click', () => {
        const exportData = {
          meta: NATIONAL_META,
          macro_indicators: MACRO_KPI,
          historical_time_series: HISTORICAL_SERIES,
          forward_scenarios_2035: FORECAST_SCENARIOS,
          gdp_sectors: GDP_BY_SECTOR,
          population_pyramid: POPULATION_PYRAMID,
          regional_provinces: REGIONAL_PROVINCES,
          trade_partners: TRADE_PARTNERS,
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `StatVeridia_Master_Dataset.json`;
        a.click();
      });
    }

    const btnGazette = document.getElementById('btn-open-gazette');
    if (btnGazette) btnGazette.addEventListener('click', showBulletinModal);
  }, 10);
}

// Sovereign Gazette Modal Overlay
export function showBulletinModal() {
  const existing = document.getElementById('bulletin-modal-overlay');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'bulletin-modal-overlay';
  modal.className = 'modal-backdrop';

  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-gov-seal">
          <div class="seal-emblem">&#x25C7;</div>
          <div>
            <div class="seal-gov">REPUBLIC OF VERIDIA</div>
            <div class="seal-agency">CENTRAL STATISTICAL INSTITUTE &bull; STATVERIDIA</div>
          </div>
        </div>
        <button class="modal-close" id="btn-modal-close">&times;</button>
      </div>

      <div class="modal-body">
        <div class="gazette-top-box">
          <div class="gazette-id">OFFICIAL STATISTICAL COMMUNIQUE &bull; ${NATIONAL_META.bulletinId}</div>
          <h2 class="gazette-title">Quarterly National Accounts &amp; Demographic Synthesis (Q3 2024)</h2>
          <div class="gazette-meta">Published: ${NATIONAL_META.releaseDate} &bull; Classification: PUBLIC RECORD &bull; Standard: UN SNA 2008 / IMF SDDS Plus</div>
        </div>

        <div class="gazette-summary-text">
          Pursuant to Section 14 of the National Statistical Act, the Central Statistical Institute submits this official synthesis of macroeconomic and census findings for the Republic of Veridia. Aggregate domestic output expanded at an annualized rate of <strong>+2.8%</strong>, bringing nominal Gross Domestic Product to <strong>$1,420.5 Billion</strong>.
        </div>

        <div class="gazette-stats-table">
          <table>
            <thead>
              <tr>
                <th>Statutory Metric</th>
                <th class="text-right">Official 2024 Value</th>
                <th class="text-right">YoY Variance</th>
                <th>Sovereign Standing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Verified Citizen Population</td>
                <td class="text-right font-mono font-bold">58,428,500</td>
                <td class="text-right font-mono text-emerald">+0.58%</td>
                <td>Census Volume 1 Confirmed</td>
              </tr>
              <tr>
                <td>Nominal Gross Domestic Product (GDP)</td>
                <td class="text-right font-mono font-bold">$1,420.5 Billion</td>
                <td class="text-right font-mono text-emerald">+2.8% YoY</td>
                <td>Rank 8 Global HDI Equivalent</td>
              </tr>
              <tr>
                <td>Headline CPI Inflation Rate</td>
                <td class="text-right font-mono font-bold">2.4%</td>
                <td class="text-right font-mono text-emerald">-1.8% vs '23</td>
                <td>Within Policy Target Band</td>
              </tr>
              <tr>
                <td>National Labor Unemployment</td>
                <td class="text-right font-mono font-bold">3.9%</td>
                <td class="text-right font-mono text-emerald">-0.3% YoY</td>
                <td>Full Employment Benchmark</td>
              </tr>
              <tr>
                <td>Grid Renewable Electricity Share</td>
                <td class="text-right font-mono font-bold">42.8%</td>
                <td class="text-right font-mono text-emerald">+4.2% YoY</td>
                <td>All-Time Record Dispatch</td>
              </tr>
              <tr>
                <td>General Government Public Debt</td>
                <td class="text-right font-mono font-bold">48.2% of GDP</td>
                <td class="text-right font-mono text-emerald">-1.4% YoY</td>
                <td>Statutory Ceiling Observed</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gazette-footer-signatures">
          <div class="sig-block">
            <div class="sig-line">Dr. H. Vance, Ph.D.</div>
            <div class="sig-role">Chief Statistician of the Republic</div>
          </div>
          <div class="sig-block">
            <div class="sig-line">E. Lindqvist, M.Sc.</div>
            <div class="sig-role">Director of National Economic Accounts</div>
          </div>
          <div class="sig-block">
            <div class="sig-hash font-mono">DIGITAL VERIFICATION: 8F7E-2A4C-9B1D-6F30</div>
            <div class="sig-role">Cryptographically Anchored Seal</div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-primary" onclick="window.print()">Print Official Document</button>
        <button class="btn btn-outline" id="btn-modal-dismiss">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('btn-modal-close')?.addEventListener('click', () => modal.remove());
  document.getElementById('btn-modal-dismiss')?.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}
