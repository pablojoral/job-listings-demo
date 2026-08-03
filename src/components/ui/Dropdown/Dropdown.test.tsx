import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { Dropdown } from './Dropdown';

// The option list lives on the native side (SwiftUI/Compose picker) — items
// are data props, not pressable text, so per testing rules §5/§9 the tests
// drive selection through the picker's native event seam via testID rather
// than asserting native rendering internals.
const options = [
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
];

describe('Dropdown', () => {
  it('renders the native picker', async () => {
    const { getByTestId } = await render(
      <Dropdown
        options={options}
        selectedValue={null}
        onChange={jest.fn()}
        placeholder="All categories"
        testID="dropdown"
      />,
    );
    expect(getByTestId('dropdown')).toBeTruthy();
  });

  it('reports the picked value through onChange', async () => {
    const onChange = jest.fn();
    const { getByTestId } = await render(
      <Dropdown
        options={options}
        selectedValue={null}
        onChange={onChange}
        placeholder="All categories"
        testID="dropdown"
      />,
    );

    await fireEvent(getByTestId('dropdown'), 'selectionChange', { nativeEvent: { selection: 'sales' } });
    expect(onChange).toHaveBeenCalledWith('sales');
  });

  it('reports null when the placeholder option is picked', async () => {
    const onChange = jest.fn();
    const { getByTestId } = await render(
      <Dropdown
        options={options}
        selectedValue="design"
        onChange={onChange}
        placeholder="All categories"
        testID="dropdown"
      />,
    );

    await fireEvent(getByTestId('dropdown'), 'selectionChange', { nativeEvent: { selection: '' } });
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
