import { Router } from 'express';
import { queryOne, execute } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required', statusCode: 400 }
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = queryOne<any>('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password credentials', statusCode: 401 }
      });
    }

    // Generate token
    const token = `demo_user_${user.id}`;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        phone: user.phone,
        street: user.street,
        city: user.city,
        state: user.state,
        postalCode: user.postal_code
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/register
authRouter.post('/register', (req, res, next) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: { message: 'Full name, email, and password are required', statusCode: 400 }
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = queryOne('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existing) {
      return res.status(400).json({
        success: false,
        error: { message: 'An account with this email already exists', statusCode: 400 }
      });
    }

    const result = execute(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES (?, ?, ?, ?, 'customer')`,
      [cleanEmail, 'hashed_' + password, fullName, phone || '']
    );

    const newUser = queryOne<any>('SELECT * FROM users WHERE id = ?', [result.lastInsertRowid]);
    const token = `demo_user_${newUser.id}`;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        role: newUser.role,
        phone: newUser.phone
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
authRouter.get('/me', (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Not authenticated', statusCode: 401 }
      });
    }

    const user = queryOne<any>('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found', statusCode: 404 }
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        phone: user.phone,
        street: user.street,
        city: user.city,
        state: user.state,
        postalCode: user.postal_code
      }
    });
  } catch (err) {
    next(err);
  }
});
