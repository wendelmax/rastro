import { buildTripPlan } from '../src/application/planning/build-trip-plan';
import { createMvpServices } from '../src/application/mvp/create-mvp-services';

describe('Rastro MVP vertical flow', () => {
  it('connects discovery, planning, tracking and contribution with local data', async () => {
    const services = createMvpServices();
    const trails = await services.trailRepository.listPublic({ vehicleType: '4x4' });
    const trail = trails[0]!;
    const points = await services.pointRepository.listForTrail(trail.id);
    const plan = buildTripPlan({
      trail,
      points,
      selectedPointIds: points.map((point) => point.id),
      departureAt: '2026-10-03T10:00:00.000Z',
      stopMinutesByPointId: Object.fromEntries(points.map((point) => [point.id, 15])),
    });
    const session = services.createTrackingSession(() => 'activity-vertical');

    await session.start(trail.id);
    await session.appendLocation({ ...trail.geometry[0]!, timestamp: '2026-10-03T10:00:00.000Z' });
    await session.appendLocation({ ...trail.geometry[1]!, timestamp: '2026-10-03T12:00:00.000Z' });
    const activity = await session.finish();
    const contribution = await services.publishActivityService.publishActivity(activity.id, {
      authorId: 'user-vertical',
      title: `${trail.name} atualizada`,
      description: 'Relato do piloto.',
      createTrailFork: false,
      visibility: 'public',
    });

    expect(trail.name).toBe('Serra Azul');
    expect(plan.stopTimeMinutes).toBe(45);
    expect(activity.status).toBe('finished');
    expect(contribution).toMatchObject({ status: 'published', activityId: 'activity-vertical' });
  });
});
