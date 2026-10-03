import { filterRemoteTrails } from './supabase-trail-repository';
import type { TrailVersion } from '../../domain/trails';

const trail = (id: string, vehicleType: '4x4' | 'quadricycle'): TrailVersion => ({
  id,
  authorId: 'user-1',
  name: id,
  description: 'Teste',
  visibility: 'public',
  geometry: [
    { latitude: -23.55, longitude: -46.63 },
    { latitude: -23.551, longitude: -46.631 },
  ],
  estimatedDurationMinutes: { min: 30, max: 60 },
  generalDifficulty: 'easy',
  vehicleRatings: [{ vehicleType, difficulty: 'easy' }],
  status: 'open',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-01T10:00:00.000Z',
});

describe('filterRemoteTrails', () => {
  it('filters the remote result by vehicle type', () => {
    expect(filterRemoteTrails(
      [trail('4x4-trail', '4x4'), trail('quad-trail', 'quadricycle')],
      { vehicleType: 'quadricycle' },
    ).map((item) => item.id)).toEqual(['quad-trail']);
  });
});
