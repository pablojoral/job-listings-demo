import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useJobDetailsTheme = makeThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.surfaceColor['surface-background'],
  },
  content: {
    padding: theme.spacing['spacing-md'],
    gap: theme.spacing['spacing-md'],
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing['spacing-xs'],
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing['spacing-sm'],
  },
  footer: {
    padding: theme.spacing['spacing-md'],
    borderTopWidth: theme.borderWidth['border-width-hairline'],
    borderTopColor: theme.borderColor['border-secondary'],
    backgroundColor: theme.surfaceColor['surface-background'],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
