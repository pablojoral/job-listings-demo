import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useFavoritesListTheme = makeThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.surfaceColor['surface-background'],
  },
  listContent: {
    flexGrow: 1,
    padding: theme.spacing['spacing-md'],
    gap: theme.spacing['spacing-md'],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
