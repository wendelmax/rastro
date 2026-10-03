import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { PointOfInterest, TrailVersion } from '../../domain/trails';
import { buildTripPlan } from '../../application/planning/build-trip-plan';
import type { TripPlanSummary } from '../../domain/planning';

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
    onSubmit(buildTripPlan({
      trail,
      points,
      selectedPointIds,
      departureAt,
      stopMinutesByPointId,
    }));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Saída</Text>
      <TextInput
        accessibilityLabel="Horário de saída"
        onChangeText={setDepartureAt}
        style={styles.input}
        value={departureAt}
      />
      <Text style={styles.sectionTitle}>Adicionar paradas</Text>
      {points.map((point) => {
        const selected = selectedPointIds.includes(point.id);
        return (
          <Pressable
            key={point.id}
            onPress={() => togglePoint(point.id)}
            style={[styles.point, selected && styles.selectedPoint]}
          >
            <Text style={[styles.pointText, selected && styles.selectedPointText]}>
              {point.name}
            </Text>
            <Text style={[styles.pointHint, selected && styles.selectedPointText]}>
              {selected ? 'Parada de 15 min adicionada' : point.description}
            </Text>
          </Pressable>
        );
      })}
      <Pressable onPress={submit} style={styles.submitButton}>
        <Text style={styles.submitText}>Calcular plano</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    color: '#0F172A',
    padding: 12,
  },
  label: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  point: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  pointHint: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  pointText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  selectedPoint: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  selectedPointText: {
    color: '#FFFFFF',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#F97316',
    borderRadius: 14,
    marginTop: 8,
    padding: 14,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
