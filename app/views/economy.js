// StatVeridia - Economy & Trade View Module
// Standard: UN SNA 2008 & IMF SDDS Plus Compliant

import {
  GDP_BY_SECTOR,
  HISTORICAL_SERIES,
  TRADE_PARTNERS,
} from '../data.js';

import {
  renderHorizontalBarChart,
  renderLineChart,
} from '../charts.js';

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
          <span class="source-tag">National Accounts Division &bull; SNA 2008</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Industry Sector</th>
                <th class="text-right">Gross Output ($B)</th>
                <th class="text-right">Share of GDP (%)</th>
                <th class="text-right">YoY Growth Rate</th>
                <th>Dominant Export Commodity</th>
              </tr>
            </thead>
            <tbody>
  `;

  GDP_BY_SECTOR.forEach((sec) => {
    html += `
      <tr>
        <td><strong>${sec.sector}</strong></td>
        <td class="text-right font-mono">$${sec.gdpBillion.toFixed(1)}B</td>
        <td class="text-right font-mono">${sec.share.toFixed(1)}%</td>
        <td class="text-right font-mono text-emerald font-bold">${sec.growth}</td>
        <td><span class="badge badge-purple">${sec.dominantExport}</span></td>
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

  // Mount charts
  const tradeContainer = document.getElementById('chart-trade-balance');
  if (tradeContainer) {
    renderLineChart(tradeContainer, {
      title: 'Merchandise Trade: Exports vs Imports (2015&ndash;2024)',
      subtitle: 'Annual trade volume in billions USD &bull; Customs & Border Revenue Agency',
      labels: HISTORICAL_SERIES.years,
      series: [
        { name: 'Exports ($B)', data: HISTORICAL_SERIES.exports, color: '#059669' },
        { name: 'Imports ($B)', data: HISTORICAL_SERIES.imports, color: '#dc2626' },
      ],
      yUnit: 'B',
      height: 280,
    });
  }

  const cpiContainer = document.getElementById('chart-inflation-interest');
  if (cpiContainer) {
    renderLineChart(cpiContainer, {
      title: 'Monetary Policy: CPI Inflation vs Central Bank Policy Rate',
      subtitle: 'Annual rate percentages &bull; Central Monetary Authority Policy Track',
      labels: HISTORICAL_SERIES.years,
      series: [
        { name: 'CPI Inflation (%)', data: HISTORICAL_SERIES.inflation, color: '#d97706' },
        { name: 'Policy Rate (%)', data: HISTORICAL_SERIES.policyRate, color: '#2563eb' },
      ],
      yUnit: '%',
      height: 280,
    });
  }

  const partnersContainer = document.getElementById('chart-trade-partners');
  if (partnersContainer) {
    renderHorizontalBarChart(partnersContainer, {
      title: 'Top Bilateral Trading Partners (2024 Total Volume)',
      subtitle: 'Combined bilateral trade volume ($B) and trade balance surplus ($B)',
      data: TRADE_PARTNERS,
      height: 280,
    });
  }
}
