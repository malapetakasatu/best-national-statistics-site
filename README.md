# StatVeridia · National Open Data & Statistical Portal

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/malapetakasatu/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/malapetakasatu/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An authoritative, transparent, and responsive national statistical repository and open data dissemination portal for the **Republic of Veridia**, built for the [make.fun Bounty: Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

Published by the **Central Statistical Institute (StatVeridia)** adhering to international reporting standards (UN SNA 2008 & IMF SDDS Plus).

---

## 🏛️ Portal Highlights & Core Sections

1. **Executive Overview (`#/`)**:
   - High-level national KPI strip with 10-year sparkline trajectories (Population, GDP, Per Capita, Inflation CPI, Unemployment Rate, Public Debt-to-GDP, Clean Energy Share, Trade Surplus).
   - **Simulated Live Census Population Clock**: Real-time incrementing citizen counter reflecting +0.58% net annual demographic growth.
   - **10-Year Forward Forecasting & Scenario Simulator (2025–2035)**: Dynamic macroeconomic projections under 3 distinct policy pathways (Consensus Baseline, Green Industrial Acceleration, Global Headwinds) complete with uncertainty envelope.
   - 10-Year Macroeconomic Trajectory interactive dual-axis line chart (Nominal GDP vs. Merchandise Trade Balance).
   - 2024 GDP Composition by Economic Sector interactive donut chart.
   - Official Statistical Bulletins & Gazettes feed.

2. **Economy & Trade (`#/economy`)**:
   - Bilateral Trading Partners Breakdown: Export and import volumes with major economic blocs (Nordic Commonwealth, Atlantic Federation, Pacific Rim).
   - Sovereign Fiscal Balance & 10-Year Bond Yields (General Government Revenue, Appropriated Expenditure, Deficit compliance).
   - Trade Balance & Merchandise Flow time series (Exports vs. Imports, 2015–2024).
   - Price Stability & Monetary Stance (Headline CPI vs. Policy Rate).
   - Full economic sector breakdown table with output values in USD Billions, percentage shares, and real growth rates.

3. **Demographics & Census (`#/demographics`)**:
   - Bi-lateral Population Age Pyramid (0–4 through 85+ cohorts, Male vs. Female distribution across 58.43M citizens).
   - Census key metrics (Median Age, Total Fertility Rate, Urbanization Ratio, Dependency status).
   - Detailed tabular census cohort breakdown with male/female totals, percentage of population, and labor force classification.

4. **Provinces & Regional Accounts (`#/regional`)**:
   - **Interactive Territorial Grid & Choropleth Map**: Dynamic SVG vector map of Veridia's 8 administrative territories with real-time metric coloring (GDP per capita, population, clean energy share, unemployment).
   - **Bilateral Regional Benchmarking Tool**: Side-by-side comparative metric analysis between any two selected provinces with visual delta comparison bars.
   - Granular profile cards for all 8 administrative provinces including regional GDP output, per-capita income, fiber optic coverage, hospital beds per 1,000, and economic pillars.

5. **Data Explorer & Open Data Dissemination (`#/data`)**:
   - Category filter chips (All, Macroeconomic, Industry Sectors, Regional Atlas, Bilateral Trade).
   - Real-time instant filtering across the entire indicator catalog.
   - One-click client-side export to **CSV format**.
   - One-click client-side export to **JSON format** carrying full historical series, 2035 projections, regional data, and census records.
   - **Official Statistical Gazette Communique**: Formatted printable sovereign release with official seal, cryptographic digital verification code, and signatories.

---

## 🚀 Architecture & Engineering Standards

- **Zero External Dependencies**: 100% vanilla JavaScript (ES modules), semantic HTML5, and bespoke CSS. No CDN calls, no tracking scripts, completely offline-capable.
- **Custom Native SVG Charting Engine**: Sparklines, multi-series line charts with area fills and dynamic tooltips, demographic pyramids, scenario projections with uncertainty cones, horizontal bar charts, and territorial choropleth maps.
- **Responsive by Design**: WCAG AAA high-contrast theme, responsive CSS Grid + Flexbox architectures tuned for both 1280x800 desktop workstations and 390x844 mobile devices.
- **Micro-Footprint**: Fast first-contentful-paint, zero bloat, pure Node 22 stdlib harness.

---

## 📊 Screenshots Preview

| View | Resolution | Target Route |
| :--- | :--- | :--- |
| **Executive Overview & Forecast Simulator** | 1280 × 800 | `#/` |
| **Economy & Trade Partners** | 1280 × 800 | `#/economy` |
| **Territorial Map & Province Benchmarking** | 1280 × 800 | `#/regional` |
| **Demographics & Mobile Census** | 390 × 844 | `#/demographics` |

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
