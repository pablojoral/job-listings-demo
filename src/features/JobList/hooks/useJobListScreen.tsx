import { useRouter } from 'expo-router';
import { useJobs } from 'query/Jobs/useJobs';
import { useCallback, useMemo, useState } from 'react';
import { useJobFiltersStore } from 'store/JobFilters/useJobFiltersStore';

import { JobCard } from 'components/domain/JobCard/JobCard';
import type { IconName } from 'components/ui/Icon/icons';
import type { FontColorToken } from 'theme/tokens';
import { filterJobs } from '../utils/filterJobs';

import type { Job } from 'models/Job';

interface ListEmptyState {
  icon: IconName;
  iconColor?: FontColorToken;
  title: string;
  message: string;
}

export const useJobListScreen = () => {
  const router = useRouter();
  const { data, isLoading, isError, isRefetching, refetch } = useJobs();
  const search = useJobFiltersStore((state) => state.search);
  const category = useJobFiltersStore((state) => state.category);
  const jobTypes = useJobFiltersStore((state) => state.jobTypes);

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // On error the list renders empty — even when cached data exists — so the
  // error state in the empty slot replaces the list entirely.
  const jobs = useMemo(
    () => (isError ? [] : filterJobs(data?.jobs ?? [], { search, category, jobTypes })),
    [isError, data, search, category, jobTypes],
  );

  const activeFiltersCount = (search ? 1 : 0) + (category ? 1 : 0) + jobTypes.length;
  const hasActiveFilters = activeFiltersCount > 0;

  // The error state renders inside the FlatList (as its empty slot) so the
  // list's pull-to-refresh stays available to retry — an early-return error
  // view would unmount the RefreshControl along with the list.
  const emptyState: ListEmptyState = isError
    ? {
        icon: 'close',
        iconColor: 'font-danger',
        title: 'Something went wrong',
        message: "We couldn't load job listings. Pull down to try again.",
      }
    : {
        icon: 'search',
        title: hasActiveFilters ? 'No matching jobs' : 'No jobs found',
        message: hasActiveFilters
          ? 'Try adjusting your search or filters.'
          : 'Check back soon for new remote opportunities.',
      };

  // One stable handler for every row: a per-row closure here would defeat
  // JobCard's memo (see its doc comment).
  const handlePressJob = useCallback((job: Job) => router.push(`/jobs/${job.id}`), [router]);
  const renderItem = useCallback(
    ({ item }: { item: Job }) => <JobCard job={item} onPress={handlePressJob} />,
    [handlePressJob],
  );
  const keyExtractor = useCallback((item: Job) => String(item.id), []);

  return {
    jobs,
    isLoading,
    isRefetching,
    activeFiltersCount,
    emptyState,
    filtersDoneLabel: jobs.length === 1 ? 'Show 1 job' : `Show ${jobs.length} jobs`,
    isFiltersVisible,
    openFilters: () => setIsFiltersVisible(true),
    closeFilters: () => setIsFiltersVisible(false),
    handleRefresh: refetch,
    renderItem,
    keyExtractor,
  };
};
