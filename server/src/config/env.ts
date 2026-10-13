import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Multi-path resolution strategy for finding the root or server .env file
const getModuleDir = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch {
    // fallback
  }
  return typeof __dirname !== 'undefined' ? __dirname : process.cwd();
};

const moduleDir = getModuleDir();

// Candidate paths to search for .env (from root, cwd, or server folder)
const envCandidatePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server', '.env'),
  path.resolve(process.cwd(), '..', '.env'),
  path.resolve(moduleDir, '..', '..', '..', '.env'), // from server/src/config or server/dist/config to root
  path.resolve(moduleDir, '..', '..', '.env'),       // from server/src or server/dist to server root
];

// Load from existing candidates (dotenv does not overwrite existing process.env variables)
for (const candidate of envCandidatePaths) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate });
  }
}

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

// Production configuration validation (warn rather than crashing module import)
if (isProduction) {
  const uri = process.env.MONGODB_URI || '';
  if (!uri || uri.includes('PASTE_MY_NEW_MONGODB_ATLAS_CONNECTION_STRING_HERE')) {
    console.error('[Config Warning] MONGODB_URI environment variable is not configured for production. Please add MONGODB_URI in Vercel Project Settings.');
  }
  const secret = process.env.JWT_SECRET || '';
  if (!secret) {
    console.warn('[Config Warning] JWT_SECRET environment variable is not configured. Falling back to default token secret.');
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: nodeEnv,
  MONGODB_URI: (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/certiverify').trim(),
  JWT_SECRET: (process.env.JWT_SECRET || 'certiverify_jwt_super_secret_key_prod_2026').trim(),
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || '7d').trim(),
  CLIENT_URL: (process.env.CLIENT_URL || 'http://localhost:5173').trim(),
  APP_URL: (process.env.APP_URL || 'http://localhost:5173').trim(),
  COOKIE_SECURE: process.env.COOKIE_SECURE === 'true' || isProduction,
};
