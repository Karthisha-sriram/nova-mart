# NOVA MART — Test Cases Specification Matrix

**Standard:** Virtusa Enterprise Quality Engineering  
**Total Documented Test Cases:** 25  
**Coverage:** UI, API, Authentication, Cart, Checkout, Admin, Search, Catalog  

---

| Test Case ID | Category | Description | Pre-conditions | Test Steps | Test Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | Auth | Valid User Sign-In | User exists in database | 1. Click Sign In<br>2. Enter email & password<br>3. Submit form | `alex.sharma@example.com` / `demo_hash_pwd_123` | User menu appears; profile loaded; session persisted | **PASS** |
| **TC-AUTH-02** | Auth | Invalid Credentials Rejection | App loaded | 1. Click Sign In<br>2. Enter incorrect password<br>3. Submit form | `alex.sharma@example.com` / `wrong_password` | Error alert displayed; user remains unauthenticated | **PASS** |
| **TC-AUTH-03** | Auth | Empty Form Field Validation | App loaded | 1. Open login modal<br>2. Leave inputs empty<br>3. Click Sign In | None | HTML5 / custom validation blocks submission | **PASS** |
| **TC-AUTH-04** | Auth | New User Registration | App loaded | 1. Open modal & switch to register<br>2. Enter details<br>3. Submit | Name: `QA Engineer`, Email: `qa.<uuid>@example.com` | Account created; automatically signed in; token stored | **PASS** |
| **TC-AUTH-05** | Auth | User Sign-Out | User is logged in | 1. Open user dropdown<br>2. Click Sign Out | N/A | Token cleared; UI updates to unauthenticated state | **PASS** |
| **TC-CAT-01** | Catalog | Seeded Catalog Integrity & Uniqueness | Database initialized | 1. Query full product catalog<br>2. Compute unique SKUs and names | 106 catalog items | Exactly 106 items with 106 unique SKUs and names | **PASS** |
| **TC-CAT-02** | Catalog | Pagination Controls | On `/shop` page | 1. Verify items on page 1<br>2. Click page 2<br>3. Verify offset | Limit: 12 per page | Page 2 displays items 13-24; URL query reflects `page=2` | **PASS** |
| **TC-CAT-03** | Catalog | Category Taxonomy Filter | On `/shop` page | 1. Select 'Electronics'<br>2. Observe product list | Category: `electronics` | Only electronics items displayed | **PASS** |
| **TC-CAT-04** | Catalog | Price Slider Boundary | On `/shop` page | 1. Drag slider to ₹10,000<br>2. Verify items | Max price: 10,000 | All visible products have price <= ₹10,000 | **PASS** |
| **TC-CAT-05** | Catalog | Multi-Criteria Sort | On `/shop` page | 1. Select 'Price: Low to High'<br>2. Verify prices order | Sort: `price_asc` | Products sorted in ascending order of price | **PASS** |
| **TC-SRCH-01** | Search | Modal Live Search with Debounce | On home page | 1. Click search or press ⌘K<br>2. Type 'NovaPods'<br>3. Check dropdown | Keyword: `NovaPods` | Matching live suggestions appear in real time | **PASS** |
| **TC-SRCH-02** | Search | Catalog Keyword Filtering | On `/shop` page | 1. Type keyword into shop search<br>2. Press Enter | Keyword: `Mechanical Keyboard` | Filtered list matches keyboard products | **PASS** |
| **TC-PROD-01** | Product | Detail Page Specifications | App loaded | 1. Click product card #1<br>2. Inspect specs table | Product ID: 1 | Detailed specifications, rating breakdown, stock status rendered | **PASS** |
| **TC-PROD-02** | Product | Quantity Selector | On product detail page | 1. Click '+' button<br>2. Verify input value | Initial: 1 | Quantity increases to 2; price updates accordingly | **PASS** |
| **TC-PROD-03** | Product | Add to Wishlist Toggle | On product detail page | 1. Click Heart button<br>2. Verify wishlist badge | Product ID: 2 | Item added to wishlist; badge increments | **PASS** |
| **TC-CART-01** | Cart | Add to Cart from Detail Page | On product page | 1. Select quantity 2<br>2. Click 'Add to Cart' | Product ID: 1 | Navbar cart badge increments; toast notification appears | **PASS** |
| **TC-CART-02** | Cart | Real-time Quantity Modification | In cart page | 1. Click quantity increase '+'<br>2. Observe line total | Item in cart | Line total updates instantaneously; grand total recalculated | **PASS** |
| **TC-CART-03** | Cart | Remove Item from Cart | In cart page | 1. Click trash/remove icon<br>2. Verify item removed | Item in cart | Item removed; total updated; empty state if 0 items | **PASS** |
| **TC-CART-04** | Cart | Coupon Code Discount Application | In cart page | 1. Enter coupon code<br>2. Click Apply | Coupon: `NOVA20` (20% off) | 20% discount subtracted from subtotal | **PASS** |
| **TC-CART-05** | Cart | Free Shipping Tier Threshold | In cart page | 1. Cart subtotal >= ₹999<br>2. Check shipping fee | Subtotal: ₹1,500 | Shipping displayed as FREE (₹0) | **PASS** |
| **TC-CHK-01** | Checkout | Shipping Form Required Validations | Cart has items | 1. Proceed to checkout<br>2. Leave required fields empty<br>3. Submit | Empty form | Validation error flags missing address & phone | **PASS** |
| **TC-CHK-02** | Checkout | Order Placement & Confirmation | In checkout page | 1. Fill shipping details<br>2. Select Payment<br>3. Click Place Order | Valid Indian address | Order confirmed; unique `NOVA-2026-XXXXX` assigned | **PASS** |
| **TC-CHK-03** | Checkout | Inventory Stock Decrement | Order placed | 1. Check stock of ordered item in database | Product ID: 1 | Stock quantity reduced by purchased quantity | **PASS** |
| **TC-ADM-01** | Admin | System Metrics & Inventory Warnings | In `/admin` | 1. Inspect low-stock alerts and revenue cards | Admin session | Low-stock items displayed (< 25 units); revenue tallied | **PASS** |
| **TC-ADM-02** | Admin | Live Automation Report Viewer | In `/admin` | 1. Click 'Selenium Test Report' tab | Test report generated | Interactive HTML report rendered with execution stats | **PASS** |
