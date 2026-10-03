import type { AppSession } from './auth-service';

let session: AppSession | null = null;

export function setAppSession(nextSession: AppSession | null): void {
  session = nextSession;
}

export function getAppSession(): AppSession | null {
  return session;
}
