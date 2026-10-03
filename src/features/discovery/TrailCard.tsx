import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TrailVersion } from '../../domain/trails';

interface TrailCardProps {
  trail: TrailVersion;
  onPress?: () => void;
}

export function TrailCard({ trail, onPress }: TrailCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{trail.name}</Text>
        <Text style={styles.status}>{statusLabel(trail.status)}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>{trail.description}</Text>
      <View style={styles.metadata}>
        <Text style={styles.metadataText}>{difficultyLabel(trail.generalDifficulty)}</Text>
        <Text style={styles.metadataText}>{formatDurationRange(trail.estimatedDurationMinutes)}</Text>
        <Text style={styles.metadataText}>{trail.region ?? 'Região não informada'}</Text>
      </View>
    </Pressable>
  );
}

export function difficultyLabel(difficulty: TrailVersion['generalDifficulty']): string {
  const labels = {
    easy: 'Fácil',
    moderate: 'Moderada',
    difficult: 'Difícil',
    extreme: 'Extrema',
  };
  return labels[difficulty];
}

export function formatDurationRange(duration: TrailVersion['estimatedDurationMinutes']): string {
  return `${formatDuration(duration.min)}–${formatDuration(duration.max)}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}min`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
}

function statusLabel(status: TrailVersion['status']): string {
  const labels = {
    unknown: 'Condição desconhecida',
    open: 'Aberta',
    partially_blocked: 'Parcialmente bloqueada',
    closed: 'Fechada',
  };
  return labels[status];
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  description: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metadataText: {
    color: '#0F766E',
    fontSize: 12,
    fontWeight: '700',
  },
  status: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: '#0F172A',
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
  },
});
