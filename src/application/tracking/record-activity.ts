import { TrackingSession } from '../../domain/tracking';
import type { ActivityRepository } from '../../data/local/activity-repository';

export function recordActivity(
  repository: ActivityRepository,
  idFactory?: () => string,
): TrackingSession {
  return new TrackingSession(repository, idFactory);
}
