import 'dotenv/config';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import express from 'express';
import { app } from './server/app';
import { ENV } from './server/config/env';

const server = http.createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : (ENV.PORT || 3000);

async function startServer() {
  if (ENV.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
      process.exit(1);
    } else {
      console.error('❌ Server startup error:', err);
      process.exit(1);
    }
  });

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 ExploreX Server running on port ${PORT}`);
    checkMLServiceHealth();
  });
}

async function checkMLServiceHealth() {
  const mlUrl = ENV.ML_SERVICE_URL;
  try {
    const res = await fetch(`${mlUrl}/health`);
    if (res.ok) {
      const health = await res.json();
      console.log(`✅ ML Service connected: ${mlUrl}`);
      console.log(`   Status: ${health.status}`);
      console.log(`   Capabilities: ${(health.capabilities || []).join(', ')}`);
    } else {
      console.warn(`⚠️ ML Service responded with status ${res.status}`);
    }
  } catch (error) {
    console.warn(`⚠️ ML Service unavailable at ${mlUrl} — falling back to rule-based scoring`);
  }
}

startServer();
