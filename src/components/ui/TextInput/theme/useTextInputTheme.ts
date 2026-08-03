import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useTextInputTheme = makeThemedStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing['spacing-sm'],
    paddingVertical: theme.spacing['spacing-sm'],
    paddingHorizontal: theme.spacing['spacing-md'],
    borderRadius: theme.cornerRad['corner-rad-md'],
    borderWidth: theme.borderWidth['border-width-hairline'],
    borderColor: theme.borderColor['border-primary'],
    backgroundColor: theme.surfaceColor['surface-primary'],
  },
  input: {
    flex: 1,
    padding: theme.spacing['spacing-none'],
    color: theme.fontColor['font-primary'],
    fontSize: theme.fontSize['font-size-md'],
  },
}));
