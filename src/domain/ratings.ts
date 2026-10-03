export type VehicleType = '4x4' | 'quadricycle';
export type TrailDifficulty = 'easy' | 'moderate' | 'difficult' | 'extreme';

export interface VehicleRating {
  vehicleType: VehicleType;
  difficulty: TrailDifficulty;
  note?: string;
}

const difficultyScores: Record<TrailDifficulty, number> = {
  easy: 1,
  moderate: 2,
  difficult: 3,
  extreme: 4,
};

export function averageDifficulty(
  ratings: VehicleRating[],
  vehicleType: VehicleType,
): TrailDifficulty | null {
  const matchingRatings = ratings.filter((rating) => rating.vehicleType === vehicleType);
  if (matchingRatings.length === 0) {
    return null;
  }

  const averageScore = matchingRatings.reduce(
    (total, rating) => total + difficultyScores[rating.difficulty],
    0,
  ) / matchingRatings.length;

  return scoreToDifficulty(Math.round(averageScore));
}

function scoreToDifficulty(score: number): TrailDifficulty {
  if (score <= 1) return 'easy';
  if (score === 2) return 'moderate';
  if (score === 3) return 'difficult';
  return 'extreme';
}
