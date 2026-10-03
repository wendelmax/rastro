import { useLocalSearchParams } from 'expo-router';
import { mobileMvpServices } from '../../src/application/mvp/mobile-services';
import { ContributeScreen } from '../../src/features/contributions/ContributeScreen';

export default function ContributeRoute() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  return (
    <ContributeScreen
      activityId={activityId}
      authorId="demo-user"
      service={mobileMvpServices.publishActivityService}
    />
  );
}
