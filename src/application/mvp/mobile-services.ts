import { openDatabaseSync } from 'expo-sqlite';
import { getAppConfig } from '../../lib/config';
import { getAppSession } from '../auth/session-store';
import { SqliteActivityRepository } from '../../data/local/sqlite-activity-repository';
import { createMobileServices } from './aws-services';

const database = openDatabaseSync('rastro.db');
const activityRepository = new SqliteActivityRepository(database);

export const mobileMvpServices = createMobileServices({
  config: getAppConfig(),
  activityRepository,
  tokenProvider: () => getAppSession()?.accessToken ?? null,
});
