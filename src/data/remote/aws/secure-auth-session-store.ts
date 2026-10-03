import * as SecureStore from 'expo-secure-store';
import type { AppSession } from '../../../application/auth/auth-service';
import type { AuthSessionStore } from './cognito-auth-service';

const SESSION_KEY = 'rastro.auth.session';

export class SecureAuthSessionStore implements AuthSessionStore {
  async save(session: AppSession): Promise<void> {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  }

  async load(): Promise<AppSession | null> {
    const serialized = await SecureStore.getItemAsync(SESSION_KEY);
    if (!serialized) return null;
    try { return JSON.parse(serialized) as AppSession; } catch { return null; }
  }

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}
