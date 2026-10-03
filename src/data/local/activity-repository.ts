import type { Activity } from '../../domain/tracking';
import type { PendingActivityRepository } from '../../application/sync/sync-activities';

export interface ActivityRepository {
  save(activity: Activity): Promise<void>;
  getById(id: string): Promise<Activity | null>;
}

export class InMemoryActivityRepository implements ActivityRepository, PendingActivityRepository {
  private readonly activities = new Map<string, Activity>();
  private readonly synced = new Set<string>();

  async save(activity: Activity): Promise<void> {
    this.activities.set(activity.id, cloneActivity(activity));
    this.synced.delete(activity.id);
  }

  async getById(id: string): Promise<Activity | null> {
    const activity = this.activities.get(id);
    return activity ? cloneActivity(activity) : null;
  }

  async listPending(): Promise<Activity[]> {
    return [...this.activities.values()]
      .filter((activity) => activity.status === 'finished' && !this.synced.has(activity.id))
      .map(cloneActivity);
  }

  async markSynced(id: string): Promise<void> {
    this.synced.add(id);
  }
}

function cloneActivity(activity: Activity): Activity {
  return {
    ...activity,
    samples: activity.samples.map((sample) => ({ ...sample })),
  };
}
