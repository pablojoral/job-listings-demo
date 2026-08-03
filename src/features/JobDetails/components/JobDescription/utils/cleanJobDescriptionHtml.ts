/**
 * Removes the filler paragraphs Remotive descriptions are littered with —
 * `<p>&nbsp;</p>`, `<p> </p>`, `<p><br></p>` — which would otherwise render
 * as stray blank lines. Runs on the raw HTML string before parsing, because
 * `RenderHtml`'s `ignoreDomNode` fires as elements open, before their
 * children exist (see `ignoreJobDescriptionNode`).
 */
export const cleanJobDescriptionHtml = (html: string): string =>
  html.replace(/<p[^>]*>(?:\s|\u00A0|&nbsp;|<br\s*\/?>)*<\/p>/gi, '');
