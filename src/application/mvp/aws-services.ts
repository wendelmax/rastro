import type { AppConfig } from '../../lib/config';
import { recordActivity } from '../tracking/record-activity';
import { PublishActivityService } from '../contributions/publish-activity';
import type { ActivityRepository } from '../../data/local/activity-repository';
import { InMemoryActivityRepository } from '../../data/local/activity-repository';
import { createDemoRepository } from '../../data/demo/demo-trails';
import { ApiClient } from '../../data/remote/aws/api-client';
import { AwsActivityGateway } from '../../data/remote/aws/aws-activity-gateway';
import { AwsPointRepository, AwsTrailRepository } from '../../data/remote/aws/aws-trail-repository';

export interface MobileServicesOptions {
  config: AppConfig;
  activityRepository: ActivityRepository;
  tokenProvider: () => string | null;
}

export function createMobileServices(options: MobileServicesOptions) {
  const catalog = createDemoRepository();
  if (!hasAwsConfig(options.config)) {
    return {
      ...catalog,
      activityRepository: options.activityRepository,
      createTrackingSession: (idFactory?: () => string) => recordActivity(options.activityRepository, idFactory),
      publishActivityService: new PublishActivityService({
        activityRepository: options.activityRepository,
        trailRepository: catalog.trailRepository,
      }),
    };
  }

  const client = new ApiClient(options.config.awsApiUrl, options.tokenProvider);
  const trailRepository = new AwsTrailRepository(client);
  const pointRepository = new AwsPointRepository(client);
  const activityGateway = new AwsActivityGateway(client);
  return {
    trailRepository,
    pointRepository,
    activityRepository: options.activityRepository,
    activityGateway,
    createTrackingSession: (idFactory?: () => string) => recordActivity(options.activityRepository, idFactory),
    publishActivityService: new PublishActivityService({
      activityRepository: options.activityRepository,
      trailRepository,
      activityGateway,
    }),
  };
}

function hasAwsConfig(config: AppConfig): config is AppConfig & Required<Pick<AppConfig, 'awsRegion' | 'awsApiUrl' | 'cognitoUserPoolId' | 'cognitoUserPoolClientId'>> {
  return Boolean(config.awsRegion && config.awsApiUrl && config.cognitoUserPoolId && config.cognitoUserPoolClientId);
}

export function createFallbackActivityRepository(): ActivityRepository {
  return new InMemoryActivityRepository();
}
