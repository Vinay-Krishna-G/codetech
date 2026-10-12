import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User, IUser } from '../models/User.js';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticateJwt = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No session token found.',
      });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };

    const user = await User.findById(decoded.userId);
    if (!user || !user.active) {
      res.status(401).json({
        success: false,
        message: 'User session is invalid or account is deactivated.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !['admin', 'superadmin'].includes(req.user.role)) {
    res.status(403).json({
      success: false,
      message: 'Forbidden. Administrator privileges required.',
    });
    return;
  }
  next();
};
