import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useCompanyLogoTheme = makeThemedStyles((theme) => ({
  logo: {
    width: theme.iconSize['icon-size-xxl'],
    height: theme.iconSize['icon-size-xxl'],
    borderRadius: theme.cornerRad['corner-rad-sm'],
    backgroundColor: theme.surfaceColor['surface-secondary'],
  },
}));
