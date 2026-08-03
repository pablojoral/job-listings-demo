import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useJobFiltersTheme = makeThemedStyles((theme) => ({
  container: {
    gap: theme.spacing['spacing-md'],
  },
  section: {
    gap: theme.spacing['spacing-xs'],
  },
}));
