import { useCallback } from 'react';

import { JobCard } from 'components/JobCard/JobCard';
import type { Job } from 'models/models';
import { useJobs } from 'query/Jobs/useJobs';

export const useJobListScreen = () => {
  const { data, isLoading, isError, isRefetching, refetch } = useJobs();

  const jobs = data?.jobs ?? [];

  const renderItem = useCallback(({ item }: { item: Job }) => <JobCard job={item} />, []);
  const keyExtractor = useCallback((item: Job) => String(item.id), []);

  return {
    jobs,
    isLoading,
    isError,
    isRefetching,
    handleRefresh: refetch,
    renderItem,
    keyExtractor,
  };
};
