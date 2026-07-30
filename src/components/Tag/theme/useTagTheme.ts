import { StyleSheet } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export const useTagTheme = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingVertical: theme.spacing['spacing-xxs'],
      paddingHorizontal: theme.spacing['spacing-sm'],
      borderRadius: theme.cornerRad['corner-rad-full'],
      backgroundColor: theme.surfaceColor['surface-brand-soft'],
    },
  });

  return { styles, theme };
};
