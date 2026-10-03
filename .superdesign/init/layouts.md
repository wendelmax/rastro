# Shared layouts

## `app/_layout.tsx`

Root Expo Router layout. It owns the stack and global route behavior.

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}
```

## `app/(tabs)/_layout.tsx`

Bottom-tab shell with Rastro Terra colors.

```tsx
import { Tabs } from 'expo-router';
import { rastroTheme } from '../../src/design/theme';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: rastroTheme.colors.forest,
      tabBarInactiveTintColor: rastroTheme.colors.muted,
      tabBarStyle: { backgroundColor: rastroTheme.colors.surface, borderTopColor: rastroTheme.colors.border },
    }}>
      <Tabs.Screen name="explore" options={{ title: 'Explorar' }} />
      <Tabs.Screen name="profile" options={{ title: 'Meu rastro' }} />
    </Tabs>
  );
}
```

## `src/design/components/RastroScreen.tsx`

The reusable screen shell is documented in `components.md`; it owns safe area,
background, padding and optional scrolling for feature screens.
