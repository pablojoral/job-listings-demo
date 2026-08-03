import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import { useJobs } from 'query/Jobs/useJobs';
import { useFavoritesStore } from 'store/Favorites/useFavoritesStore';
import { formatJobType } from 'utils/formatJobType';
import { formatPostedDate } from 'utils/formatPostedDate';
import { stripHtml } from 'utils/stripHtml';

/**
 * Remotive has no per-id endpoint (see api rules §4), so the job is looked up
 * in the already-fetched list — with the favorites snapshot as fallback, so a
 * favorited job still opens after its listing expires off Remotive.
 */
export const useJobDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useJobs();

  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const snapshot = useFavoritesStore((state) => state.snapshots[Number(id)]);

  const job = data?.jobs.find((candidate) => String(candidate.id) === id) ?? snapshot;
  const isFavorite = job ? favoriteIds.includes(job.id) : false;

  const handleToggleFavorite = () => {
    if (job) toggleFavorite(job);
  };

  const handleOpenListing = () => {
    if (job) WebBrowser.openBrowserAsync(job.url);
  };

  return {
    job,
    // A snapshot renders immediately — only block on the query while there is
    // nothing to show yet.
    isLoading: isLoading && !job,
    isFavorite,
    description: job ? stripHtml(job.description) : '',
    postedDate: job ? formatPostedDate(job.publicationDate) : '',
    jobTypeLabel: job ? formatJobType(job.jobType) : '',
    handleToggleFavorite,
    handleOpenListing,
  };
};
