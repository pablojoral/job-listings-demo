import { useMemo } from 'react';

import { StyleSheet } from 'react-native';

import { useTheme, type Theme } from 'theme/hooks/useTheme';

/**
 * Builds a `use<Name>Theme` hook for the common case: styles that depend only
 * on the theme. Encodes the required pattern once — `useTheme` + a
 * `StyleSheet.create` memoized on `[theme]` — so per-component theme hooks
 * can't accidentally rebuild styles on every render (see styling rules §4).
 *
 * Hooks whose styles also depend on props or state don't fit this factory and
 * are written by hand (e.g. `useButtonTheme`, `useChipTheme`).
 */
export const makeThemedStyles = <T extends StyleSheet.NamedStyles<T>>(builder: (theme: Theme) => T) => {
  return function useThemedStyles() {
    const theme = useTheme();
    const styles = useMemo(() => StyleSheet.create(builder(theme)), [theme, builder]);
    return { styles, theme };
  };
};
