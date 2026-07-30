import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';

import { useJobFiltersStore } from 'store/JobFilters/useJobFiltersStore';

jest.mock('query/Categories/useCategories', () => ({ useCategories: jest.fn() }));

import { useCategories } from 'query/Categories/useCategories';

import { FiltersModal } from './FiltersModal';

const mockUseCategories = useCategories as jest.Mock;

const baseProps = { visible: true, title: 'Filters', closeLabel: 'Close', doneLabel: 'Show 5 jobs' };

describe('FiltersModal', () => {
  beforeEach(async () => {
    await act(() => useJobFiltersStore.getState().reset());
    mockUseCategories.mockReturnValue({ data: [] });
  });

  it('renders the title and the filters content when visible', async () => {
    const { getByText, getByPlaceholderText } = await render(<FiltersModal {...baseProps} onClose={jest.fn()} />);
    expect(getByText('Filters')).toBeTruthy();
    expect(getByPlaceholderText('Search by title or company')).toBeTruthy();
  });

  it('calls onClose when the close button is pressed', async () => {
    const onClose = jest.fn();
    const { getByLabelText } = await render(<FiltersModal {...baseProps} onClose={onClose} />);
    await fireEvent.press(getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is tapped', async () => {
    const onClose = jest.fn();
    const { getByTestId } = await render(<FiltersModal {...baseProps} onClose={onClose} />);
    await fireEvent.press(getByTestId('filters-modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose from the done button, which shows the results label', async () => {
    const onClose = jest.fn();
    const { getByText } = await render(<FiltersModal {...baseProps} onClose={onClose} />);
    await fireEvent.press(getByText('Show 5 jobs'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
