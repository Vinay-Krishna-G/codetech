import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AuditService } from '../services/auditService.js';

export class AuthController {
  public static async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      if (!user.active) {
        res.status(403).json({
          success: false,
          message: 'Account is deactivated. Contact an administrator.',
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set HTTP-only Cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SECURE ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Audit Log
      await AuditService.log({
        actorId: user._id.toString(),
        actorEmail: user.email,
        action: 'LOGIN',
        metadata: { ip: req.ip, userAgent: req.headers['user-agent'] },
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('[AuthController.login] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login',
      });
    }
  }

  public static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (req.user) {
        await AuditService.log({
          actorId: req.user._id.toString(),
          actorEmail: req.user.email,
          action: 'LOGOUT',
          metadata: { ip: req.ip },
        });
      }

      res.clearCookie('token', {
        httpOnly: true,
        secure: env.COOKIE_SECURE,
        sameSite: env.COOKIE_SECURE ? 'none' : 'lax',
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error during logout',
      });
    }
  }

  public static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
}
