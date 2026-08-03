import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useIconLabelTheme = makeThemedStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['spacing-xs'],
  },
}));
