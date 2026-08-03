import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { QueryProvider } from 'query/provider';

/**
 * Anchor the root stack at the tab navigator: a deep link straight to
 * jobs/[id] mounts (tabs) beneath it, so back navigation always lands on
 * the tabs instead of dead-ending on the details screen.
 */
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          {/* Lives outside the (tabs) group so either tab can push it over the tab bar. */}
          <Stack.Screen
            name="jobs/[id]"
            options={{ headerShown: true, title: '', headerBackButtonDisplayMode: 'minimal' }}
          />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}
