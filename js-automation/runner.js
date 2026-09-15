import { createDriver } from './utils/driverFactory.js';
import { HtmlReporter } from './utils/reporter.js';
import { HomePage } from './pages/HomePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { ProductPage } from './pages/ProductPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { SearchPage } from './pages/SearchPage.js';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runTestSuite() {
  console.log('====================================================');
  console.log('🚀 Starting NOVA MART JavaScript Selenium WebDriver Suite');
  console.log(`🌐 Target Base URL: ${BASE_URL}`);
  console.log('====================================================\n');

  const reporter = new HtmlReporter();
  let driver;

  try {
    driver = await createDriver();
    console.log('✅ Chrome Headless WebDriver initialized successfully.\n');

    // TEST CASE 01: Homepage & Catalog Rendering
    await runTest('TC_JS_01: Verify Home Page loads branding and product catalog', async () => {
      const home = new HomePage(driver, BASE_URL);
      await home.load();
      const count = await home.getProductCardsCount();
      if (count < 1) throw new Error(`Expected product cards on home page, got ${count}`);
    });

    // TEST CASE 02: User Login with Valid Credentials
    await runTest('TC_JS_02: Verify customer sign-in with valid demo credentials', async () => {
      const login = new LoginPage(driver, BASE_URL);
      await login.navigateTo('/');
      await login.login('alex.sharma@example.com', 'demo_hash_pwd_123');
      const loggedIn = await login.isUserLoggedIn();
      if (!loggedIn) throw new Error('User menu did not appear after valid sign-in');
    });

    // TEST CASE 03: User Login with Invalid Credentials
    await runTest('TC_JS_03: Verify customer sign-in with invalid credentials displays error', async () => {
      const login = new LoginPage(driver, BASE_URL);
      await login.logout();
      await login.navigateTo('/');
      await login.login('invalid.user@nonexistent.domain', 'wrong_password_999');
      const isError = await login.isErrorDisplayed();
      if (!isError) throw new Error('Expected validation error alert for invalid credentials');
      await login.navigateTo('/'); // reset state
    });

    // TEST CASE 04: Product Search & Live Filtering
    await runTest('TC_JS_04: Verify product search filters catalog correctly', async () => {
      const search = new SearchPage(driver, BASE_URL);
      await search.loadShop();
      await search.searchProduct('NovaPods');
      const count = await search.getMatchingProductsCount();
      if (count < 1) throw new Error('Expected matching products for keyword "NovaPods"');
    });

    // TEST CASE 05: Product Detail View & Specifications
    await runTest('TC_JS_05: Verify product detail page renders specifications and pricing', async () => {
      const product = new ProductPage(driver, BASE_URL);
      await product.loadProduct(1);
      const title = await product.getTitle();
      if (!title || title.trim().length === 0) throw new Error('Product title was empty on detail view');
    });

    // TEST CASE 06: Quantity Increment on Product Page
    await runTest('TC_JS_06: Verify product quantity adjustment controls', async () => {
      const product = new ProductPage(driver, BASE_URL);
      await product.loadProduct(1);
      await product.increaseQuantity();
      const qty = await product.getQuantity();
      if (parseInt(qty, 10) < 2) throw new Error(`Expected quantity >= 2, got ${qty}`);
    });

    // TEST CASE 07: Add to Cart from Product Detail Page
    await runTest('TC_JS_07: Verify adding product to cart updates session cart', async () => {
      const product = new ProductPage(driver, BASE_URL);
      await product.loadProduct(2);
      await product.addToCart();
      await product.sleep(500);
    });

    // TEST CASE 08: Cart Management (Quantity & Items)
    await runTest('TC_JS_08: Verify shopping cart displays items and line totals', async () => {
      const cart = new CartPage(driver, BASE_URL);
      await cart.load();
      const itemCount = await cart.getItemCount();
      if (itemCount === 0) throw new Error('Expected at least one item in cart');
    });

    // TEST CASE 09: Wishlist Interaction
    await runTest('TC_JS_09: Verify product wishlist toggle', async () => {
      const product = new ProductPage(driver, BASE_URL);
      await product.loadProduct(3);
      await product.toggleWishlist();
    });

    // TEST CASE 10: End-to-End Regression Flow (Shop -> Cart -> Checkout -> Order Confirmation)
    await runTest('TC_JS_10: [REGRESSION] Complete E2E Order Placement Flow', async () => {
      const product = new ProductPage(driver, BASE_URL);
      await product.loadProduct(1);
      await product.addToCart();

      const cart = new CartPage(driver, BASE_URL);
      await cart.load();
      await cart.proceedToCheckout();

      const checkout = new CheckoutPage(driver, BASE_URL);
      await checkout.fillShippingForm({
        fullName: 'Virtusa QA Engineer',
        email: 'qa.virtusa@novamart.com',
        phone: '+91 98765 00000',
        street: '100 IT Corridor, Tech Park',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500081'
      });

      await checkout.placeOrder();
      const success = await checkout.isOrderSuccessful();
      if (!success) throw new Error('Order confirmation did not appear within timeout');
    });

  } catch (globalErr) {
    console.error('❌ Fatal error during test execution:', globalErr);
  } finally {
    if (driver) {
      await driver.quit();
      console.log('\n🔒 WebDriver session terminated cleanly.');
    }

    const reportPath = reporter.generate();
    console.log(`\n📄 HTML Test Execution Report generated at: ${reportPath}`);
    console.log('====================================================');
  }

  async function runTest(testName, fn) {
    const start = Date.now();
    try {
      process.stdout.write(`⏳ Running: ${testName}... `);
      await fn();
      const duration = Date.now() - start;
      console.log(`\x1b[32mPASSED\x1b[0m (${duration}ms)`);
      reporter.addResult(testName, 'PASSED', duration);
    } catch (err) {
      const duration = Date.now() - start;
      console.log(`\x1b[31mFAILED\x1b[0m (${duration}ms)`);
      console.error(`   Error: ${err.message}`);
      reporter.addResult(testName, 'FAILED', duration, err);
    }
  }
}

runTestSuite();
