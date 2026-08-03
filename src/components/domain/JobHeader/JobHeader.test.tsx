import React from 'react';
import { render } from '@testing-library/react-native';

import { JobHeader } from './JobHeader';

describe('JobHeader', () => {
  it('renders the title and logo', async () => {
    const { getByText, getByTestId } = await render(
      <JobHeader logoUrl="https://remotive.com/logo.png" title="Senior Backend Engineer" />,
    );
    expect(getByText('Senior Backend Engineer')).toBeTruthy();
    expect(getByTestId('company-logo')).toBeTruthy();
  });

  it('omits the logo when the URL is empty', async () => {
    const { queryByTestId } = await render(<JobHeader logoUrl="" title="Senior Backend Engineer" />);
    expect(queryByTestId('company-logo')).toBeNull();
  });
});
