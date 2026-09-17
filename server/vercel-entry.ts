import { app } from './app';

// Export handler for Vercel Serverless Functions
export default function handler(req: any, res: any) {
  return app(req, res);
}
