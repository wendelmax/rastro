import type { AppSession, EmailVerificationRequired } from './auth-service';

export interface AuthGateway {
  signIn(email: string, password: string): Promise<AppSession>;
  signUp(email: string, password: string): Promise<AppSession | EmailVerificationRequired>;
  restoreSession(): Promise<AppSession | null>;
  signOut(): Promise<void>;
}
