import { getAppConfig } from '../src/lib/config';
import { CognitoAuthService } from '../src/data/remote/aws/cognito-auth-service';
import { SecureAuthSessionStore } from '../src/data/remote/aws/secure-auth-session-store';
import { createRastroSupabaseClient } from '../src/data/remote/supabase-client';
import { AuthService } from '../src/application/auth/auth-service';
import { AuthScreen } from '../src/features/auth/AuthScreen';
import { Text, View } from 'react-native';

const config = getAppConfig();
const client = createRastroSupabaseClient(config);

export default function AuthRoute() {
  if (config.awsRegion && config.cognitoUserPoolId && config.cognitoUserPoolClientId) {
    return <AuthScreen authService={new CognitoAuthService({
      region: config.awsRegion,
      userPoolId: config.cognitoUserPoolId,
      clientId: config.cognitoUserPoolClientId,
    }, undefined, new SecureAuthSessionStore())} />;
  }
  if (!client) {
    return (
      <View>
        <Text>Login indisponível: configure o Supabase para ativar a autenticação.</Text>
      </View>
    );
  }
  return <AuthScreen authService={new AuthService(client)} />;
}
