import type { SqlParameter } from '@aws-sdk/client-rds-data';
import { createDefaultSqlExecutor, type SqlExecutor } from '../shared/db';
import { errorResponse, jsonResponse, parseBody, requireUserId, type HttpApiEvent, type HttpResponse } from '../shared/http';

export async function handleActivities(event: HttpApiEvent, db: SqlExecutor = createDefaultSqlExecutor()): Promise<HttpResponse> {
  try {
    const authorId = requireUserId(event);
    const body = parseBody<{ activity?: Record<string, unknown> }>(event);
    const activity = body.activity;
    if (!activity?.id) return jsonResponse(400, { message: 'activity.id is required' });
    await db.execute(
      `INSERT INTO activities (id, author_id, trail_id, status, started_at, finished_at, distance_km, total_seconds, samples)
       VALUES (:id, :author_id, :trail_id, :status, :started_at, :finished_at, :distance_km, :total_seconds, :samples)
       ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, finished_at = EXCLUDED.finished_at, distance_km = EXCLUDED.distance_km, total_seconds = EXCLUDED.total_seconds, samples = EXCLUDED.samples
       WHERE activities.author_id = :author_id`,
      parameters({
        id: activity.id, author_id: authorId, trail_id: activity.trailId ?? null, status: activity.status,
        started_at: activity.startedAt, finished_at: activity.finishedAt ?? null, distance_km: activity.distanceKm,
        total_seconds: activity.totalSeconds, samples: JSON.stringify(activity.samples ?? []),
      }),
    );
    return jsonResponse(200, { status: 'synced', id: activity.id });
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
