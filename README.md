# StatVeridia · National Open Data & Statistical Portal

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/malapetakasatu/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/malapetakasatu/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An authoritative, transparent, and responsive national statistical repository and open data dissemination portal for the **Republic of Veridia**, built for the [make.fun Bounty: Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

Published by the **Central Statistical Institute (StatVeridia)** adhering to international reporting standards (UN SNA 2008 & IMF SDDS Plus).

---

## 🏛️ Portal Highlights & Core Sections

1. **Executive Overview (`#/`)**:
   - High-level national KPI strip with 10-year sparkline trajectories (Population, GDP, Per Capita, Inflation CPI, Unemployment Rate, Public Debt-to-GDP, Clean Energy Share, Life Expectancy).
   - 10-Year Macroeconomic Trajectory interactive dual-axis line chart (Nominal GDP vs. Real Growth %).
   - 2024 GDP Composition by Economic Sector interactive donut chart.
   - Highlights & key demographic/social indicators.

2. **Economy & Trade (`#/economy`)**:
   - Comprehensive national accounts overview (Gross Capital Formation, Household Consumption, Central Bank Policy Rate, Government Balance).
   - Trade Balance & Merchandise Flow time series (Exports vs. Imports, 2015–2024).
   - Price Stability & Monetary Stance (Headline CPI vs. Policy Rate).
   - Full economic sector breakdown table with output values in USD Billions, percentage shares, and YoY growth rates.

3. **Demographics & Census (`#/demographics`)**:
   - Bi-lateral Population Age Pyramid (0–4 through 85+ cohorts, Male vs. Female distribution across 58.42M citizens).
   - Census key metrics (Median Age, Total Fertility Rate, Urbanization Ratio, Net Annual Migration).
   - Detailed tabular census cohort breakdown with male/female totals and gender ratios.

4. **Provinces & Regional Accounts (`#/regional`)**:
   - Granular breakdown across all 8 administrative provinces (Capital District, Northumbria Maritime, Eldoria Industrial Heartland, Sunbelt Agricultural Valley, Zephyr Coastal Basin, Iron Peak Highlands, Sylvan Forestry Region, Frontier Special Economic Zone).
   - Regional population, regional GDP output, per-capita income, unemployment rate, surface area, economic pillars, and administrative highlights.
   - Fully optimized mobile viewport layout for on-the-go citizen access.

5. **Data Explorer & Open Data Dissemination (`#/data`)**:
   - Real-time instant filtering across the entire indicator catalog.
   - One-click client-side export to **CSV format** for analysts, researchers, and journalists.
   - One-click client-side export to **JSON format** carrying full historical series, regional data, and census records.

---

## 🚀 Architecture & Engineering Standards

- **Zero External Dependencies**: 100% vanilla JavaScript (ES modules), semantic HTML5, and bespoke CSS. No CDN calls, no tracking scripts, completely offline-capable.
- **Custom Native SVG Charting Engine**: Sparklines, multi-series line charts with area fills and dynamic tooltips, demographic pyramids, and sector donut charts rendered entirely in native SVG.
- **Responsive by Design**: WCAG AAA high-contrast theme, responsive CSS Grid + Flexbox architectures tuned for both 1280x800 desktop workstations and 390x844 mobile devices.
- **Micro-Footprint**: Fast first-contentful-paint, zero bloat, pure Node 22 stdlib harness.

---

## 📊 Screenshots Preview

| View | Resolution | Target Route |
| :--- | :--- | :--- |
| **Executive Overview** | 1280 × 800 | `#/` |
| **Economy & Trade** | 1280 × 800 | `#/economy` |
| **Demographics & Census** | 1280 × 800 | `#/demographics` |
| **Regional & Mobile View** | 390 × 844 | `#/regional` |

---

## 🛠️ Local Development & Preview

Serve the application locally using the built-in Node 22 HTTP server:

```bash
# Start local static server on port 8080
node serve.ts --port 8080

# Run screenshot capture script with headless Chrome
node scripts/capture_screenshots.mjs

# Build submission dossier
MAKEFUN_OUTPUT_DIR=./dist node main.ts
```

---

## 📜 License

Released under the [MIT License](LICENSE).
