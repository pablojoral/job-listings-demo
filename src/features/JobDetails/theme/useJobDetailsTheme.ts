import { StyleSheet } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export const useJobDetailsTheme = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceColor['surface-background'],
    },
    content: {
      padding: theme.spacing['spacing-md'],
      gap: theme.spacing['spacing-md'],
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing['spacing-xs'],
    },
    actionsRow: {
      flexDirection: 'row',
      gap: theme.spacing['spacing-sm'],
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return { styles, theme };
};
