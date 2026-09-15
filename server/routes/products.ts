import { Router } from 'express';
import { queryAll, queryOne } from '../database/db.js';

export const productsRouter = Router();

// GET /api/categories
productsRouter.get('/categories', (req, res, next) => {
  try {
    const categories = queryAll<any>(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.id ASC
    `);

    res.status(200).json({
      success: true,
      categories
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products
productsRouter.get('/products', (req, res, next) => {
  try {
    const {
      search,
      q,
      category,
      minPrice,
      maxPrice,
      rating,
      inStock,
      discount,
      featured,
      sort = 'featured',
      page = '1',
      limit = '12'
    } = req.query;

    const searchTerm = (search || q || '') as string;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(200, parseInt(limit as string, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: any[] = [];

    if (searchTerm.trim()) {
      conditions.push('(LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(c.name) LIKE ?)');
      const wild = `%${searchTerm.trim().toLowerCase()}%`;
      params.push(wild, wild, wild);
    }

    if (category && category !== 'all') {
      if (!isNaN(Number(category))) {
        conditions.push('p.category_id = ?');
        params.push(Number(category));
      } else {
        conditions.push('LOWER(c.slug) = ?');
        params.push(String(category).toLowerCase());
      }
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      conditions.push('p.price >= ?');
      params.push(Number(minPrice));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      conditions.push('p.price <= ?');
      params.push(Number(maxPrice));
    }

    if (rating && !isNaN(Number(rating))) {
      conditions.push('p.rating >= ?');
      params.push(Number(rating));
    }

    if (inStock === 'true' || inStock === '1') {
      conditions.push('p.stock > 0');
    }

    if (discount && !isNaN(Number(discount))) {
      conditions.push('p.discount_percent >= ?');
      params.push(Number(discount));
    }

    if (featured === 'true' || featured === '1') {
      conditions.push('p.featured = 1');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    let orderBy = 'p.featured DESC, p.rating DESC';
    switch (sort) {
      case 'price_asc':
        orderBy = 'p.price ASC';
        break;
      case 'price_desc':
        orderBy = 'p.price DESC';
        break;
      case 'rating_desc':
        orderBy = 'p.rating DESC';
        break;
      case 'newest':
        orderBy = 'p.created_at DESC';
        break;
      case 'discount_desc':
        orderBy = 'p.discount_percent DESC';
        break;
      default:
        orderBy = 'p.featured DESC, p.id ASC';
    }

    // Total count
    const countSql = `
      SELECT COUNT(*) as count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const countResult = queryOne<{ count: number }>(countSql, params);
    const total = countResult ? countResult.count : 0;

    // Items query
    const dataSql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    const items = queryAll<any>(dataSql, [...params, limitNum, offset]);

    // Parse JSON fields
    const formattedProducts = items.map((p) => ({
      ...p,
      discounted_price: Math.round(p.price * (1 - (p.discount_percent || 0) / 100)),
      additional_images: p.additional_images ? JSON.parse(p.additional_images) : [],
      specifications: p.specifications ? JSON.parse(p.specifications) : {}
    }));

    res.status(200).json({
      success: true,
      products: formattedProducts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
productsRouter.get('/products/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const isNumeric = !isNaN(Number(id));

    const sql = isNumeric
      ? `SELECT p.*, c.name as category_name, c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = ?`
      : `SELECT p.*, c.name as category_name, c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.slug = ?`;

    const product = queryOne<any>(sql, [id]);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { message: 'Product not found', statusCode: 404 }
      });
    }

    // Fetch reviews for this product
    const reviews = queryAll<any>(
      `SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC`,
      [product.id]
    );

    // Fetch related products from same category
    const related = queryAll<any>(
      `SELECT id, name, slug, price, discount_percent, image_url, rating, review_count, stock
       FROM products
       WHERE category_id = ? AND id != ?
       LIMIT 4`,
      [product.category_id, product.id]
    ).map(p => ({
      ...p,
      discounted_price: Math.round(p.price * (1 - (p.discount_percent || 0) / 100))
    }));

    const response = {
      ...product,
      discounted_price: Math.round(product.price * (1 - (product.discount_percent || 0) / 100)),
      additional_images: product.additional_images ? JSON.parse(product.additional_images) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      reviews,
      related
    };

    res.status(200).json({
      success: true,
      product: response
    });
  } catch (err) {
    next(err);
  }
});
