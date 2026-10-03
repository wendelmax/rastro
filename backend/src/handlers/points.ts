import { createDefaultSqlExecutor, type SqlExecutor } from '../shared/db';
import { errorResponse, jsonResponse, parseBody, requireUserId, type HttpApiEvent, type HttpResponse } from '../shared/http';

export async function handlePoints(event: HttpApiEvent, db: SqlExecutor = createDefaultSqlExecutor()): Promise<HttpResponse> {
  try {
    if (event.requestContext.http.method === 'GET') {
      const trailId = event.pathParameters?.trailId;
      if (!trailId) return jsonResponse(400, { message: 'trailId is required' });
      return jsonResponse(200, { items: await db.query('SELECT * FROM points_of_interest WHERE trail_id = :trail_id', [{ name: ':trail_id', value: { stringValue: trailId } }]) });
    }
    const authorId = requireUserId(event);
    const point = parseBody<Record<string, unknown>>(event);
    await db.execute(
      'INSERT INTO points_of_interest (id, trail_id, author_id, type, name, description, coordinate) VALUES (:id, :trail_id, :author_id, :type, :name, :description, :coordinate) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description',
      Object.entries({ id: point.id, trail_id: point.trailId, author_id: authorId, type: point.type, name: point.name, description: point.description, coordinate: JSON.stringify(point.coordinate) }).map(([name, value]) => ({ name: `:${name}`, value: { stringValue: String(value) } })),
    );
    return jsonResponse(200, { id: point.id });
  } catch (error) {
    return errorResponse(error);
  }
}
