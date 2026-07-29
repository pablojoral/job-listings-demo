import { renderHook } from '@testing-library/react-native';

import { useTheme } from './useTheme';
import { darkColors, lightColors } from '../tokens';

jest.mock('@/hooks/use-color-scheme', () => ({ useColorScheme: jest.fn() }));

const { useColorScheme } = jest.requireMock('@/hooks/use-color-scheme') as { useColorScheme: jest.Mock };

describe('useTheme', () => {
  it('resolves light colors by default', async () => {
    useColorScheme.mockReturnValue('light');
    const { result } = await renderHook(() => useTheme());
    expect(result.current.isDark).toBe(false);
    expect(result.current.surfaceColor).toEqual(lightColors.surfaceColor);
  });

  it('resolves dark colors when the scheme is dark', async () => {
    useColorScheme.mockReturnValue('dark');
    const { result } = await renderHook(() => useTheme());
    expect(result.current.isDark).toBe(true);
    expect(result.current.surfaceColor).toEqual(darkColors.surfaceColor);
  });

  it('exposes safe-area insets alongside the design tokens', async () => {
    useColorScheme.mockReturnValue('light');
    const { result } = await renderHook(() => useTheme());
    expect(result.current.topInset).toBe(0);
    expect(result.current.bottomInset).toBe(0);
  });
});
