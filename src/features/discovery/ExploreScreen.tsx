import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { TrailRepository } from '../../data/repositories';
import type { TrailVersion } from '../../domain/trails';
import type { VehicleType } from '../../domain/ratings';
import { RastroScreen, RastroSection, RastroText } from '../../design/components';
import { rastroTheme } from '../../design/theme';
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
    <RastroScreen>
      <RastroSection title="Encontre seu próximo rastro" description="Trilhas reais, relatos recentes e pontos para planejar melhor.">
        <RastroText color={rastroTheme.colors.clay} variant="caption">EXPLORAR</RastroText>
      </RastroSection>
      <TrailFilters vehicleType={vehicleType} onVehicleTypeChange={setVehicleType} />
      <FlatList
        contentContainerStyle={styles.list}
        data={trails}
        keyExtractor={(trail) => trail.id}
        renderItem={({ item }) => (
          <TrailCard trail={item} onPress={() => onSelectTrail?.(item.id)} />
        )}
        ListEmptyComponent={<RastroText color={rastroTheme.colors.muted} style={styles.empty}>Nenhuma trilha encontrada.</RastroText>}
      />
    </RastroScreen>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 32,
    textAlign: 'center',
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
});
