import { Pressable, StyleSheet, View } from 'react-native';
import type { TrailVersion } from '../../domain/trails';
import { rastroTheme } from '../theme';
import { RastroBadge } from './RastroBadge';
import { RastroCard } from './RastroCard';
import { RastroText } from './RastroText';

interface TrailCardProps {
  trail: TrailVersion;
  onPress?: () => void;
}

export function TrailCard({ trail, onPress }: TrailCardProps) {
  return (
    <Pressable accessibilityLabel={trail.name} accessibilityRole="button" onPress={onPress}>
      <RastroCard>
        <View style={styles.header}>
          <RastroText numberOfLines={2} style={styles.title} variant="bodyLarge">{trail.name}</RastroText>
          <RastroBadge label={statusLabel(trail.status)} tone={statusTone(trail.status)} />
        </View>
        <RastroText color={rastroTheme.colors.muted} numberOfLines={2}>{trail.description}</RastroText>
        <View style={styles.metadata}>
          <RastroBadge label={difficultyLabel(trail.generalDifficulty)} tone="clay" />
          <RastroBadge label={formatDurationRange(trail.estimatedDurationMinutes)} tone="water" />
          <RastroBadge label={trail.region ?? 'Região não informada'} />
        </View>
      </RastroCard>
    </Pressable>
  );
}

export function difficultyLabel(difficulty: TrailVersion['generalDifficulty']): string {
  return {
    easy: 'Fácil',
    moderate: 'Moderada',
    difficult: 'Difícil',
    extreme: 'Extrema',
  }[difficulty];
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
  const labels: Record<TrailVersion['status'], string> = {
    unknown: 'Condição desconhecida',
    open: 'Aberta',
    partially_blocked: 'Parcialmente bloqueada',
    closed: 'Fechada',
  };
  return labels[status];
}

function statusTone(status: TrailVersion['status']): 'neutral' | 'success' | 'warning' | 'danger' {
  const tones: Record<TrailVersion['status'], 'neutral' | 'success' | 'warning' | 'danger'> = {
    unknown: 'neutral',
    open: 'success',
    partially_blocked: 'warning',
    closed: 'danger',
  };
  return tones[status];
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: rastroTheme.spacing.sm,
    justifyContent: 'space-between',
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rastroTheme.spacing.sm,
  },
  title: {
    flex: 1,
  },
});
