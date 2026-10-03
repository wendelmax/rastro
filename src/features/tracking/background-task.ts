import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const LOCATION_TASK_NAME = 'rastro-location';

export function defineLocationTask(
  onLocationUpdate: (locations: Location.LocationObject[]) => void,
): void {
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error || !data) return;
    const taskData = data as { locations?: Location.LocationObject[] };
    if (taskData.locations) onLocationUpdate(taskData.locations);
  });
}
