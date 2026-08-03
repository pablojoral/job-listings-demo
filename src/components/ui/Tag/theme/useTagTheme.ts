import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useTagTheme = makeThemedStyles((theme) => ({
  container: {
    paddingVertical: theme.spacing['spacing-xxs'],
    paddingHorizontal: theme.spacing['spacing-sm'],
    borderRadius: theme.cornerRad['corner-rad-full'],
    backgroundColor: theme.surfaceColor['surface-brand-soft'],
  },
}));
