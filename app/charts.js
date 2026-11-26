// StatVeridia - Pure Vanilla SVG Charting Engine (Zero External Dependencies)
// Fully responsive, high-DPI crisp vector graphics for national statistics

export function renderSparklineSVG(data, color = '#2563eb', width = 110, height = 28) {
  if (!data || data.length < 2) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polyline = points.join(' ');
  const lastPoint = points[points.length - 1].split(',');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="sparkline-svg" aria-hidden="true">
      <polyline points="${polyline}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="2.8" fill="${color}" />
    </svg>
  `;
}

export function renderLineChart(container, options) {
  const {
    labels = [],
    series = [],
    yUnit = '',
    title = '',
    subtitle = '',
    height = 280,
  } = options;

  container.innerHTML = '';

  const width = container.clientWidth || 640;
  const padLeft = 55;
  const padRight = 25;
  const padTop = 30;
  const padBottom = 35;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  let allVals = [];
  series.forEach((s) => (allVals = allVals.concat(s.data)));
  const rawMin = Math.min(0, Math.min(...allVals));
  const rawMax = Math.max(...allVals);
  const minVal = rawMin < 0 ? Math.floor(rawMin * 1.1) : 0;
  const maxVal = Math.ceil(rawMax * 1.15) || 10;
  const valRange = maxVal - minVal;

  let svg = `
    <div class="chart-wrapper">
      ${title ? `<div class="chart-header"><h4>${title}</h4>${subtitle ? `<span class="chart-sub">${subtitle}</span>` : ''}</div>` : ''}
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="stat-chart-svg">
  `;

  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const val = minVal + (valRange * (yTicks - i)) / yTicks;
    const y = padTop + (plotH * i) / yTicks;

    svg += `
      <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="var(--border-color)" stroke-dasharray="3 3" stroke-width="1" />
      <text x="${padLeft - 8}" y="${y + 4}" font-size="11" fill="var(--text-muted)" text-anchor="end" font-family="var(--font-mono)">
        ${val.toFixed(1)}${yUnit}
      </text>
    `;
  }

  const nLabels = labels.length;
  labels.forEach((label, idx) => {
    const x = padLeft + (idx / (nLabels - 1)) * plotW;
    svg += `
      <line x1="${x}" y1="${height - padBottom}" x2="${x}" y2="${height - padBottom + 4}" stroke="var(--border-color)" stroke-width="1" />
      <text x="${x}" y="${height - padBottom + 18}" font-size="11" fill="var(--text-muted)" text-anchor="middle" font-family="var(--font-sans)">
        ${label}
      </text>
    `;
  });

  series.forEach((s) => {
    const points = s.data.map((val, idx) => {
      const x = padLeft + (idx / (nLabels - 1)) * plotW;
      const y = padTop + plotH - ((val - minVal) / valRange) * plotH;
      return { x, y, val };
    });

    const ptsString = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaString = `${points[0].x},${height - padBottom} ${ptsString} ${points[points.length - 1].x},${height - padBottom}`;

    svg += `
      <polygon points="${areaString}" fill="${s.color}" fill-opacity="0.08" />
      <polyline points="${ptsString}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    `;

    points.forEach((p) => {
      svg += `
        <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#ffffff" stroke="${s.color}" stroke-width="2">
          <title>${s.name}: ${p.val}${yUnit}</title>
        </circle>
      `;
    });
  });

  svg += `
      </svg>
      <div class="chart-legend">
        ${series
          .map(
            (s) => `
          <div class="legend-item">
            <span class="legend-color" style="background-color: ${s.color};"></span>
            <span class="legend-label">${s.name}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `;

  container.innerHTML = svg;
}

// 10-Year Projections Chart with Uncertainty Envelope & Scenario Comparison
export function renderProjectionChart(container, options) {
  const {
    historicalYears = [],
    historicalGdp = [],
    projectionYears = [],
    scenario = {},
    allScenarios = {},
    height = 290,
  } = options;

  container.innerHTML = '';
  const width = container.clientWidth || 640;
  const padLeft = 55;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 35;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  // Combine timeline: 2018 to 2035 (subset of historical + projection)
  const histSubYears = historicalYears.slice(3); // 2018-2024
  const histSubGdp = historicalGdp.slice(3);
  const projYears = projectionYears.slice(1); // 2025-2035
  const fullTimeline = [...histSubYears, ...projYears];
  const nTotal = fullTimeline.length;

  const minVal = 1100;
  const maxVal = 2300;
  const valRange = maxVal - minVal;

  const getX = (idx) => padLeft + (idx / (nTotal - 1)) * plotW;
  const getY = (val) => padTop + plotH - ((val - minVal) / valRange) * plotH;

  const splitIdx = histSubYears.length - 1; // Index of 2024
  const splitX = getX(splitIdx);

  let svg = `
    <div class="chart-wrapper">
      <div class="chart-header">
        <h4>10-Year Macroeconomic Trajectory & Scenario Projections (2018-2035)</h4>
        <span class="chart-sub">Nominal GDP ($B) &bull; Active Model: <strong>${scenario.name} (${scenario.avgGrowth})</strong></span>
      </div>
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="stat-chart-svg">
  `;

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const val = minVal + (valRange * (4 - i)) / 4;
    const y = padTop + (plotH * i) / 4;
    svg += `
      <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="var(--border-color)" stroke-dasharray="3 3" stroke-width="1" />
      <text x="${padLeft - 8}" y="${y + 4}" font-size="11" fill="var(--text-muted)" text-anchor="end" font-family="var(--font-mono)">$${val.toFixed(0)}B</text>
    `;
  }

  // Vertical split line at 2024 (Now)
  svg += `
    <line x1="${splitX}" y1="${padTop}" x2="${splitX}" y2="${height - padBottom}" stroke="#3b82f6" stroke-dasharray="4 4" stroke-width="1.5" />
    <text x="${splitX}" y="${padTop - 8}" font-size="10" font-weight="700" fill="#38bdf8" text-anchor="middle">TODAY (2024)</text>
  `;

  // Timeline labels
  fullTimeline.forEach((yr, idx) => {
    if (idx % 2 === 0 || idx === splitIdx || idx === nTotal - 1) {
      const x = getX(idx);
      svg += `
        <text x="${x}" y="${height - padBottom + 18}" font-size="10" fill="var(--text-muted)" text-anchor="middle" font-family="var(--font-sans)">${yr}</text>
      `;
    }
  });

  // Uncertainty Envelope between High Tech and Headwinds
  if (allScenarios.green_tech && allScenarios.headwinds) {
    const upperPts = allScenarios.green_tech.gdpNominal.map((val, i) => `${getX(splitIdx + i).toFixed(1)},${getY(val).toFixed(1)}`);
    const lowerPts = [...allScenarios.headwinds.gdpNominal].reverse().map((val, i) => {
      const origIdx = allScenarios.headwinds.gdpNominal.length - 1 - i;
      return `${getX(splitIdx + origIdx).toFixed(1)},${getY(val).toFixed(1)}`;
    });
    const envelope = [...upperPts, ...lowerPts].join(' ');
    svg += `<polygon points="${envelope}" fill="#3b82f6" fill-opacity="0.08" />`;
  }

  // 1. Historical Line (Solid Indigo)
  const histPoints = histSubGdp.map((val, idx) => `${getX(idx).toFixed(1)},${getY(val).toFixed(1)}`).join(' ');
  svg += `<polyline points="${histPoints}" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`;

  // 2. Projected Line for active scenario (Dashed Vibrant)
  const projPoints = scenario.gdpNominal.map((val, idx) => `${getX(splitIdx + idx).toFixed(1)},${getY(val).toFixed(1)}`).join(' ');
  svg += `<polyline points="${projPoints}" fill="none" stroke="${scenario.color}" stroke-width="3" stroke-dasharray="6 4" stroke-linecap="round" stroke-linejoin="round" />`;

  // Highlight Current 2024 anchor point
  const anchorY = getY(historicalGdp[historicalGdp.length - 1]);
  svg += `
    <circle cx="${splitX}" cy="${anchorY}" r="5.5" fill="#ffffff" stroke="#6366f1" stroke-width="3" />
    <text x="${splitX + 8}" y="${anchorY - 6}" font-size="11" font-weight="700" fill="#ffffff" font-family="var(--font-mono)">$1,420.5B</text>
  `;

  // Highlight 2035 terminal point
  const endVal = scenario.gdpNominal[scenario.gdpNominal.length - 1];
  const endX = getX(nTotal - 1);
  const endY = getY(endVal);
  svg += `
    <circle cx="${endX}" cy="${endY}" r="5.5" fill="${scenario.color}" stroke="#ffffff" stroke-width="2.5" />
    <text x="${endX - 10}" y="${endY - 8}" font-size="11" font-weight="700" fill="${scenario.color}" text-anchor="end" font-family="var(--font-mono)">$${endVal.toFixed(0)}B (2035)</text>
  `;

  svg += `
      </svg>
      <div class="chart-legend">
        <div class="legend-item"><span class="legend-color" style="background:#6366f1;"></span><span class="legend-label">Historical Series (2018-2024)</span></div>
        <div class="legend-item"><span class="legend-color" style="background:${scenario.color};"></span><span class="legend-label">${scenario.name} Forecast</span></div>
        <div class="legend-item"><span class="legend-color" style="background:rgba(59,130,246,0.25);"></span><span class="legend-label">Scenario Confidence Bounds</span></div>
      </div>
    </div>
  `;

  container.innerHTML = svg;
}

// Interactive Provincial Map / Regional Geography SVG
export function renderProvincialMapSVG(container, options) {
  const {
    provinces = [],
    activeMetric = 'gdpCapitaRaw',
    selectedId = 'p-01',
    onSelect = () => {},
  } = options;

  container.innerHTML = '';
  const width = container.clientWidth || 580;
  const height = 340;

  // Layout 8 provinces on an organic stylized grid territory
  // Grid: 4 columns x 4 rows
  const colW = (width - 60) / 4;
  const rowH = (height - 60) / 4;

  const vals = provinces.map((p) => p[activeMetric]);
  const minVal = Math.min(...vals);
  const maxVal = Math.max(...vals);

  // Generate color scale: Deep slate to rich Emerald / Cyan
  const getColor = (val) => {
    const ratio = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));
    if (activeMetric === 'unemploymentRaw') {
      // Lower is better (Green to Red)
      const r = Math.round(16 + ratio * 200);
      const g = Math.round(185 - ratio * 100);
      return `rgb(${r}, ${g}, 100)`;
    }
    // Higher is better (Deep Navy to Vibrant Teal/Emerald)
    const r = Math.round(30 + ratio * 10);
    const g = Math.round(70 + ratio * 140);
    const b = Math.round(140 + ratio * 80);
    return `rgb(${r}, ${g}, ${b})`;
  };

  let svg = `
    <div class="provincial-map-wrap">
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="provincial-map-svg">
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#1e293b" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95"/>
          </radialGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#oceanGlow)" rx="8" />
  `;

  provinces.forEach((p) => {
    const x = 30 + p.gridX * colW + 6;
    const y = 30 + p.gridY * rowH + 6;
    const w = colW - 12;
    const h = rowH - 12;
    const isSelected = p.id === selectedId;
    const color = getColor(p[activeMetric]);

    let displayVal = '';
    if (activeMetric === 'gdpCapitaRaw') displayVal = p.gdpCapita;
    else if (activeMetric === 'popRaw') displayVal = (p.popRaw / 1000000).toFixed(1) + 'M';
    else if (activeMetric === 'unemploymentRaw') displayVal = p.unemployment;
    else if (activeMetric === 'cleanEnergyRaw') displayVal = p.cleanEnergy;

    svg += `
      <g class="map-province-tile" data-id="${p.id}" style="cursor:pointer;">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" 
          fill="${color}" 
          stroke="${isSelected ? '#38bdf8' : 'rgba(255,255,255,0.18)'}" 
          stroke-width="${isSelected ? '3' : '1'}"
          filter="${isSelected ? 'drop-shadow(0 0 8px rgba(56,189,248,0.5))' : 'none'}"
        >
          <title>${p.name} - ${displayVal}</title>
        </rect>
        <text x="${x + w / 2}" y="${y + h / 2 - 4}" font-size="11" font-weight="700" fill="#ffffff" text-anchor="middle" font-family="var(--font-sans)">
          ${p.code}
        </text>
        <text x="${x + w / 2}" y="${y + h / 2 + 12}" font-size="10" font-weight="600" fill="#cbd5e1" text-anchor="middle" font-family="var(--font-mono)">
          ${displayVal}
        </text>
      </g>
    `;
  });

  svg += `
      </svg>
      <div class="map-legend-row">
        <span>Low (${minVal.toLocaleString()})</span>
        <div class="legend-gradient-bar"></div>
        <span>High (${maxVal.toLocaleString()})</span>
      </div>
    </div>
  `;

  container.innerHTML = svg;

  // Add click listener
  container.querySelectorAll('.map-province-tile').forEach((tile) => {
    tile.addEventListener('click', () => {
      const id = tile.getAttribute('data-id');
      if (id) onSelect(id);
    });
  });
}

// Side-by-Side Provincial Comparison Bars
export function renderComparisonBarChart(container, provA, provB) {
  container.innerHTML = '';
  const metrics = [
    { label: 'GDP Per Capita ($)', valA: provA.gdpCapitaRaw, valB: provB.gdpCapitaRaw, max: 35000, fmt: (v) => '$' + v.toLocaleString() },
    { label: 'Clean Energy Share (%)', valA: provA.cleanEnergyRaw, valB: provB.cleanEnergyRaw, max: 100, fmt: (v) => v.toFixed(1) + '%' },
    { label: 'High-Speed Fiber (%)', valA: parseFloat(provA.fiberCoverage), valB: parseFloat(provB.fiberCoverage), max: 100, fmt: (v) => v.toFixed(1) + '%' },
    { label: 'Hospital Beds / 1,000', valA: provA.hospitalBedsPer1k, valB: provB.hospitalBedsPer1k, max: 7.0, fmt: (v) => v.toFixed(1) },
    { label: 'Unemployment Rate (%)', valA: provA.unemploymentRaw, valB: provB.unemploymentRaw, max: 6.0, fmt: (v) => v.toFixed(1) + '%', inverse: true },
  ];

  let html = `
    <div class="comp-bars-container">
      <div class="comp-header-row">
        <div class="comp-col-a">
          <span class="comp-tag a">${provA.name}</span>
        </div>
        <div class="comp-vs">VS</div>
        <div class="comp-col-b">
          <span class="comp-tag b">${provB.name}</span>
        </div>
      </div>
      <div class="comp-metric-list">
  `;

  metrics.forEach((m) => {
    const pctA = Math.min(100, (m.valA / m.max) * 100);
    const pctB = Math.min(100, (m.valB / m.max) * 100);
    const delta = m.valA - m.valB;
    const aWins = m.inverse ? delta < 0 : delta > 0;

    html += `
      <div class="comp-metric-row">
        <div class="comp-label-centered">
          <strong>${m.label}</strong>
        </div>
        <div class="comp-bars-split">
          <div class="comp-bar-half left">
            <span class="comp-bar-val font-mono">${m.fmt(m.valA)}</span>
            <div class="comp-bar-fill" style="width: ${pctA}%; background: ${aWins ? '#38bdf8' : '#64748b'};"></div>
          </div>
          <div class="comp-bar-half right">
            <div class="comp-bar-fill" style="width: ${pctB}%; background: ${!aWins ? '#10b981' : '#64748b'};"></div>
            <span class="comp-bar-val font-mono">${m.fmt(m.valB)}</span>
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
}

export function renderPopulationPyramid(container, pyramidData) {
  container.innerHTML = '';
  const width = container.clientWidth || 580;
  const height = 380;
  const padLeft = 40;
  const padRight = 40;
  const padTop = 30;
  const padBottom = 30;
  const centerW = 50;
  const halfPlotW = (width - padLeft - padRight - centerW) / 2;
  const plotH = height - padTop - padBottom;
  const rowHeight = plotH / pyramidData.length;

  const maxVal = Math.max(...pyramidData.map((d) => Math.max(d.male, d.female))) * 1.15;

  let svg = `
    <div class="chart-wrapper">
      <div class="chart-header">
        <h4>National Demographic Population Pyramid (2024 Census)</h4>
        <span class="chart-sub">Cohort population in millions (Male: 28.9M vs Female: 29.5M)</span>
      </div>
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="stat-chart-svg">
  `;

  pyramidData.forEach((d, idx) => {
    const y = padTop + idx * rowHeight;
    const barH = Math.max(2, rowHeight - 3);

    const maleW = (d.male / maxVal) * halfPlotW;
    const maleX = padLeft + halfPlotW - maleW;

    const femaleW = (d.female / maxVal) * halfPlotW;
    const femaleX = padLeft + halfPlotW + centerW;

    svg += `
      <rect x="${maleX}" y="${y}" width="${maleW}" height="${barH}" rx="2" fill="#2563eb" fill-opacity="0.85">
        <title>Age ${d.cohort} Male: ${d.male}M</title>
      </rect>
      <text x="${maleX - 4}" y="${y + barH / 2 + 3.5}" font-size="9" fill="var(--text-muted)" text-anchor="end" font-family="var(--font-mono)">${d.male}</text>
      <text x="${padLeft + halfPlotW + centerW / 2}" y="${y + barH / 2 + 3.5}" font-size="10" font-weight="600" fill="var(--text-main)" text-anchor="middle" font-family="var(--font-sans)">${d.cohort}</text>
      <rect x="${femaleX}" y="${y}" width="${femaleW}" height="${barH}" rx="2" fill="#ec4899" fill-opacity="0.85">
        <title>Age ${d.cohort} Female: ${d.female}M</title>
      </rect>
      <text x="${femaleX + femaleW + 4}" y="${y + barH / 2 + 3.5}" font-size="9" fill="var(--text-muted)" text-anchor="start" font-family="var(--font-mono)">${d.female}</text>
    `;
  });

  svg += `
      </svg>
      <div class="chart-legend">
        <div class="legend-item"><span class="legend-color" style="background:#2563eb;"></span><span class="legend-label">Male Cohort (49.5%)</span></div>
        <div class="legend-item"><span class="legend-color" style="background:#ec4899;"></span><span class="legend-label">Female Cohort (50.5%)</span></div>
      </div>
    </div>
  `;

  container.innerHTML = svg;
}

export function renderDonutChart(container, options) {
  const { title = '', data = [], height = 260 } = options;
  container.innerHTML = '';
  const width = container.clientWidth || 380;
  const size = Math.min(width, height);
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const innerRadius = radius * 0.62;

  const total = data.reduce((sum, item) => sum + item.share, 0);
  let currentAngle = -Math.PI / 2;
  const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b', '#84cc16'];

  let svg = `
    <div class="chart-wrapper">
      ${title ? `<div class="chart-header"><h4>${title}</h4></div>` : ''}
      <div class="donut-flex">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  `;

  data.forEach((item, idx) => {
    const sliceAngle = (item.share / total) * Math.PI * 2;
    const endAngle = currentAngle + sliceAngle;

    const x1 = cx + radius * Math.cos(currentAngle);
    const y1 = cy + radius * Math.sin(currentAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const x3 = cx + innerRadius * Math.cos(endAngle);
    const y3 = cy + innerRadius * Math.sin(endAngle);
    const x4 = cx + innerRadius * Math.cos(currentAngle);
    const y4 = cy + innerRadius * Math.sin(currentAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    const color = item.color || colors[idx % colors.length];

    const dPath = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;

    svg += `<path d="${dPath}" fill="${color}" stroke="#ffffff" stroke-width="1.5"><title>${item.sector}: ${item.share}% ($${item.gdpBillion}B)</title></path>`;
    currentAngle = endAngle;
  });

  svg += `
        <text x="${cx}" y="${cy - 4}" font-size="11" fill="var(--text-muted)" text-anchor="middle">TOTAL GDP</text>
        <text x="${cx}" y="${cy + 16}" font-size="15" font-weight="700" fill="var(--text-main)" text-anchor="middle">$1.42T</text>
      </svg>
      <div class="donut-legend">
        ${data
          .slice(0, 5)
          .map(
            (item, idx) => `
          <div class="donut-legend-row">
            <span class="legend-color" style="background:${item.color || colors[idx % colors.length]};"></span>
            <span class="d-leg-label">${item.sector}</span>
            <strong class="d-leg-val">${item.share}%</strong>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  </div>
  `;

  container.innerHTML = svg;
}

export function renderHorizontalBarChart(container, options) {
  const { title = '', data = [], height = 240 } = options;
  container.innerHTML = '';
  const width = container.clientWidth || 480;

  let html = `
    <div class="chart-wrapper">
      ${title ? `<div class="chart-header"><h4>${title}</h4></div>` : ''}
      <div class="hbar-list">
  `;

  const maxVal = Math.max(...data.map((d) => d.val));

  data.forEach((d) => {
    const pct = ((d.val / maxVal) * 100).toFixed(1);
    html += `
      <div class="hbar-item">
        <div class="hbar-info">
          <span class="hbar-label">${d.label}</span>
          <span class="hbar-val font-mono">${d.formatted || d.val}</span>
        </div>
        <div class="hbar-track">
          <div class="hbar-fill" style="width: ${pct}%; background: ${d.color || '#2563eb'};"></div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;
}
