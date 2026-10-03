export type AppEnvironment = 'test' | 'development' | 'production';

export interface AppConfigInput {
  environment?: AppEnvironment;
  awsRegion?: string;
  awsApiUrl?: string;
  cognitoUserPoolId?: string;
  cognitoUserPoolClientId?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface AppConfig {
  appName: 'Rastro';
  environment: AppEnvironment;
  awsRegion?: string;
  awsApiUrl?: string;
  cognitoUserPoolId?: string;
  cognitoUserPoolClientId?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export function getAppConfig(input: AppConfigInput = {}): AppConfig {
  const environment = input.environment ?? (process.env.NODE_ENV === 'test' ? 'test' : 'development');
  const awsRegion = input.awsRegion ?? process.env.EXPO_PUBLIC_AWS_REGION;
  const awsApiUrl = input.awsApiUrl ?? process.env.EXPO_PUBLIC_AWS_API_URL;
  const cognitoUserPoolId = input.cognitoUserPoolId ?? process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID;
  const cognitoUserPoolClientId = input.cognitoUserPoolClientId ?? process.env.EXPO_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
  const supabaseUrl = input.supabaseUrl ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = input.supabaseAnonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (environment !== 'test' && supabaseUrl && !isValidUrl(supabaseUrl)) {
    throw new Error('SUPABASE_URL must be a valid URL');
  }
  if (environment !== 'test' && awsApiUrl && !isValidUrl(awsApiUrl)) {
    throw new Error('AWS_API_URL must be a valid URL');
  }

  return {
    appName: 'Rastro',
    environment,
    ...(awsRegion ? { awsRegion } : {}),
    ...(awsApiUrl ? { awsApiUrl } : {}),
    ...(cognitoUserPoolId ? { cognitoUserPoolId } : {}),
    ...(cognitoUserPoolClientId ? { cognitoUserPoolClientId } : {}),
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
