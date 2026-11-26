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

  // Compute global min and max across all series
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

  // Horizontal Grid Lines & Y-Axis Labels
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

  // X-Axis Labels
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

  // Plot Each Series
  series.forEach((s) => {
    const points = s.data.map((val, idx) => {
      const x = padLeft + (idx / (nLabels - 1)) * plotW;
      const y = padTop + plotH - ((val - minVal) / valRange) * plotH;
      return { x, y, val };
    });

    const ptsString = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    // Area Fill
    const areaString = `
      ${points[0].x},${height - padBottom} 
      ${ptsString} 
      ${points[points.length - 1].x},${height - padBottom}
    `;

    svg += `
      <polygon points="${areaString}" fill="${s.color}" fill-opacity="0.08" />
      <polyline points="${ptsString}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    `;

    // Data Point Dots
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

    // Male bar (Left side, right-to-left)
    const maleW = (d.male / maxVal) * halfPlotW;
    const maleX = padLeft + halfPlotW - maleW;

    // Female bar (Right side, left-to-right)
    const femaleW = (d.female / maxVal) * halfPlotW;
    const femaleX = padLeft + halfPlotW + centerW;

    svg += `
      <!-- Male Bar -->
      <rect x="${maleX}" y="${y}" width="${maleW}" height="${barH}" rx="2" fill="#2563eb" fill-opacity="0.85">
        <title>Age ${d.cohort} Male: ${d.male}M</title>
      </rect>
      <text x="${maleX - 4}" y="${y + barH / 2 + 3.5}" font-size="9" fill="var(--text-muted)" text-anchor="end" font-family="var(--font-mono)">${d.male}</text>

      <!-- Center Age Cohort Label -->
      <text x="${padLeft + halfPlotW + centerW / 2}" y="${y + barH / 2 + 3.5}" font-size="10" font-weight="600" fill="var(--text-main)" text-anchor="middle" font-family="var(--font-sans)">${d.cohort}</text>

      <!-- Female Bar -->
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
    const color = colors[idx % colors.length];

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

  // Center Total
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
            <span class="legend-color" style="background:${colors[idx % colors.length]};"></span>
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
