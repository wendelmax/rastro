import type { Activity } from '../../domain/tracking';
import { SqliteActivityRepository, type SyncActivityDatabase } from './sqlite-activity-repository';

describe('SqliteActivityRepository', () => {
  it('persists and reloads an activity payload through SQLite', async () => {
    const rows = new Map<string, string>();
    const database = {
      execSync: jest.fn(),
      runSync: jest.fn((_sql: string, id: string, payload: string) => rows.set(id, payload)),
      getFirstSync: jest.fn((_sql: string, id: string) => {
        const payload = rows.get(id);
        return payload ? { payload } : null;
      }),
    } as unknown as SyncActivityDatabase;
    const repository = new SqliteActivityRepository(database);
    const activity: Activity = {
      id: 'activity-sqlite',
      status: 'recording',
      startedAt: '2026-10-03T10:00:00.000Z',
      samples: [],
      distanceKm: 0,
      totalSeconds: 0,
    };

    await repository.save(activity);

    await expect(repository.getById(activity.id)).resolves.toEqual(activity);
    expect(database.execSync).toHaveBeenCalled();
    expect(database.runSync).toHaveBeenCalled();
  });
});
