import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { QueryProvider } from 'query/provider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Slot />
      </ThemeProvider>
    </QueryProvider>
  );
}
