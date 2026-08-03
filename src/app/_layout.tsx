import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { QueryProvider } from 'query/provider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          {/* Lives outside the (tabs) group so either tab can push it over the tab bar. */}
          <Stack.Screen name="jobs/[id]" options={{ headerShown: true, title: '' }} />
        </Stack>
      </ThemeProvider>
    </QueryProvider>
  );
}
