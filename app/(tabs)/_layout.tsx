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
