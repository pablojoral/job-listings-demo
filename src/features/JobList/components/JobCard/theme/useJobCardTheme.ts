import { StyleSheet } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export const useJobCardTheme = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing['spacing-md'],
      borderRadius: theme.cornerRad['corner-rad-md'],
      backgroundColor: theme.surfaceColor['surface-primary'],
      borderWidth: theme.borderWidth['border-width-hairline'],
      borderColor: theme.borderColor['border-primary'],
      gap: theme.spacing['spacing-sm'],
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing['spacing-sm'],
    },
    headerText: {
      flex: 1,
      gap: theme.spacing['spacing-xxs'],
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing['spacing-xs'],
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing['spacing-xs'],
    },
  });

  return { styles, theme };
};
