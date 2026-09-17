# NOVA MART • Full-Stack E-Commerce & Automated QA Platform

![NOVA MART CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions\&logoColor=white)
![Automation](https://img.shields.io/badge/Testing-C%23%20%7C%20Selenium%20%7C%20NUnit-512BD4?logo=dotnet\&logoColor=white)
![Additional Testing](https://img.shields.io/badge/Testing-Playwright%20%7C%20PyTest%20%7C%20Robot%20Framework-45C5D5)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Tailwind-61DAFB?logo=react\&logoColor=black)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20SQL-339933?logo=node.js\&logoColor=white)

**NOVA MART** is a full-stack e-commerce web application developed with an automated Quality Assurance (QA) and Continuous Integration/Continuous Delivery (CI/CD) testing setup.

The project combines a React/TypeScript frontend with a Node.js/Express backend and SQL-based persistence. It includes automated UI, API, regression, and performance testing using multiple testing technologies, including **C#/.NET 8, Selenium WebDriver, NUnit, Playwright, PyTest, Robot Framework, and JMeter**.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Automated QA & Testing Strategy](#automated-qa--testing-strategy)
4. [C# Selenium Automation Framework](#c-selenium-automation-framework)
5. [Playwright Tests](#playwright-tests)
6. [PyTest Tests](#pytest-tests)
7. [Robot Framework Tests](#robot-framework-tests)
8. [Performance Testing](#performance-testing)
9. [Page Object Model](#page-object-model)
10. [Automated Test Scenarios](#automated-test-scenarios)
11. [CI/CD Pipeline](#cicd-pipeline)
12. [How to Run Tests Locally](#how-to-run-tests-locally)
13. [Cloud Deployment Configuration](#cloud-deployment-configuration)
14. [QA Engineering Skills Demonstrated](#qa-engineering-skills-demonstrated)

---

## Architecture Overview

NOVA MART follows a multi-tier architecture designed for maintainability and automated testing.

* **Frontend:** React, TypeScript, Vite, and Tailwind CSS.
* **Backend:** Node.js and Express REST API.
* **Database:** SQLite for local development and testing.
* **UI Automation:** C#/.NET 8 with Selenium WebDriver and NUnit using the Page Object Model.
* **Browser Testing:** Playwright test suite for browser-level smoke testing.
* **API/Reachability Testing:** PyTest and Robot Framework test suites using Python-based HTTP requests.
* **Performance Testing:** JMeter-based performance testing.
* **CI/CD:** GitHub Actions for automated build and regression verification.
* **Cloud Configuration:** Azure deployment configuration is included, but cloud deployment is not currently active.

---

## Technology Stack

| Area                  | Technologies                              |
| --------------------- | ----------------------------------------- |
| Frontend              | React, TypeScript, Vite, Tailwind CSS     |
| Backend               | Node.js, Express.js, REST APIs            |
| Database              | SQL, SQLite                               |
| Primary Automation    | C#, .NET 8, Selenium WebDriver, NUnit     |
| UI Automation Pattern | Page Object Model (POM)                   |
| Browser Testing       | Playwright                                |
| Python Testing        | PyTest, Requests                          |
| Keyword-Based Testing | Robot Framework, RequestsLibrary          |
| Performance Testing   | Apache JMeter                             |
| CI/CD                 | GitHub Actions                            |
| Version Control       | Git, GitHub                               |
| Diagnostics           | HTML reports, screenshots, test artifacts |

---

## Automated QA & Testing Strategy

The project uses multiple layers of testing rather than relying on a single automation framework.

### Functional UI Testing

The C# Selenium framework validates major e-commerce workflows including:

* Authentication
* Product search
* Product filtering
* Product sorting
* Product details
* Cart management
* Wishlist functionality
* Checkout validation
* Order placement
* Order confirmation
* Order history

### Browser Smoke Testing

Playwright provides a lightweight browser-level smoke test suite for verifying that the application loads and important UI elements are available.

### API / Application Reachability Testing

PyTest and Robot Framework provide independent HTTP-based checks against the running application.

### Regression Testing

The C# NUnit suite provides broader regression coverage across the application's core workflows.

### Performance Testing

JMeter is used for performance testing and evaluating application/API behavior under test load.

### Test Diagnostics

The Selenium framework includes failure screenshots and generated test reports to support troubleshooting and defect investigation.

---

## C# Selenium Automation Framework

The main Selenium automation framework is located under:

```text
automation/
```

The project file is:

```text
automation/NOVAMart.Automation.csproj
```

The framework uses:

* C#
* .NET 8
* Selenium WebDriver
* NUnit
* Page Object Model
* Explicit waits
* Test data utilities
* API verification
* Failure screenshots
* HTML reporting

### Framework Structure

```text
automation/
├── NOVAMart.Automation.csproj
├── Pages/
│   ├── BasePage.cs
│   ├── LoginPage.cs
│   ├── HomePage.cs
│   ├── ShopPage.cs
│   ├── ProductPage.cs
│   ├── CartPage.cs
│   ├── CheckoutPage.cs
│   ├── OrderConfirmationPage.cs
│   └── AccountPage.cs
├── Tests/
│   ├── AuthenticationTests.cs
│   ├── SearchAndCatalogTests.cs
│   ├── CartManagementTests.cs
│   ├── CheckoutAndOrderTests.cs
│   └── RegressionSuite.cs
├── Utilities/
│   ├── DriverFactory.cs
│   ├── BaseTest.cs
│   ├── WaitHelper.cs
│   ├── ScreenshotHelper.cs
│   ├── TestDataHelper.cs
│   ├── ApiHelper.cs
│   └── HtmlReportHelper.cs
├── TestData/
├── Reports/
└── Screenshots/
```

---

## Playwright Tests

The Playwright test suite is located under:

```text
playwright-tests/
```

It uses:

* Playwright Test
* TypeScript
* Chromium
* HTML test reporting
* Screenshots and traces on failures

Current smoke tests verify:

1. The NOVA MART application loads successfully.
2. The user menu button is available.

The tests were executed locally using Playwright and passed successfully.

### Run Playwright

```bash
cd playwright-tests
npm ci
npx playwright install chromium
npm test
```

For headed execution:

```bash
npm run test:headed
```

---

## PyTest Tests

The PyTest suite is located under:

```text
pytest-tests/
```

It uses:

* Python
* PyTest
* Requests

The current test suite performs an HTTP reachability check against the running NOVA MART application.

### Run PyTest

```bash
py -3.12 -m pytest -v pytest-tests/tests
```

---

## Robot Framework Tests

The Robot Framework suite is located under:

```text
robot-tests/
```

It uses:

* Robot Framework
* RequestsLibrary
* HTTP-based application verification

The current test verifies that the NOVA MART application is reachable and returns a successful HTTP response.

### Run Robot Framework

```bash
py -3.12 -m robot -d robot-tests/results robot-tests/tests
```

The test execution generates:

```text
robot-tests/results/output.xml
robot-tests/results/log.html
robot-tests/results/report.html
```

---

## Performance Testing

Performance testing assets are maintained under:

```text
performance/
```

Apache JMeter is used to evaluate application/API behavior under test load and support non-functional testing.

---

## Page Object Model

The Selenium automation framework follows the **Page Object Model (POM)** pattern.

The approach separates:

* Test scenarios and assertions
* Page locators
* UI interaction methods
* Reusable test utilities

For example, page classes encapsulate actions such as:

```text
Search()
AddToCart()
ProceedToCheckout()
FillShippingDetails()
```

This reduces duplicated UI interaction logic and makes the automation suite easier to maintain when application elements change.

---

## Automated Test Scenarios

The primary Selenium regression suite covers scenarios across:

| Area           | Coverage                                     |
| -------------- | -------------------------------------------- |
| Authentication | Valid login, invalid login, validation       |
| Search         | Product search, no-result search             |
| Catalog        | Category filtering, price filtering, sorting |
| Product        | Product detail navigation                    |
| Cart           | Add, increase, decrease, remove              |
| Wishlist       | Add/remove wishlist state                    |
| Checkout       | Form validation and order placement          |
| Orders         | Confirmation and order history               |
| Regression     | End-to-end customer workflow                 |
| API            | Backend/application verification             |
| Performance    | JMeter-based testing                         |

The C# automation suite contains the project's broader functional regression scenarios, while Playwright, PyTest, and Robot Framework provide additional independent test coverage.

---

## CI/CD Pipeline

The primary GitHub Actions workflow is:

```text
.github/workflows/ci-cd.yml
```

The pipeline currently performs automated build and testing activities.

### Pipeline Flow

```text
GitHub Push / Pull Request
          |
          v
    Checkout Repository
          |
          v
     Setup Node.js
          |
          v
    Install Dependencies
          |
          v
 Install Playwright Dependencies
          |
          v
       Run Lint
          |
          v
       Build App
          |
          v
   Run Playwright Tests
          |
          v
     Upload Reports
          |
          v
   Selenium/NUnit Suite
          |
          v
      Test Results
```

### CI/CD Technologies

* GitHub Actions
* Node.js 20
* .NET 8
* Playwright
* Selenium WebDriver
* NUnit
* Automated test artifacts

The pipeline is configured to execute automated verification before the project proceeds through later workflow stages.

---

## Cloud Deployment Configuration

NOVA MART contains configuration and workflow components for cloud deployment, including Azure-related deployment configuration.

However, **the application is not currently deployed to Azure or AWS**.

The cloud configuration is retained as deployment-ready project configuration rather than being represented as an active production deployment.

This README therefore does **not** claim an active Azure or AWS deployment.

---

## How to Run Tests Locally

### 1. Start the Application

From the repository root:

```bash
npm install
npm run dev
```

Confirm that the application is available at:

```text
http://localhost:3000
```

### 2. Run Selenium/NUnit Tests

```bash
cd automation
dotnet restore
dotnet test
```

### 3. Run Playwright

```bash
cd playwright-tests
npm ci
npx playwright install chromium
npm test
```

### 4. Run PyTest

```bash
py -3.12 -m pytest -v pytest-tests/tests
```

### 5. Run Robot Framework

```bash
py -3.12 -m robot -d robot-tests/results robot-tests/tests
```

### 6. Performance Testing

Open the relevant JMeter test plan under:

```text
performance/
```

and execute it using Apache JMeter.

---

## QA Engineering Skills Demonstrated

This project demonstrates practical experience with:

1. **Test Automation** — Selenium WebDriver, Playwright, NUnit, PyTest, and Robot Framework.
2. **Functional Testing** — authentication, catalog, cart, checkout, orders, and user workflows.
3. **Regression Testing** — reusable automated regression scenarios using C# and NUnit.
4. **API Testing** — HTTP/API verification using automation utilities, Requests, and Robot Framework.
5. **Performance Testing** — JMeter-based testing.
6. **Test Framework Design** — Page Object Model and reusable test utilities.
7. **Failure Diagnostics** — screenshots, logs, and HTML test reports.
8. **CI/CD** — GitHub Actions-based automated build and test execution.
9. **Git/GitHub** — branches, pull requests, commits, and CI checks.
10. **Troubleshooting** — debugging automation failures, dependency issues, test selectors, CI configuration, and environment problems.

---

## Project Goal

NOVA MART was developed as a portfolio project to demonstrate how a full-stack web application can be supported by a structured QA automation strategy.

The project combines application development with multiple testing approaches, CI/CD automation, regression testing, API verification, and performance testing to demonstrate practical software quality engineering skills.
