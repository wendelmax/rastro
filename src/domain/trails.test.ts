import { createFork, validateTrail, type TrailVersion } from './trails';

const sourceTrail: TrailVersion = {
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
};

describe('trail domain', () => {
  it('rejects a trail without a usable geometry', () => {
    const result = validateTrail({ ...sourceTrail, geometry: [] });

    expect(result).toEqual({
      valid: false,
      errors: ['geometry must contain at least two points'],
    });
  });

  it('creates a fork without mutating the source trail', () => {
    const fork = createFork(sourceTrail, {
      name: 'Serra Azul — desvio da ponte',
      description: 'Versão com desvio atualizado',
      status: 'partially_blocked',
    }, 'user-2');

    expect(fork.id).not.toBe(sourceTrail.id);
    expect(fork.parentVersionId).toBe(sourceTrail.id);
    expect(fork.authorId).toBe('user-2');
    expect(fork.name).toBe('Serra Azul — desvio da ponte');
    expect(sourceTrail.status).toBe('open');
  });
});
