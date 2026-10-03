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

  it('reads public AWS configuration and validates the API URL', () => {
    expect(getAppConfig({
      environment: 'development',
      awsRegion: 'us-east-1',
      awsApiUrl: 'https://api.example.com',
      cognitoUserPoolId: 'us-east-1_pool',
      cognitoUserPoolClientId: 'client-id',
    })).toMatchObject({
      awsRegion: 'us-east-1',
      awsApiUrl: 'https://api.example.com',
      cognitoUserPoolId: 'us-east-1_pool',
      cognitoUserPoolClientId: 'client-id',
    });
  });

  it('rejects a malformed AWS API URL outside the test environment', () => {
    expect(() => getAppConfig({
      environment: 'development',
      awsApiUrl: 'not-a-url',
    })).toThrow('AWS_API_URL');
  });
});
