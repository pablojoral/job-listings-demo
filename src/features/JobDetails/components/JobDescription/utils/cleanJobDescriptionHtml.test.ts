import { cleanJobDescriptionHtml } from './cleanJobDescriptionHtml';

describe('cleanJobDescriptionHtml', () => {
  it('removes paragraphs containing only &nbsp;', () => {
    expect(cleanJobDescriptionHtml('<p>Hello</p><p>&nbsp;</p><p>World</p>')).toBe(
      '<p>Hello</p><p>World</p>',
    );
  });

  it('removes paragraphs containing only whitespace or line breaks', () => {
    expect(cleanJobDescriptionHtml('<p>  </p><p><br></p><p><br /></p>')).toBe('');
  });

  it('removes empty paragraphs that carry attributes', () => {
    expect(cleanJobDescriptionHtml('<p style="text-align:center">&nbsp;</p>')).toBe('');
  });

  it('keeps paragraphs with real content', () => {
    const html = '<p>We are <strong>hiring</strong></p>';
    expect(cleanJobDescriptionHtml(html)).toBe(html);
  });

  it('keeps non-paragraph markup untouched', () => {
    const html = '<ul><li>Ship features</li></ul>';
    expect(cleanJobDescriptionHtml(html)).toBe(html);
  });
});
