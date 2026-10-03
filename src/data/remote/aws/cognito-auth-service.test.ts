import { CognitoAuthService, MemoryAuthSessionStore, type CognitoPoolFactory, type CognitoUserLike } from './cognito-auth-service';

describe('CognitoAuthService', () => {
  it('maps a successful password sign-in to an app session', async () => {
    const user: CognitoUserLike = {
      authenticateUser: (_details, callbacks) => callbacks.onSuccess({
        getIdToken: () => ({ getJwtToken: () => 'jwt-1' }),
        getAccessToken: () => ({ getJwtToken: () => 'access-1' }),
      }),
      getSession: (callback) => callback(null, null),
      signOut: jest.fn(),
    };
    const factory: CognitoPoolFactory = {
      createUser: jest.fn(() => user),
      createPool: jest.fn(() => ({
        signUp: jest.fn(),
        getCurrentUser: () => user,
      })),
    };
    const service = new CognitoAuthService({
      region: 'us-east-1',
      userPoolId: 'pool-1',
      clientId: 'client-1',
    }, factory);

    await expect(service.signIn('driver@example.com', 'secret')).resolves.toEqual({
      userId: 'driver@example.com',
      accessToken: 'access-1',
    });
  });

  it('maps sign-up without an immediate session to verification required', async () => {
    const factory: CognitoPoolFactory = {
      createUser: jest.fn(),
      createPool: jest.fn(() => ({
        signUp: (_email, _password, _attributes, callbacks) => callbacks(null, null),
        getCurrentUser: () => null,
      })),
    };
    const service = new CognitoAuthService({
      region: 'us-east-1',
      userPoolId: 'pool-1',
      clientId: 'client-1',
    }, factory);

    await expect(service.signUp('driver@example.com', 'secret')).resolves.toEqual({
      kind: 'email-verification-required',
    });
  });

  it('restores a current Cognito session and can sign out', async () => {
    const user: CognitoUserLike = {
      authenticateUser: jest.fn(),
      getSession: (callback) => callback(null, {
        isValid: () => true,
        getIdToken: () => ({ payload: { sub: 'user-1' } }),
        getAccessToken: () => ({ getJwtToken: () => 'access-1' }),
      }),
      signOut: jest.fn(),
    };
    const factory: CognitoPoolFactory = {
      createUser: jest.fn(() => user),
      createPool: jest.fn(() => ({
        signUp: jest.fn(),
        getCurrentUser: () => user,
      })),
    };
    const service = new CognitoAuthService({
      region: 'us-east-1',
      userPoolId: 'pool-1',
      clientId: 'client-1',
    }, factory);

    await expect(service.restoreSession()).resolves.toEqual({ userId: 'user-1', accessToken: 'access-1' });
    await service.signOut();
    expect(user.signOut).toHaveBeenCalled();
  });

  it('restores a persisted app session when the native Cognito user is unavailable', async () => {
    const store = new MemoryAuthSessionStore();
    const factory: CognitoPoolFactory = {
      createUser: jest.fn(),
      createPool: jest.fn(() => ({ signUp: jest.fn(), getCurrentUser: () => null })),
    };
    const service = new CognitoAuthService({
      region: 'us-east-1',
      userPoolId: 'pool-1',
      clientId: 'client-1',
    }, factory, store);
    await store.save({ userId: 'user-1', accessToken: 'access-1' });

    await expect(service.restoreSession()).resolves.toEqual({ userId: 'user-1', accessToken: 'access-1' });
  });
});
