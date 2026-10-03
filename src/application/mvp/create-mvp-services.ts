import { recordActivity } from '../tracking/record-activity';
import { PublishActivityService } from '../contributions/publish-activity';
import type { ActivityRepository } from '../../data/local/activity-repository';
import { InMemoryActivityRepository } from '../../data/local/activity-repository';
import { createDemoRepository } from '../../data/demo/demo-trails';

export function createMvpServices(activityRepository: ActivityRepository = new InMemoryActivityRepository()) {
  const catalog = createDemoRepository();
  const publishActivityService = new PublishActivityService({
    activityRepository,
    trailRepository: catalog.trailRepository,
  });

  return {
    ...catalog,
    activityRepository,
    publishActivityService,
    createTrackingSession: (idFactory?: () => string) => recordActivity(activityRepository, idFactory),
  };
}
