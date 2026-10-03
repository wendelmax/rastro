import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import type { AuthGateway } from '../../application/auth/auth-gateway';
import { RastroButton, RastroScreen, RastroText } from '../../design/components';
import { rastroTheme } from '../../design/theme';

interface AuthScreenProps {
  authService: Pick<AuthGateway, 'signIn'>;
}

export function AuthScreen({ authService }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string>();

  async function handleSignIn() {
    try {
      await authService.signIn(email, password);
      setMessage('Login realizado.');
    } catch {
      setMessage('Não foi possível entrar. Confira seus dados.');
    }
  }

  return (
    <RastroScreen contentContainerStyle={styles.container}>
      <RastroText color={rastroTheme.colors.clay} variant="caption">RASTRO</RastroText>
      <RastroText variant="display">Entre para deixar seu rastro</RastroText>
      <TextInput
        accessibilityLabel="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Seu e-mail"
        placeholderTextColor={rastroTheme.colors.muted}
        style={styles.input}
        value={email}
      />
      <TextInput
        accessibilityLabel="Senha"
        onChangeText={setPassword}
        placeholder="Sua senha"
        placeholderTextColor={rastroTheme.colors.muted}
        secureTextEntry
        style={styles.input}
        value={password}
      />
      <RastroButton label="Entrar" onPress={() => void handleSignIn()} />
      {message ? <RastroText color={rastroTheme.colors.success} style={styles.message}>{message}</RastroText> : null}
    </RastroScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  input: {
    backgroundColor: rastroTheme.colors.surface,
    borderColor: rastroTheme.colors.border,
    borderRadius: rastroTheme.radii.md,
    borderWidth: 1,
    color: rastroTheme.colors.ink,
    minHeight: 48,
    padding: rastroTheme.spacing.md,
  },
  message: {
    textAlign: 'center',
  },
});
