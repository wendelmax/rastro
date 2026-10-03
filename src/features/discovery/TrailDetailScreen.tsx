import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PointRepository, TrailRepository } from '../../data/repositories';
import type { PointOfInterest, TrailVersion } from '../../domain/trails';
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
    return <Text style={styles.loading}>Carregando roteiro...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>ROTEIRO</Text>
      <Text style={styles.title}>{trail.name}</Text>
      <Text style={styles.description}>{trail.description}</Text>
      <TrailMap geometry={trail.geometry} points={points} />
      <View style={styles.metadata}>
        <Metric label="Duração" value={formatDurationRange(trail.estimatedDurationMinutes)} />
        <Metric label="Dificuldade" value={difficultyLabel(trail.generalDifficulty)} />
        <Metric label="Condição" value={statusLabel(trail.status)} />
      </View>
      <Text style={styles.sectionTitle}>Pontos úteis</Text>
      {points.map((point) => <PointRow key={point.id} point={point} />)}
      <Text style={styles.sectionTitle}>Abrir destino em</Text>
      <View style={styles.providers}>
        {(['waze', 'google', 'apple'] as MapProvider[]).map((provider) => (
          <Pressable
            key={provider}
            onPress={() => void Linking.openURL(buildExternalNavigationUrl(provider, trail.geometry[0]!))}
            style={styles.providerButton}
          >
            <Text style={styles.providerLabel}>{providerLabel(provider)}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={() => setReportVisible(true)} style={styles.reportButton}>
        <Text style={styles.reportLabel}>Sinalizar conteúdo</Text>
      </Pressable>
      <ReportContentSheet
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        onSubmit={(reason) => {
          onReport?.(reason);
          setReportVisible(false);
        }}
      />
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function PointRow({ point }: { point: PointOfInterest }) {
  return (
    <View style={styles.pointRow}>
      <Text style={styles.pointName}>{point.name}</Text>
      <Text style={styles.pointDescription}>{point.description}</Text>
    </View>
  );
}

function providerLabel(provider: MapProvider): string {
  return { waze: 'Waze', google: 'Google Maps', apple: 'Apple Maps' }[provider];
}

function statusLabel(status: TrailVersion['status']): string {
  return {
    unknown: 'Desconhecida',
    open: 'Aberta',
    partially_blocked: 'Parcialmente bloqueada',
    closed: 'Fechada',
  }[status];
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    gap: 14,
    padding: 20,
  },
  description: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
  eyebrow: {
    color: '#F97316',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  loading: {
    color: '#475569',
    padding: 24,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metric: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexGrow: 1,
    minWidth: '30%',
    padding: 12,
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 11,
  },
  metricValue: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  pointDescription: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 3,
  },
  pointName: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
  pointRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
  },
  providerButton: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  providerLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  reportButton: {
    alignItems: 'center',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    padding: 12,
  },
  reportLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '800',
  },
  providers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  title: {
    color: '#0F172A',
    fontSize: 32,
    fontWeight: '800',
  },
});
