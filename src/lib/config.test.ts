import { getAppConfig } from './config';

describe('getAppConfig', () => {
  it('returns the Rastro test configuration without requiring backend credentials', () => {
    expect(getAppConfig()).toEqual({
      appName: 'Rastro',
      environment: 'test',
    });
  });

  it('rejects a malformed backend URL outside the test environment', () => {
    expect(() => getAppConfig({
      environment: 'development',
      supabaseUrl: 'not-a-url',
    })).toThrow('SUPABASE_URL');
  });
});
