import { useQuery } from '@tanstack/react-query';

import { qk } from 'query/keys';
import { jobsService, type JobFilters } from 'services/api/services/JobsService';

/**
 * Remotive's `/remote-jobs` has no server-side pagination (only a `limit`
 * cap) and no per-id detail endpoint — so this is a plain `useQuery`, not
 * `useInfiniteQuery`. Their own docs advise against polling more than a
 * handful of times a day, so `staleTime` is generous.
 */
export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: qk.jobs.list(filters),
    queryFn: () => jobsService.list(filters),
    staleTime: 5 * 60 * 1000,
  });
}
