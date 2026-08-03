import { isDomElement, type Node } from '@native-html/render';

/**
 * Drops `img` nodes that would render as visual junk in Remotive descriptions:
 * the tracking pixel appended to every description (a `blank.gif` under
 * `/job/track/`) and any `img` with no `src` — both show as a broken image.
 *
 * Passed to `RenderHtml`'s `ignoreDomNode`, which the parser calls as each
 * element *opens* — attributes are available but children are not, so this
 * can only judge a node by its tag and attributes. Filters that need to see
 * content (e.g. empty paragraphs) live in `cleanJobDescriptionHtml` instead.
 */
export const ignoreJobDescriptionNode = (node: Node): boolean => {
  if (!isDomElement(node) || node.name !== 'img') return false;

  const src = node.attribs.src;
  return !src || src.includes('/job/track/');
};
