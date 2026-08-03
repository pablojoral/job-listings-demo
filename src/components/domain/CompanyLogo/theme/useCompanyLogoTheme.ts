import { StyleSheet } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export const useCompanyLogoTheme = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    logo: {
      width: theme.iconSize['icon-size-xxl'],
      height: theme.iconSize['icon-size-xxl'],
      borderRadius: theme.cornerRad['corner-rad-sm'],
      backgroundColor: theme.surfaceColor['surface-secondary'],
    },
  });

  return { styles, theme };
};
