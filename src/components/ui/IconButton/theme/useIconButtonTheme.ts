import { useMemo } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export type IconButtonVariant = 'outlined' | 'plain';

export const useIconButtonTheme = (variant: IconButtonVariant) => {
  const theme = useTheme();

  const containerStyle = useMemo<ViewStyle>(() => {
    const base: ViewStyle = {
      padding: theme.spacing['spacing-sm'],
      borderRadius: theme.cornerRad['corner-rad-md'],
    };

    switch (variant) {
      case 'outlined':
        return {
          ...base,
          borderWidth: theme.borderWidth['border-width-hairline'],
          borderColor: theme.borderColor['border-primary'],
          backgroundColor: theme.surfaceColor['surface-primary'],
        };
      case 'plain':
        return base;
    }
  }, [theme, variant]);

  const styles = StyleSheet.create({
    badge: {
      position: 'absolute',
      top: -theme.spacing['spacing-xs'],
      right: -theme.spacing['spacing-xs'],
      minWidth: theme.spacing['spacing-md'],
      paddingHorizontal: theme.spacing['spacing-xxs'],
      borderRadius: theme.cornerRad['corner-rad-full'],
      backgroundColor: theme.surfaceColor['surface-brand'],
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return { containerStyle, styles, theme };
};
