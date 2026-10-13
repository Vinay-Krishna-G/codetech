import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid value for parameter: ${err.path}`,
    });
    return;
  }

  // Handle MongoDB Atlas connection / IP whitelist error
  if (
    err.name === 'MongooseServerSelectionError' ||
    err.message?.includes('whitelist') ||
    err.message?.includes('Could not connect to any servers')
  ) {
    res.status(503).json({
      success: false,
      message: 'Could not connect to MongoDB Atlas cluster. Please ensure that Network Access in MongoDB Atlas allows access from anywhere (0.0.0.0/0) for Vercel.',
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
