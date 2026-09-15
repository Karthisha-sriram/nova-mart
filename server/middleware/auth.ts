import { Request, Response, NextFunction } from 'express';
import { queryOne } from '../database/db.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    // For demo simplicity, tokens encode user id or email
    let userId: number | null = null;
    if (token.startsWith('demo_user_')) {
      userId = parseInt(token.replace('demo_user_', ''), 10);
    } else if (token === 'admin_token') {
      userId = 2;
    } else {
      // Decode standard base64 or string
      const parsed = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      userId = parsed.userId;
    }

    if (userId) {
      const user = queryOne<{ id: number; email: string; full_name: string; role: string }>(
        'SELECT id, email, full_name, role FROM users WHERE id = ?',
        [userId]
      );
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        };
      }
    }
  } catch (err) {
    // Ignore invalid tokens for optional auth
  }

  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required. Please sign in to continue.',
        statusCode: 401
      }
    });
  }
  next();
}
