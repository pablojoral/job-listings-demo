import React from 'react';
import { render } from '@testing-library/react-native';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders its title and message', async () => {
    const { getByText } = await render(<EmptyState icon="search" title="No jobs found" message="Check back soon." />);
    expect(getByText('No jobs found')).toBeTruthy();
    expect(getByText('Check back soon.')).toBeTruthy();
  });
});
