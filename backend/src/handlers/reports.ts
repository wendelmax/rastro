import type { SqlParameter } from '@aws-sdk/client-rds-data';
import { createDefaultSqlExecutor, type SqlExecutor } from '../shared/db';
import { errorResponse, jsonResponse, parseBody, requireUserId, type HttpApiEvent, type HttpResponse } from '../shared/http';

interface ReportBody {
  id?: unknown;
  activityId?: unknown;
  title?: unknown;
  description?: unknown;
  visibility?: unknown;
}

export async function handleReports(event: HttpApiEvent, db: SqlExecutor = createDefaultSqlExecutor()): Promise<HttpResponse> {
  try {
    const authorId = requireUserId(event);
    const report = parseBody<ReportBody>(event);
    if (!report.id || !report.activityId || !report.title || !report.description) {
      return jsonResponse(400, { message: 'id, activityId, title and description are required' });
    }
    if (!['public', 'private', 'group'].includes(String(report.visibility))) {
      return jsonResponse(400, { message: 'visibility is invalid' });
    }
    await db.execute(
      `INSERT INTO activity_reports (id, activity_id, author_id, title, description, visibility)
       VALUES (:id, :activity_id, :author_id, :title, :description, :visibility)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, visibility = EXCLUDED.visibility
       WHERE activity_reports.author_id = :author_id`,
      parameters({
        id: report.id,
        activity_id: report.activityId,
        author_id: authorId,
        title: report.title,
        description: report.description,
        visibility: report.visibility,
      }),
    );
    return jsonResponse(200, { status: 'published', id: report.id });
  } catch (error) {
    return errorResponse(error);
  }
}

export const handler = handleReports;

function parameters(values: Record<string, unknown>): SqlParameter[] {
  return Object.entries(values).map(([name, value]) => ({
    name: `:${name}`,
    value: value === null || value === undefined ? { isNull: true } : { stringValue: String(value) },
  }));
}
