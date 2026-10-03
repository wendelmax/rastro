import type { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { rastroTheme } from '../theme';
import { RastroButton } from './RastroButton';
import { RastroText } from './RastroText';

interface RastroSectionProps extends PropsWithChildren {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function RastroSection({ title, description, actionLabel, onAction, children }: RastroSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <RastroText variant="title">{title}</RastroText>
          {description ? <RastroText color={rastroTheme.colors.muted} variant="caption">{description}</RastroText> : null}
        </View>
        {actionLabel && onAction ? <RastroButton label={actionLabel} onPress={onAction} variant="quiet" /> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: rastroTheme.spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: rastroTheme.spacing.sm,
    justifyContent: 'space-between',
  },
  heading: {
    flex: 1,
    gap: rastroTheme.spacing.xs,
    minWidth: 0,
  },
});
