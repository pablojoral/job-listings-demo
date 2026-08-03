import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useEmptyStateTheme = makeThemedStyles((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing['spacing-xl'],
    gap: theme.spacing['spacing-sm'],
  },
}));
