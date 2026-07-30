import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { JobListHeader } from './JobListHeader';

const baseProps = { title: 'Job Listings', filtersLabel: 'Filters', activeFiltersCount: 0 };

describe('JobListHeader', () => {
  it('renders the title', async () => {
    const { getByText } = await render(<JobListHeader {...baseProps} onOpenFilters={jest.fn()} />);
    expect(getByText('Job Listings')).toBeTruthy();
  });

  it('opens the filters from the filter button', async () => {
    const onOpenFilters = jest.fn();
    const { getByLabelText } = await render(<JobListHeader {...baseProps} onOpenFilters={onOpenFilters} />);
    await fireEvent.press(getByLabelText('Filters'));
    expect(onOpenFilters).toHaveBeenCalledTimes(1);
  });

  it('shows the active filter count badge only when non-zero', async () => {
    const { queryByText, rerender, getByText } = await render(
      <JobListHeader {...baseProps} onOpenFilters={jest.fn()} />,
    );
    expect(queryByText('0')).toBeNull();

    await rerender(<JobListHeader {...baseProps} activeFiltersCount={2} onOpenFilters={jest.fn()} />);
    expect(getByText('2')).toBeTruthy();
  });
});
