import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { getDb } from './server/database/db.js';
import { seedDatabase } from './server/database/seed.js';
import { optionalAuth } from './server/middleware/auth.js';
import { errorHandler } from './server/middleware/errorHandler.js';
import { authRouter } from './server/routes/auth.js';
import { productsRouter } from './server/routes/products.js';
import { cartRouter } from './server/routes/cart.js';
import { ordersRouter } from './server/routes/orders.js';
import { wishlistRouter } from './server/routes/wishlist.js';
import { reviewsRouter } from './server/routes/reviews.js';
import { adminRouter } from './server/routes/admin.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize and seed SQLite database
  await getDb();
  await seedDatabase();

  // Standard middleware
  app.use(express.json());
  app.use(optionalAuth);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'NOVA MART E-Commerce Backend',
      version: '1.0.0',
      database: 'SQLite (Azure SQL Compatible)',
      timestamp: new Date().toISOString()
    });
  });

  // REST API Routes
  app.use('/api/auth', authRouter);
  app.use('/api', productsRouter);
  app.use('/api', cartRouter);
  app.use('/api', ordersRouter);
  app.use('/api', wishlistRouter);
  app.use('/api', reviewsRouter);
  app.use('/api/admin', adminRouter);

  // Centralized Error Handler for APIs
  app.use('/api', errorHandler);

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOVA MART Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start NOVA MART server:', err);
  process.exit(1);
});
