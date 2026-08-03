import React from 'react';
import { render } from '@testing-library/react-native';

import { Tag } from './Tag';

describe('Tag', () => {
  it('renders its label', async () => {
    const { getByText } = await render(<Tag label="Software Development" />);
    expect(getByText('Software Development')).toBeTruthy();
  });
});
