import { useRouter } from 'expo-router';
import { mobileMvpServices } from '../../src/application/mvp/mobile-services';
import { ExploreScreen } from '../../src/features/discovery/ExploreScreen';

export default function ExploreRoute() {
  const router = useRouter();
  return (
    <ExploreScreen
      trailRepository={mobileMvpServices.trailRepository}
      onSelectTrail={(trailId) => router.push(`/trails/${trailId}`)}
    />
  );
}
