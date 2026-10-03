import { AwsTrailRepository, mapAwsTrail } from './aws-trail-repository';
import type { ApiClient } from './api-client';

describe('AwsTrailRepository', () => {
  it('maps API trail payloads and excludes non-public results', async () => {
    const client = {
      request: jest.fn().mockResolvedValue({
        items: [{
          id: 'trail-public',
          parent_version_id: null,
          author_id: 'user-1',
          name: 'Serra AWS',
          description: 'Trecho de terra.',
          region: 'MG',
          visibility: 'public',
          geometry_json: [{ latitude: -19, longitude: -44 }],
          estimated_duration_min: 60,
          estimated_duration_max: 120,
          general_difficulty: 'moderate',
          vehicle_ratings: [],
          status: 'open',
          created_at: '2026-10-03T10:00:00.000Z',
          updated_at: '2026-10-03T10:00:00.000Z',
        }, {
          id: 'trail-private',
          visibility: 'private',
        }],
      }),
    } as unknown as ApiClient;
    const repository = new AwsTrailRepository(client);

    await expect(repository.listPublic({})).resolves.toEqual([expect.objectContaining({
      id: 'trail-public',
      name: 'Serra AWS',
      visibility: 'public',
    })]);
  });

  it('maps the API duration and geometry fields to the domain shape', () => {
    expect(mapAwsTrail({
      id: 'trail-1',
      parent_version_id: null,
      author_id: 'user-1',
      name: 'Rastro',
      description: 'Descrição',
      region: null,
      visibility: 'public',
      geometry_json: [{ latitude: 1, longitude: 2 }],
      estimated_duration_min: 10,
      estimated_duration_max: 20,
      general_difficulty: 'easy',
      vehicle_ratings: [],
      status: 'unknown',
      created_at: '2026-10-03T10:00:00.000Z',
      updated_at: '2026-10-03T10:00:00.000Z',
    })).toMatchObject({
      estimatedDurationMinutes: { min: 10, max: 20 },
      geometry: [{ latitude: 1, longitude: 2 }],
    });
  });
});
