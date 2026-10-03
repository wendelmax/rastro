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
  content: {
    flexGrow: 1,
    gap: rastroTheme.spacing.lg,
    padding: rastroTheme.spacing.xl,
  },
  safeArea: {
    flex: 1,
  },
});
