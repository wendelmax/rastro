import type { Activity } from '../../domain/tracking';
import { syncPendingActivities, type ActivityGateway, type PendingActivityRepository } from './sync-activities';

const activity: Activity = {
  id: 'activity-1',
  status: 'finished',
  startedAt: '2026-10-03T10:00:00.000Z',
  finishedAt: '2026-10-03T11:00:00.000Z',
  samples: [],
  distanceKm: 2,
  totalSeconds: 3600,
};

describe('syncPendingActivities', () => {
  it('marks an activity synced only after the gateway confirms it', async () => {
    const repository: PendingActivityRepository = {
      getById: jest.fn(),
      save: jest.fn(),
      listPending: jest.fn().mockResolvedValue([activity]),
      markSynced: jest.fn(),
    };
    const gateway: ActivityGateway = {
      push: jest.fn().mockResolvedValue({ status: 'synced' }),
    };

    await expect(syncPendingActivities(repository, gateway)).resolves.toEqual({ synced: 1, failed: 0 });
    expect(repository.markSynced).toHaveBeenCalledWith('activity-1');
  });

  it('keeps failed activities pending for a later retry', async () => {
    const repository: PendingActivityRepository = {
      getById: jest.fn(),
      save: jest.fn(),
      listPending: jest.fn().mockResolvedValue([activity]),
      markSynced: jest.fn(),
    };
    const gateway: ActivityGateway = {
      push: jest.fn().mockRejectedValue(new Error('offline')),
    };

    await expect(syncPendingActivities(repository, gateway)).resolves.toEqual({ synced: 0, failed: 1 });
    expect(repository.markSynced).not.toHaveBeenCalled();
  });
});
