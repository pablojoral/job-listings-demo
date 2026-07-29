import { StyleSheet } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export const useComponentsShowcaseTheme = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceColor['surface-background'],
    },
    scrollContent: {
      padding: theme.spacing['spacing-lg'],
      gap: theme.spacing['spacing-xl'],
    },
    section: {
      gap: theme.spacing['spacing-md'],
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme.spacing['spacing-md'],
    },
    card: {
      padding: theme.spacing['spacing-md'],
      borderRadius: theme.cornerRad['corner-rad-md'],
      backgroundColor: theme.surfaceColor['surface-primary'],
      borderWidth: theme.borderWidth['border-width-hairline'],
      borderColor: theme.borderColor['border-primary'],
      gap: theme.spacing['spacing-sm'],
    },
  });

  return { styles, theme };
};
