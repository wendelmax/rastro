import type { SqlParameter } from '@aws-sdk/client-rds-data';
import { createDefaultSqlExecutor, type SqlExecutor } from '../shared/db';
import { errorResponse, jsonResponse, optionalUserId, parseBody, requireUserId, type HttpApiEvent, type HttpResponse } from '../shared/http';

export async function handleTrails(event: HttpApiEvent, db: SqlExecutor = createDefaultSqlExecutor()): Promise<HttpResponse> {
  try {
    const method = event.requestContext.http.method;
    if (method === 'GET' && event.pathParameters?.id) {
      const userId = optionalUserId(event);
      const rows = await db.query(
        "SELECT * FROM trail_versions WHERE id = :id AND (visibility = 'public' OR author_id = :author_id)",
        parameters({ id: event.pathParameters.id, author_id: userId ?? '' }),
      );
      return rows[0] ? jsonResponse(200, rows[0]) : jsonResponse(404, { message: 'trail not found' });
    }
    if (method === 'GET') {
      const query = event.queryStringParameters ?? {};
      const rows = await db.query(
        "SELECT * FROM trail_versions WHERE visibility = 'public' ORDER BY updated_at DESC",
        parameters({ region: query.region ?? null, difficulty: query.difficulty ?? null }),
      );
      return jsonResponse(200, { items: rows });
    }
    if (method === 'PUT') {
      const authorId = requireUserId(event);
      const trail = parseBody<Record<string, unknown>>(event);
      const duration = trail.estimatedDurationMinutes as { min?: number; max?: number } | undefined;
      await db.execute(
        `INSERT INTO trail_versions (id, author_id, name, description, visibility, geometry_json, estimated_duration_min, estimated_duration_max, general_difficulty, vehicle_ratings, status, created_at, updated_at)
         VALUES (:id, :author_id, :name, :description, :visibility, :geometry_json, :duration_min, :duration_max, :difficulty, :vehicle_ratings, :status, :created_at, :updated_at)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, visibility = EXCLUDED.visibility, updated_at = EXCLUDED.updated_at
         WHERE trail_versions.author_id = :author_id`,
        parameters({
          id: trail.id, author_id: authorId, name: trail.name, description: trail.description,
          visibility: trail.visibility, geometry_json: JSON.stringify(trail.geometry),
          duration_min: duration?.min, duration_max: duration?.max,
          difficulty: trail.generalDifficulty, vehicle_ratings: JSON.stringify(trail.vehicleRatings),
          status: trail.status, created_at: trail.createdAt, updated_at: trail.updatedAt,
        }),
      );
      return jsonResponse(200, { id: trail.id });
    }
    return jsonResponse(405, { message: 'method not allowed' });
  } catch (error) {
    return errorResponse(error);
  }
}

function parameters(values: Record<string, unknown>): SqlParameter[] {
  return Object.entries(values).map(([name, value]) => ({
    name: `:${name}`,
    value: value === null || value === undefined ? { isNull: true } : { stringValue: typeof value === 'string' ? value : JSON.stringify(value) },
  }));
}
