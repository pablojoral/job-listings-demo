import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

import type { Job } from 'models/Job';
import { useJobs } from 'query/Jobs/useJobs';
import { useFavoritesStore } from 'store/Favorites/useFavoritesStore';

import { JobCard } from 'components/domain/JobCard/JobCard';

export const useFavoritesListScreen = () => {
  const router = useRouter();
  const { data, isLoading } = useJobs();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  // Only ids are stored — each resolves against the client-fetched jobs list.
  // An id whose listing expired off Remotive no longer resolves and is skipped.
  const jobs = useMemo(() => {
    const jobById = new Map((data?.jobs ?? []).map((job) => [job.id, job]));
    return favoriteIds.map((id) => jobById.get(id)).filter((job): job is Job => Boolean(job));
  }, [data, favoriteIds]);

  // One stable handler for every row: a per-row closure here would defeat
  // JobCard's memo (see its doc comment).
  const handlePressJob = useCallback((job: Job) => router.push(`/jobs/${job.id}`), [router]);
  const renderItem = useCallback(
    ({ item }: { item: Job }) => <JobCard job={item} onPress={handlePressJob} />,
    [handlePressJob],
  );
  const keyExtractor = useCallback((item: Job) => String(item.id), []);

  return { jobs, isLoading, renderItem, keyExtractor };
};
