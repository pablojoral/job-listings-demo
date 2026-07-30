import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { MultiSelect } from './MultiSelect';

const options = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'contract', label: 'Contract' },
];

describe('MultiSelect', () => {
  it('renders a chip per option', async () => {
    const { getByText } = await render(<MultiSelect options={options} selectedValues={[]} onChange={jest.fn()} />);
    expect(getByText('Full-time')).toBeTruthy();
    expect(getByText('Contract')).toBeTruthy();
  });

  it('adds a value to the selection on press', async () => {
    const onChange = jest.fn();
    const { getByText } = await render(<MultiSelect options={options} selectedValues={[]} onChange={onChange} />);
    await fireEvent.press(getByText('Full-time'));
    expect(onChange).toHaveBeenCalledWith(['full_time']);
  });

  it('removes an already-selected value on press', async () => {
    const onChange = jest.fn();
    const { getByText } = await render(
      <MultiSelect options={options} selectedValues={['full_time', 'contract']} onChange={onChange} />,
    );
    await fireEvent.press(getByText('Full-time'));
    expect(onChange).toHaveBeenCalledWith(['contract']);
  });

  it('supports multiple simultaneous selections', async () => {
    const onChange = jest.fn();
    const { getByText, rerender } = await render(
      <MultiSelect options={options} selectedValues={[]} onChange={onChange} />,
    );

    await fireEvent.press(getByText('Full-time'));
    expect(onChange).toHaveBeenLastCalledWith(['full_time']);

    await rerender(<MultiSelect options={options} selectedValues={['full_time']} onChange={onChange} />);
    await fireEvent.press(getByText('Contract'));
    expect(onChange).toHaveBeenLastCalledWith(['full_time', 'contract']);
  });
});
