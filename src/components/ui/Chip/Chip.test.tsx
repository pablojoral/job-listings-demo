import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { Chip } from './Chip';

describe('Chip', () => {
  it('renders its label', async () => {
    const { getByText } = await render(<Chip label="Contract" selected={false} onPress={jest.fn()} />);
    expect(getByText('Contract')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<Chip label="Contract" selected={false} onPress={onPress} />);
    await fireEvent.press(getByText('Contract'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('exposes its selected state to accessibility', async () => {
    const { getByRole, rerender } = await render(<Chip label="Contract" selected={false} onPress={jest.fn()} />);
    expect(getByRole('button', { selected: false })).toBeTruthy();

    await rerender(<Chip label="Contract" selected onPress={jest.fn()} />);
    expect(getByRole('button', { selected: true })).toBeTruthy();
  });
});
