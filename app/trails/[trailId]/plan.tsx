import { useLocalSearchParams } from 'expo-router';
import { createDemoRepository } from '../../../src/data/demo/demo-trails';
import { TripPlanScreen } from '../../../src/features/planning/TripPlanScreen';

const repository = createDemoRepository();

export default function TripPlanRoute() {
  const { trailId } = useLocalSearchParams<{ trailId: string }>();
  return (
    <TripPlanScreen
      trailId={trailId}
      trailRepository={repository.trailRepository}
      pointRepository={repository.pointRepository}
    />
  );
}
