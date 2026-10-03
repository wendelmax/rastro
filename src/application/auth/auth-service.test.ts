import { AuthService } from './auth-service';

describe('AuthService', () => {
  it('maps a Supabase session to the app session', async () => {
    const client = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({
          data: { session: { user: { id: 'user-1' }, access_token: 'token-1' } },
          error: null,
        }),
        signUp: jest.fn(),
      },
    };
    const service = new AuthService(client);

    await expect(service.signIn('driver@example.com', 'secret')).resolves.toEqual({
      userId: 'user-1',
      accessToken: 'token-1',
    });
  });

  it('returns verification required when sign up has no session', async () => {
    const client = {
      auth: {
        signInWithPassword: jest.fn(),
        signUp: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
      },
    };
    const service = new AuthService(client);

    await expect(service.signUp('driver@example.com', 'secret')).resolves.toEqual({
      kind: 'email-verification-required',
    });
  });
});
