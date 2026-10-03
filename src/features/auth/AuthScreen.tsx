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
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'danger' }>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await authService.signIn(email, password);
      setMessage({ text: 'Login realizado.', tone: 'success' });
    } catch {
      setMessage({ text: 'Não foi possível entrar. Confira seus dados.', tone: 'danger' });
    } finally {
      setSubmitting(false);
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
      <RastroButton label="Entrar" loading={submitting} onPress={() => void handleSignIn()} />
      {message ? <RastroText color={message.tone === 'danger' ? rastroTheme.colors.danger : rastroTheme.colors.success} style={styles.message}>{message.text}</RastroText> : null}
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
