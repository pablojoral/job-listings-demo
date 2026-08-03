import { Share } from 'react-native';

import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import { useJobs } from 'query/Jobs/useJobs';
import { useFavoritesStore } from 'store/Favorites/useFavoritesStore';
import { formatJobType } from 'utils/formatJobType';
import { formatPostedDate } from 'utils/formatPostedDate';

/**
 * Remotive has no per-id endpoint (see api rules §4), so the job is looked up
 * in the already-fetched list. An id that is not on the list — including a
 * favorite whose listing expired off Remotive — shows the not-found state.
 */
export const useJobDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useJobs();

  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const job = data?.jobs.find((candidate) => String(candidate.id) === id);
  const isFavorite = job ? favoriteIds.includes(job.id) : false;

  const handleToggleFavorite = () => {
    if (job) toggleFavorite(job.id);
  };

  const handleOpenListing = () => {
    if (job) WebBrowser.openBrowserAsync(job.url);
  };

  const handleShare = () => {
    if (job) {
      Share.share({ message: `${job.title} at ${job.companyName}\n${Linking.createURL(`/jobs/${job.id}`)}` });
    }
  };

  return {
    job,
    isLoading,
    isFavorite,
    description: job?.description ?? '',
    postedDate: job ? formatPostedDate(job.publicationDate) : '',
    jobTypeLabel: job ? formatJobType(job.jobType) : '',
    handleToggleFavorite,
    handleOpenListing,
    handleShare,
  };
};
