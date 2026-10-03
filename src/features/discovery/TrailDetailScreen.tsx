import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import type { PointRepository, TrailRepository } from '../../data/repositories';
import type { PointOfInterest, TrailVersion } from '../../domain/trails';
import { RastroBadge, RastroButton, RastroCard, RastroScreen, RastroSection, RastroText } from '../../design/components';
import { rastroTheme } from '../../design/theme';
import { TrailMap } from '../maps/TrailMap';
import { buildExternalNavigationUrl, type MapProvider } from '../maps/map-links';
import { ReportContentSheet } from '../quality/ReportContentSheet';
import { difficultyLabel, formatDurationRange } from './TrailCard';

interface TrailDetailScreenProps {
  trailId: string;
  trailRepository: TrailRepository;
  pointRepository: PointRepository;
  onReport?: (reason: string) => void;
}

export function TrailDetailScreen({ trailId, trailRepository, pointRepository, onReport }: TrailDetailScreenProps) {
  const [trail, setTrail] = useState<TrailVersion | null>(null);
  const [points, setPoints] = useState<PointOfInterest[]>([]);
  const [reportVisible, setReportVisible] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([
      trailRepository.getById(trailId),
      pointRepository.listForTrail(trailId),
    ]).then(([nextTrail, nextPoints]) => {
      if (!active) return;
      setTrail(nextTrail);
      setPoints(nextPoints);
    });
    return () => {
      active = false;
    };
  }, [pointRepository, trailId, trailRepository]);

  if (!trail) {
    return <RastroScreen><RastroText color={rastroTheme.colors.muted}>Carregando roteiro...</RastroText></RastroScreen>;
  }

  return (
    <RastroScreen contentContainerStyle={styles.container} scroll>
      <RastroText color={rastroTheme.colors.clay} variant="caption">ROTEIRO</RastroText>
      <RastroText variant="display">{trail.name}</RastroText>
      <RastroText color={rastroTheme.colors.muted}>{trail.description}</RastroText>
      <TrailMap geometry={trail.geometry} points={points} />
      <View style={styles.metadata}>
        <Metric label="Duração" value={formatDurationRange(trail.estimatedDurationMinutes)} />
        <Metric label="Dificuldade" value={difficultyLabel(trail.generalDifficulty)} />
        <Metric label="Condição" value={statusLabel(trail.status)} tone={statusTone(trail.status)} />
      </View>
      <RastroSection title="Pontos úteis" description={`${points.length} pontos no roteiro`}>
        {points.map((point) => <PointRow key={point.id} point={point} />)}
      </RastroSection>
      <RastroSection title="Abrir destino em">
        <View style={styles.providers}>
          {(['waze', 'google', 'apple'] as MapProvider[]).map((provider) => (
            <RastroButton
              key={provider}
              label={providerLabel(provider)}
              onPress={() => void Linking.openURL(buildExternalNavigationUrl(provider, trail.geometry[0]!))}
              variant="secondary"
            />
          ))}
        </View>
      </RastroSection>
      <Pressable accessibilityRole="button" onPress={() => setReportVisible(true)} style={styles.reportButton}>
        <RastroText color={rastroTheme.colors.muted} variant="caption">Sinalizar conteúdo</RastroText>
      </Pressable>
      <ReportContentSheet
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        onSubmit={(reason) => {
          onReport?.(reason);
          setReportVisible(false);
        }}
      />
    </RastroScreen>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: 'success' | 'warning' | 'danger' | 'neutral' }) {
  return (
    <RastroCard style={styles.metric}>
      <RastroText color={rastroTheme.colors.muted} variant="caption">{label}</RastroText>
      {tone ? <RastroBadge label={value} tone={tone} /> : <RastroText variant="bodyLarge">{value}</RastroText>}
    </RastroCard>
  );
}

function PointRow({ point }: { point: PointOfInterest }) {
  return (
    <RastroCard variant="outlined">
      <RastroText variant="bodyLarge">{point.name}</RastroText>
      <RastroText color={rastroTheme.colors.muted}>{point.description}</RastroText>
    </RastroCard>
  );
}

function providerLabel(provider: MapProvider): string {
  return { waze: 'Waze', google: 'Google Maps', apple: 'Apple Maps' }[provider];
}

function statusLabel(status: TrailVersion['status']): string {
  const labels: Record<TrailVersion['status'], string> = {
    unknown: 'Condição desconhecida',
    open: 'Aberta',
    partially_blocked: 'Parcialmente bloqueada',
    closed: 'Fechada',
  };
  return labels[status];
}

function statusTone(status: TrailVersion['status']): 'success' | 'warning' | 'danger' | 'neutral' {
  const tones: Record<TrailVersion['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
    unknown: 'neutral',
    open: 'success',
    partially_blocked: 'warning',
    closed: 'danger',
  };
  return tones[status];
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: rastroTheme.spacing.xxl,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rastroTheme.spacing.sm,
  },
  metric: {
    flexGrow: 1,
    minWidth: '30%',
  },
  providers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rastroTheme.spacing.sm,
  },
  reportButton: {
    alignItems: 'center',
    borderColor: rastroTheme.colors.border,
    borderRadius: rastroTheme.radii.md,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    padding: rastroTheme.spacing.md,
  },
});
