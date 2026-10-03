import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';
import type { TrailRepository } from '../../data/repositories';
import type { TrailVersion } from '../../domain/trails';
import type { VehicleType } from '../../domain/ratings';
import { TrailCard } from './TrailCard';
import { TrailFilters } from './TrailFilters';

interface ExploreScreenProps {
  trailRepository: TrailRepository;
  onSelectTrail?: (trailId: string) => void;
}

export function ExploreScreen({ trailRepository, onSelectTrail }: ExploreScreenProps) {
  const [vehicleType, setVehicleType] = useState<VehicleType>();
  const [trails, setTrails] = useState<TrailVersion[]>([]);

  useEffect(() => {
    let active = true;
    void trailRepository.listPublic({ vehicleType }).then((nextTrails) => {
      if (active) setTrails(nextTrails);
    });
    return () => {
      active = false;
    };
  }, [trailRepository, vehicleType]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>EXPLORAR</Text>
      <Text style={styles.title}>Encontre seu próximo rastro</Text>
      <Text style={styles.subtitle}>Trilhas reais, relatos recentes e pontos para planejar melhor.</Text>
      <TrailFilters vehicleType={vehicleType} onVehicleTypeChange={setVehicleType} />
      <FlatList
        contentContainerStyle={styles.list}
        data={trails}
        keyExtractor={(trail) => trail.id}
        renderItem={({ item }) => (
          <TrailCard trail={item} onPress={() => onSelectTrail?.(item.id)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma trilha encontrada.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    paddingHorizontal: 20,
  },
  empty: {
    color: '#64748B',
    paddingVertical: 32,
    textAlign: 'center',
  },
  eyebrow: {
    color: '#F97316',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 16,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },
  title: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 6,
  },
});
