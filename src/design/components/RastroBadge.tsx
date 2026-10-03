import { StyleSheet, Text, View } from 'react-native';
import { rastroTheme } from '../theme';

type RastroBadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'water' | 'clay';

interface RastroBadgeProps {
  label: string;
  tone?: RastroBadgeTone;
}

export function RastroBadge({ label, tone = 'neutral' }: RastroBadgeProps) {
  const colors = toneColors[tone];
  return (
    <View accessibilityLabel={label} style={[styles.base, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const toneColors: Record<RastroBadgeTone, { background: string; text: string }> = {
  neutral: { background: rastroTheme.colors.background, text: rastroTheme.colors.ink },
  success: { background: rastroTheme.colors.successSurface, text: rastroTheme.colors.success },
  warning: { background: rastroTheme.colors.warningSurface, text: rastroTheme.colors.warning },
  danger: { background: rastroTheme.colors.dangerSurface, text: rastroTheme.colors.danger },
  water: { background: rastroTheme.colors.waterSurface, text: rastroTheme.colors.water },
  clay: { background: rastroTheme.colors.claySurface, text: rastroTheme.colors.clay },
};

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: rastroTheme.radii.pill,
    paddingHorizontal: rastroTheme.spacing.md,
    paddingVertical: rastroTheme.spacing.xs,
  },
  label: {
    ...rastroTheme.typography.caption,
  },
});
