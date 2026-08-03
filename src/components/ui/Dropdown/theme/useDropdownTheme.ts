import { useTheme } from 'theme/hooks/useTheme';

/**
 * The dropdown renders a native SwiftUI/Compose picker that styles itself —
 * the theme is only needed to pin the native view to the app's color scheme.
 */
export const useDropdownTheme = () => {
  const theme = useTheme();

  return { theme };
};
