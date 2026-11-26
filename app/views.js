// StatVeridia - Application View Templates & Content Renderers
import { GDP_BY_SECTOR, HISTORICAL_SERIES, MACRO_KPI, NATIONAL_META, POPULATION_PYRAMID, REGIONAL_PROVINCES } from './data.js';
import { renderDonutChart, renderLineChart, renderPopulationPyramid, renderSparklineSVG } from './charts.js';

export function renderOverview(container) {
  let html = `
    <div class="view-container">
      <!-- Executive Welcome & Summary -->
      <section class="hero-banner">
        <div class="hero-text">
          <div class="hero-pill">OFFICIAL 2024 ECONOMIC BULLETIN &bull; RELEASED Q3</div>
          <h2 class="hero-title">${NATIONAL_META.country} Economic & Social State</h2>
          <p class="hero-desc">
            Official statistics published by the ${NATIONAL_META.agency}. Real GDP grew 2.8% YoY to $1.42T, driven by advanced manufacturing and financial services. Inflation cooled to 2.4%, with labor unemployment steady at 3.9%.
          </p>
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" id="btn-goto-data">Explore Full Dataset</button>
          <button class="btn btn-outline" id="btn-export-overview">Export Summary (CSV)</button>
        </div>
      </section>

      <!-- Key Macro KPI Strip -->
      <section class="kpi-section">
        <div class="section-title-row">
          <h3>Core National Indicators (2024)</h3>
          <span class="source-tag">Verified by National Statistical System</span>
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

      <!-- Macro Charts Grid -->
      <section class="charts-grid-2col">
        <div class="chart-card" id="chart-gdp-trend"></div>
        <div class="chart-card" id="chart-sector-share"></div>
      </section>

      <!-- Key Highlights Matrix -->
      <section class="highlights-grid">
        <div class="highlight-box">
          <div class="hl-icon">&#9650;</div>
          <h4>Industrial Modernization</h4>
          <p>Advanced robotics and semiconductor fabrication expanded by +4.1% in 2024, representing 22.8% of national output.</p>
        </div>
        <div class="highlight-box">
          <div class="hl-icon">&#9733;</div>
          <h4>Clean Energy Transition</h4>
          <p>Renewable power generation crossed 42.8% of total electricity dispatch, led by alpine hydropower and offshore wind.</p>
        </div>
        <div class="highlight-box">
          <div class="hl-icon">&#10003;</div>
          <h4>Fiscal Consolidation</h4>
          <p>Public debt-to-GDP ratio declined for the third consecutive year to 48.2%, anchored by statutory fiscal deficit ceilings.</p>
        </div>
      </section>
    </div>
  `;

  container.innerHTML = html;

  // Mount Interactive SVG Charts
  setTimeout(() => {
    const gdpContainer = document.getElementById('chart-gdp-trend');
    if (gdpContainer) {
      renderLineChart(gdpContainer, {
        title: '10-Year National GDP & Inflation Trajectory (2015-2024)',
        subtitle: 'Nominal GDP ($B) and Headline CPI Inflation Rate (%)',
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
        title: 'Gross Domestic Product by Economic Sector (2024)',
        data: GDP_BY_SECTOR,
        height: 290,
      });
    }

    // Bind Hero Buttons
    const btnData = document.getElementById('btn-goto-data');
    if (btnData) btnData.addEventListener('click', () => (window.location.hash = '#/data'));
  }, 10);
}

export function renderEconomy(container) {
  let html = `
    <div class="view-container">
      <div class="page-header">
        <div class="header-breadcrumbs"><a href="#/">Home</a> / <span>Macroeconomy</span></div>
        <h2 class="page-title">National Economic Accounts & Trade Balance</h2>
        <p class="page-desc">Comprehensive macroeconomic accounts, international trade, inflation indicators, and sovereign fiscal balances.</p>
      </div>

      <div class="charts-grid-2col">
        <div class="chart-card" id="chart-trade-balance"></div>
        <div class="chart-card" id="chart-inflation-interest"></div>
      </div>

      <div class="table-card">
        <div class="table-header">
          <h3>Economic Sector Composition & Annual Growth (2024)</h3>
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
        <td class="text-muted">Digital transformation, export demand, productivity gains</td>
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
  }, 10);
}

export function renderDemographics(container) {
  let html = `
    <div class="view-container">
      <div class="page-header">
        <div class="header-breadcrumbs"><a href="#/">Home</a> / <span>Demographics</span></div>
        <h2 class="page-title">National Population Structure & Census</h2>
        <p class="page-desc">Demographic pyramid, age cohorts, urbanization, life expectancy, and labor force dynamics from the 2024 Census.</p>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-title">Total Population</span>
          <strong class="kpi-val">58,420,000</strong>
          <span class="kpi-delta pos">+0.58% annual growth</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-title">Urbanization Rate</span>
          <strong class="kpi-val">78.4%</strong>
          <span class="kpi-delta pos">+0.4% YoY</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-title">Median Age</span>
          <strong class="kpi-val">39.2 years</strong>
          <span class="kpi-delta text-muted">Stable cohort</span>
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
              </tr>
            </thead>
            <tbody>
  `;

  POPULATION_PYRAMID.forEach((p) => {
    const total = (p.male + p.female).toFixed(2);
    const pct = (((p.male + p.female) / 58.42) * 100).toFixed(1);
    html += `
      <tr>
        <td><strong>${p.cohort} Years</strong></td>
        <td class="text-right font-mono">${p.male.toFixed(2)}M</td>
        <td class="text-right font-mono">${p.female.toFixed(2)}M</td>
        <td class="text-right font-mono font-bold">${total}M</td>
        <td class="text-right font-mono">${pct}%</td>
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
        <div class="header-breadcrumbs"><a href="#/">Home</a> / <span>Regional Atlas</span></div>
        <h2 class="page-title">Provinces & Administrative Territories</h2>
        <p class="page-desc">Regional economic output, population distribution, land area, and local industry clusters across the 8 administrative regions.</p>
      </div>

      <div class="provinces-grid">
  `;

  REGIONAL_PROVINCES.forEach((p) => {
    html += `
      <div class="province-card" tabindex="0">
        <div class="p-card-header">
          <div class="p-id">${p.id}</div>
          <h3 class="p-name">${p.name}</h3>
          <span class="p-cap">Capital: ${p.capital}</span>
        </div>
        <div class="p-metrics">
          <div class="p-metric-item">
            <span class="p-lbl">Population</span>
            <strong class="p-val font-mono">${p.population}</strong>
          </div>
          <div class="p-metric-item">
            <span class="p-lbl">Regional GDP</span>
            <strong class="p-val font-mono text-cyan">$${p.gdpBillion.toFixed(1)}B</strong>
          </div>
          <div class="p-metric-item">
            <span class="p-lbl">GDP / Capita</span>
            <strong class="p-val font-mono text-emerald">${p.gdpCapita}</strong>
          </div>
          <div class="p-metric-item">
            <span class="p-lbl">Unemployment</span>
            <strong class="p-val font-mono">${p.unemployment}</strong>
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
}

export function renderDataExplorer(container) {
  let html = `
    <div class="view-container">
      <div class="page-header">
        <div class="header-breadcrumbs"><a href="#/">Home</a> / <span>Data Explorer</span></div>
        <h2 class="page-title">National Open Data Explorer & Export Center</h2>
        <p class="page-desc">Search, filter, and export verified national statistical datasets. Direct client-side CSV & JSON download available.</p>
      </div>

      <div class="explorer-toolbar">
        <div class="search-input-wrap">
          <input type="text" id="table-search" placeholder="Filter by indicator, province, or keyword..." class="form-control" />
        </div>
        <div class="toolbar-buttons">
          <button class="btn btn-primary" id="btn-dl-csv">Export Table (CSV)</button>
          <button class="btn btn-outline" id="btn-dl-json">Export Full Dataset (JSON)</button>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table" id="master-data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Indicator Name</th>
                <th>Latest Value (2024)</th>
                <th>Unit / Scale</th>
                <th>YoY Trend</th>
                <th>Official Source</th>
              </tr>
            </thead>
            <tbody id="master-table-body">
  `;

  MACRO_KPI.forEach((kpi) => {
    html += `
      <tr>
        <td><span class="badge badge-blue">Macroeconomic</span></td>
        <td><strong>${kpi.title}</strong></td>
        <td class="font-mono font-bold">${kpi.value}</td>
        <td class="text-muted">${kpi.unit}</td>
        <td class="${kpi.isPositive ? 'text-emerald' : 'text-red'} font-mono">${kpi.delta}</td>
        <td class="text-muted">${kpi.source}</td>
      </tr>
    `;
  });

  GDP_BY_SECTOR.forEach((sec) => {
    html += `
      <tr>
        <td><span class="badge badge-purple">Industry Sector</span></td>
        <td><strong>${sec.sector}</strong></td>
        <td class="font-mono font-bold">$${sec.gdpBillion}B</td>
        <td class="text-muted">${sec.share}% of total GDP</td>
        <td class="text-emerald font-mono">${sec.growth}</td>
        <td class="text-muted">National Accounts Division</td>
      </tr>
    `;
  });

  REGIONAL_PROVINCES.forEach((prov) => {
    html += `
      <tr>
        <td><span class="badge badge-amber">Regional Territory</span></td>
        <td><strong>${prov.name}</strong></td>
        <td class="font-mono font-bold">${prov.population}</td>
        <td class="text-muted">GDP $${prov.gdpBillion}B (${prov.gdpCapita}/capita)</td>
        <td class="text-emerald font-mono">${prov.unemployment} unemp</td>
        <td class="text-muted">Regional Statistical Office</td>
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

  // Search Filter Handler
  setTimeout(() => {
    const searchInput = document.getElementById('table-search');
    const tbody = document.getElementById('master-table-body');
    if (searchInput && tbody) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row) => {
          const text = row.innerText.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }

    // CSV Download Trigger
    const btnCsv = document.getElementById('btn-dl-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => {
        let csv = 'Category,Indicator,Value,Unit,Trend,Source\n';
        MACRO_KPI.forEach((k) => (csv += `Macroeconomic,"${k.title}","${k.value}","${k.unit}","${k.delta}","${k.source}"\n`));
        GDP_BY_SECTOR.forEach((s) => (csv += `Industry,"${s.sector}","$${s.gdpBillion}B","${s.share}%","${s.growth}","National Accounts"\n`));
        REGIONAL_PROVINCES.forEach((p) => (csv += `Regional,"${p.name}","${p.population}","GDP $${p.gdpBillion}B","${p.unemployment}","Regional Census"\n`));

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `StatVeridia_National_Dataset_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
      });
    }

    // JSON Download Trigger
    const btnJson = document.getElementById('btn-dl-json');
    if (btnJson) {
      btnJson.addEventListener('click', () => {
        const exportData = {
          meta: NATIONAL_META,
          macro_indicators: MACRO_KPI,
          historical_time_series: HISTORICAL_SERIES,
          gdp_sectors: GDP_BY_SECTOR,
          population_pyramid: POPULATION_PYRAMID,
          regional_provinces: REGIONAL_PROVINCES,
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `StatVeridia_Master_Dataset.json`;
        a.click();
      });
    }
  }, 10);
}
