import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useJobListHeaderTheme = makeThemedStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing['spacing-sm'],
  },
}));
