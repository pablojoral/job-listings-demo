import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { Dropdown } from './Dropdown';

const options = [
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
];

describe('Dropdown', () => {
  it('shows the placeholder on the trigger while nothing is selected', async () => {
    const { getByTestId, getByText } = await render(
      <Dropdown
        options={options}
        selectedValue={null}
        onChange={jest.fn()}
        placeholder="All categories"
        testID="dropdown"
      />,
    );
    expect(getByTestId('dropdown')).toBeTruthy();
    expect(getByText('All categories')).toBeTruthy();
  });

  it('shows the selected option label on the trigger', async () => {
    const { getByText, queryByText } = await render(
      <Dropdown
        options={options}
        selectedValue="design"
        onChange={jest.fn()}
        placeholder="All categories"
        testID="dropdown"
      />,
    );
    expect(getByText('Design')).toBeTruthy();
    expect(queryByText('All categories')).toBeNull();
  });

  it('opens the options and reports the picked value through onChange', async () => {
    const onChange = jest.fn();
    const { getByTestId, getByText } = await render(
      <Dropdown
        options={options}
        selectedValue={null}
        onChange={onChange}
        placeholder="All categories"
        testID="dropdown"
      />,
    );

    await fireEvent.press(getByTestId('dropdown'));
    await fireEvent.press(getByText('Sales'));

    expect(onChange).toHaveBeenCalledWith('sales');
  });

  it('reports null when the placeholder option is picked', async () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByText } = await render(
      <Dropdown
        options={options}
        selectedValue="design"
        onChange={onChange}
        placeholder="All categories"
        testID="dropdown"
      />,
    );

    await fireEvent.press(getByTestId('dropdown'));
    // The placeholder heads the option list as the "no selection" option.
    await fireEvent.press(getAllByText('All categories')[0]);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('marks the selected option in accessibility state', async () => {
    const { getByTestId, getByRole } = await render(
      <Dropdown
        options={options}
        selectedValue="design"
        onChange={jest.fn()}
        placeholder="All categories"
        testID="dropdown"
      />,
    );

    await fireEvent.press(getByTestId('dropdown'));
    expect(getByRole('button', { name: 'Design', selected: true })).toBeTruthy();
    expect(getByRole('button', { name: 'Sales', selected: false })).toBeTruthy();
  });

  it('closes on backdrop press without reporting a change', async () => {
    const onChange = jest.fn();
    const { getByTestId, queryByText } = await render(
      <Dropdown
        options={options}
        selectedValue={null}
        onChange={onChange}
        placeholder="All categories"
        testID="dropdown"
      />,
    );

    await fireEvent.press(getByTestId('dropdown'));
    expect(queryByText('Sales')).toBeTruthy();

    await fireEvent.press(getByTestId('dropdown-backdrop'));

    expect(onChange).not.toHaveBeenCalled();
    expect(queryByText('Sales')).toBeNull();
  });
});
