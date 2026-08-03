import { Tabs } from 'expo-router';

import { Icon } from 'components/ui/Icon/Icon';
import { useTheme } from 'theme/hooks/useTheme';

const renderJobsTabIcon = ({ focused }: { focused: boolean }) => (
  <Icon name="briefcase" size="icon-size-sm" color={focused ? 'font-brand' : 'font-secondary'} />
);

const renderFavoritesTabIcon = ({ focused }: { focused: boolean }) => (
  <Icon name="heart" size="icon-size-sm" color={focused ? 'font-brand' : 'font-secondary'} />
);

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.fontColor['font-brand'],
        tabBarInactiveTintColor: theme.fontColor['font-secondary'],
        tabBarStyle: { backgroundColor: theme.surfaceColor['surface-primary'] },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Jobs', tabBarIcon: renderJobsTabIcon }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites', tabBarIcon: renderFavoritesTabIcon }} />
    </Tabs>
  );
}
