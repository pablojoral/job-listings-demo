import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders the current value and placeholder', async () => {
    const { getByPlaceholderText } = await render(
      <TextInput value="engineer" onChangeText={jest.fn()} placeholder="Search" />,
    );
    expect(getByPlaceholderText('Search').props.value).toBe('engineer');
  });

  it('calls onChangeText when the user types', async () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = await render(
      <TextInput value="" onChangeText={onChangeText} placeholder="Search" />,
    );
    await fireEvent.changeText(getByPlaceholderText('Search'), 'backend');
    expect(onChangeText).toHaveBeenCalledWith('backend');
  });

  it('renders no leading icon by default', async () => {
    const { queryByTestId } = await render(<TextInput value="" onChangeText={jest.fn()} placeholder="Search" />);
    expect(queryByTestId('button-icon')).toBeNull();
  });

  it('does not render a clear button when onClear is omitted', async () => {
    const { queryByRole } = await render(<TextInput value="engineer" onChangeText={jest.fn()} placeholder="Search" />);
    expect(queryByRole('button')).toBeNull();
  });

  it('shows a clear button only once there is a value, and calls onClear on press', async () => {
    const onClear = jest.fn();
    const { getByLabelText, queryByLabelText, rerender } = await render(
      <TextInput value="" onChangeText={jest.fn()} placeholder="Search" onClear={onClear} clearLabel="Clear" />,
    );
    expect(queryByLabelText('Clear')).toBeNull();

    await rerender(
      <TextInput value="engineer" onChangeText={jest.fn()} placeholder="Search" onClear={onClear} clearLabel="Clear" />,
    );
    await fireEvent.press(getByLabelText('Clear'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
