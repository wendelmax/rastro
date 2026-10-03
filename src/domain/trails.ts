import type { GeoPoint } from './geo';
import type { TrailDifficulty, VehicleRating } from './ratings';

export type TrailVisibility = 'public' | 'private' | 'group';
export type TrailStatus = 'unknown' | 'open' | 'partially_blocked' | 'closed';
export type PointOfInterestType =
  | 'stop'
  | 'viewpoint'
  | 'water'
  | 'fuel'
  | 'food'
  | 'camping'
  | 'bathroom'
  | 'obstacle'
  | 'crossing'
  | 'gate'
  | 'support';

export interface DurationRange {
  min: number;
  max: number;
}

export interface TrailVersion {
  id: string;
  parentVersionId?: string;
  authorId: string;
  name: string;
  description: string;
  region?: string;
  visibility: TrailVisibility;
  geometry: GeoPoint[];
  estimatedDurationMinutes: DurationRange;
  generalDifficulty: TrailDifficulty;
  vehicleRatings: VehicleRating[];
  status: TrailStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PointOfInterest {
  id: string;
  trailId: string;
  type: PointOfInterestType;
  name: string;
  description: string;
  coordinate: GeoPoint;
  verifiedAt?: string;
}

export type TrailPatch = Partial<Pick<
  TrailVersion,
  | 'name'
  | 'description'
  | 'visibility'
  | 'geometry'
  | 'estimatedDurationMinutes'
  | 'generalDifficulty'
  | 'vehicleRatings'
  | 'status'
>>;

export interface TrailValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTrail(trail: TrailVersion): TrailValidationResult {
  const errors: string[] = [];

  if (trail.geometry.length < 2) {
    errors.push('geometry must contain at least two points');
  }
  if (!trail.name.trim()) {
    errors.push('name is required');
  }
  if (trail.estimatedDurationMinutes.min > trail.estimatedDurationMinutes.max) {
    errors.push('minimum duration cannot exceed maximum duration');
  }

  return { valid: errors.length === 0, errors };
}

export function createFork(source: TrailVersion, patch: TrailPatch, authorId: string): TrailVersion {
  const now = new Date().toISOString();
  return {
    ...source,
    ...patch,
    id: `${source.id}:fork:${authorId}:${Date.now()}`,
    parentVersionId: source.id,
    authorId,
    createdAt: now,
    updatedAt: now,
  };
}
