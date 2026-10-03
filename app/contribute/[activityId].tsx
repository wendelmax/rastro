import { useLocalSearchParams } from 'expo-router';
import { PublishActivityService } from '../../src/application/contributions/publish-activity';
import { InMemoryActivityRepository } from '../../src/data/local/activity-repository';
import { createDemoRepository } from '../../src/data/demo/demo-trails';
import { ContributeScreen } from '../../src/features/contributions/ContributeScreen';

const activities = new InMemoryActivityRepository();
const repository = createDemoRepository();
const service = new PublishActivityService({
  activityRepository: activities,
  trailRepository: repository.trailRepository,
});

export default function ContributeRoute() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  return <ContributeScreen activityId={activityId} authorId="demo-user" service={service} />;
}
