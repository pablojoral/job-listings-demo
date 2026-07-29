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

  it('renders the salary when present', async () => {
    const job = makeJob({ salary: '$100k - $130k' });
    const { getByText } = await render(<JobCard job={job} />);
    expect(getByText('$100k - $130k')).toBeTruthy();
  });

  it('omits the salary row when empty', async () => {
    const job = makeJob({ salary: '' });
    const { queryByText } = await render(<JobCard job={job} />);
    expect(queryByText('$', { exact: false })).toBeNull();
  });

  it('omits the job type tag when empty', async () => {
    const job = makeJob({ jobType: '' });
    const { queryByText } = await render(<JobCard job={job} />);
    expect(queryByText('full_time')).toBeNull();
  });
});
