import { useRouter } from 'expo-router';
import { useJobs } from 'query/Jobs/useJobs';
import { useCallback, useMemo, useState } from 'react';
import { useJobFiltersStore } from 'store/JobFilters/useJobFiltersStore';

import { JobCard } from 'components/domain/JobCard/JobCard';
import { filterJobs } from '../utils/filterJobs';

import type { Job } from 'models/Job';
export const useJobListScreen = () => {
  const router = useRouter();
  const { data, isLoading, isError, isRefetching, refetch } = useJobs();
  const search = useJobFiltersStore((state) => state.search);
  const category = useJobFiltersStore((state) => state.category);
  const jobTypes = useJobFiltersStore((state) => state.jobTypes);

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const jobs = useMemo(
    () => filterJobs(data?.jobs ?? [], { search, category, jobTypes }),
    [data, search, category, jobTypes],
  );

  const activeFiltersCount = (search ? 1 : 0) + (category ? 1 : 0) + jobTypes.length;
  const hasActiveFilters = activeFiltersCount > 0;

  const renderItem = useCallback(
    ({ item }: { item: Job }) => <JobCard job={item} onPress={() => router.push(`/jobs/${item.id}`)} />,
    [router],
  );
  const keyExtractor = useCallback((item: Job) => String(item.id), []);

  return {
    jobs,
    isLoading,
    isError,
    isRefetching,
    activeFiltersCount,
    emptyStateTitle: hasActiveFilters ? 'No matching jobs' : 'No jobs found',
    emptyStateMessage: hasActiveFilters
      ? 'Try adjusting your search or filters.'
      : 'Check back soon for new remote opportunities.',
    filtersDoneLabel: jobs.length === 1 ? 'Show 1 job' : `Show ${jobs.length} jobs`,
    isFiltersVisible,
    openFilters: () => setIsFiltersVisible(true),
    closeFilters: () => setIsFiltersVisible(false),
    handleRefresh: refetch,
    renderItem,
    keyExtractor,
  };
};
