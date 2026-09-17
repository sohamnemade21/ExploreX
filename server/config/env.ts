import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const getEnvDir = (): string => {
  try {
    if (typeof __dirname !== 'undefined') return __dirname;
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.url) {
      return path.dirname(fileURLToPath((import.meta as any).url));
    }
  } catch {}
  return process.cwd();
};

const currentDir = getEnvDir();

// Look for .env in current working directory and project root
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '..', '.env'),
  path.resolve(currentDir, '..', '..', '.env'),
  path.resolve(currentDir, '..', '.env'),
  path.resolve(currentDir, '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

export interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  APP_URL: string;
  ML_SERVICE_URL: string;
  
  // AI Services
  GEMINI_API_KEY?: string;
  OPENAI_API_KEY?: string;

  // Supabase (Database & Auth)
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_API_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;

  // Payments (Razorpay)
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;

  // Communications (Resend Transactional Email)
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;

  // Google Maps & Places
  GOOGLE_MAPS_API_KEY?: string;
}

// Helper to mask secrets in diagnostic output
function maskSecret(val?: string): string {
  if (!val || val.startsWith('your_') || val.startsWith('rzp_test_your_')) return 'Not configured';
  if (val.length <= 8) return '********';
  return `${val.substring(0, 4)}...${val.substring(val.length - 4)}`;
}

// Clean any trailing comments or flags from env values
function cleanEnvString(val?: string): string | undefined {
  if (!val) return undefined;
  // Remove trailing inline comments or annotations like '---done', '# ...', or whitespace
  const cleaned = val.split(/\s+---|\s+#/)[0].trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

function cleanUrl(val?: string): string | undefined {
  const cleaned = cleanEnvString(val);
  if (!cleaned || cleaned.includes('your-project-id') || cleaned.includes('placeholder')) return undefined;
  try {
    const u = new URL(cleaned);
    return (u.protocol === 'http:' || u.protocol === 'https:') ? u.origin : undefined;
  } catch {
    return undefined;
  }
}

// Normalize Supabase url and key: allow SUPABASE_URL, VITE_SUPABASE_URL, SUPABASE_ANON_KEY, VITE_SUPABASE_ANON_KEY, or SUPABASE_API_KEY
const resolvedSupabaseUrl = cleanUrl(process.env.SUPABASE_URL) || cleanUrl(process.env.VITE_SUPABASE_URL) || undefined;
const resolvedSupabaseAnonKey = cleanEnvString(process.env.SUPABASE_ANON_KEY) || cleanEnvString(process.env.VITE_SUPABASE_ANON_KEY) || cleanEnvString(process.env.SUPABASE_API_KEY) || undefined;
const resolvedSupabaseServiceRoleKey = cleanEnvString(process.env.SUPABASE_SERVICE_ROLE_KEY) || undefined;

export const ENV = {
  PORT: parseInt(cleanEnvString(process.env.PORT) || '3000', 10),
  NODE_ENV: cleanEnvString(process.env.NODE_ENV) || 'development',
  APP_URL: cleanEnvString(process.env.APP_URL) || 'http://localhost:3000',
  ML_SERVICE_URL: cleanEnvString(process.env.ML_SERVICE_URL) || 'http://localhost:8000',
  
  GEMINI_API_KEY: cleanEnvString(process.env.GEMINI_API_KEY) || undefined,
  OPENAI_API_KEY: cleanEnvString(process.env.OPENAI_API_KEY) || undefined,

  SUPABASE_URL: resolvedSupabaseUrl,
  SUPABASE_ANON_KEY: resolvedSupabaseAnonKey,
  SUPABASE_API_KEY: cleanEnvString(process.env.SUPABASE_API_KEY) || undefined,
  SUPABASE_SERVICE_ROLE_KEY: resolvedSupabaseServiceRoleKey,
  
  RAZORPAY_KEY_ID: cleanEnvString(process.env.RAZORPAY_KEY_ID) || undefined,
  RAZORPAY_KEY_SECRET: cleanEnvString(process.env.RAZORPAY_KEY_SECRET) || undefined,
  RAZORPAY_WEBHOOK_SECRET: cleanEnvString(process.env.RAZORPAY_WEBHOOK_SECRET) || undefined,

  RESEND_API_KEY: cleanEnvString(process.env.RESEND_API_KEY) || undefined,
  RESEND_FROM_EMAIL: cleanEnvString(process.env.RESEND_FROM_EMAIL) || 'confirmations@explorex.com',

  GOOGLE_MAPS_API_KEY: cleanEnvString(process.env.GOOGLE_MAPS_API_KEY) || undefined,
};

/**
 * Validates environment variables at server startup and prints a diagnostics summary.
 * Secrets are never exposed.
 */
export function validateEnvironment(): void {
  console.log('\n======================================================');
  console.log('   🌍 ExploreX Environment & Service Diagnostics');
  console.log('======================================================');

  // Core App
  console.log(`📡 Server Port:       ${ENV.PORT} (${ENV.NODE_ENV})`);
  console.log(`🌐 Base URL:          ${ENV.APP_URL}`);
  console.log(`🧠 ML Microservice:   ${ENV.ML_SERVICE_URL}`);

  console.log('\n--- Service Credentials & Integration Status ---');
  
  // Supabase
  if (ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY && !ENV.SUPABASE_URL.includes('your-project-id')) {
    const keySource = process.env.SUPABASE_ANON_KEY ? 'SUPABASE_ANON_KEY' : 'SUPABASE_API_KEY (aliased)';
    console.log(`✅ Supabase:          Configured [${keySource}: ${maskSecret(ENV.SUPABASE_ANON_KEY)}]`);
  } else {
    console.log(`ℹ️  Supabase:          Not connected -> Using local document store (data_store.json)`);
  }

  // AI Engines (OpenAI & Gemini)
  if (ENV.OPENAI_API_KEY && !ENV.OPENAI_API_KEY.includes('your_openai') && !ENV.OPENAI_API_KEY.includes('placeholder')) {
    console.log(`✅ OpenAI GPT-4o:     Configured [${maskSecret(ENV.OPENAI_API_KEY)}]`);
  } else if (ENV.GEMINI_API_KEY && !ENV.GEMINI_API_KEY.includes('your_gemini')) {
    console.log(`✅ Gemini AI Engine:  Configured [${maskSecret(ENV.GEMINI_API_KEY)}]`);
  } else {
    console.log(`⚠️  AI Engines:        Missing AI API Key -> Falling back to rule-based travel assistant`);
  }

  // Razorpay Payments & Webhook
  if (ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET && !ENV.RAZORPAY_KEY_ID.includes('rzp_test_your_key')) {
    console.log(`✅ Razorpay Gateway:  Configured [Key ID: ${maskSecret(ENV.RAZORPAY_KEY_ID)}]`);
  } else {
    console.log(`ℹ️  Razorpay Gateway:  Missing live keys -> Test sandbox simulation mode active`);
  }

  if (ENV.RAZORPAY_WEBHOOK_SECRET) {
    console.log(`✅ Razorpay Webhook:  Configured [HMAC Secret: ${maskSecret(ENV.RAZORPAY_WEBHOOK_SECRET)}]`);
  } else {
    console.log(`ℹ️  Razorpay Webhook:  Secret not configured`);
  }

  // Resend Email
  if (ENV.RESEND_API_KEY && !ENV.RESEND_API_KEY.includes('re_your_resend')) {
    console.log(`✅ Resend Email:      Configured [${maskSecret(ENV.RESEND_API_KEY)}]`);
  } else {
    console.log(`ℹ️  Resend Email:      Optional (Not configured)`);
  }

  // Google Maps
  if (ENV.GOOGLE_MAPS_API_KEY && !ENV.GOOGLE_MAPS_API_KEY.includes('your_google')) {
    console.log(`✅ Google Maps API:   Configured [${maskSecret(ENV.GOOGLE_MAPS_API_KEY)}]`);
  } else {
    console.log(`ℹ️  Maps Engine:       Leaflet + OpenStreetMap tile layers active`);
  }

  console.log('======================================================\n');
}
