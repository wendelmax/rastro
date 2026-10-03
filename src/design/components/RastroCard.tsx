import type { PropsWithChildren } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { rastroTheme } from '../theme';

type RastroCardVariant = 'default' | 'dark' | 'outlined';

interface RastroCardProps extends PropsWithChildren {
  variant?: RastroCardVariant;
  style?: StyleProp<ViewStyle>;
}

export function RastroCard({ children, variant = 'default', style }: RastroCardProps) {
  return <View style={[styles.base, styles[variant], variant === 'default' && rastroTheme.elevation.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: rastroTheme.radii.lg,
    gap: rastroTheme.spacing.sm,
    padding: rastroTheme.spacing.lg,
  },
  dark: {
    backgroundColor: rastroTheme.colors.darkSurface,
  },
  default: {
    backgroundColor: rastroTheme.colors.surface,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: rastroTheme.colors.border,
    borderWidth: 1,
  },
});
