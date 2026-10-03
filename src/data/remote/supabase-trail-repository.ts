import type { SupabaseClient } from '@supabase/supabase-js';
import type { PointOfInterest, TrailVersion } from '../../domain/trails';
import type { TrailFilters, TrailRepository } from '../repositories';

interface TrailRow {
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

export class SupabaseTrailRepository implements TrailRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listPublic(filters: TrailFilters): Promise<TrailVersion[]> {
    let query = this.client
      .from('trail_versions')
      .select('*')
      .eq('visibility', 'public')
      .order('updated_at', { ascending: false });

    if (filters.region) query = query.eq('region', filters.region);
    if (filters.difficulty) query = query.eq('general_difficulty', filters.difficulty);

    const { data, error } = await query;
    if (error) throw error;
    return filterRemoteTrails((data as TrailRow[]).map(mapTrail), filters);
  }

  async getById(id: string): Promise<TrailVersion | null> {
    const { data, error } = await this.client
      .from('trail_versions')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapTrail(data as TrailRow) : null;
  }

  async save(trail: TrailVersion): Promise<void> {
    const { error } = await this.client.from('trail_versions').upsert({
      id: trail.id,
      parent_version_id: trail.parentVersionId ?? null,
      author_id: trail.authorId,
      name: trail.name,
      description: trail.description,
      region: trail.region ?? null,
      visibility: trail.visibility,
      geometry_json: trail.geometry,
      estimated_duration_min: trail.estimatedDurationMinutes.min,
      estimated_duration_max: trail.estimatedDurationMinutes.max,
      general_difficulty: trail.generalDifficulty,
      vehicle_ratings: trail.vehicleRatings,
      status: trail.status,
      created_at: trail.createdAt,
      updated_at: trail.updatedAt,
    });
    if (error) throw error;
  }
}

export function mapTrail(row: TrailRow): TrailVersion {
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

export function filterRemoteTrails(trails: TrailVersion[], filters: TrailFilters): TrailVersion[] {
  return trails.filter((trail) => !filters.vehicleType
    || trail.vehicleRatings.some((rating) => rating.vehicleType === filters.vehicleType));
}

export type RemotePoint = Pick<PointOfInterest, 'id' | 'trailId' | 'type' | 'name' | 'description' | 'coordinate'>;
