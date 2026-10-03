export interface AppSession {
  userId: string;
  accessToken: string;
}

export interface EmailVerificationRequired {
  kind: 'email-verification-required';
}

interface SupabaseSession {
  user: { id: string };
  access_token: string;
}

interface SupabaseAuthClient {
  auth: {
    signInWithPassword(input: { email: string; password: string }): Promise<{
      data: { session: SupabaseSession | null };
      error: Error | null;
    }>;
    signUp(input: { email: string; password: string }): Promise<{
      data: { session: SupabaseSession | null };
      error: Error | null;
    }>;
  };
}

export class AuthService {
  constructor(private readonly client: SupabaseAuthClient) {}

  async signIn(email: string, password: string): Promise<AppSession> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.session) throw new Error('Supabase did not return a session');
    return mapSession(data.session);
  }

  async signUp(email: string, password: string): Promise<AppSession | EmailVerificationRequired> {
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) throw error;
    return data.session ? mapSession(data.session) : { kind: 'email-verification-required' };
  }
}

function mapSession(session: SupabaseSession): AppSession {
  return {
    userId: session.user.id,
    accessToken: session.access_token,
  };
}
