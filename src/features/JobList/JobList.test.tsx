import React from 'react';
import { render } from '@testing-library/react-native';

import { makeJob } from 'test/fixtures';

jest.mock('query/Jobs/useJobs', () => ({ useJobs: jest.fn() }));

import { useJobs } from 'query/Jobs/useJobs';

import { JobList } from './JobList';

const mockUseJobs = useJobs as jest.Mock;

const baseResult = { data: undefined, isLoading: false, isError: false, isRefetching: false, refetch: jest.fn() };

describe('JobList', () => {
  it('shows a loading indicator while the query is loading', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, isLoading: true });
    const { queryByText } = await render(<JobList />);
    expect(queryByText('Job Listings')).toBeNull();
  });

  it('shows an error state when the query fails', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, isError: true });
    const { getByText } = await render(<JobList />);
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('shows the empty state when there are no jobs', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 0, totalJobCount: 0, jobs: [] } });
    const { getByText } = await render(<JobList />);
    expect(getByText('No jobs found')).toBeTruthy();
  });

  it('renders a job card per job', async () => {
    const job = makeJob({ title: 'Senior Backend Engineer' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [job] } });
    const { getByText } = await render(<JobList />);
    expect(getByText('Senior Backend Engineer')).toBeTruthy();
  });
});
