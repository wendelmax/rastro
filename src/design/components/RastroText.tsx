import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { rastroTheme } from '../theme';

type RastroTextVariant = keyof typeof rastroTheme.typography;

interface RastroTextProps extends PropsWithChildren {
  variant?: RastroTextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export function RastroText({ children, variant = 'body', color, style, numberOfLines }: RastroTextProps) {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.base, rastroTheme.typography[variant], color ? { color } : null, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: rastroTheme.colors.ink,
  },
});
