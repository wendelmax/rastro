import { createRastroSupabaseClient } from '../src/data/remote/supabase-client';
import { AuthService } from '../src/application/auth/auth-service';
import { AuthScreen } from '../src/features/auth/AuthScreen';

const client = createRastroSupabaseClient();

export default function AuthRoute() {
  if (!client) return null;
  return <AuthScreen authService={new AuthService(client)} />;
}
