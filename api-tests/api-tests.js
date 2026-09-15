import assert from 'node:assert';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runApiTests() {
  console.log('====================================================');
  console.log('🧪 Starting NOVA MART Backend REST API Test Suite');
  console.log(`🌐 Target: ${BASE_URL}`);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;
  let sessionCookie = '';

  async function test(name, fn) {
    const start = Date.now();
    try {
      process.stdout.write(`⏳ API Test: ${name}... `);
      await fn();
      const dur = Date.now() - start;
      console.log(`\x1b[32mPASSED\x1b[0m (${dur}ms)`);
      passed++;
    } catch (err) {
      const dur = Date.now() - start;
      console.log(`\x1b[31mFAILED\x1b[0m (${dur}ms)`);
      console.error(`   Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await test('GET /api/health - Server health and diagnostics', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.ok(data.database);
  });

  // 2. Products Pagination
  await test('GET /api/products - Paginated product catalog listing', async () => {
    const res = await fetch(`${BASE_URL}/api/products?page=1&limit=12`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.products));
    assert.ok(data.products.length > 0);
    assert.ok(data.pagination);
    assert.strictEqual(data.pagination.limit, 12);
  });

  // 3. Catalog SKU & Name Uniqueness Verification (Prompt Mandate)
  await test('VERIFY CATALOG INTEGRITY - All seeded catalog products have strictly unique SKUs', async () => {
    const res = await fetch(`${BASE_URL}/api/products?limit=200`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    const items = data.products;
    assert.ok(items.length >= 24, `Expected at least 24 seeded products, found ${items.length}`);
    
    const skus = new Set(items.map(p => p.sku));
    const names = new Set(items.map(p => p.name));
    assert.strictEqual(skus.size, items.length, `Duplicate SKUs detected! ${items.length} items but only ${skus.size} unique SKUs.`);
    assert.strictEqual(names.size, items.length, `Duplicate product names detected! ${items.length} items but only ${names.size} unique names.`);
  });

  // 4. Product Details
  await test('GET /api/products/:id - Single product with specifications', async () => {
    const res = await fetch(`${BASE_URL}/api/products/1`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.product);
    assert.strictEqual(data.product.id, 1);
    assert.ok(data.product.sku);
    assert.ok(data.product.price > 0);
  });

  // 5. Product Search
  await test('GET /api/products?search=NovaPods - Keyword search filter', async () => {
    const res = await fetch(`${BASE_URL}/api/products?search=NovaPods`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.products.length >= 1);
    assert.ok(data.products.some(p => p.name.includes('NovaPods')));
  });

  // 6. Categories Listing
  await test('GET /api/categories - Full categories taxonomy list', async () => {
    const res = await fetch(`${BASE_URL}/api/categories`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.categories));
    assert.ok(data.categories.length >= 4);
    assert.ok(data.categories.some(c => c.slug === 'electronics'));
  });

  // 7. Auth: Valid Login
  await test('POST /api/auth/login - Valid credentials authentication', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alex.sharma@example.com',
        password: 'demo_hash_pwd_123'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.user);
    assert.strictEqual(data.user.email, 'alex.sharma@example.com');

    // Extract cookie if returned
    const cookieHeader = res.headers.get('set-cookie');
    if (cookieHeader) {
      sessionCookie = cookieHeader.split(';')[0];
    }
  });

  // 8. Auth: Invalid Login
  await test('POST /api/auth/login - Invalid credentials returns 401 error', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nobody@nowhere.test',
        password: 'incorrect_password_xyz'
      })
    });
    assert.strictEqual(res.status, 401);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  // 9. Auth: New User Registration
  await test('POST /api/auth/register - Create new user account', async () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Virtusa Tester',
        email: `qa.${randomId}@example.com`,
        password: 'SecurePassword123!',
        phone: '+91 99999 88888'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.user.id);
  });

  // 10. Cart: Fetch Cart
  await test('GET /api/cart - Retrieve shopping session cart', async () => {
    const res = await fetch(`${BASE_URL}/api/cart`, {
      headers: sessionCookie ? { Cookie: sessionCookie } : {}
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.cart);
    assert.ok(typeof data.cart.itemCount === 'number');
  });

  // 11. Cart: Add Item to Cart
  let addedCartItemId = null;
  await test('POST /api/cart - Add item to cart with quantity', async () => {
    const res = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionCookie ? { Cookie: sessionCookie } : {})
      },
      body: JSON.stringify({
        productId: 1,
        quantity: 2
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.cart.items.length > 0);
    const item = data.cart.items.find(i => i.productId === 1);
    assert.ok(item, 'Item 1 should be in cart');
    addedCartItemId = item.id;
  });

  // 12. Cart: Update Item Quantity
  await test('PUT /api/cart/:id - Update item quantity in cart', async () => {
    if (!addedCartItemId) return;
    const res = await fetch(`${BASE_URL}/api/cart/${addedCartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionCookie ? { Cookie: sessionCookie } : {})
      },
      body: JSON.stringify({ quantity: 3 })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  // 13. Orders: Place Order
  let placedOrderNumber = null;
  await test('POST /api/orders - Place and authorize new order', async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionCookie ? { Cookie: sessionCookie } : {})
      },
      body: JSON.stringify({
        customerName: 'API Test User',
        customerEmail: 'api.tester@novamart.com',
        customerPhone: '+91 91234 56789',
        shippingAddress: '42 Silicon Highway, Cyber City, Hyderabad, 500081',
        paymentMethod: 'Credit Card (Visa)'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.order);
    assert.ok(data.order.order_number);
    placedOrderNumber = data.order.order_number;
  });

  // 14. Orders: Query Order by Order Number
  await test('GET /api/orders/:orderNumber - Fetch order confirmation by reference', async () => {
    if (!placedOrderNumber) return;
    const res = await fetch(`${BASE_URL}/api/orders/${placedOrderNumber}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.order.order_number, placedOrderNumber);
    assert.strictEqual(data.order.customer_name, 'API Test User');
  });

  // 15. Admin Stats
  await test('GET /api/admin/stats - QA diagnostics and database metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/stats`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.stats.totalProducts >= 24);
    assert.ok(data.testingStatus);
  });

  console.log('\n====================================================');
  console.log(`📊 API Test Summary: ${passed} Passed, ${failed} Failed out of ${passed + failed} Tests`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runApiTests().catch(err => {
  console.error('Fatal API test error:', err);
  process.exit(1);
});
