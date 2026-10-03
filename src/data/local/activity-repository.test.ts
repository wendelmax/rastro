import { InMemoryActivityRepository } from './activity-repository';

describe('InMemoryActivityRepository', () => {
  it('upserts activities and returns a copy for local recovery', async () => {
    const repository = new InMemoryActivityRepository();
    const activity = {
      id: 'activity-1',
      trailId: undefined,
      status: 'recording' as const,
      startedAt: '2026-10-03T10:00:00.000Z',
      samples: [],
      distanceKm: 0,
      totalSeconds: 0,
    };

    await repository.save(activity);
    const loaded = await repository.getById(activity.id);

    expect(loaded).toEqual(activity);
    expect(loaded).not.toBe(activity);
  });
});
