// StatVeridia - Open Data Explorer View Module
// Standard: UN SNA 2008 & IMF SDDS Plus Compliant

import {
  GDP_BY_SECTOR,
  MACRO_KPI,
  NATIONAL_META,
  REGIONAL_PROVINCES,
  TRADE_PARTNERS,
} from '../data.js';

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
        <td class="text-emerald font-mono font-bold">${sec.growth}</td>
        <td class="text-muted">National Accounts Division</td>
      </tr>
    `;
  });

  REGIONAL_PROVINCES.forEach((prov) => {
    html += `
      <tr data-cat="Regional">
        <td><span class="badge badge-amber">Regional Territory</span></td>
        <td><strong>${prov.name}</strong> (${prov.code})</td>
        <td class="font-mono font-bold text-right">${prov.gdpCapita}</td>
        <td class="text-muted">GDP per capita (Pop: ${prov.population})</td>
        <td class="text-emerald font-mono">${prov.cleanEnergyShare} clean energy</td>
        <td class="text-muted">Regional Statistical Office</td>
      </tr>
    `;
  });

  TRADE_PARTNERS.forEach((tp) => {
    html += `
      <tr data-cat="Trade">
        <td><span class="badge badge-cyan">Trade Partner</span></td>
        <td><strong>${tp.country}</strong></td>
        <td class="font-mono font-bold text-right">$${tp.volumeBillion}B</td>
        <td class="text-muted">Total merchandise exchange</td>
        <td class="${tp.surplusBillion >= 0 ? 'text-emerald' : 'text-red'} font-mono">Surplus: +$${tp.surplusBillion}B</td>
        <td class="text-muted">Customs Tariff Board</td>
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

  // Search filter
  const searchInput = document.getElementById('table-search');
  const tableRows = document.querySelectorAll('#master-table-body tr');
  let currentFilterCat = 'all';

  function applyFilters() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    tableRows.forEach((row) => {
      const cat = row.getAttribute('data-cat');
      const text = row.innerText.toLowerCase();
      const matchCat = currentFilterCat === 'all' || cat === currentFilterCat;
      const matchQuery = !q || text.includes(q);
      row.style.display = matchCat && matchQuery ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);

  const chips = document.querySelectorAll('.chip');
  chips.forEach((c) => {
    c.addEventListener('click', () => {
      chips.forEach((chip) => chip.classList.remove('active'));
      c.classList.add('active');
      currentFilterCat = c.getAttribute('data-cat') || 'all';
      applyFilters();
    });
  });

  // Client-side CSV Export
  document.getElementById('btn-dl-csv')?.addEventListener('click', () => {
    const rows = [
      ['Category', 'Indicator/Territory', 'Value 2024', 'Unit', 'Trend', 'Source'],
    ];
    tableRows.forEach((r) => {
      if (r.style.display !== 'none') {
        const cols = Array.from(r.querySelectorAll('td')).map((c) => `"${c.innerText.trim().replace(/"/g, '""')}"`);
        rows.push(cols);
      }
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'statveridia_official_extract_2024.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  // Client-side JSON Export
  document.getElementById('btn-dl-json')?.addEventListener('click', () => {
    const records = [];
    tableRows.forEach((r) => {
      if (r.style.display !== 'none') {
        const tds = r.querySelectorAll('td');
        records.push({
          category: tds[0]?.innerText.trim(),
          indicator: tds[1]?.innerText.trim(),
          value: tds[2]?.innerText.trim(),
          unit: tds[3]?.innerText.trim(),
          trend: tds[4]?.innerText.trim(),
          source: tds[5]?.innerText.trim(),
        });
      }
    });
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', 'statveridia_official_extract_2024.json');
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  document.getElementById('btn-open-gazette')?.addEventListener('click', () => {
    window.print();
  });
}
