import { Router } from 'express';
import { queryAll, queryOne, execute } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const reviewsRouter = Router();

// GET /api/reviews
reviewsRouter.get('/reviews', (req, res, next) => {
  try {
    const { productId } = req.query;
    let sql = 'SELECT * FROM reviews';
    const params: any[] = [];

    if (productId && !isNaN(Number(productId))) {
      sql += ' WHERE product_id = ? ORDER BY created_at DESC';
      params.push(Number(productId));
    } else {
      sql += ' ORDER BY created_at DESC LIMIT 50';
    }

    const reviews = queryAll<any>(sql, params);
    res.status(200).json({
      success: true,
      reviews
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews
reviewsRouter.post('/reviews', (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id || null;
    const { productId, userName, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: { message: 'Product ID, rating, and comment are required', statusCode: 400 }
      });
    }

    const numericRating = Math.max(1, Math.min(5, parseInt(rating, 10)));
    const reviewerName = userName?.trim() || req.user?.fullName || 'Verified Customer';

    const insertResult = execute(
      `INSERT INTO reviews (product_id, user_id, user_name, rating, comment, verified_purchase)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [productId, userId, reviewerName, numericRating, comment.trim()]
    );

    // Recalculate average rating & review_count
    const stats = queryOne<{ avgRating: number; count: number }>(
      'SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE product_id = ?',
      [productId]
    );

    if (stats) {
      const formattedAvg = Math.round((stats.avgRating || numericRating) * 10) / 10;
      execute(
        'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
        [formattedAvg, stats.count, productId]
      );
    }

    const newReview = queryOne<any>('SELECT * FROM reviews WHERE id = ?', [insertResult.lastInsertRowid]);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview
    });
  } catch (err) {
    next(err);
  }
});
