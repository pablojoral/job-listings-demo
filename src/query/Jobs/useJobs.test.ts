import { waitFor } from '@testing-library/react-native';

import { makeJob } from 'test/fixtures';
import { renderHookWithQuery } from 'test/renderWithQuery';

jest.mock('services/api/services/JobsService', () => ({
  jobsService: { list: jest.fn() },
}));

import { jobsService } from 'services/api/services/JobsService';

import { useJobs } from './useJobs';

const mockList = jobsService.list as jest.Mock;

describe('useJobs', () => {
  it('resolves with the jobs page from the service', async () => {
    const job = makeJob();
    const page = { jobCount: 1, totalJobCount: 1, jobs: [job] };
    mockList.mockResolvedValue(page);

    const { result } = await renderHookWithQuery(() => useJobs());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(page);
  });

  it('passes filters through to the service', async () => {
    mockList.mockResolvedValue({ jobCount: 0, totalJobCount: 0, jobs: [] });

    await renderHookWithQuery(() => useJobs({ search: 'engineer' }));
    await waitFor(() => expect(mockList).toHaveBeenCalledWith({ search: 'engineer' }));
  });
});
