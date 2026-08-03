import React from 'react';
import { render } from '@testing-library/react-native';

import { CompanyLogo } from './CompanyLogo';

describe('CompanyLogo', () => {
  it('renders the image when a URL is provided', async () => {
    const { getByTestId } = await render(<CompanyLogo url="https://remotive.com/logo.png" />);
    expect(getByTestId('company-logo')).toBeTruthy();
  });

  it('renders nothing when the URL is empty', async () => {
    const { toJSON } = await render(<CompanyLogo url="" />);
    expect(toJSON()).toBeNull();
  });
});
