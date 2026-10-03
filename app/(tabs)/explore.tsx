import { useRouter } from 'expo-router';
import { createDemoRepository } from '../../src/data/demo/demo-trails';
import { ExploreScreen } from '../../src/features/discovery/ExploreScreen';

const repository = createDemoRepository();

export default function ExploreRoute() {
  const router = useRouter();
  return (
    <ExploreScreen
      trailRepository={repository.trailRepository}
      onSelectTrail={(trailId) => router.push(`/trails/${trailId}`)}
    />
  );
}
