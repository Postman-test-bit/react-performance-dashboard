# 📘 Report Dashboard – Technical & Functional Documentation  

**Version**: `v1.0`  |  **Author**: *[QA Team]*  
**App Modules**: Performance Dashboard · Visual Test Dashboard  
**Goal**: Provide a single source of truth for front-end performance & visual regression reporting for QA and Product teams.

## 📌 Introduction

The Report Dashboard is a unified analytics platform built using React that enables teams to:

- Track front-end performance metrics (Lighthouse-based) across pages, brands, and devices
- Identify and explore visual regressions with screenshot diff previews
- Provide a theme-aware, mobile-responsive, and filter-driven interface for non-technical users

## 🧱 Folder Structure

![Folder Structure](image.png)

## 🎨 Theming & Responsiveness

- Fully supports dark/light modes via a theme toggle
- Uses var(--bg-color) and var(--text-color) across CSS
- Charts, cards, and modals respond fluidly across devices

## 📊 Module 1: Performance Dashboard

### 🧠 Purpose

Track Lighthouse test result data across brands, devices, and URLs.

### 🔍 Key Functionalities

- Global KPI Cards (Performance, SEO, etc.)
- Search by page name
- Filters by Brand, Device, Date
- Tabbed views per metric type
- Trend indicators
- Full paginated test result table with report links

## 🖼️ Module 2: Visual Test Dashboard

### 🧠 Purpose

Analyze screenshot comparison results.

### 🔍 Key Functionalities

- Pie chart showing pass/fail ratio
- Brand-wise bar charts
- Filters by test name, device, brand, status
- Test results table with screenshot modal previews

## ⚙️ Internal Logic Highlights

- Theme-aware charts via Highcharts
- Auto-merged JSON inputs for performance/visual data
- Generic table/chart components for reuse
- Real-time data filtering and pagination

## 🧪 Testing Strategy

- React Testing Library unit tests
- Manual QA on responsiveness
- JSON validity checks

## Images

- ![Performance Dashboard - Desktop Mode - Dark Mode](https://i.postimg.cc/1RFkbpwR/networks-performance-test-dashboard-netlify-app.png)
- ![Performance Dashboard - Desktop Mode - Light Mode](https://i.postimg.cc/v89mXxmf/networks-performance-test-dashboard-netlify-app-4.png)
- ![Sidebar - Desktop Mode - Dark Mode](https://i.postimg.cc/gj31RWmL/networks-performance-test-dashboard-netlify-app-1.png)
- ![Sidebar - Desktop Mode - Light Mode](https://i.postimg.cc/gkW27cw5/networks-performance-test-dashboard-netlify-app-5.png)
- ![Visual Dashboard - Desktop Mode - Dark Mode](https://i.postimg.cc/Fsg2HNT2/networks-performance-test-dashboard-netlify-app-2.png)
- ![Visual Dashboard - Desktop Mode - Light Mode](https://i.postimg.cc/4yCxssWY/networks-performance-test-dashboard-netlify-app-3.png)
- [Performance Dashboard - Mobile Mode - Dark Mode](https://i.postimg.cc/GhFVMdYX/networks-performance-test-dashboard-netlify-app-Samsung-Galaxy-S20-Ultra-1.png)
- [Performance Dashboard - Mobile Mode - Light Mode](https://i.postimg.cc/gc6fZv0F/networks-performance-test-dashboard-netlify-app-i-Phone-14-Pro-Max.png)
- [Visual Dashboard - Mobile Mode - Dark Mode](https://i.postimg.cc/RF2yY0XD/networks-performance-test-dashboard-netlify-app-i-Phone-14-Pro-Max-1.png)
- [Visual Dashboard - Mobile Mode - Light Mode](https://i.postimg.cc/m2fKNtcc/networks-performance-test-dashboard-netlify-app-Samsung-Galaxy-S20-Ultra.png)

## 🧭 Future Enhancements

- Multi-project support
- Real-time auto-refresh
- Slack alerts on failure
- PDF export support

## 📎 Appendix

### 🔖 Tag Definitions

| Tag | Meaning |
|-----|---------|
| passed | No visual mismatch detected |
| failed | Significant mismatch |
| IR/PDI/GLOBAL | Brand |
| desktop/mobile | Device viewport |
