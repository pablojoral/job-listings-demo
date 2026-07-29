import { renderHook } from '@testing-library/react-native';

import { useTheme } from './useTheme';
import { darkColors, lightColors } from '../tokens';

// react-native's module namespace is full of lazy getters (FlatList, native
// modules, ...) — spreading it (`{ ...actual }`) forces them all to evaluate
// eagerly and crashes. A Proxy delegates straight through instead, only
// substituting `useColorScheme`.
const mockUseColorScheme = jest.fn();
jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return new Proxy(actual, {
    get(target, prop) {
      if (prop === 'useColorScheme') return mockUseColorScheme;
      return target[prop as keyof typeof target];
    },
  });
});

describe('useTheme', () => {
  it('resolves light colors by default', async () => {
    mockUseColorScheme.mockReturnValue('light');
    const { result } = await renderHook(() => useTheme());
    expect(result.current.isDark).toBe(false);
    expect(result.current.surfaceColor).toEqual(lightColors.surfaceColor);
  });

  it('resolves dark colors when the scheme is dark', async () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { result } = await renderHook(() => useTheme());
    expect(result.current.isDark).toBe(true);
    expect(result.current.surfaceColor).toEqual(darkColors.surfaceColor);
  });

  it('exposes safe-area insets alongside the design tokens', async () => {
    mockUseColorScheme.mockReturnValue('light');
    const { result } = await renderHook(() => useTheme());
    expect(result.current.topInset).toBe(0);
    expect(result.current.bottomInset).toBe(0);
  });
});
