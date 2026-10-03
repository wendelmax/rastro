import { buildTripPlan } from './build-trip-plan';
import type { TripPlanInput } from '../../domain/planning';

describe('application buildTripPlan', () => {
  it('exposes the domain planner through the application boundary', () => {
    const input = {
      trail: {
        id: 'trail-1',
        authorId: 'user-1',
        name: 'Trilha',
        description: 'Teste',
        visibility: 'public' as const,
        geometry: [
          { latitude: -23.55, longitude: -46.63 },
          { latitude: -23.551, longitude: -46.631 },
        ],
        estimatedDurationMinutes: { min: 30, max: 60 },
        generalDifficulty: 'easy' as const,
        vehicleRatings: [{ vehicleType: '4x4' as const, difficulty: 'easy' as const }],
        status: 'open' as const,
        createdAt: '2026-10-01T10:00:00.000Z',
        updatedAt: '2026-10-01T10:00:00.000Z',
      },
      points: [],
      selectedPointIds: [],
      departureAt: '2026-10-03T10:00:00.000Z',
      stopMinutesByPointId: {},
    } satisfies TripPlanInput;

    expect(buildTripPlan(input).finishAt).toBe('2026-10-03T11:00:00.000Z');
  });
});
