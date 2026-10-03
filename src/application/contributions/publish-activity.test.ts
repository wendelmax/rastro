import { InMemoryActivityRepository } from '../../data/local/activity-repository';
import { createDemoRepository } from '../../data/demo/demo-trails';
import type { Activity } from '../../domain/tracking';
import { PublishActivityService } from './publish-activity';

const activity: Activity = {
  id: 'activity-1',
  trailId: 'trail-serra-azul',
  status: 'finished',
  startedAt: '2026-10-03T10:00:00.000Z',
  finishedAt: '2026-10-03T12:00:00.000Z',
  samples: [
    { latitude: -23.55, longitude: -46.63, timestamp: '2026-10-03T10:00:00.000Z' },
    { latitude: -23.551, longitude: -46.631, timestamp: '2026-10-03T12:00:00.000Z' },
  ],
  distanceKm: 0.15,
  totalSeconds: 7200,
};

describe('PublishActivityService', () => {
  it('publishes a trail update as a fork linked to the original', async () => {
    const activityRepository = new InMemoryActivityRepository();
    await activityRepository.save(activity);
    const { trailRepository } = createDemoRepository();
    const service = new PublishActivityService({ activityRepository, trailRepository });

    const result = await service.publishActivity('activity-1', {
      authorId: 'user-2',
      title: 'Desvio da ponte',
      description: 'A ponte está parcialmente bloqueada.',
      createTrailFork: true,
      visibility: 'public',
    });

    expect('parentVersionId' in result).toBe(true);
    if ('parentVersionId' in result) {
      expect(result.parentVersionId).toBe('trail-serra-azul');
      expect(result.authorId).toBe('user-2');
    }
  });

  it('publishes a report without changing the source trail', async () => {
    const activityRepository = new InMemoryActivityRepository();
    await activityRepository.save(activity);
    const { trailRepository } = createDemoRepository();
    const service = new PublishActivityService({ activityRepository, trailRepository });

    const result = await service.publishActivity('activity-1', {
      authorId: 'user-2',
      title: 'Condição atual',
      description: 'Trecho com lama leve.',
      createTrailFork: false,
      visibility: 'public',
    });

    expect(result).toMatchObject({
      activityId: 'activity-1',
      authorId: 'user-2',
      visibility: 'public',
      status: 'published',
    });
    expect((await trailRepository.getById('trail-serra-azul'))?.name).toBe('Serra Azul');
  });
});
