import { createRastroSupabaseClient } from '../src/data/remote/supabase-client';
import { AuthService } from '../src/application/auth/auth-service';
import { AuthScreen } from '../src/features/auth/AuthScreen';
import { Text, View } from 'react-native';

const client = createRastroSupabaseClient();

export default function AuthRoute() {
  if (!client) {
    return (
      <View>
        <Text>Login indisponível: configure o Supabase para ativar a autenticação.</Text>
      </View>
    );
  }
  return <AuthScreen authService={new AuthService(client)} />;
}
