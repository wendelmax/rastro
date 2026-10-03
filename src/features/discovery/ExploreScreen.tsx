import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { TrailRepository } from '../../data/repositories';
import type { TrailVersion } from '../../domain/trails';
import type { VehicleType } from '../../domain/ratings';
import { RastroButton, RastroScreen, RastroSection, RastroText } from '../../design/components';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    void trailRepository.listPublic({ vehicleType })
      .then((nextTrails) => {
        if (active) {
          setTrails(nextTrails);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setTrails([]);
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [retryKey, trailRepository, vehicleType]);

  return (
    <RastroScreen>
      <RastroSection title="Encontre seu próximo rastro" description="Trilhas reais, relatos recentes e pontos para planejar melhor.">
        <RastroText color={rastroTheme.colors.clay} variant="caption">EXPLORAR</RastroText>
      </RastroSection>
      <TrailFilters vehicleType={vehicleType} onVehicleTypeChange={setVehicleType} />
      {loading ? <RastroText color={rastroTheme.colors.muted} style={styles.empty}>Carregando trilhas...</RastroText> : null}
      {error ? (
        <>
          <RastroText color={rastroTheme.colors.danger} style={styles.empty}>Não foi possível carregar as trilhas.</RastroText>
          <RastroButton label="Tentar novamente" onPress={() => setRetryKey((current) => current + 1)} variant="secondary" />
        </>
      ) : null}
      {!loading && !error ? (
        <FlatList
          contentContainerStyle={styles.list}
          data={trails}
          keyExtractor={(trail) => trail.id}
          renderItem={({ item }) => (
            <TrailCard trail={item} onPress={() => onSelectTrail?.(item.id)} />
          )}
          ListEmptyComponent={<RastroText color={rastroTheme.colors.muted} style={styles.empty}>Nenhuma trilha encontrada.</RastroText>}
        />
      ) : null}
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
