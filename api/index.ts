import type { IncomingMessage, ServerResponse } from 'http';
import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Normalize req.url to ensure /api prefix is preserved if stripped by Vercel rewrites
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }

  try {
    await connectDB();
  } catch (error: any) {
    console.error('[Vercel Serverless] Failed to connect to MongoDB Atlas:', error?.message || error);
  }
  return app(req, res);
}
