import { Element, Text } from '@native-html/render';

import { ignoreJobDescriptionNode } from './ignoreJobDescriptionNode';

describe('ignoreJobDescriptionNode', () => {
  it('drops the Remotive tracking pixel', () => {
    const pixel = new Element('img', {
      src: 'https://remotive.com/job/track/1234567/blank.gif',
    });
    expect(ignoreJobDescriptionNode(pixel)).toBe(true);
  });

  it('drops an img with no src', () => {
    expect(ignoreJobDescriptionNode(new Element('img', {}))).toBe(true);
  });

  it('keeps a content image', () => {
    const img = new Element('img', { src: 'https://acme.com/team.jpg' });
    expect(ignoreJobDescriptionNode(img)).toBe(false);
  });

  it('keeps text nodes and non-img tags', () => {
    expect(ignoreJobDescriptionNode(new Text('plain text'))).toBe(false);
    expect(ignoreJobDescriptionNode(new Element('p', {}))).toBe(false);
    expect(ignoreJobDescriptionNode(new Element('ul', {}))).toBe(false);
  });
});
