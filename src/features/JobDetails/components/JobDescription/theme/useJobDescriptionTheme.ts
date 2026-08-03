import { useMemo } from 'react';

import type { MixedStyleDeclaration, MixedStyleRecord } from '@native-html/render';

import { useTheme } from 'theme/hooks/useTheme';

/**
 * Styles for the rendered HTML description. These are `RenderHtml` style
 * records, not RN `StyleSheet` styles — the renderer flattens them into the
 * native views it creates per tag.
 *
 * Block spacing uses margins: the description is a document flow, not a flex
 * container, so `gap` cannot reach between its blocks (see styling rules §6
 * exception). Margin collapsing is enabled on the renderer.
 */
export const useJobDescriptionTheme = () => {
  const theme = useTheme();

  const baseStyle: MixedStyleDeclaration = useMemo(
    () => ({
      color: theme.fontColor['font-primary'],
      fontSize: theme.fontSize['font-size-sm'],
      lineHeight: theme.lineHeight['line-height-sm'],
    }),
    [theme],
  );

  const tagsStyles: MixedStyleRecord = useMemo(
    () => ({
      p: {
        marginTop: 0,
        marginBottom: theme.spacing['spacing-sm'],
      },
      ul: {
        marginTop: 0,
        marginBottom: theme.spacing['spacing-sm'],
        paddingLeft: theme.spacing['spacing-md'],
      },
      ol: {
        marginTop: 0,
        marginBottom: theme.spacing['spacing-sm'],
        paddingLeft: theme.spacing['spacing-md'],
      },
      li: {
        marginBottom: theme.spacing['spacing-xs'],
      },
      a: {
        color: theme.fontColor['font-brand'],
        textDecorationLine: 'none',
      },
      strong: {
        fontWeight: theme.fontWeight['font-weight-semibold'],
      },
      b: {
        fontWeight: theme.fontWeight['font-weight-semibold'],
      },
      h1: {
        fontSize: theme.fontSize['font-size-lg'],
        lineHeight: theme.lineHeight['line-height-lg'],
        marginTop: theme.spacing['spacing-sm'],
        marginBottom: theme.spacing['spacing-sm'],
      },
      h2: {
        fontSize: theme.fontSize['font-size-lg'],
        lineHeight: theme.lineHeight['line-height-lg'],
        marginTop: theme.spacing['spacing-sm'],
        marginBottom: theme.spacing['spacing-sm'],
      },
      h3: {
        fontSize: theme.fontSize['font-size-md'],
        lineHeight: theme.lineHeight['line-height-md'],
        marginTop: theme.spacing['spacing-sm'],
        marginBottom: theme.spacing['spacing-sm'],
      },
      h4: {
        fontSize: theme.fontSize['font-size-md'],
        lineHeight: theme.lineHeight['line-height-md'],
        marginTop: theme.spacing['spacing-sm'],
        marginBottom: theme.spacing['spacing-sm'],
      },
    }),
    [theme],
  );

  return { baseStyle, tagsStyles, theme };
};
