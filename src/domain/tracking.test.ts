import { TrackingSession, type LocationSample } from './tracking';
import { InMemoryActivityRepository } from '../data/local/activity-repository';

const firstSample: LocationSample = {
  latitude: -23.55,
  longitude: -46.63,
  timestamp: '2026-10-03T10:00:00.000Z',
};

const secondSample: LocationSample = {
  latitude: -23.551,
  longitude: -46.631,
  timestamp: '2026-10-03T10:05:00.000Z',
};

describe('TrackingSession', () => {
  it('supports recording, pause, resume and finish while calculating distance', async () => {
    const repository = new InMemoryActivityRepository();
    const session = new TrackingSession(repository, () => 'activity-1');

    await session.start('trail-1');
    await session.appendLocation(firstSample);
    await session.pause();
    await expect(session.appendLocation(secondSample)).rejects.toThrow('tracking is paused');
    await session.resume();
    const snapshot = await session.appendLocation(secondSample);
    const activity = await session.finish();

    expect(snapshot.sampleCount).toBe(2);
    expect(snapshot.distanceKm).toBeGreaterThan(0);
    expect(activity.status).toBe('finished');
    expect(activity.samples).toHaveLength(2);
    expect(await repository.getById('activity-1')).toEqual(activity);
  });

  it('preserves captured samples in local storage before any remote sync', async () => {
    const repository = new InMemoryActivityRepository();
    const session = new TrackingSession(repository, () => 'activity-2');

    await session.start();
    await session.appendLocation(firstSample);

    const stored = await repository.getById('activity-2');
    expect(stored?.samples).toEqual([firstSample]);
    expect(stored?.status).toBe('recording');
  });
});
