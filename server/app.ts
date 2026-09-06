import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { apiRouter } from './routes/api';
import { validateEnvironment } from './config/env';
import { ensureAdminAccount } from './services/supabaseAuthService';

export const app = express();

// One-time initialization flag for serverless cold starts
let initialized = false;
async function initOnce() {
  if (initialized) return;
  initialized = true;
  validateEnvironment();
  await ensureAdminAccount();
}
// Fire and forget on module load — handles both standalone and serverless
initOnce().catch(err => console.warn('Init warning:', err?.message || err));

// Body parsers with raw body preservation for cryptographic signature verification (Razorpay webhook)
app.use(express.json({
  limit: '20mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// CORS & Security Headers for production resilience
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Static uploads directory with serverless read-only safe fallback
const uploadDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch {}
}
app.use('/uploads', express.static(uploadDir));

// Health check endpoints
app.get(['/api/health', '/health', '/api/v1/health'], (_req, res) => {
  res.json({
    status: 'online',
    platform: 'ExploreX - Smart Tourism Platform',
    timestamp: new Date().toISOString()
  });
});

// Mount main API router under /api/v1, /api, and root fallback for serverless rewrites
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);
app.use(apiRouter);

// Static assets (public images)
const publicImagesPath = path.join(process.cwd(), 'public', 'images');
if (fs.existsSync(publicImagesPath)) {
  app.use('/images', express.static(publicImagesPath));
}
const publicPath = path.join(process.cwd(), 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Global 404 for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: `API route not found: ${req.method} ${req.originalUrl || req.url}`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.',
    timestamp: new Date().toISOString()
  });
});

export default app;
