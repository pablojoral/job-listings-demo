import RenderHtml from '@native-html/render';

import { useJobDescription } from './hooks/useJobDescription';
import { useJobDescriptionTheme } from './theme/useJobDescriptionTheme';

interface JobDescriptionProps {
  /** Raw HTML from `Job['description']`. */
  html: string;
}

/**
 * Renders a job's HTML description as native views. Sanitization is
 * allowlist-based (see `useJobDescription`), so unexpected markup degrades to
 * plain text instead of breaking the layout or the theme.
 */
export const JobDescription = ({ html }: JobDescriptionProps) => {
  const { source, contentWidth, renderersProps, allowedStyles, ignoredDomTags, ignoreDomNode } =
    useJobDescription(html);
  const { baseStyle, tagsStyles } = useJobDescriptionTheme();

  return (
    <RenderHtml
      source={source}
      contentWidth={contentWidth}
      baseStyle={baseStyle}
      tagsStyles={tagsStyles}
      allowedStyles={allowedStyles}
      ignoredDomTags={ignoredDomTags}
      ignoreDomNode={ignoreDomNode}
      renderersProps={renderersProps}
      enableExperimentalMarginCollapsing
    />
  );
};
