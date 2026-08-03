/**
 * Crude plain-text extraction from an HTML string: drops tags, decodes the
 * handful of entities Remotive descriptions actually use, and collapses
 * whitespace. Good enough for preview text — not an HTML renderer.
 */
export const stripHtml = (html: string): string =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
