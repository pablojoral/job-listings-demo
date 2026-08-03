import { stripHtml } from './stripHtml';

describe('stripHtml', () => {
  it('removes tags and collapses whitespace', () => {
    expect(stripHtml('<p>Senior <strong>Backend</strong> Engineer</p>\n<ul><li>Remote</li></ul>')).toBe(
      'Senior Backend Engineer Remote',
    );
  });

  it('decodes common entities', () => {
    expect(stripHtml('Fish &amp; Chips &lt;3 &quot;remote&quot; &#39;ok&#39;&nbsp;now')).toBe(
      'Fish & Chips <3 "remote" \'ok\' now',
    );
  });

  it('returns an empty string for empty input', () => {
    expect(stripHtml('')).toBe('');
  });
});
