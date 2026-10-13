import mongoose from 'mongoose';
import { env } from './env.js';

let cachedPromise: Promise<typeof mongoose> | null = null;

const sanitizeErrorMessage = (msg: string): string => {
  // Redact any mongodb connection URI credentials from error messages
  return msg.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
};

export const connectDB = async (): Promise<void> => {
  // 1. Return immediately if already fully connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // 2. Detect missing or placeholder connection string
  if (!env.MONGODB_URI || env.MONGODB_URI.includes('PASTE_MY_NEW_MONGODB_ATLAS_CONNECTION_STRING_HERE')) {
    throw new Error(
      '[Database Error] MONGODB_URI environment variable is not configured. Please add your MongoDB Atlas connection string in Vercel project settings.'
    );
  }

  // 3. Reuse in-flight connection promise to avoid parallel connections in serverless cold starts
  if (!cachedPromise) {
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000, // 10s timeout for serverless Atlas connection handshakes
      ...(process.env.DB_NAME ? { dbName: process.env.DB_NAME } : {}),
    };
    cachedPromise = mongoose.connect(env.MONGODB_URI, options);
  }

  try {
    const conn = await cachedPromise;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    cachedPromise = null; // Reset so subsequent requests can retry
    const sanitizedMsg = sanitizeErrorMessage(error?.message || String(error));
    console.error(`[Database Error] Failed to connect to MongoDB:`, sanitizedMsg);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    cachedPromise = null;
    await mongoose.disconnect();
    console.log('[Database] MongoDB disconnected.');
  } catch (error: any) {
    console.error('[Database Error] Disconnection error:', sanitizeErrorMessage(error?.message || String(error)));
  }
};
