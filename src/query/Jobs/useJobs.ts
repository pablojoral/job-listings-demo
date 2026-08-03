import { useQuery } from '@tanstack/react-query';

import { qk } from 'query/keys';
import { jobsService } from 'services/api/services/JobsService';

/**
 * The one jobs query: the full list, unfiltered, in a single cache entry.
 * All filtering happens client-side, and the details and favorites screens
 * resolve jobs against this same entry — which only works because every
 * caller shares it. Remotive's `/remote-jobs` has no server-side pagination
 * and no per-id detail endpoint — so this is a plain `useQuery`, not
 * `useInfiniteQuery`. Their own docs advise against polling more than a
 * handful of times a day, so `staleTime` is generous.
 */
export function useJobs() {
  return useQuery({
    queryKey: qk.jobs.list(),
    queryFn: () => jobsService.list(),
    staleTime: 5 * 60 * 1000,
  });
}
