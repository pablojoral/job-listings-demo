import { StyleSheet } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export const useJobFiltersTheme = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      gap: theme.spacing['spacing-md'],
    },
    section: {
      gap: theme.spacing['spacing-xs'],
    },
  });

  return { styles, theme };
};
