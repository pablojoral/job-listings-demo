import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';
import type { FontColorToken } from 'theme/tokens';

export const useChipTheme = (selected: boolean) => {
  const theme = useTheme();

  const containerStyle = useMemo<ViewStyle>(
    () => ({
      paddingVertical: theme.spacing['spacing-xxs'],
      paddingHorizontal: theme.spacing['spacing-sm'],
      borderRadius: theme.cornerRad['corner-rad-full'],
      borderWidth: theme.borderWidth['border-width-hairline'],
      backgroundColor: selected ? theme.surfaceColor['surface-brand'] : theme.surfaceColor['surface-primary'],
      borderColor: selected ? theme.surfaceColor['surface-brand'] : theme.borderColor['border-primary'],
    }),
    [theme, selected],
  );

  const labelColor: FontColorToken = selected ? 'font-on-brand' : 'font-secondary';

  return { containerStyle, labelColor, theme };
};
