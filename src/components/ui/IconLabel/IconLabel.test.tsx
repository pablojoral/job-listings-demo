import React from 'react';
import { render } from '@testing-library/react-native';

import { IconLabel } from './IconLabel';

describe('IconLabel', () => {
  it('renders its label', async () => {
    const { getByText } = await render(<IconLabel icon="map-pin" label="Worldwide" />);
    expect(getByText('Worldwide')).toBeTruthy();
  });
});
