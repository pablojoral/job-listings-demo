import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';

import { useJobFiltersStore } from 'store/JobFilters/useJobFiltersStore';

jest.mock('query/Categories/useCategories', () => ({ useCategories: jest.fn() }));

import { useCategories } from 'query/Categories/useCategories';

import { JobFilters } from './JobFilters';

const mockUseCategories = useCategories as jest.Mock;

describe('JobFilters', () => {
  beforeEach(async () => {
    await act(() => useJobFiltersStore.getState().reset());
    mockUseCategories.mockReturnValue({ data: [{ id: 19, name: 'Software Development', slug: 'software-dev' }] });
  });

  it('renders the search input, labeled sections, and job type chips', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = await render(<JobFilters />);
    expect(getByPlaceholderText('Search by title or company')).toBeTruthy();
    expect(getByText('Category')).toBeTruthy();
    expect(getByTestId('category-dropdown')).toBeTruthy();
    expect(getByText('Job type')).toBeTruthy();
    expect(getByText('Full-time')).toBeTruthy();
  });

  it('renders the clear-filters button disabled while no filter is active', async () => {
    const { getByRole } = await render(<JobFilters />);
    expect(getByRole('button', { name: 'Clear filters', disabled: true })).toBeTruthy();
  });

  it('enables the clear-filters button once a filter is active, and disables it again after reset', async () => {
    const { getByText, getByRole } = await render(<JobFilters />);

    await fireEvent.press(getByText('Full-time'));
    expect(getByRole('button', { name: 'Clear filters', disabled: false })).toBeTruthy();

    await fireEvent.press(getByText('Clear filters'));
    expect(getByRole('button', { name: 'Clear filters', disabled: true })).toBeTruthy();
  });

  it('writes typed search text into the search input', async () => {
    const { getByPlaceholderText } = await render(<JobFilters />);
    const input = getByPlaceholderText('Search by title or company');
    await fireEvent.changeText(input, 'engineer');
    expect(input.props.value).toBe('engineer');
  });

  // The dropdown's option list is native (SwiftUI/Compose picker) — selection
  // is driven through its native event seam via testID, and the observable
  // effect at this level is the Clear-filters button becoming enabled.
  it('selects a category from the dropdown', async () => {
    const { getByTestId, getByRole } = await render(<JobFilters />);
    expect(getByRole('button', { name: 'Clear filters', disabled: true })).toBeTruthy();

    await fireEvent(getByTestId('category-dropdown'), 'selectionChange', {
      nativeEvent: { selection: 'Software Development' },
    });

    expect(getByRole('button', { name: 'Clear filters', disabled: false })).toBeTruthy();
  });

  // Multi-select job type behavior (multiple simultaneous selections, toggling
  // off) is covered at the unit level in MultiSelect.test.tsx and end-to-end
  // via the filtered job list in JobList.test.tsx.
  it('reflects a chip selection in accessibility state', async () => {
    const { getByText, getByRole } = await render(<JobFilters />);
    await fireEvent.press(getByText('Full-time'));
    expect(getByRole('button', { name: 'Full-time', selected: true })).toBeTruthy();

    await fireEvent.press(getByText('Full-time'));
    expect(getByRole('button', { name: 'Full-time', selected: false })).toBeTruthy();
  });
});
