import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Activity, ActivitySnapshot, TrackingSession, TrackingStatus } from '../../domain/tracking';

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

  async function handlePrimaryAction() {
    if (status === 'idle') {
      if (onStart && !(await onStart())) return;
      await session.start();
    }
    else if (status === 'recording') await session.pause();
    else if (status === 'paused') await session.resume();
    setStatus(session.status);
    setSnapshot((current) => ({ ...current, status: session.status }));
  }

  async function handleFinish() {
    const activity = await session.finish();
    setStatus(activity.status);
    setSnapshot((current) => ({ ...current, status: activity.status }));
    onFinished?.(activity);
  }

  const primaryLabel = {
    idle: 'Iniciar rastreamento',
    recording: 'Pausar',
    paused: 'Retomar',
    finished: 'Atividade finalizada',
  }[status];

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>RASTREAR</Text>
      <Text style={styles.title}>Sua aventura começa aqui</Text>
      <Text style={styles.status}>{statusLabel(status)}</Text>
      <View style={styles.stats}>
        <Stat label="Distância" value={`${snapshot.distanceKm.toFixed(2)} km`} />
        <Stat label="Pontos GPS" value={`${snapshot.sampleCount} pontos`} />
        <Stat label="Tempo" value={`${Math.round(snapshot.elapsedSeconds / 60)} min`} />
      </View>
      <Pressable
        disabled={status === 'finished'}
        onPress={() => void handlePrimaryAction()}
        style={[styles.primaryButton, status === 'finished' && styles.disabledButton]}
      >
        <Text style={styles.primaryText}>{primaryLabel}</Text>
      </Pressable>
      {status === 'recording' || status === 'paused' ? (
        <Pressable onPress={() => void handleFinish()} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Finalizar e salvar</Text>
        </Pressable>
      ) : null}
      <Text style={styles.offlineNote}>As amostras são salvas localmente antes da sincronização.</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    flex: 1,
    gap: 16,
    padding: 24,
  },
  disabledButton: {
    opacity: 0.55,
  },
  eyebrow: {
    color: '#F97316',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 24,
  },
  offlineNote: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#F97316',
    borderRadius: 16,
    padding: 16,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#475569',
    borderRadius: 16,
    borderWidth: 1,
    padding: 15,
  },
  secondaryText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '700',
  },
  stat: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    flex: 1,
    padding: 12,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 5,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  status: {
    color: '#CBD5E1',
    fontSize: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 24,
  },
});
