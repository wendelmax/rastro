import { useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { mobileMvpServices } from '../src/application/mvp/mobile-services';
import type { LocationSample, TrackingSession } from '../src/domain/tracking';
import {
  requestTrackingPermissions,
  startLocationUpdates,
  stopLocationUpdates,
} from '../src/features/tracking/location-adapter';
import { defineLocationTask } from '../src/features/tracking/background-task';
import { TrackingScreen } from '../src/features/tracking/TrackingScreen';

let activeSession: TrackingSession | undefined;

defineLocationTask((locations) => {
  for (const location of locations) {
    if (!activeSession) continue;
    const sample: LocationSample = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: new Date(location.timestamp).toISOString(),
      ...(location.coords.accuracy == null ? {} : { accuracy: location.coords.accuracy }),
      ...(location.coords.altitude == null ? {} : { altitude: location.coords.altitude }),
    };
    void activeSession.appendLocation(sample);
  }
});

export default function TrackRoute() {
  const router = useRouter();
  const session = useMemo(() => mobileMvpServices.createTrackingSession(), []);
  useEffect(() => {
    activeSession = session;
    return () => {
      if (activeSession === session) activeSession = undefined;
    };
  }, [session]);

  async function startTracking(): Promise<boolean> {
    const granted = await requestTrackingPermissions();
    if (!granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à localização para registrar a trilha.');
      return false;
    }
    await startLocationUpdates();
    return true;
  }

  return (
    <TrackingScreen
      session={session}
      onStart={startTracking}
      onFinished={(activity) => {
        void stopLocationUpdates();
        router.push(`/contribute/${activity.id}`);
      }}
    />
  );
}
