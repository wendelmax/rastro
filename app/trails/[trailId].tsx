import { useLocalSearchParams } from 'expo-router';
import { mobileMvpServices } from '../../src/application/mvp/mobile-services';
import { TrailDetailScreen } from '../../src/features/discovery/TrailDetailScreen';

export default function TrailDetailRoute() {
  const { trailId } = useLocalSearchParams<{ trailId: string }>();
  return (
    <TrailDetailScreen
      trailId={trailId}
      trailRepository={mobileMvpServices.trailRepository}
      pointRepository={mobileMvpServices.pointRepository}
    />
  );
}
