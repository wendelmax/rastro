import * as Location from 'expo-location';
import { LOCATION_TASK_NAME } from './background-task';

export async function requestTrackingPermissions(): Promise<boolean> {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== Location.PermissionStatus.GRANTED) return false;

  const background = await Location.requestBackgroundPermissionsAsync();
  return background.status === Location.PermissionStatus.GRANTED;
}

export function startLocationUpdates(taskName = LOCATION_TASK_NAME): Promise<void> {
  return Location.startLocationUpdatesAsync(taskName, {
    accuracy: Location.Accuracy.BestForNavigation,
    distanceInterval: 10,
    pausesUpdatesAutomatically: false,
    foregroundService: {
      notificationTitle: 'Rastro registrando atividade',
      notificationBody: 'Sua posição está sendo salva localmente.',
    },
  });
}

export function stopLocationUpdates(taskName = LOCATION_TASK_NAME): Promise<void> {
  return Location.stopLocationUpdatesAsync(taskName);
}
