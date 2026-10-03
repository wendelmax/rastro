import { createDemoRepository } from './demo/demo-trails';
import { initializeLocalSchema, LOCAL_SCHEMA_SQL } from './local/schema';

describe('local trail repositories', () => {
  it('lists only public trails and applies vehicle and difficulty filters', async () => {
    const { trailRepository } = createDemoRepository();

    const publicTrails = await trailRepository.listPublic({});
    const quadricycleTrails = await trailRepository.listPublic({ vehicleType: 'quadricycle' });
    const difficultTrails = await trailRepository.listPublic({ difficulty: 'difficult' });

    expect(publicTrails).toHaveLength(3);
    expect(publicTrails.every((trail) => trail.visibility === 'public')).toBe(true);
    expect(quadricycleTrails.every((trail) => (
      trail.vehicleRatings.some((rating) => rating.vehicleType === 'quadricycle')
    ))).toBe(true);
    expect(difficultTrails.every((trail) => trail.generalDifficulty === 'difficult')).toBe(true);
  });

  it('returns a trail with at least stop, water and viewpoint demo points', async () => {
    const { trailRepository, pointRepository } = createDemoRepository();
    const trails = await trailRepository.listPublic({});

    const points = await Promise.all(
      trails.map((trail) => pointRepository.listForTrail(trail.id)),
    );
    const pointTypes = new Set(points.flat().map((point) => point.type));

    expect(pointTypes).toEqual(new Set(['stop', 'water', 'viewpoint']));
  });

  it('keeps private trails out of public listing while allowing direct local lookup', async () => {
    const { trailRepository } = createDemoRepository();
    const privateTrail = await trailRepository.getById('trail-private-demo');

    expect(await trailRepository.listPublic({})).not.toContain(privateTrail);
    expect(privateTrail?.visibility).toBe('private');
  });

  it('initializes the local schema through the database boundary', async () => {
    const database = { execAsync: jest.fn().mockResolvedValue(undefined) };

    await initializeLocalSchema(database);

    expect(database.execAsync).toHaveBeenCalledWith(LOCAL_SCHEMA_SQL);
  });
});
