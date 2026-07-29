import React from 'react';
import { render } from '@testing-library/react-native';

import { ActivityIndicator } from './ActivityIndicator';

describe('ActivityIndicator', () => {
  it('renders', async () => {
    const { getByTestId } = await render(<ActivityIndicator testID="indicator" />);
    expect(getByTestId('indicator')).toBeTruthy();
  });

  it('applies the color token', async () => {
    const { getByTestId } = await render(<ActivityIndicator color="font-danger" testID="indicator" />);
    expect(getByTestId('indicator').props.color).toBe('#E5484D');
  });
});
