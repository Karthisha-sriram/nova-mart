import { getDb, execute, queryOne } from './db.js';
import { allProducts } from './productsCatalog.js';

export async function seedDatabase(forceRecreate = false) {
  await getDb();

  // 1. Seed Users if not present
  const userCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM users');
  if (!userCount || userCount.count === 0 || forceRecreate) {
    console.log('Seeding initial demo users...');
    execute(`
      INSERT OR REPLACE INTO users (id, email, password_hash, full_name, phone, role, street, city, state, postal_code)
      VALUES 
      (1, 'alex.sharma@example.com', 'demo_hash_pwd_123', 'Alex Sharma', '+91 98765 43210', 'customer', '402 Cyber Heights, HSR Layout', 'Bengaluru', 'Karnataka', '560102'),
      (2, 'admin@novamart.com', 'admin_hash_pwd_999', 'NovaMart Lead QA & Admin', '+91 91234 56789', 'admin', 'Tech Park North, Whitefield', 'Bengaluru', 'Karnataka', '560066');
    `);
  }

  // 2. Seed Categories (6 core departments)
  const catCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM categories');
  if (!catCount || catCount.count < 6 || forceRecreate) {
    console.log('Seeding departments taxonomy...');
    execute(`
      INSERT OR REPLACE INTO categories (id, slug, name, description, image_url, icon_name)
      VALUES 
      (1, 'electronics', 'Electronics', 'Next-gen audio, smart computing, and ultra-high fidelity visual displays.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'Headphones'),
      (2, 'fashion', 'Fashion', 'Contemporary streetwear, performance outerwear, and refined everyday staples.', 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&q=80', 'Shirt'),
      (3, 'home-living', 'Home & Living', 'Ergonomic lighting, minimalist desk setups, and acoustic living decor.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 'Lamp'),
      (4, 'fitness', 'Fitness', 'Precision biometric trackers, resistance gear, and dynamic athletic footwear.', 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&q=80', 'Activity'),
      (5, 'accessories', 'Accessories', 'Waterproof tech commuter backpacks, premium carry-alls, and modular sleeves.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'Briefcase'),
      (6, 'gadgets', 'Gadgets', 'High-precision wireless peripherals, rapid charging stations, and creative tools.', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', 'Cpu');
    `);
  }

  // 3. Seed Expanded Product Catalog (106 production-style products)
  console.log(`Seeding/updating product catalog (${allProducts.length} realistic products)...`);
  for (const p of allProducts) {
    execute(
      `INSERT OR REPLACE INTO products (id, sku, name, slug, description, category_id, price, discount_percent, stock, rating, review_count, image_url, additional_images, specifications, featured, is_new)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.sku,
        p.name,
        p.slug,
        p.description,
        p.category_id,
        p.price,
        p.discount_percent,
        p.stock,
        p.rating,
        p.review_count,
        p.image_url,
        p.additional_images,
        p.specifications,
        p.featured,
        p.is_new
      ]
    );
  }

  // Verify product uniqueness after seeding
  const uniquenessCheck = queryOne<{ total: number; uniqueSkus: number; uniqueSlugs: number; uniqueNames: number }>(`
    SELECT 
      COUNT(*) as total, 
      COUNT(DISTINCT sku) as uniqueSkus,
      COUNT(DISTINCT slug) as uniqueSlugs,
      COUNT(DISTINCT LOWER(TRIM(name))) as uniqueNames
    FROM products
  `);
  if (uniquenessCheck) {
    console.log(`Catalog uniqueness check passed: ${uniquenessCheck.total} products, ${uniquenessCheck.uniqueSkus} unique SKUs, ${uniquenessCheck.uniqueSlugs} unique slugs, ${uniquenessCheck.uniqueNames} canonical names.`);
    if (uniquenessCheck.total !== uniquenessCheck.uniqueSkus || uniquenessCheck.total !== uniquenessCheck.uniqueNames) {
      console.error('CRITICAL: Duplicate products detected in database catalog!');
    }
  }

  // 4. Seed Reviews if needed
  const reviewCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM reviews');
  if (!reviewCount || reviewCount.count === 0 || forceRecreate) {
    execute(`
      INSERT OR REPLACE INTO reviews (id, product_id, user_id, user_name, rating, comment, verified_purchase)
      VALUES
      (1, 1, 1, 'Kavita Reddy', 5, 'The active noise cancellation on NovaPods Pro is remarkable! Beats my previous high-end pair in call clarity and the case feel is incredible.', 1),
      (2, 1, NULL, 'Rahul Mehta', 5, 'Crystal clear soundstage and punchy bass. Connects instantly with both my phone and laptop.', 1),
      (3, 1, NULL, 'Sneha Patel', 4, 'Very comfortable for long work calls. Battery easily lasts 2 days of heavy usage.', 1),
      (4, 2, 1, 'Alex Sharma', 5, 'The AMOLED display is super bright outdoors under direct sunlight. Battery lasts well over 10 days.', 1),
      (5, 4, NULL, 'Vikram Malhotra', 5, 'UrbanFlex shoes are lightweight with unmatched rebound foam. Perfect for 10K runs.', 1),
      (6, 9, NULL, 'Ananya Das', 5, 'The typing feel on Titan Mechanical Keyboard is pure satisfaction. Gateron switches are buttery smooth.', 1),
      (7, 10, 1, 'Alex Sharma', 5, 'Astonishing color accuracy for my design work. 65W USB-C single cable setup keeps my desk super clean.', 1),
      (8, 25, NULL, 'Pooja Verma', 5, 'The fabric of Aura Maxi Dress is breathable and airy, perfect for summer brunches!', 1),
      (9, 41, 1, 'Alex Sharma', 5, 'NovaPhone 15 Pro titanium feel and 120Hz display are ultra responsive. Incredible battery life.', 1),
      (10, 68, NULL, 'Rohan Kapoor', 5, 'Hex Dumbbells have the best knurled chrome grip. Solid construction.', 1);
    `);
  }

  // 5. Seed Demo Orders if needed
  const orderCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM orders');
  if (!orderCount || orderCount.count === 0 || forceRecreate) {
    execute(`
      INSERT OR REPLACE INTO orders (id, order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, payment_method, payment_status, subtotal, discount, shipping_fee, tax, total_amount, order_status, estimated_delivery, created_at)
      VALUES
      (1, 'NOVA-2026-48291', 1, 'Alex Sharma', 'alex.sharma@example.com', '+91 98765 43210', '402 Cyber Heights, HSR Layout, Bengaluru, Karnataka - 560102', 'UPI', 'Paid', 3749.25, 0, 0, 187.46, 3936.71, 'Delivered', 'Delivered on Sep 02, 2026', '2026-08-30 14:22:00'),
      (2, 'NOVA-2026-31048', 1, 'Alex Sharma', 'alex.sharma@example.com', '+91 98765 43210', '402 Cyber Heights, HSR Layout, Bengaluru, Karnataka - 560102', 'Credit Card', 'Paid', 5199.20, 500, 0, 234.96, 4934.16, 'Out for Delivery', 'Expected Today by 7:00 PM', '2026-09-05 09:15:00'),
      (3, 'NOVA-2026-11842', 1, 'Alex Sharma', 'alex.sharma@example.com', '+91 98765 43210', '402 Cyber Heights, HSR Layout, Bengaluru, Karnataka - 560102', 'UPI', 'Paid', 2799.00, 0, 0, 139.95, 2938.95, 'Processing', 'Expected by Sep 10, 2026', '2026-09-06 18:40:00');
    `);

    execute(`
      INSERT OR REPLACE INTO order_items (id, order_id, product_id, product_name, price, quantity, image_url)
      VALUES
      (1, 1, 1, 'NovaPods Pro', 3749.25, 1, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'),
      (2, 2, 2, 'AeroWatch X', 5199.20, 1, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'),
      (3, 3, 5, 'NovaBook Backpack', 2239.20, 1, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80');
    `);
  }

  // 6. Seed Wishlist
  const wishlistCount = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM wishlist');
  if (!wishlistCount || wishlistCount.count === 0 || forceRecreate) {
    execute(`
      INSERT OR REPLACE INTO wishlist (id, user_id, session_id, product_id)
      VALUES
      (1, 1, 'demo_session_alex', 9),
      (2, 1, 'demo_session_alex', 10);
    `);
  }

  console.log('Database seeded successfully with expanded catalog!');
}
