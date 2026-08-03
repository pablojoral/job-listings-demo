import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { Button } from './Button';

describe('Button', () => {
  it('renders its label', async () => {
    const { getByText } = await render(<Button label="Save job" onPress={jest.fn()} />);
    expect(getByText('Save job')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<Button label="Save job" onPress={onPress} />);
    await fireEvent.press(getByText('Save job'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(<Button label="Save job" onPress={onPress} disabled />);
    await fireEvent.press(getByText('Save job'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows a spinner instead of the label while loading, and blocks press', async () => {
    const onPress = jest.fn();
    const { queryByText, getByRole } = await render(<Button label="Save job" onPress={onPress} loading />);
    expect(queryByText('Save job')).toBeNull();
    await fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders a leading icon when icon is set', async () => {
    const { queryByTestId } = await render(<Button label="Save job" onPress={jest.fn()} icon="search" />);
    expect(queryByTestId('button-icon')).toBeTruthy();
  });

  it('renders no icon by default', async () => {
    const { queryByTestId } = await render(<Button label="Save job" onPress={jest.fn()} />);
    expect(queryByTestId('button-icon')).toBeNull();
  });
});
