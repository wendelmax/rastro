import type { Activity } from '../../domain/tracking';
import type { ActivityRepository } from '../../data/local/activity-repository';

export interface ActivityGateway {
  push(activity: Activity): Promise<{ status: 'synced' | 'pending' }>;
}

export interface PendingActivityRepository extends ActivityRepository {
  listPending(): Promise<Activity[]>;
  markSynced(id: string): Promise<void>;
}

export async function syncPendingActivities(
  repository: PendingActivityRepository,
  gateway: ActivityGateway,
): Promise<{ synced: number; failed: number }> {
  let synced = 0;
  let failed = 0;
  for (const activity of await repository.listPending()) {
    try {
      const result = await gateway.push(activity);
      if (result.status === 'synced') {
        await repository.markSynced(activity.id);
        synced += 1;
      }
    } catch {
      failed += 1;
    }
  }
  return { synced, failed };
}
