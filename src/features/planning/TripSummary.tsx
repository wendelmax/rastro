import { StyleSheet, Text, View } from 'react-native';
import type { TripPlanSummary } from '../../domain/planning';

interface TripSummaryProps {
  summary: TripPlanSummary;
}

export function TripSummary({ summary }: TripSummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plano da saída</Text>
      <Text style={styles.item}>Deslocamento: {summary.movingTimeMinutes} min</Text>
      <Text style={styles.item}>Paradas: {summary.stopTimeMinutes} min</Text>
      <Text style={styles.item}>Término estimado: {formatDate(summary.finishAt)}</Text>
      {summary.returnAt ? <Text style={styles.item}>Retorno estimado: {formatDate(summary.returnAt)}</Text> : null}
      {summary.warnings.map((warning) => <Text key={warning} style={styles.warning}>{warning}</Text>)}
    </View>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    gap: 6,
    margin: 20,
    padding: 16,
  },
  item: {
    color: '#134E4A',
    fontSize: 14,
  },
  title: {
    color: '#134E4A',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  warning: {
    color: '#9A3412',
    fontSize: 13,
  },
});
