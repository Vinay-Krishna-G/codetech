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

  // 2. Detect unconfigured placeholder connection string
  if (env.MONGODB_URI.includes('PASTE_MY_NEW_MONGODB_ATLAS_CONNECTION_STRING_HERE')) {
    throw new Error(
      '[Database Error] MONGODB_URI contains placeholder "PASTE_MY_NEW_MONGODB_ATLAS_CONNECTION_STRING_HERE". Please paste your real MongoDB Atlas connection string in .env.'
    );
  }

  // 3. Reuse in-flight connection promise to avoid parallel connections in serverless cold starts
  if (!cachedPromise) {
    cachedPromise = mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast in 5 seconds rather than hanging serverless requests for 30s
    });
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
