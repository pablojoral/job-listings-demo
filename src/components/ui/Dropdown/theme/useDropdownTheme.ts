import { Dimensions } from 'react-native';

import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useDropdownTheme = makeThemedStyles((theme) => {
  // Bounded so the option ScrollView has a fixed height to scroll within —
  // capped at the safe-area top inset plus a spacing buffer, same rationale
  // as the filters sheet (see useFiltersModalTheme).
  const maxSheetHeight = Dimensions.get('window').height - theme.topInset - theme.spacing['spacing-xl'];

  return {
    // Mirrors the TextInput container so both filter inputs read as one family.
    trigger: {
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
    triggerLabel: {
      flex: 1,
    },
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
      paddingTop: theme.spacing['spacing-sm'],
      paddingBottom: theme.spacing['spacing-sm'] + theme.bottomInset,
    },
    option: {
      paddingVertical: theme.spacing['spacing-sm'],
      paddingHorizontal: theme.spacing['spacing-md'],
    },
  };
});
