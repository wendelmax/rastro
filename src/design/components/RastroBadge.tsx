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
  success: { background: '#DCEEDB', text: rastroTheme.colors.success },
  warning: { background: '#F8E8C8', text: rastroTheme.colors.warning },
  danger: { background: '#F4D8D2', text: rastroTheme.colors.danger },
  water: { background: '#D8EFF0', text: rastroTheme.colors.water },
  clay: { background: '#F5DFCF', text: rastroTheme.colors.clay },
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
