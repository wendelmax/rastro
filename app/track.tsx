import { useMemo } from 'react';
import { InMemoryActivityRepository } from '../src/data/local/activity-repository';
import { recordActivity } from '../src/application/tracking/record-activity';
import { TrackingScreen } from '../src/features/tracking/TrackingScreen';

export default function TrackRoute() {
  const session = useMemo(
    () => recordActivity(new InMemoryActivityRepository()),
    [],
  );
  return <TrackingScreen session={session} />;
}
