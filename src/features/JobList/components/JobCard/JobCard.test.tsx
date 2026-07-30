import React from 'react';
import { render } from '@testing-library/react-native';

import { makeJob } from 'test/fixtures';

import { JobCard } from './JobCard';

describe('JobCard', () => {
  it('renders the job title, company, and location', async () => {
    const job = makeJob({ title: 'Senior Backend Engineer', companyName: 'Acme', candidateRequiredLocation: 'USA' });
    const { getByText } = await render(<JobCard job={job} />);
    expect(getByText('Senior Backend Engineer')).toBeTruthy();
    expect(getByText('Acme')).toBeTruthy();
    expect(getByText('USA')).toBeTruthy();
  });

  it('does not render the salary', async () => {
    const job = makeJob({ salary: '$100k - $130k' });
    const { queryByText } = await render(<JobCard job={job} />);
    expect(queryByText('$100k - $130k')).toBeNull();
  });

  it('omits the job type tag when empty', async () => {
    const job = makeJob({ jobType: '' });
    const { queryByText } = await render(<JobCard job={job} />);
    expect(queryByText('full_time')).toBeNull();
  });

  it('shows the company logo when a logo URL is present', async () => {
    const job = makeJob({ companyLogoUrl: 'https://remotive.com/logo.png' });
    const { getByTestId } = await render(<JobCard job={job} />);
    expect(getByTestId('company-logo')).toBeTruthy();
  });

  it('omits the company logo when the logo URL is empty', async () => {
    const job = makeJob({ companyLogoUrl: '' });
    const { queryByTestId } = await render(<JobCard job={job} />);
    expect(queryByTestId('company-logo')).toBeNull();
  });

  it('shows the publication date as a relative label', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-06-17T12:00:00'));
    const job = makeJob({ publicationDate: '2020-06-15T12:00:00' });

    const { getByText } = await render(<JobCard job={job} />);
    expect(getByText('2 days ago')).toBeTruthy();

    jest.useRealTimers();
  });
});
