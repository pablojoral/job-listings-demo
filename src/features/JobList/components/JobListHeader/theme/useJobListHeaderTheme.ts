import { StyleSheet } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export const useJobListHeaderTheme = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing['spacing-sm'],
    },
  });

  return { styles, theme };
};
