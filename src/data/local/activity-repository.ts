import type { Activity } from '../../domain/tracking';

export interface ActivityRepository {
  save(activity: Activity): Promise<void>;
  getById(id: string): Promise<Activity | null>;
}

export class InMemoryActivityRepository implements ActivityRepository {
  private readonly activities = new Map<string, Activity>();

  async save(activity: Activity): Promise<void> {
    this.activities.set(activity.id, cloneActivity(activity));
  }

  async getById(id: string): Promise<Activity | null> {
    const activity = this.activities.get(id);
    return activity ? cloneActivity(activity) : null;
  }
}

function cloneActivity(activity: Activity): Activity {
  return {
    ...activity,
    samples: activity.samples.map((sample) => ({ ...sample })),
  };
}
