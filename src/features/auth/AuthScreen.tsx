import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { AuthGateway } from '../../application/auth/auth-gateway';

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
    <View style={styles.container}>
      <Text style={styles.eyebrow}>RASTRO</Text>
      <Text style={styles.title}>Entre para deixar seu rastro</Text>
      <TextInput autoCapitalize="none" onChangeText={setEmail} placeholder="Seu e-mail" style={styles.input} value={email} />
      <TextInput onChangeText={setPassword} placeholder="Sua senha" secureTextEntry style={styles.input} value={password} />
      <Pressable onPress={() => void handleSignIn()} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#F97316',
    borderRadius: 14,
    marginTop: 8,
    padding: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  eyebrow: {
    color: '#F97316',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    padding: 13,
  },
  message: {
    color: '#0F766E',
    textAlign: 'center',
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
  },
});
