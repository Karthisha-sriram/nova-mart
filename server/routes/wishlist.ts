import { Router } from 'express';
import { queryAll, queryOne, execute } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const wishlistRouter = Router();

// GET /api/wishlist
wishlistRouter.get('/wishlist', (req: AuthenticatedRequest, res, next) => {
  try {
    const sessionId = (req.headers['x-session-id'] as string) || req.query.sessionId as string || 'default_session';
    const userId = req.user?.id || 1;

    const items = queryAll<any>(
      `SELECT w.id as wishlist_id, w.created_at as added_at,
              p.id as product_id, p.name, p.slug, p.price, p.discount_percent, p.stock, p.rating, p.review_count, p.image_url,
              c.name as category_name
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       WHERE w.user_id = ? OR w.session_id = ?
       ORDER BY w.id DESC`,
      [userId, sessionId]
    );

    const formatted = items.map((p) => ({
      id: p.wishlist_id,
      productId: p.product_id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      discountPercent: p.discount_percent,
      discountedPrice: Math.round(p.price * (1 - (p.discount_percent || 0) / 100)),
      stock: p.stock,
      rating: p.rating,
      reviewCount: p.review_count,
      imageUrl: p.image_url,
      categoryName: p.category_name,
      addedAt: p.added_at
    }));

    res.status(200).json({
      success: true,
      wishlist: formatted
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/wishlist
wishlistRouter.post('/wishlist', (req: AuthenticatedRequest, res, next) => {
  try {
    const sessionId = (req.headers['x-session-id'] as string) || req.body.sessionId || 'default_session';
    const userId = req.user?.id || 1;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product ID is required', statusCode: 400 }
      });
    }

    const product = queryOne<any>('SELECT id, name FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: 'Product not found', statusCode: 404 }
      });
    }

    const existing = queryOne<any>(
      'SELECT id FROM wishlist WHERE (user_id = ? OR session_id = ?) AND product_id = ?',
      [userId, sessionId, productId]
    );

    if (!existing) {
      execute(
        'INSERT INTO wishlist (user_id, session_id, product_id) VALUES (?, ?, ?)',
        [userId, sessionId, productId]
      );
    }

    res.status(201).json({
      success: true,
      message: `Added ${product.name} to wishlist`,
      productId
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/wishlist/:id
wishlistRouter.delete('/wishlist/:id', (req: AuthenticatedRequest, res, next) => {
  try {
    const sessionId = (req.headers['x-session-id'] as string) || req.query.sessionId as string || 'default_session';
    const userId = req.user?.id || 1;
    const targetId = parseInt(req.params.id, 10);

    // Can delete by either wishlist ID or product ID
    execute(
      'DELETE FROM wishlist WHERE (id = ? OR product_id = ?) AND (user_id = ? OR session_id = ?)',
      [targetId, targetId, userId, sessionId]
    );

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist'
    });
  } catch (err) {
    next(err);
  }
});
