import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useJobHeaderTheme = makeThemedStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['spacing-sm'],
  },
  titleText: {
    flex: 1,
  },
}));
