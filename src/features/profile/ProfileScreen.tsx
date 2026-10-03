import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ProfileScreenProps {
  profile: { name: string; vehicles: string[] };
  activities: Array<{ id: string; title: string; distanceKm: number }>;
  contributions: Array<{ id: string; title: string; type: string }>;
}

export function ProfileScreen({ profile, activities, contributions }: ProfileScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>MEU RASTRO</Text>
      <Text style={styles.title}>{profile.name}</Text>
      <View style={styles.vehicleRow}>
        {profile.vehicles.map((vehicle) => <Text key={vehicle} style={styles.vehicle}>{vehicle}</Text>)}
      </View>
      <Text style={styles.sectionTitle}>Atividades recentes</Text>
      {activities.length === 0 ? <Text style={styles.empty}>Nenhuma atividade registrada.</Text> : null}
      {activities.map((activity) => (
        <View key={activity.id} style={styles.card}>
          <Text style={styles.cardTitle}>{activity.title}</Text>
          <Text style={styles.cardMeta}>{activity.distanceKm.toFixed(1)} km registrados</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Contribuições</Text>
      {contributions.length === 0 ? <Text style={styles.empty}>Ainda não há contribuições.</Text> : null}
      {contributions.map((contribution) => (
        <View key={contribution.id} style={styles.card}>
          <Text style={styles.cardTitle}>{contribution.title}</Text>
          <Text style={styles.cardMeta}>{contribution.type}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
  },
  cardMeta: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
  },
  cardTitle: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },
  container: {
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
    gap: 12,
    padding: 20,
  },
  empty: {
    color: '#64748B',
  },
  eyebrow: {
    color: '#F97316',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 12,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 12,
  },
  title: {
    color: '#0F172A',
    fontSize: 32,
    fontWeight: '800',
  },
  vehicle: {
    backgroundColor: '#CCFBF1',
    borderRadius: 999,
    color: '#115E59',
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  vehicleRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
