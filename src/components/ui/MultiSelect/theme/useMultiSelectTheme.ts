import { StyleSheet } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export const useMultiSelectTheme = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing['spacing-sm'],
    },
  });

  return { styles, theme };
};
