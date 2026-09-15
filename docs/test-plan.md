# NOVA MART E-Commerce Platform — Comprehensive QA Test Plan

**Project:** NOVA MART Next-Generation Retail E-Commerce Portal  
**Document Version:** 2.4.0  
**Target Delivery:** Virtusa Enterprise Quality Engineering Standard  
**Environment:** Staging / Pre-Production (`http://localhost:3000`)

---

## 1. Executive Summary & Objective

The objective of this comprehensive Test Plan is to validate the functional integrity, end-to-end user workflows, API resilience, catalog database consistency, cross-browser compatibility, and performance SLAs for the **NOVA MART** e-commerce platform.

NOVA MART offers customers a frictionless omnichannel retail experience spanning 6 key taxonomies (Electronics, Fashion, Home & Living, Fitness, Accessories, Gadgets), real-time product search with keyword debouncing, coupon discount calculation, persistent cart management, address verification, and simulated payment gateway checkout.

---

## 2. Scope of Testing

### 2.1 In-Scope Modules
- **Authentication & User Profiles:** Customer sign-up, sign-in, JWT token lifecycle, session persistence, role-based authorization (Customer vs. Admin), address management.
- **Product Catalog & Taxonomy:** 106 unique seeded products across 6 categories. Verification of zero duplicate SKUs and zero duplicate product names.
- **Live Search & Filtering:** Dynamic keyword searching, category taxonomy filtering, price range sliding, customer ratings, in-stock only filters, multi-column sorting (price, rating, discount).
- **Shopping Cart & Promotions:** Dynamic cart calculations, line item totals, real-time quantity updates, cart badge sync, free shipping tier evaluation (threshold: ₹999), and coupon code validation (`NOVA20`, `WELCOME10`, `SAVE500`).
- **Checkout & Order Processing:** Multi-step shipping form validation, phone & postal code format checks, simulated payment methods, automated order generation (`NOVA-YYYY-XXXXX`), and inventory stock decrements.
- **Admin & Quality Dashboard:** Live QA automation test monitors, catalog integrity metrics, low-stock inventory warnings, revenue analytics, and interactive report rendering.
- **Automation Suites:** C# .NET 8 NUnit Selenium WebDriver suite and JavaScript Selenium WebDriver suite.
- **Performance & Load:** 50 concurrent virtual users simulated via Apache JMeter and Node.js benchmark runners (< 500ms latency SLA).
- **Cloud Infrastructure & CI/CD:** Azure Bicep IaC provisioning and multi-stage Azure DevOps pipeline (`azure-pipelines.yml`).

### 2.2 Out-of-Scope
- Real financial card settlement (simulated gateway used for QA).
- Third-party physical courier dispatch integration.

---

## 3. Test Strategy & Methodologies

| Tier | Tooling / Framework | Scope / Coverage | Execution Frequency |
| :--- | :--- | :--- | :--- |
| **Unit & Integration** | Vitest / Jest | Core utility functions, discount formulas, tax calculations | Every commit |
| **REST API Testing** | Node.js native assert / Supertest | 15 API endpoints (Auth, Products, Cart, Orders, Admin) | Every PR |
| **C# UI Automation** | C# .NET 8, NUnit 3, Selenium 4.x | Cross-browser critical end-to-end flows on Chromium | Nightly & Pre-release |
| **JavaScript UI Automation** | Node.js, Selenium WebDriver 4.x | Headless Chromium regression suite (10 scenarios) | Every CI/CD build |
| **Performance Testing** | Apache JMeter 5.5, Node Bench | Concurrency, throughput, p95 latencies, stress points | Weekly / Release gate |
| **Infrastructure as Code** | Azure Bicep, Azure Pipelines | App Service, PostgreSQL Flexible Server, Key Vault, Storage | On infrastructure change |

---

## 4. Test Environment & Configuration

- **Web Server:** Node.js 20.x + Express (port 3000)
- **Frontend SPA:** React 18, Vite, Tailwind CSS
- **Database:** SQLite3 / Cloud SQL PostgreSQL (WAL mode, foreign keys enabled)
- **Test Browsers:** Chromium (Headless & Desktop), Google Chrome, Firefox, Safari
- **Execution Host:** Linux x64 container (Debian Bookworm)

---

## 5. Entry & Exit Criteria

### 5.1 Entry Criteria
- Application compiles cleanly with zero TypeScript errors (`npm run build`).
- Database migration and seeding scripts executed with 106 unique products verified.
- Port 3000 health check endpoint (`/api/health`) returns HTTP 200 OK.

### 5.2 Exit Criteria
- 100% of Critical (P0) and Major (P1) test cases executed and passed.
- Catalog duplicate check confirms exactly 106 unique SKUs and 106 unique product names.
- Zero high-severity open defects.
- Average endpoint response time under peak load < 500ms.
- Both C# and JavaScript Selenium test reports generated and verified in admin portal.

---

## 6. Roles & Responsibilities

- **Lead QA Architect (Virtusa Standards):** Test strategy, architecture review, Azure CI/CD gating.
- **Automation Test Engineers:** Page Object Model maintenance, C# and JS Selenium script creation, defect triage.
- **DevOps Engineer:** Azure Bicep template management, pipeline configuration, artifact storage.
