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
  const snapshots = useFavoritesStore((state) => state.snapshots);

  // Favorites must outlive Remotive's list churn: prefer the fresh job from
  // the query cache, fall back to the snapshot taken at save time.
  const jobs = useMemo(() => {
    const freshById = new Map((data?.jobs ?? []).map((job) => [job.id, job]));
    return favoriteIds.map((id) => freshById.get(id) ?? snapshots[id]).filter((job): job is Job => Boolean(job));
  }, [data, favoriteIds, snapshots]);

  // One stable handler for every row: a per-row closure here would defeat
  // JobCard's memo (see its doc comment).
  const handlePressJob = useCallback((job: Job) => router.push(`/jobs/${job.id}`), [router]);
  const renderItem = useCallback(
    ({ item }: { item: Job }) => <JobCard job={item} onPress={handlePressJob} />,
    [handlePressJob],
  );
  const keyExtractor = useCallback((item: Job) => String(item.id), []);

  // Snapshots render without the network — only block on the query while
  // nothing resolves yet.
  return { jobs, isLoading: isLoading && jobs.length === 0, renderItem, keyExtractor };
};
