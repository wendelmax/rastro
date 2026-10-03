import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  type CognitoUserSession,
  type ICognitoStorage,
} from 'amazon-cognito-identity-js';
import type { AuthGateway } from '../../../application/auth/auth-gateway';
import type { AppSession, EmailVerificationRequired } from '../../../application/auth/auth-service';
import { setAppSession } from '../../../application/auth/session-store';

export interface CognitoConfig {
  region: string;
  userPoolId: string;
  clientId: string;
}

export interface CognitoSessionLike {
  isValid?: () => boolean;
  getIdToken(): { payload?: { sub?: string }; getJwtToken?: () => string };
  getAccessToken(): { getJwtToken(): string };
}

export interface CognitoUserLike {
  authenticateUser(
    details: unknown,
    callbacks: { onSuccess: (session: CognitoSessionLike) => void; onFailure: (error: Error) => void },
  ): void;
  getSession(callback: (error: Error | null, session: CognitoSessionLike | null) => void): void;
  signOut(): void;
}

export interface CognitoPoolLike {
  signUp(
    email: string,
    password: string,
    attributes: Array<{ Name: string; Value: string }>,
    callbacks: (error: Error | null, result: unknown) => void,
  ): void;
  getCurrentUser(): CognitoUserLike | null;
}

export interface CognitoPoolFactory {
  createPool(config: CognitoConfig): CognitoPoolLike;
  createUser(email: string, pool: CognitoPoolLike): CognitoUserLike;
}

export class CognitoAuthService implements AuthGateway {
  private readonly pool: CognitoPoolLike;

  constructor(
    private readonly config: CognitoConfig,
    factory: CognitoPoolFactory = defaultFactory,
  ) {
    this.pool = factory.createPool(config);
    this.createUser = (email) => factory.createUser(email, this.pool);
  }

  private createUser: (email: string) => CognitoUserLike;

  signIn(email: string, password: string): Promise<AppSession> {
    return new Promise((resolve, reject) => {
      const user = this.createUser(email);
      user.authenticateUser(new AuthenticationDetails({ Username: email, Password: password }), {
        onSuccess: (session) => {
          const appSession = mapSession(session, email);
          setAppSession(appSession);
          resolve(appSession);
        },
        onFailure: reject,
      });
    });
  }

  signUp(email: string, password: string): Promise<AppSession | EmailVerificationRequired> {
    return new Promise((resolve, reject) => {
      this.pool.signUp(email, password, [{ Name: 'email', Value: email }], (error) => {
        if (error) reject(error);
        else resolve({ kind: 'email-verification-required' });
      });
    });
  }

  restoreSession(): Promise<AppSession | null> {
    const user = this.pool.getCurrentUser();
    if (!user) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      user.getSession((error, session) => {
        if (error) return reject(error);
        if (!session || session.isValid?.() === false) return resolve(null);
        const appSession = mapSession(session, '');
        setAppSession(appSession);
        resolve(appSession);
      });
    });
  }

  async signOut(): Promise<void> {
    this.pool.getCurrentUser()?.signOut();
    setAppSession(null);
  }
}

function mapSession(session: CognitoSessionLike, fallbackUserId: string): AppSession {
  const idToken = session.getIdToken();
  return {
    userId: idToken.payload?.sub ?? fallbackUserId,
    accessToken: session.getAccessToken().getJwtToken(),
  };
}

const defaultFactory: CognitoPoolFactory = {
  createPool: (config) => {
    const pool = new CognitoUserPool({
      UserPoolId: config.userPoolId,
      ClientId: config.clientId,
      ...(createStorage() ? { Storage: createStorage() } : {}),
    });
    return {
      __nativePool: pool,
      signUp: (email, password, attributes, callbacks) => pool.signUp(
        email,
        password,
        attributes as never[],
        [],
        (error, result) => callbacks(error ?? null, result),
      ),
      getCurrentUser: () => pool.getCurrentUser(),
    } as CognitoPoolLike & { __nativePool: CognitoUserPool };
  },
  createUser: (email, pool) => {
    const nativePool = pool as CognitoPoolLike & { __nativePool?: CognitoUserPool };
    if (nativePool.__nativePool) return new CognitoUser({ Username: email, Pool: nativePool.__nativePool });
    throw new Error('Cognito user factory is not available');
  },
};

function createStorage(): ICognitoStorage | undefined {
  return undefined;
}
