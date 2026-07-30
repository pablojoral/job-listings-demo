import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByLabelText } = await render(<IconButton icon="filter" onPress={onPress} accessibilityLabel="Filters" />);
    await fireEvent.press(getByLabelText('Filters'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows no badge by default', async () => {
    const { queryByText } = await render(<IconButton icon="filter" onPress={jest.fn()} accessibilityLabel="Filters" />);
    expect(queryByText('0')).toBeNull();
  });

  it('shows the badge count when greater than zero', async () => {
    const { getByText } = await render(
      <IconButton icon="filter" onPress={jest.fn()} accessibilityLabel="Filters" badgeCount={3} />,
    );
    expect(getByText('3')).toBeTruthy();
  });
});
