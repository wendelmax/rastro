import { InMemoryActivityRepository } from '../src/data/local/activity-repository';
import { AwsTrailRepository } from '../src/data/remote/aws/aws-trail-repository';
import { createMobileServices } from '../src/application/mvp/aws-services';

describe('mobile AWS composition', () => {
  it('uses AWS gateways when public AWS configuration is complete', () => {
    const services = createMobileServices({
      config: {
        appName: 'Rastro',
        environment: 'development',
        awsRegion: 'us-east-1',
        awsApiUrl: 'https://api.example.com',
        cognitoUserPoolId: 'pool-1',
        cognitoUserPoolClientId: 'client-1',
      },
      activityRepository: new InMemoryActivityRepository(),
      tokenProvider: () => 'access-token',
    });

    expect(services.trailRepository).toBeInstanceOf(AwsTrailRepository);
  });

  it('uses the demo catalog when AWS configuration is unavailable', () => {
    const services = createMobileServices({
      config: { appName: 'Rastro', environment: 'development' },
      activityRepository: new InMemoryActivityRepository(),
      tokenProvider: () => null,
    });

    expect(services.trailRepository).not.toBeInstanceOf(AwsTrailRepository);
  });
});
