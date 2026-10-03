import type { PointOfInterest, TrailVersion } from '../../domain/trails';
import type { PointRepository, TrailFilters, TrailRepository } from '../repositories';
import { initializeLocalSchema, type LocalDatabase } from './schema';

export interface SqliteRowDatabase extends LocalDatabase {
  getAllAsync<T>(sql: string, ...params: unknown[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, ...params: unknown[]): Promise<T | null>;
  runAsync(sql: string, ...params: unknown[]): Promise<void>;
}

interface TrailRow {
  id: string;
  payload: string;
}

export class SqliteTrailRepository implements TrailRepository, PointRepository {
  constructor(private readonly database: SqliteRowDatabase) {}

  async initialize(): Promise<void> {
    await initializeLocalSchema(this.database);
  }

  async listPublic(filters: TrailFilters): Promise<TrailVersion[]> {
    const rows = await this.database.getAllAsync<TrailRow>(
      'SELECT id, payload FROM trail_versions WHERE visibility = ? ORDER BY updated_at DESC',
      'public',
    );
    return rows
      .map((row) => JSON.parse(row.payload) as TrailVersion)
      .filter((trail) => {
        if (filters.difficulty && trail.generalDifficulty !== filters.difficulty) return false;
        if (filters.region && trail.region !== filters.region) return false;
        return !filters.vehicleType
          || trail.vehicleRatings.some((rating) => rating.vehicleType === filters.vehicleType);
      });
  }

  async getById(id: string): Promise<TrailVersion | null> {
    const row = await this.database.getFirstAsync<TrailRow>(
      'SELECT id, payload FROM trail_versions WHERE id = ?',
      id,
    );
    return row ? JSON.parse(row.payload) as TrailVersion : null;
  }

  async listForTrail(trailId: string): Promise<PointOfInterest[]> {
    const rows = await this.database.getAllAsync<TrailRow>(
      'SELECT id, payload FROM points_of_interest WHERE trail_id = ?',
      trailId,
    );
    return rows.map((row) => JSON.parse(row.payload) as PointOfInterest);
  }

  async savePoint(point: PointOfInterest): Promise<void> {
    await this.database.runAsync(
      'INSERT OR REPLACE INTO points_of_interest (id, trail_id, payload) VALUES (?, ?, ?)',
      point.id,
      point.trailId,
      JSON.stringify(point),
    );
  }

  async save(trail: TrailVersion): Promise<void>;
  async save(point: PointOfInterest): Promise<void>;
  async save(point: TrailVersion | PointOfInterest): Promise<void> {
    if ('geometry' in point) {
      await this.saveTrail(point);
    } else {
      await this.savePoint(point);
    }
  }

  private saveTrail(trail: TrailVersion): Promise<void> {
    return this.database.runAsync(
      'INSERT OR REPLACE INTO trail_versions (id, payload, visibility, updated_at) VALUES (?, ?, ?, ?)',
      trail.id,
      JSON.stringify(trail),
      trail.visibility,
      trail.updatedAt,
    );
  }
}
