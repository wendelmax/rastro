import type { PointOfInterest, TrailVersion } from './trails';

export interface TripPlanInput {
  trail: TrailVersion;
  points: PointOfInterest[];
  selectedPointIds: string[];
  departureAt: string;
  stopMinutesByPointId: Record<string, number>;
  returnBufferMinutes?: number;
}

export interface TripPlanSummary {
  movingTimeMinutes: number;
  stopTimeMinutes: number;
  finishAt: string;
  returnAt?: string;
  warnings: string[];
}

export function buildTripPlan(input: TripPlanInput): TripPlanSummary {
  const departure = new Date(input.departureAt);
  if (Number.isNaN(departure.getTime())) {
    throw new Error('departureAt must be a valid ISO date');
  }

  const pointsById = new Map(input.points.map((point) => [point.id, point]));
  const warnings: string[] = [];
  let stopTimeMinutes = 0;

  for (const pointId of input.selectedPointIds) {
    const point = pointsById.get(pointId);
    if (!point || point.trailId !== input.trail.id) {
      warnings.push(`Point ${pointId} does not belong to this trail`);
      continue;
    }
    stopTimeMinutes += Math.max(0, input.stopMinutesByPointId[pointId] ?? 0);
  }

  const movingTimeMinutes = input.trail.estimatedDurationMinutes.max;
  const finishAt = addMinutes(departure, movingTimeMinutes + stopTimeMinutes);
  const returnAt = input.returnBufferMinutes === undefined
    ? undefined
    : addMinutes(finishAt, Math.max(0, input.returnBufferMinutes));

  return {
    movingTimeMinutes,
    stopTimeMinutes,
    finishAt: finishAt.toISOString(),
    ...(returnAt ? { returnAt: returnAt.toISOString() } : {}),
    warnings,
  };
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}
