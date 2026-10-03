import { StyleSheet } from 'react-native';
import { RastroBadge, RastroCard, RastroScreen, RastroSection, RastroText } from '../../design/components';
import { rastroTheme } from '../../design/theme';

interface ProfileScreenProps {
  profile: { name: string; vehicles: string[] };
  activities: Array<{ id: string; title: string; distanceKm: number }>;
  contributions: Array<{ id: string; title: string; type: string }>;
}

export function ProfileScreen({ profile, activities, contributions }: ProfileScreenProps) {
  return (
    <RastroScreen contentContainerStyle={styles.container} scroll>
      <RastroText color={rastroTheme.colors.clay} variant="caption">MEU RASTRO</RastroText>
      <RastroText variant="display">{profile.name}</RastroText>
      <RastroSection title="Veículos">
        {profile.vehicles.length === 0 ? <RastroText color={rastroTheme.colors.muted}>Adicione um veículo para personalizar suas trilhas.</RastroText> : null}
        {profile.vehicles.map((vehicle) => <RastroBadge key={vehicle} label={vehicle} tone="water" />)}
      </RastroSection>
      <RastroSection title="Atividades recentes">
        {activities.length === 0 ? <RastroText color={rastroTheme.colors.muted}>Nenhuma atividade registrada.</RastroText> : null}
        {activities.map((activity) => (
          <RastroCard key={activity.id}>
            <RastroText variant="bodyLarge">{activity.title}</RastroText>
            <RastroText color={rastroTheme.colors.muted}>{activity.distanceKm.toFixed(1)} km registrados</RastroText>
          </RastroCard>
        ))}
      </RastroSection>
      <RastroSection title="Contribuições">
        {contributions.length === 0 ? <RastroText color={rastroTheme.colors.muted}>Ainda não há contribuições.</RastroText> : null}
        {contributions.map((contribution) => (
          <RastroCard key={contribution.id}>
            <RastroText variant="bodyLarge">{contribution.title}</RastroText>
            <RastroBadge label={contribution.type} tone="clay" />
          </RastroCard>
        ))}
      </RastroSection>
    </RastroScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: rastroTheme.spacing.xxl,
  },
});
