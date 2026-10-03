import { averageDifficulty, type VehicleRating } from './ratings';

describe('averageDifficulty', () => {
  it('returns the rounded community difficulty for a vehicle type', () => {
    const ratings: VehicleRating[] = [
      { vehicleType: '4x4', difficulty: 'moderate' },
      { vehicleType: '4x4', difficulty: 'difficult' },
      { vehicleType: 'quadricycle', difficulty: 'easy' },
    ];

    expect(averageDifficulty(ratings, '4x4')).toBe('difficult');
    expect(averageDifficulty(ratings, 'quadricycle')).toBe('easy');
    expect(averageDifficulty(ratings, 'quadricycle')).not.toBe('moderate');
  });

  it('returns null when the vehicle has no ratings', () => {
    expect(averageDifficulty([], '4x4')).toBeNull();
  });
});
