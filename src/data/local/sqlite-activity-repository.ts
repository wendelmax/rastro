import type { ActivityRepository } from './activity-repository';
import type { Activity } from '../../domain/tracking';

export const ACTIVITY_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;

export interface SyncActivityDatabase {
  execSync(sql: string): void;
  runSync(sql: string, ...params: unknown[]): unknown;
  getFirstSync<T>(sql: string, ...params: unknown[]): T | null;
}

interface ActivityRow {
  payload: string;
}

export class SqliteActivityRepository implements ActivityRepository {
  constructor(private readonly database: SyncActivityDatabase) {
    database.execSync(ACTIVITY_SCHEMA_SQL);
  }

  async save(activity: Activity): Promise<void> {
    this.database.runSync(
      'INSERT OR REPLACE INTO activities (id, payload, status, updated_at) VALUES (?, ?, ?, ?)',
      activity.id,
      JSON.stringify(activity),
      activity.status,
      activity.finishedAt ?? activity.startedAt,
    );
  }

  async getById(id: string): Promise<Activity | null> {
    const row = this.database.getFirstSync<ActivityRow>(
      'SELECT payload FROM activities WHERE id = ?',
      id,
    );
    return row ? JSON.parse(row.payload) as Activity : null;
  }
}
