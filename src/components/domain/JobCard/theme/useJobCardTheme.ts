import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useJobCardTheme = makeThemedStyles((theme) => ({
  container: {
    padding: theme.spacing['spacing-md'],
    borderRadius: theme.cornerRad['corner-rad-md'],
    backgroundColor: theme.surfaceColor['surface-primary'],
    borderWidth: theme.borderWidth['border-width-hairline'],
    borderColor: theme.borderColor['border-primary'],
    gap: theme.spacing['spacing-sm'],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['spacing-sm'],
  },
  headerFlex: {
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing['spacing-xs'],
  },
}));
