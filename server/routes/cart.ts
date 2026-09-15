import { Router } from 'express';
import { queryAll, queryOne, execute } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const cartRouter = Router();

function getOrCreateCartId(sessionId: string, userId?: number): number {
  let cart = queryOne<{ id: number }>('SELECT id FROM cart WHERE session_id = ?', [sessionId]);
  if (!cart) {
    const result = execute(
      'INSERT INTO cart (session_id, user_id) VALUES (?, ?)',
      [sessionId, userId || null]
    );
    return result.lastInsertRowid;
  }
  if (userId) {
    execute('UPDATE cart SET user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [userId, cart.id]);
  }
  return cart.id;
}

function calculateCartTotals(cartId: number) {
  const items = queryAll<any>(
    `SELECT ci.id as item_id, ci.quantity, ci.product_id,
            p.name, p.slug, p.price, p.discount_percent, p.stock, p.image_url,
            c.name as category_name
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     JOIN categories c ON p.category_id = c.id
     WHERE ci.cart_id = ?
     ORDER BY ci.id DESC`,
    [cartId]
  );

  let subtotal = 0;
  let originalTotal = 0;

  const formattedItems = items.map((item) => {
    const discountedPrice = Math.round(item.price * (1 - (item.discount_percent || 0) / 100));
    const lineTotal = discountedPrice * item.quantity;
    const lineOriginal = item.price * item.quantity;

    subtotal += lineTotal;
    originalTotal += lineOriginal;

    return {
      id: item.item_id,
      productId: item.product_id,
      name: item.name,
      slug: item.slug,
      originalPrice: item.price,
      discountedPrice,
      discountPercent: item.discount_percent,
      quantity: item.quantity,
      stock: item.stock,
      imageUrl: item.image_url,
      categoryName: item.category_name,
      lineTotal
    };
  });

  const totalDiscount = Math.max(0, originalTotal - subtotal);
  const freeShippingThreshold = 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + shippingFee + tax;

  return {
    items: formattedItems,
    itemCount: formattedItems.reduce((sum, item) => sum + item.quantity, 0),
    originalTotal,
    subtotal,
    totalDiscount,
    shippingFee,
    tax,
    grandTotal,
    freeShippingThreshold,
    freeShippingUnlocked: subtotal >= freeShippingThreshold,
    amountNeededForFreeShipping: Math.max(0, freeShippingThreshold - subtotal)
  };
}

// GET /api/cart
cartRouter.get('/cart', (req: AuthenticatedRequest, res, next) => {
  try {
    const sessionId = (req.headers['x-session-id'] as string) || req.query.sessionId as string || 'default_session';
    const userId = req.user?.id;
    const cartId = getOrCreateCartId(sessionId, userId);
    const cartData = calculateCartTotals(cartId);

    res.status(200).json({
      success: true,
      cart: cartData
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/cart
cartRouter.post('/cart', (req: AuthenticatedRequest, res, next) => {
  try {
    const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId || 'default_session';
    const userId = req.user?.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product ID is required', statusCode: 400 }
      });
    }

    const product = queryOne<any>('SELECT id, stock, name FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: 'Product not found', statusCode: 404 }
      });
    }

    const cartId = getOrCreateCartId(sessionId, userId);
    const existing = queryOne<any>(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    const qtyToAdd = Math.max(1, parseInt(quantity, 10));

    if (existing) {
      const newQty = existing.quantity + qtyToAdd;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          error: { message: `Only ${product.stock} units currently in stock`, statusCode: 400 }
        });
      }
      execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing.id]);
    } else {
      if (qtyToAdd > product.stock) {
        return res.status(400).json({
          success: false,
          error: { message: `Only ${product.stock} units currently in stock`, statusCode: 400 }
        });
      }
      execute(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, qtyToAdd]
      );
    }

    const updatedCart = calculateCartTotals(cartId);
    res.status(200).json({
      success: true,
      message: `Added ${product.name} to cart`,
      cart: updatedCart
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/cart/:id
cartRouter.put('/cart/:id', (req: AuthenticatedRequest, res, next) => {
  try {
    const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId || 'default_session';
    const userId = req.user?.id;
    const itemId = parseInt(req.params.id, 10);
    const { quantity } = req.body;

    const cartId = getOrCreateCartId(sessionId, userId);
    const item = queryOne<any>(
      'SELECT ci.id, ci.product_id, p.stock FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.id = ? AND ci.cart_id = ?',
      [itemId, cartId]
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        error: { message: 'Cart item not found', statusCode: 404 }
      });
    }

    const newQty = parseInt(quantity, 10);
    if (newQty <= 0) {
      execute('DELETE FROM cart_items WHERE id = ?', [itemId]);
    } else {
      if (newQty > item.stock) {
        return res.status(400).json({
          success: false,
          error: { message: `Only ${item.stock} units available in stock`, statusCode: 400 }
        });
      }
      execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, itemId]);
    }

    const updatedCart = calculateCartTotals(cartId);
    res.status(200).json({
      success: true,
      cart: updatedCart
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/:id
cartRouter.delete('/cart/:id', (req: AuthenticatedRequest, res, next) => {
  try {
    const sessionId = (req.headers['x-session-id'] as string) || req.query.sessionId as string || 'default_session';
    const userId = req.user?.id;
    const itemId = parseInt(req.params.id, 10);

    const cartId = getOrCreateCartId(sessionId, userId);
    execute('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [itemId, cartId]);

    const updatedCart = calculateCartTotals(cartId);
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedCart
    });
  } catch (err) {
    next(err);
  }
});
