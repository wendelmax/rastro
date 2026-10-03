import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import type { PointOfInterest, TrailVersion } from '../../domain/trails';
import { buildTripPlan } from '../../application/planning/build-trip-plan';
import type { TripPlanSummary } from '../../domain/planning';
import { RastroButton, RastroCard, RastroSection, RastroText } from '../../design/components';
import { rastroTheme } from '../../design/theme';

interface TripPlanFormProps {
  trail: TrailVersion;
  points: PointOfInterest[];
  onSubmit: (summary: TripPlanSummary) => void;
}

export function TripPlanForm({ trail, points, onSubmit }: TripPlanFormProps) {
  const [departureAt, setDepartureAt] = useState('2026-10-03T10:00:00.000Z');
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);

  function togglePoint(pointId: string) {
    setSelectedPointIds((current) => current.includes(pointId)
      ? current.filter((id) => id !== pointId)
      : [...current, pointId]);
  }

  function submit() {
    const stopMinutesByPointId = Object.fromEntries(
      selectedPointIds.map((pointId) => [pointId, 15]),
    );
    onSubmit(buildTripPlan({ trail, points, selectedPointIds, departureAt, stopMinutesByPointId }));
  }

  return (
    <RastroCard>
      <RastroText color={rastroTheme.colors.muted} variant="caption">Saída</RastroText>
      <TextInput
        accessibilityLabel="Horário de saída"
        onChangeText={setDepartureAt}
        style={styles.input}
        value={departureAt}
      />
      <RastroSection title="Adicionar paradas">
        {points.map((point) => {
          const selected = selectedPointIds.includes(point.id);
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={point.id}
              onPress={() => togglePoint(point.id)}
              style={[styles.point, selected && styles.selectedPoint]}
            >
              <RastroText color={selected ? rastroTheme.colors.white : rastroTheme.colors.ink} variant="bodyLarge">{point.name}</RastroText>
              <RastroText color={selected ? rastroTheme.colors.white : rastroTheme.colors.muted} variant="caption">
                {selected ? 'Parada de 15 min adicionada' : point.description}
              </RastroText>
            </Pressable>
          );
        })}
      </RastroSection>
      <RastroButton label="Calcular plano" onPress={submit} />
    </RastroCard>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: rastroTheme.colors.surface,
    borderColor: rastroTheme.colors.border,
    borderRadius: rastroTheme.radii.md,
    borderWidth: 1,
    color: rastroTheme.colors.ink,
    minHeight: 48,
    padding: rastroTheme.spacing.md,
  },
  point: {
    backgroundColor: rastroTheme.colors.surface,
    borderColor: rastroTheme.colors.border,
    borderRadius: rastroTheme.radii.md,
    borderWidth: 1,
    gap: rastroTheme.spacing.xs,
    minHeight: 60,
    padding: rastroTheme.spacing.md,
  },
  selectedPoint: {
    backgroundColor: rastroTheme.colors.forest,
    borderColor: rastroTheme.colors.forest,
  },
});
