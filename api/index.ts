import type { Request, Response } from 'express';
import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req: Request, res: Response) {
  try {
    await connectDB();
  } catch (error) {
    console.error('[Vercel Serverless] Failed to connect to MongoDB Atlas:', error);
  }
  return app(req, res);
}
