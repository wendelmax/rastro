import type { PointOfInterest, TrailVersion } from '../domain/trails';
import type { TrailDifficulty, VehicleType } from '../domain/ratings';

export interface TrailFilters {
  vehicleType?: VehicleType;
  difficulty?: TrailDifficulty;
  region?: string;
}

export interface TrailRepository {
  listPublic(filters: TrailFilters): Promise<TrailVersion[]>;
  getById(id: string): Promise<TrailVersion | null>;
  save(trail: TrailVersion): Promise<void>;
}

export interface PointRepository {
  listForTrail(trailId: string): Promise<PointOfInterest[]>;
  save(point: PointOfInterest): Promise<void>;
}

export class InMemoryTrailRepository implements TrailRepository {
  private readonly trails: TrailVersion[];

  constructor(initialTrails: TrailVersion[] = []) {
    this.trails = [...initialTrails];
  }

  async listPublic(filters: TrailFilters): Promise<TrailVersion[]> {
    return this.trails.filter((trail) => {
      if (trail.visibility !== 'public') return false;
      if (filters.difficulty && trail.generalDifficulty !== filters.difficulty) return false;
      if (filters.region && trail.region !== filters.region) return false;
      if (
        filters.vehicleType
        && !trail.vehicleRatings.some((rating) => rating.vehicleType === filters.vehicleType)
      ) {
        return false;
      }
      return true;
    });
  }

  async getById(id: string): Promise<TrailVersion | null> {
    return this.trails.find((trail) => trail.id === id) ?? null;
  }

  async save(trail: TrailVersion): Promise<void> {
    const index = this.trails.findIndex((candidate) => candidate.id === trail.id);
    if (index === -1) {
      this.trails.push(trail);
    } else {
      this.trails[index] = trail;
    }
  }
}

export class InMemoryPointRepository implements PointRepository {
  private readonly points: PointOfInterest[];

  constructor(initialPoints: PointOfInterest[] = []) {
    this.points = [...initialPoints];
  }

  async listForTrail(trailId: string): Promise<PointOfInterest[]> {
    return this.points.filter((point) => point.trailId === trailId);
  }

  async save(point: PointOfInterest): Promise<void> {
    const index = this.points.findIndex((candidate) => candidate.id === point.id);
    if (index === -1) {
      this.points.push(point);
    } else {
      this.points[index] = point;
    }
  }
}
