import { Router } from 'express';
import { queryAll, queryOne, execute } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const ordersRouter = Router();

// Helper to generate realistic order ID e.g. NOVA-2026-48291
function generateOrderNumber(): string {
  const random5Digits = Math.floor(10000 + Math.random() * 90000);
  return `NOVA-2026-${random5Digits}`;
}

// POST /api/orders - Place order
ordersRouter.post('/orders', (req: AuthenticatedRequest, res, next) => {
  try {
    const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId || 'default_session';
    const userId = req.user?.id || null;

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod = 'UPI',
      items, // Optional if placing directly, otherwise loads from cart
    } = req.body;

    if (!customerName || !customerEmail || !shippingAddress) {
      return res.status(400).json({
        success: false,
        error: { message: 'Customer name, email, and shipping address are required', statusCode: 400 }
      });
    }

    let orderItemsToProcess: any[] = [];

    if (items && Array.isArray(items) && items.length > 0) {
      orderItemsToProcess = items;
    } else {
      // Fetch from cart
      const cart = queryOne<{ id: number }>('SELECT id FROM cart WHERE session_id = ?', [sessionId]);
      if (!cart) {
        return res.status(400).json({
          success: false,
          error: { message: 'Your cart is empty', statusCode: 400 }
        });
      }

      const cartRows = queryAll<any>(
        `SELECT ci.quantity, ci.product_id, p.name, p.price, p.discount_percent, p.image_url, p.stock
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.cart_id = ?`,
        [cart.id]
      );

      if (cartRows.length === 0) {
        return res.status(400).json({
          success: false,
          error: { message: 'Your cart is empty', statusCode: 400 }
        });
      }

      orderItemsToProcess = cartRows.map((row) => ({
        productId: row.product_id,
        productName: row.name,
        price: Math.round(row.price * (1 - (row.discount_percent || 0) / 100)),
        quantity: row.quantity,
        imageUrl: row.image_url
      }));
    }

    // Calculate totals
    const subtotal = orderItemsToProcess.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + shippingFee + tax;
    const orderNumber = generateOrderNumber();

    // Delivery estimate: 3 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const estimatedDelivery = `Estimated delivery by ${deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    // Insert Order
    const orderResult = execute(
      `INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, payment_method, payment_status, subtotal, discount, shipping_fee, tax, total_amount, order_status, estimated_delivery)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        userId,
        customerName,
        customerEmail,
        customerPhone || '+91 98765 43210',
        typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
        paymentMethod,
        paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        subtotal,
        0,
        shippingFee,
        tax,
        totalAmount,
        'Processing',
        estimatedDelivery
      ]
    );

    const orderId = orderResult.lastInsertRowid;

    // Insert Order Items and decrement stock
    for (const item of orderItemsToProcess) {
      execute(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.productName, item.price, item.quantity, item.imageUrl]
      );

      execute(
        `UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?`,
        [item.quantity, item.productId]
      );
    }

    // Clear cart if cart exists
    const cart = queryOne<{ id: number }>('SELECT id FROM cart WHERE session_id = ?', [sessionId]);
    if (cart) {
      execute('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
    }

    const createdOrder = queryOne<any>('SELECT * FROM orders WHERE id = ?', [orderId]);
    const itemsList = queryAll<any>('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...createdOrder,
        items: itemsList
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders - List user orders
ordersRouter.get('/orders', (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id || 1; // Default to demo user if not logged in

    const orders = queryAll<any>(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    const ordersWithItems = orders.map((order) => {
      const items = queryAll<any>('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      return {
        ...order,
        items
      };
    });

    res.status(200).json({
      success: true,
      orders: ordersWithItems
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id - Single order
ordersRouter.get('/orders/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const isOrderNumber = id.startsWith('NOVA-');

    const order = isOrderNumber
      ? queryOne<any>('SELECT * FROM orders WHERE order_number = ?', [id])
      : queryOne<any>('SELECT * FROM orders WHERE id = ?', [id]);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found', statusCode: 404 }
      });
    }

    const items = queryAll<any>('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    res.status(200).json({
      success: true,
      order: {
        ...order,
        items
      }
    });
  } catch (err) {
    next(err);
  }
});
