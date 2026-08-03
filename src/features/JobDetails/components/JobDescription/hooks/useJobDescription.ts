import { useMemo } from 'react';
import { type GestureResponderEvent, useWindowDimensions } from 'react-native';

import * as WebBrowser from 'expo-web-browser';

import type { RenderHTMLProps } from '@native-html/render';

import { useTheme } from 'theme/hooks/useTheme';

import { cleanJobDescriptionHtml } from '../utils/cleanJobDescriptionHtml';
import { ignoreJobDescriptionNode } from '../utils/ignoreJobDescriptionNode';

/**
 * Inline-style allowlist: everything else — Remotive descriptions arrive
 * polluted with hardcoded colors, fonts, and Tailwind variables — is dropped,
 * so the app theme (and dark mode) always wins. Only text-level emphasis and
 * alignment survive.
 */
const ALLOWED_STYLES: RenderHTMLProps['allowedStyles'] = [
  'fontWeight',
  'fontStyle',
  'textDecorationLine',
  'textAlign',
];

/** Tags that make no sense inside a job description rendered natively. */
const IGNORED_DOM_TAGS = ['iframe', 'object', 'embed', 'form', 'input', 'button', 'video', 'audio'];

export const useJobDescription = (html: string) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  // RenderHtml re-parses the whole document when `source` changes identity —
  // keep it (and every config prop below) referentially stable.
  const source = useMemo(() => ({ html: cleanJobDescriptionHtml(html) }), [html]);

  // The description sits inside JobDetails' ScrollView, which insets its
  // content by spacing-md per side; images/tables size against this width.
  const contentWidth = width - 2 * theme.spacing['spacing-md'];

  const renderersProps: RenderHTMLProps['renderersProps'] = useMemo(
    () => ({
      a: {
        onPress: (_event: GestureResponderEvent, href: string) => {
          // No failure UI to recover into — warn and drop instead of leaving
          // an unhandled rejection.
          WebBrowser.openBrowserAsync(href).catch((error) => console.warn('Failed to open link', error));
        },
      },
    }),
    [],
  );

  return {
    source,
    contentWidth,
    renderersProps,
    allowedStyles: ALLOWED_STYLES,
    ignoredDomTags: IGNORED_DOM_TAGS,
    ignoreDomNode: ignoreJobDescriptionNode,
  };
};
