import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Activity, ActivitySnapshot, TrackingSession, TrackingStatus } from '../../domain/tracking';
import { RastroBadge, RastroButton, RastroCard, RastroScreen, RastroText } from '../../design/components';
import { rastroTheme } from '../../design/theme';

interface TrackingScreenProps {
  session: TrackingSession;
  onStart?: () => Promise<boolean>;
  onFinished?: (activity: Activity) => void;
}

export function TrackingScreen({ session, onStart, onFinished }: TrackingScreenProps) {
  const [status, setStatus] = useState<TrackingStatus>(session.status);
  const [snapshot, setSnapshot] = useState<ActivitySnapshot>({
    status: session.status,
    distanceKm: 0,
    elapsedSeconds: 0,
    sampleCount: 0,
  });
  const [pending, setPending] = useState(false);

  async function handlePrimaryAction() {
    if (pending) return;
    setPending(true);
    try {
      if (status === 'idle') {
        if (onStart && !(await onStart())) return;
        await session.start();
      } else if (status === 'recording') await session.pause();
      else if (status === 'paused') await session.resume();
      setStatus(session.status);
      setSnapshot((current) => ({ ...current, status: session.status }));
    } finally {
      setPending(false);
    }
  }

  async function handleFinish() {
    if (pending) return;
    setPending(true);
    try {
      const activity = await session.finish();
      setStatus(activity.status);
      setSnapshot((current) => ({ ...current, status: activity.status }));
      onFinished?.(activity);
    } finally {
      setPending(false);
    }
  }

  const primaryLabel = {
    idle: 'Iniciar rastreamento',
    recording: 'Pausar',
    paused: 'Retomar',
    finished: 'Atividade finalizada',
  }[status];

  return (
    <RastroScreen dark contentContainerStyle={styles.container}>
      <RastroText color={rastroTheme.colors.clay} variant="caption">RASTREAR</RastroText>
      <RastroText color={rastroTheme.colors.darkInk} variant="display">Sua aventura começa aqui</RastroText>
      <RastroBadge label={statusLabel(status)} tone={statusTone(status)} />
      <View style={styles.stats}>
        <Stat label="Distância" value={`${snapshot.distanceKm.toFixed(2)} km`} />
        <Stat label="Pontos GPS" value={`${snapshot.sampleCount} pontos`} />
        <Stat label="Tempo" value={`${Math.round(snapshot.elapsedSeconds / 60)} min`} />
      </View>
      <RastroButton
        disabled={status === 'finished'}
        label={primaryLabel}
        loading={pending}
        onPress={() => void handlePrimaryAction()}
      />
      {status === 'recording' || status === 'paused' ? (
        <RastroButton label="Finalizar e salvar" loading={pending} onPress={() => void handleFinish()} variant="secondary" />
      ) : null}
      <RastroText color={rastroTheme.colors.darkMuted} style={styles.offlineNote} variant="caption">
        As amostras são salvas localmente antes da sincronização.
      </RastroText>
    </RastroScreen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <RastroCard style={styles.stat} variant="dark">
      <RastroText color={rastroTheme.colors.darkMuted} variant="caption">{label}</RastroText>
      <RastroText color={rastroTheme.colors.darkInk} variant="bodyLarge">{value}</RastroText>
    </RastroCard>
  );
}

function statusLabel(status: TrackingStatus): string {
  return {
    idle: 'Pronto para começar',
    recording: 'Rastreando',
    paused: 'Pausado',
    finished: 'Atividade salva',
  }[status];
}

function statusTone(status: TrackingStatus): 'neutral' | 'success' | 'warning' {
  const tones: Record<TrackingStatus, 'neutral' | 'success' | 'warning'> = {
    idle: 'neutral',
    recording: 'success',
    paused: 'warning',
    finished: 'success',
  };
  return tones[status];
}

const styles = StyleSheet.create({
  container: {
    gap: rastroTheme.spacing.lg,
    justifyContent: 'center',
  },
  offlineNote: {
    textAlign: 'center',
  },
  stat: {
    flex: 1,
    padding: rastroTheme.spacing.md,
  },
  stats: {
    flexDirection: 'row',
    gap: rastroTheme.spacing.sm,
  },
});
