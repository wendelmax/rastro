import type { ApiClient } from './api-client';
import type { PointOfInterest, TrailVersion } from '../../../domain/trails';
import type { TrailFilters, TrailRepository } from '../../repositories';

export interface AwsTrailRow {
  id: string;
  parent_version_id: string | null;
  author_id: string;
  name: string;
  description: string;
  region: string | null;
  visibility: TrailVersion['visibility'];
  geometry_json: TrailVersion['geometry'];
  estimated_duration_min: number;
  estimated_duration_max: number;
  general_difficulty: TrailVersion['generalDifficulty'];
  vehicle_ratings: TrailVersion['vehicleRatings'];
  status: TrailVersion['status'];
  created_at: string;
  updated_at: string;
}

export class AwsTrailRepository implements TrailRepository {
  constructor(private readonly client: ApiClient) {}

  async listPublic(filters: TrailFilters): Promise<TrailVersion[]> {
    const params = new URLSearchParams({ visibility: 'public' });
    if (filters.region) params.set('region', filters.region);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.vehicleType) params.set('vehicleType', filters.vehicleType);
    const response = await this.client.request<{ items: AwsTrailRow[] }>(`/v1/trails?${params.toString()}`);
    return response.items.filter((row) => row.visibility === 'public').map(mapAwsTrail);
  }

  async getById(id: string): Promise<TrailVersion | null> {
    try {
      const row = await this.client.request<AwsTrailRow>(`/v1/trails/${encodeURIComponent(id)}`);
      return row.visibility === 'public' ? mapAwsTrail(row) : null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('status 404')) return null;
      throw error;
    }
  }

  async save(trail: TrailVersion): Promise<void> {
    await this.client.request('/v1/trails', {
      method: 'PUT',
      body: JSON.stringify(trail),
    });
  }
}

export function mapAwsTrail(row: AwsTrailRow): TrailVersion {
  return {
    id: row.id,
    ...(row.parent_version_id ? { parentVersionId: row.parent_version_id } : {}),
    authorId: row.author_id,
    name: row.name,
    description: row.description,
    ...(row.region ? { region: row.region } : {}),
    visibility: row.visibility,
    geometry: row.geometry_json,
    estimatedDurationMinutes: {
      min: row.estimated_duration_min,
      max: row.estimated_duration_max,
    },
    generalDifficulty: row.general_difficulty,
    vehicleRatings: row.vehicle_ratings,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface AwsPointRow extends Omit<PointOfInterest, 'trailId' | 'verifiedAt'> {
  trail_id: string;
  verified_at: string | null;
}

export class AwsPointRepository {
  constructor(private readonly client: ApiClient) {}

  async listForTrail(trailId: string): Promise<PointOfInterest[]> {
    const response = await this.client.request<{ items: AwsPointRow[] }>(`/v1/trails/${encodeURIComponent(trailId)}/points`);
    return response.items.map((point) => ({
      id: point.id,
      trailId: point.trail_id,
      type: point.type,
      name: point.name,
      description: point.description,
      coordinate: point.coordinate,
      ...(point.verified_at ? { verifiedAt: point.verified_at } : {}),
    }));
  }

  async save(point: PointOfInterest): Promise<void> {
    await this.client.request('/v1/points', {
      method: 'PUT',
      body: JSON.stringify(point),
    });
  }
}
