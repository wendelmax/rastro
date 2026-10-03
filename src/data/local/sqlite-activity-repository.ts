import type { ActivityRepository } from './activity-repository';
import type { Activity } from '../../domain/tracking';
import type { PendingActivityRepository } from '../../application/sync/sync-activities';

export const ACTIVITY_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL
  ,sync_status TEXT NOT NULL DEFAULT 'pending'
);
`;

export interface SyncActivityDatabase {
  execSync(sql: string): void;
  runSync(sql: string, ...params: unknown[]): unknown;
  getFirstSync<T>(sql: string, ...params: unknown[]): T | null;
  getAllSync<T>(sql: string, ...params: unknown[]): T[];
}

interface ActivityRow {
  payload: string;
}

export class SqliteActivityRepository implements ActivityRepository, PendingActivityRepository {
  constructor(private readonly database: SyncActivityDatabase) {
    database.execSync(ACTIVITY_SCHEMA_SQL);
  }

  async save(activity: Activity): Promise<void> {
    this.database.runSync(
      'INSERT OR REPLACE INTO activities (id, payload, status, updated_at, sync_status) VALUES (?, ?, ?, ?, ?)',
      activity.id,
      JSON.stringify(activity),
      activity.status,
      activity.finishedAt ?? activity.startedAt,
      'pending',
    );
  }

  async getById(id: string): Promise<Activity | null> {
    const row = this.database.getFirstSync<ActivityRow>(
      'SELECT payload FROM activities WHERE id = ?',
      id,
    );
    return row ? JSON.parse(row.payload) as Activity : null;
  }

  async listPending(): Promise<Activity[]> {
    const rows = this.database.getAllSync<ActivityRow>(
      "SELECT payload FROM activities WHERE status = 'finished' AND sync_status = 'pending'",
    );
    return rows.map((row) => JSON.parse(row.payload) as Activity);
  }

  async markSynced(id: string): Promise<void> {
    this.database.runSync('UPDATE activities SET sync_status = ? WHERE id = ?', 'synced', id);
  }
}
