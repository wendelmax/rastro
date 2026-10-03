jest.mock('expo-location', () => ({
  Accuracy: { BestForNavigation: 6 },
  PermissionStatus: { GRANTED: 'granted' },
  requestBackgroundPermissionsAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  startLocationUpdatesAsync: jest.fn(),
  stopLocationUpdatesAsync: jest.fn(),
}));
jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
}));

import * as Location from 'expo-location';
import { requestTrackingPermissions, startLocationUpdates } from './location-adapter';

describe('location adapter', () => {
  it('requires foreground and background permissions', async () => {
    jest.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValueOnce({ status: 'granted' } as never);
    jest.mocked(Location.requestBackgroundPermissionsAsync).mockResolvedValueOnce({ status: 'denied' } as never);

    await expect(requestTrackingPermissions()).resolves.toBe(false);
  });

  it('starts a background location task with navigation-friendly settings', async () => {
    jest.mocked(Location.startLocationUpdatesAsync).mockResolvedValueOnce(undefined);

    await startLocationUpdates('rastro-test-task');

    expect(Location.startLocationUpdatesAsync).toHaveBeenCalledWith(
      'rastro-test-task',
      expect.objectContaining({
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 10,
      }),
    );
  });
});
