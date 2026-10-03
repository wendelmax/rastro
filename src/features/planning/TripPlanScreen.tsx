import { useEffect, useState } from 'react';
import type { PointRepository, TrailRepository } from '../../data/repositories';
import type { PointOfInterest, TrailVersion } from '../../domain/trails';
import type { TripPlanSummary } from '../../domain/planning';
import { RastroScreen, RastroText } from '../../design/components';
import { rastroTheme } from '../../design/theme';
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

  if (!trail) {
    return <RastroScreen><RastroText color={rastroTheme.colors.muted}>Carregando planejamento...</RastroText></RastroScreen>;
  }

  return (
    <RastroScreen scroll>
      <RastroText color={rastroTheme.colors.clay} variant="caption">PLANEJAR SAÍDA</RastroText>
      <RastroText variant="display">{trail.name}</RastroText>
      <TripPlanForm trail={trail} points={points} onSubmit={setSummary} />
      {summary ? <TripSummary summary={summary} /> : null}
    </RastroScreen>
  );
}
