import { buildTripPlan, type TripPlanInput } from './planning';

const input: TripPlanInput = {
  trail: {
    id: 'trail-1',
    authorId: 'user-1',
    name: 'Serra Azul',
    description: 'Roteiro de teste',
    visibility: 'public',
    geometry: [
      { latitude: -23.55, longitude: -46.63 },
      { latitude: -23.551, longitude: -46.631 },
    ],
    estimatedDurationMinutes: { min: 90, max: 150 },
    generalDifficulty: 'moderate',
    vehicleRatings: [{ vehicleType: '4x4', difficulty: 'moderate' }],
    status: 'open',
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  points: [
    {
      id: 'stop-1',
      trailId: 'trail-1',
      type: 'stop',
      name: 'Parada',
      description: 'Parada',
      coordinate: { latitude: -23.55, longitude: -46.63 },
    },
    {
      id: 'water-1',
      trailId: 'trail-1',
      type: 'water',
      name: 'Água',
      description: 'Água',
      coordinate: { latitude: -23.551, longitude: -46.631 },
    },
  ],
  selectedPointIds: ['stop-1', 'water-1'],
  departureAt: '2026-10-03T10:00:00.000Z',
  stopMinutesByPointId: { 'stop-1': 15, 'water-1': 30 },
  returnBufferMinutes: 45,
};

describe('buildTripPlan', () => {
  it('uses the conservative moving estimate and adds selected stops', () => {
    const summary = buildTripPlan(input);

    expect(summary.movingTimeMinutes).toBe(150);
    expect(summary.stopTimeMinutes).toBe(45);
    expect(summary.finishAt).toBe('2026-10-03T13:15:00.000Z');
    expect(summary.returnAt).toBe('2026-10-03T14:00:00.000Z');
    expect(summary.warnings).toEqual([]);
  });

  it('warns about selected points that do not belong to the trail', () => {
    const summary = buildTripPlan({
      ...input,
      selectedPointIds: ['missing-point'],
      stopMinutesByPointId: { 'missing-point': 20 },
      returnBufferMinutes: undefined,
    });

    expect(summary.finishAt).toBe('2026-10-03T12:30:00.000Z');
    expect(summary.returnAt).toBeUndefined();
    expect(summary.warnings).toContain('Point missing-point does not belong to this trail');
  });
});
