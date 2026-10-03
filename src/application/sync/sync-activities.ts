import type { Activity } from '../../domain/tracking';
import type { ActivityRepository } from '../../data/local/activity-repository';

export interface PublishedActivityReport {
  id: string;
  activityId: string;
  authorId: string;
  title: string;
  description: string;
  visibility: 'public' | 'private' | 'group';
  status: 'published';
}

export interface ActivityGateway {
  push(activity: Activity): Promise<{ status: 'synced' | 'pending' }>;
  publishReport?(report: PublishedActivityReport): Promise<void>;
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
