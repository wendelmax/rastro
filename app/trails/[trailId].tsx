import { useLocalSearchParams } from 'expo-router';
import { createDemoRepository } from '../../src/data/demo/demo-trails';
import { TrailDetailScreen } from '../../src/features/discovery/TrailDetailScreen';

const repository = createDemoRepository();

export default function TrailDetailRoute() {
  const { trailId } = useLocalSearchParams<{ trailId: string }>();
  return (
    <TrailDetailScreen
      trailId={trailId}
      trailRepository={repository.trailRepository}
      pointRepository={repository.pointRepository}
    />
  );
}
