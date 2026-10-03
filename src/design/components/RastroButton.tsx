import { ActivityIndicator, Pressable, StyleSheet, Text, type GestureResponderEvent } from 'react-native';
import { rastroTheme } from '../theme';

type RastroButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';

interface RastroButtonProps {
  label: string;
  variant?: RastroButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
}

export function RastroButton({
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  accessibilityLabel,
}: RastroButtonProps) {
  const safeVariant: RastroButtonVariant = ['primary', 'secondary', 'quiet', 'danger'].includes(variant as RastroButtonVariant)
    ? variant
    : 'primary';
  const isDisabled = disabled || loading;
  const textColor = safeVariant === 'primary' || safeVariant === 'danger' ? rastroTheme.colors.white : rastroTheme.colors.forest;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.base, styles[safeVariant], isDisabled && styles.disabled]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: rastroTheme.radii.md,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: rastroTheme.spacing.lg,
    paddingVertical: rastroTheme.spacing.md,
  },
  danger: {
    backgroundColor: rastroTheme.colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...rastroTheme.typography.body,
    fontWeight: '800',
  },
  primary: {
    backgroundColor: rastroTheme.colors.forest,
  },
  quiet: {
    backgroundColor: 'transparent',
    borderColor: rastroTheme.colors.border,
    borderWidth: 1,
  },
  secondary: {
    backgroundColor: rastroTheme.colors.surface,
    borderColor: rastroTheme.colors.forest,
    borderWidth: 1,
  },
});
