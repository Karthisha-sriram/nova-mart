# NOVA MART — QA Defect Report & Root Cause Analysis

**Standard:** Virtusa Enterprise Quality Engineering  
**Lifecycle Status:** All Logged Defects Verified & Resolved (0 Open Defects)  

---

## Defect Summary Table

| Defect ID | Severity | Module | Description | Root Cause | Resolution / Fix Applied | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DEF-001** | **Critical (P1)** | Test Automation | `dotnet` runtime missing in container environment | Container lacked .NET 8 SDK and Chromium binaries needed by NUnit runner | Executed headless package setup for `dotnet-sdk-8.0`, `chromium`, and `chromium-driver` | **CLOSED / VERIFIED** |
| **DEF-002** | **Major (P2)** | Authentication | Sign-in modal button selector unreachable in automated test | `AuthContext` auto-seeded demo user upon initial render, keeping user signed in and masking sign-in button | Updated `AuthContext` to support explicit sign-out state (`novamart_logged_out`) and updated POM to handle pre-authenticated state cleanly | **CLOSED / VERIFIED** |
| **DEF-003** | **Major (P2)** | Catalog Data | Risk of duplicate product SKUs during repeated seeding cycles | Initial seeding script lacked strict unique constraints and UPSERT deduplication | Restructured `database/seed.ts` with 106 distinct products with unique SKUs and names, confirmed via automated catalog uniqueness assertion | **CLOSED / VERIFIED** |
| **DEF-004** | **Medium (P3)** | Admin Dashboard | Admin test-report endpoint only served static text when report not generated | Missing dynamic routing and fallback between C# and JS Selenium HTML reports | Enhanced `/api/admin/test-report` in `admin.ts` with multi-framework query parameter support and automatic path resolution | **CLOSED / VERIFIED** |
| **DEF-005** | **Low (P4)** | Navigation | Missing accessible shortcut to QA Automation reports for evaluators | Admin dashboard link was nested only in account profile menu | Added top-level "Admin & Testing" link directly in main navbar for one-click access by recruiters and evaluators | **CLOSED / VERIFIED** |

---

## Detailed Root Cause Analysis (RCA)

### DEF-002: Automation Test Selector Staleness on Pre-Auth State
- **Problem Statement:** JavaScript Selenium test step `TC_JS_02` timed out waiting for selector `[data-testid='signin-button']`.
- **Root Cause:** To provide a friendly demo experience for first-time visitors, the client-side `AuthContext` automatically initialized a dummy demo user profile when no token was present. Consequently, the navigation bar immediately presented the signed-in user avatar menu rather than the sign-in modal trigger button.
- **Remediation:**
  1. Modified `src/context/AuthContext.tsx` so that an explicit user sign-out records `novamart_logged_out: true` in storage and halts unwanted auto-login rehydration.
  2. Enhanced `LoginPage.js` in `js-automation/pages/LoginPage.js` to inspect for the existing user session before triggering sign-in, proactively logging out if necessary.
- **Verification:** Both `TC_JS_02` and `TC_JS_03` executed and passed on Chromium headless with 0 timeout errors.
