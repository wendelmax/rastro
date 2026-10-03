# Shared UI components

Framework: Expo 53 / React Native / TypeScript. Styling uses `StyleSheet` and
tokens from `src/design/theme.ts`; there is no external component library.

## `RastroScreen`

Source: `src/design/components/RastroScreen.tsx`. Safe-area shell with light or
dark background and optional scrolling.

```tsx
import type { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { rastroTheme } from '../theme';

interface RastroScreenProps extends PropsWithChildren {
  dark?: boolean;
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function RastroScreen({ children, dark = false, scroll = false, contentContainerStyle }: RastroScreenProps) {
  const backgroundColor = dark ? rastroTheme.colors.darkBackground : rastroTheme.colors.background;
  const contentStyle = [styles.content, { backgroundColor }, contentContainerStyle];

  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <ScrollView contentContainerStyle={contentStyle}>{children}</ScrollView>
      </SafeAreaView>
    );
  }

  return <SafeAreaView style={[styles.safeArea, { backgroundColor }, contentStyle]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, gap: rastroTheme.spacing.lg, padding: rastroTheme.spacing.xl },
  safeArea: { flex: 1 },
});
```

## `RastroText`

Source: `src/design/components/RastroText.tsx`. Text scale and optional color.

```tsx
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
  return <Text numberOfLines={numberOfLines} style={[styles.base, rastroTheme.typography[variant], color ? { color } : null, style]}>{children}</Text>;
}

const styles = StyleSheet.create({ base: { color: rastroTheme.colors.ink } });
```

## `RastroButton`

Source: `src/design/components/RastroButton.tsx`. Primary/secondary/quiet/danger
button with accessibility state and loading guard.

```tsx
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

export function RastroButton({ label, variant = 'primary', loading = false, disabled = false, onPress, accessibilityLabel }: RastroButtonProps) {
  const isDisabled = disabled || loading;
  const textColor = variant === 'primary' || variant === 'danger' ? rastroTheme.colors.white : rastroTheme.colors.forest;
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.base, styles[variant], isDisabled && styles.disabled]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', borderRadius: rastroTheme.radii.md, justifyContent: 'center', minHeight: 44, minWidth: 44, paddingHorizontal: rastroTheme.spacing.lg, paddingVertical: rastroTheme.spacing.md },
  danger: { backgroundColor: rastroTheme.colors.danger },
  disabled: { opacity: 0.5 },
  label: { ...rastroTheme.typography.body, fontWeight: '800' },
  primary: { backgroundColor: rastroTheme.colors.forest },
  quiet: { backgroundColor: 'transparent', borderColor: rastroTheme.colors.border, borderWidth: 1 },
  secondary: { backgroundColor: rastroTheme.colors.surface, borderColor: rastroTheme.colors.forest, borderWidth: 1 },
});
```

## `RastroCard`

Source: `src/design/components/RastroCard.tsx`.

```tsx
import type { PropsWithChildren } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { rastroTheme } from '../theme';

type RastroCardVariant = 'default' | 'dark' | 'outlined';
interface RastroCardProps extends PropsWithChildren { variant?: RastroCardVariant; style?: StyleProp<ViewStyle>; }

export function RastroCard({ children, variant = 'default', style }: RastroCardProps) {
  return <View style={[styles.base, styles[variant], variant === 'default' && rastroTheme.elevation.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { borderRadius: rastroTheme.radii.lg, gap: rastroTheme.spacing.sm, padding: rastroTheme.spacing.lg },
  dark: { backgroundColor: rastroTheme.colors.darkSurface },
  default: { backgroundColor: rastroTheme.colors.surface },
  outlined: { backgroundColor: 'transparent', borderColor: rastroTheme.colors.border, borderWidth: 1 },
});
```

## `RastroBadge`

Source: `src/design/components/RastroBadge.tsx`. Textual status indicator.

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { rastroTheme } from '../theme';

type RastroBadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'water' | 'clay';
interface RastroBadgeProps { label: string; tone?: RastroBadgeTone; }

export function RastroBadge({ label, tone = 'neutral' }: RastroBadgeProps) {
  const colors = toneColors[tone];
  return <View accessibilityLabel={label} style={[styles.base, { backgroundColor: colors.background }]}><Text style={[styles.label, { color: colors.text }]}>{label}</Text></View>;
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
  base: { alignSelf: 'flex-start', borderRadius: rastroTheme.radii.pill, paddingHorizontal: rastroTheme.spacing.md, paddingVertical: rastroTheme.spacing.xs },
  label: { ...rastroTheme.typography.caption },
});
```

## `RastroSection`

Source: `src/design/components/RastroSection.tsx`. Heading, optional description
and action.

```tsx
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
  return <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.heading}>
        <RastroText variant="title">{title}</RastroText>
        {description ? <RastroText color={rastroTheme.colors.muted} variant="caption">{description}</RastroText> : null}
      </View>
      {actionLabel && onAction ? <RastroButton label={actionLabel} onPress={onAction} variant="quiet" /> : null}
    </View>
    {children}
  </View>;
}

const styles = StyleSheet.create({
  container: { gap: rastroTheme.spacing.md },
  header: { alignItems: 'center', flexDirection: 'row', gap: rastroTheme.spacing.sm, justifyContent: 'space-between' },
  heading: { flex: 1, gap: rastroTheme.spacing.xs },
});
```

## `TrailCard`

Source: `src/design/components/TrailCard.tsx`. Product-level summary card for a
`TrailVersion`, reused by discovery and future feeds.

```tsx
import { Pressable, StyleSheet, View } from 'react-native';
import type { TrailVersion } from '../../domain/trails';
import { rastroTheme } from '../theme';
import { RastroBadge } from './RastroBadge';
import { RastroCard } from './RastroCard';
import { RastroText } from './RastroText';

interface TrailCardProps { trail: TrailVersion; onPress?: () => void; }

export function TrailCard({ trail, onPress }: TrailCardProps) {
  return <Pressable accessibilityLabel={trail.name} accessibilityRole="button" onPress={onPress}>
    <RastroCard>
      <View style={styles.header}>
        <RastroText numberOfLines={2} style={styles.title} variant="bodyLarge">{trail.name}</RastroText>
        <RastroBadge label={statusLabel(trail.status)} tone={statusTone(trail.status)} />
      </View>
      <RastroText color={rastroTheme.colors.muted} numberOfLines={2}>{trail.description}</RastroText>
      <View style={styles.metadata}>
        <RastroBadge label={difficultyLabel(trail.generalDifficulty)} tone="clay" />
        <RastroBadge label={formatDurationRange(trail.estimatedDurationMinutes)} tone="water" />
        <RastroBadge label={trail.region ?? 'Região não informada'} />
      </View>
    </RastroCard>
  </Pressable>;
}

export function difficultyLabel(difficulty: TrailVersion['generalDifficulty']): string {
  return { easy: 'Fácil', moderate: 'Moderada', difficult: 'Difícil', extreme: 'Extrema' }[difficulty];
}

export function formatDurationRange(duration: TrailVersion['estimatedDurationMinutes']): string {
  return `${formatDuration(duration.min)}–${formatDuration(duration.max)}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours === 0) return `${remainingMinutes}min`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
}

function statusLabel(status: TrailVersion['status']): string {
  const labels: Record<TrailVersion['status'], string> = { unknown: 'Condição desconhecida', open: 'Aberta', partially_blocked: 'Parcialmente bloqueada', closed: 'Fechada' };
  return labels[status];
}

function statusTone(status: TrailVersion['status']): 'neutral' | 'success' | 'warning' | 'danger' {
  const tones: Record<TrailVersion['status'], 'neutral' | 'success' | 'warning' | 'danger'> = { unknown: 'neutral', open: 'success', partially_blocked: 'warning', closed: 'danger' };
  return tones[status];
}

const styles = StyleSheet.create({
  header: { alignItems: 'flex-start', flexDirection: 'row', gap: rastroTheme.spacing.sm, justifyContent: 'space-between' },
  metadata: { flexDirection: 'row', flexWrap: 'wrap', gap: rastroTheme.spacing.sm },
  title: { flex: 1 },
});
```

## Barrel

`src/design/components/index.ts` exports `RastroBadge`, `RastroButton`,
`RastroCard`, `RastroScreen`, `RastroSection` and `RastroText`.
