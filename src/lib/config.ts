export type AppEnvironment = 'test' | 'development' | 'production';

export interface AppConfigInput {
  environment?: AppEnvironment;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface AppConfig {
  appName: 'Rastro';
  environment: AppEnvironment;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export function getAppConfig(input: AppConfigInput = {}): AppConfig {
  const environment = input.environment ?? (process.env.NODE_ENV === 'test' ? 'test' : 'development');
  const supabaseUrl = input.supabaseUrl ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = input.supabaseAnonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (environment !== 'test' && supabaseUrl && !isValidUrl(supabaseUrl)) {
    throw new Error('SUPABASE_URL must be a valid URL');
  }

  return {
    appName: 'Rastro',
    environment,
    ...(supabaseUrl ? { supabaseUrl } : {}),
    ...(supabaseAnonKey ? { supabaseAnonKey } : {}),
  };
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
