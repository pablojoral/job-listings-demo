import React from 'react';
import { render } from '@testing-library/react-native';

import { Icon } from './Icon';

describe('Icon', () => {
  it('renders', async () => {
    const { getByTestId } = await render(<Icon name="map-pin" testID="icon" />);
    expect(getByTestId('icon')).toBeTruthy();
  });

  it('sizes itself from the icon size token', async () => {
    const { getByTestId } = await render(<Icon name="search" size="icon-size-lg" testID="icon" />);
    const svg = getByTestId('icon');
    expect(svg.props.width).toBe(32);
    expect(svg.props.height).toBe(32);
  });
});
