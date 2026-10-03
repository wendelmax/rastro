export const LOCAL_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS trail_versions (
  id TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  visibility TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS points_of_interest (
  id TEXT PRIMARY KEY NOT NULL,
  trail_id TEXT NOT NULL,
  payload TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS offline_packages (
  trail_id TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  downloaded_at TEXT NOT NULL
);
`;

export interface LocalDatabase {
  execAsync(sql: string): Promise<void>;
}

export function initializeLocalSchema(database: LocalDatabase): Promise<void> {
  return database.execAsync(LOCAL_SCHEMA_SQL);
}
