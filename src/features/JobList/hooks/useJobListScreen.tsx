/** @format */

import { useJobs } from "query/Jobs/useJobs";
import { useCallback, useMemo, useState } from "react";
import { useJobFiltersStore } from "store/JobFilters/useJobFiltersStore";

import { JobCard } from "../components/JobCard/JobCard";
import { filterJobs } from "../utils/filterJobs";
import { useJobListStrings } from "./useJobListStrings";

import type { Job } from "models/models";
export const useJobListScreen = () => {
  const strings = useJobListStrings();
  const { data, isLoading, isError, isRefetching, refetch } = useJobs();
  const search = useJobFiltersStore((state) => state.search);
  const category = useJobFiltersStore((state) => state.category);
  const jobTypes = useJobFiltersStore((state) => state.jobTypes);

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const jobs = useMemo(
    () => filterJobs(data?.jobs ?? [], { search, category, jobTypes }),
    [data, search, category, jobTypes],
  );

  const activeFiltersCount =
    (search ? 1 : 0) + (category ? 1 : 0) + jobTypes.length;
  const hasActiveFilters = activeFiltersCount > 0;

  const renderItem = useCallback(
    ({ item }: { item: Job }) => <JobCard job={item} />,
    [],
  );
  const keyExtractor = useCallback((item: Job) => String(item.id), []);

  return {
    jobs,
    isLoading,
    isError,
    isRefetching,
    activeFiltersCount,
    emptyStateTitle: hasActiveFilters
      ? strings.filteredEmptyTitle
      : strings.emptyTitle,
    emptyStateMessage: hasActiveFilters
      ? strings.filteredEmptyMessage
      : strings.emptyMessage,
    filtersDoneLabel: strings.showResults(jobs.length),
    isFiltersVisible,
    openFilters: () => setIsFiltersVisible(true),
    closeFilters: () => setIsFiltersVisible(false),
    handleRefresh: refetch,
    renderItem,
    keyExtractor,
  };
};
