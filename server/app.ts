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

// Universal Body Parser (Vercel Serverless + Standalone Node.js)
// In serverless runtimes (@vercel/node), req.body is often pre-parsed before hitting Express.
app.use((req: any, _res: express.Response, next: express.NextFunction) => {
  // If req.body is already an object, preserve rawBody if needed and proceed
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    if (!req.rawBody) {
      try {
        req.rawBody = JSON.stringify(req.body);
      } catch {}
    }
    return next();
  }

  // If req.body is a string, parse it
  if (typeof req.body === 'string') {
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body);
    } catch {}
    return next();
  }

  // Otherwise, use standard express.json() for stream-based requests
  express.json({
    limit: '20mb',
    verify: (r: any, _res, buf) => {
      r.rawBody = buf.toString('utf8');
    }
  })(req, _res, (err) => {
    if (err) {
      console.warn('JSON body parser notice:', err.message);
    }
    next();
  });
});

app.use((req: any, res: express.Response, next: express.NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    return next();
  }
  express.urlencoded({ extended: true, limit: '20mb' })(req, res, () => next());
});

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

// Global error handler with clean logging and status resolution
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(`[ExploreX API Error] ${req.method} ${req.originalUrl || req.url}:`, err);
  const status = typeof err.status === 'number' && err.status >= 400 && err.status < 600
    ? err.status
    : (typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500);

  res.status(status).json({
    error: err.message || 'Internal server error occurred.',
    timestamp: new Date().toISOString()
  });
});

export default app;
