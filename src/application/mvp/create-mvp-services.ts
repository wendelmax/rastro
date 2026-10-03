import { recordActivity } from '../tracking/record-activity';
import { PublishActivityService } from '../contributions/publish-activity';
import { InMemoryActivityRepository } from '../../data/local/activity-repository';
import { createDemoRepository } from '../../data/demo/demo-trails';

export function createMvpServices() {
  const catalog = createDemoRepository();
  const activityRepository = new InMemoryActivityRepository();
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
