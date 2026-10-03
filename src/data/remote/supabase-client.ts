import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getAppConfig, type AppConfig } from '../../lib/config';

export function createRastroSupabaseClient(config: AppConfig = getAppConfig()): SupabaseClient | null {
  if (!config.supabaseUrl || !config.supabaseAnonKey) return null;
  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}
