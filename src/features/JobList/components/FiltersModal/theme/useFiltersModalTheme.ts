import { Dimensions } from 'react-native';

import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useFiltersModalTheme = makeThemedStyles((theme) => {
  // Bounded so the ScrollView inside `sheet` has a fixed height to scroll
  // within — capped at the safe-area top inset (never covers the status bar
  // / notch) plus a spacing buffer, not an arbitrary percentage of the screen.
  const maxSheetHeight = Dimensions.get('window').height - theme.topInset - theme.spacing['spacing-xl'];

  return {
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      position: 'absolute',
      top: theme.spacing['spacing-none'],
      bottom: theme.spacing['spacing-none'],
      left: theme.spacing['spacing-none'],
      right: theme.spacing['spacing-none'],
      backgroundColor: theme.surfaceColor['surface-overlay'],
    },
    sheet: {
      maxHeight: maxSheetHeight,
      backgroundColor: theme.surfaceColor['surface-background'],
      borderTopLeftRadius: theme.cornerRad['corner-rad-lg'],
      borderTopRightRadius: theme.cornerRad['corner-rad-lg'],
      paddingTop: theme.spacing['spacing-md'],
      paddingBottom: theme.spacing['spacing-md'] + theme.bottomInset,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing['spacing-md'],
      paddingBottom: theme.spacing['spacing-md'],
    },
    body: {
      paddingHorizontal: theme.spacing['spacing-md'],
      paddingBottom: theme.spacing['spacing-md'],
    },
    footer: {
      paddingHorizontal: theme.spacing['spacing-md'],
      paddingTop: theme.spacing['spacing-sm'],
      borderTopWidth: theme.borderWidth['border-width-hairline'],
      borderTopColor: theme.borderColor['border-secondary'],
    },
  };
});
