import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { PointRepository, TrailRepository } from '../../data/repositories';
import type { PointOfInterest, TrailVersion } from '../../domain/trails';
import type { TripPlanSummary } from '../../domain/planning';
import { TripPlanForm } from './TripPlanForm';
import { TripSummary } from './TripSummary';

interface TripPlanScreenProps {
  trailId: string;
  trailRepository: TrailRepository;
  pointRepository: PointRepository;
}

export function TripPlanScreen({ trailId, trailRepository, pointRepository }: TripPlanScreenProps) {
  const [trail, setTrail] = useState<TrailVersion | null>(null);
  const [points, setPoints] = useState<PointOfInterest[]>([]);
  const [summary, setSummary] = useState<TripPlanSummary>();

  useEffect(() => {
    void Promise.all([
      trailRepository.getById(trailId),
      pointRepository.listForTrail(trailId),
    ]).then(([nextTrail, nextPoints]) => {
      setTrail(nextTrail);
      setPoints(nextPoints);
    });
  }, [pointRepository, trailId, trailRepository]);

  if (!trail) return <Text style={styles.loading}>Carregando planejamento...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>PLANEJAR SAÍDA</Text>
      <Text style={styles.title}>{trail.name}</Text>
      <TripPlanForm trail={trail} points={points} onSubmit={setSummary} />
      {summary ? <TripSummary summary={summary} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  eyebrow: {
    color: '#F97316',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loading: {
    color: '#475569',
    padding: 24,
  },
  title: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
    paddingHorizontal: 20,
    paddingTop: 6,
  },
});
