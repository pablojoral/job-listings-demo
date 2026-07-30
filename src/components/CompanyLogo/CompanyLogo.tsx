import React from 'react';
import { Image } from 'expo-image';

import { useCompanyLogoTheme } from './theme/useCompanyLogoTheme';

// Cross-dissolve once the remote image arrives, so logos fade in instead of popping.
const FADE_IN_MS = 200;

interface CompanyLogoProps {
  url: string;
}

/**
 * A company logo loaded lazily from a remote URL via `expo-image` (async
 * loading + disk cache by default). Renders nothing when the API returned no
 * logo URL, so callers can pass the field straight through.
 */
export const CompanyLogo = ({ url }: CompanyLogoProps) => {
  const { styles } = useCompanyLogoTheme();

  if (!url) {
    return null;
  }

  return <Image source={url} style={styles.logo} contentFit="contain" transition={FADE_IN_MS} testID="company-logo" />;
};
