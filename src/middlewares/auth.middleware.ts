import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

/**
 * Verifies the JWT token and attaches user info to the request.
 * Any authenticated user (including admin) passes this check.
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authorized. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string; role: string };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Not authorized. Invalid token.', 401));
  }
};

/**
 * Ensures the authenticated user has the ADMIN role.
 * Must be used AFTER the `protect` middleware.
 */
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }
  next();
};
