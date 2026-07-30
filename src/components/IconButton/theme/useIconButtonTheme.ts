import { StyleSheet } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export const useIconButtonTheme = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing['spacing-sm'],
      borderRadius: theme.cornerRad['corner-rad-md'],
      borderWidth: theme.borderWidth['border-width-hairline'],
      borderColor: theme.borderColor['border-primary'],
      backgroundColor: theme.surfaceColor['surface-primary'],
    },
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

  return { styles, theme };
};
