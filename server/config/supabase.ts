import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './env';

export interface SupabaseConfig {
  url: string | null;
  anonKey: string | null;
  serviceRoleKey: string | null;
  isConfigured: boolean;
}

/**
 * Normalized Supabase configuration.
 * Resolves both SUPABASE_ANON_KEY and SUPABASE_API_KEY naming conventions.
 */
export const supabaseConfig: SupabaseConfig = {
  url: ENV.SUPABASE_URL || null,
  anonKey: ENV.SUPABASE_ANON_KEY || null,
  serviceRoleKey: ENV.SUPABASE_SERVICE_ROLE_KEY || null,
  isConfigured: Boolean(
    ENV.SUPABASE_URL && 
    ENV.SUPABASE_ANON_KEY && 
    !ENV.SUPABASE_URL.includes('your-project-id') &&
    !ENV.SUPABASE_ANON_KEY.includes('your-anon-key')
  ),
};

/**
 * Standard Supabase client for Authentication and User sessions.
 */
export const supabase: SupabaseClient | null = supabaseConfig.isConfigured && supabaseConfig.url && supabaseConfig.anonKey
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    })
  : null;

/**
 * Supabase Admin client for service-role privileged operations if service key is supplied.
 */
export const supabaseAdmin: SupabaseClient | null = supabaseConfig.isConfigured && supabaseConfig.url && supabaseConfig.serviceRoleKey
  ? createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    })
  : null;

/**
 * Helper to obtain authenticated Supabase REST headers for external requests/syncs.
 */
export function getSupabaseHeaders(): Record<string, string> | null {
  if (!supabaseConfig.isConfigured || !supabaseConfig.anonKey) {
    return null;
  }
  return {
    'apikey': supabaseConfig.anonKey,
    'Authorization': `Bearer ${supabaseConfig.anonKey}`,
    'Content-Type': 'application/json',
  };
}

