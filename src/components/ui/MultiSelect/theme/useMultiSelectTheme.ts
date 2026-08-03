import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useMultiSelectTheme = makeThemedStyles((theme) => ({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing['spacing-sm'],
  },
}));
