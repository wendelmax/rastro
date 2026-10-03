import { openDatabaseSync } from 'expo-sqlite';
import { createMvpServices } from './create-mvp-services';
import { SqliteActivityRepository } from '../../data/local/sqlite-activity-repository';

const database = openDatabaseSync('rastro.db');

export const mobileMvpServices = createMvpServices(new SqliteActivityRepository(database));
