import type { Job } from 'models/Job';
import { useFavoritesStore } from 'store/Favorites/useFavoritesStore';
import { formatJobType } from 'utils/formatJobType';
import { formatPostedDate } from 'utils/formatPostedDate';

export const useJobCard = (job: Job) => {
  // Primitive-returning selector: zustand re-renders this card only when its
  // own boolean flips (Object.is), so a favorite toggle never touches the
  // list or the other memoized cards.
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(job.id));

  return {
    postedDate: formatPostedDate(job.publicationDate),
    jobTypeLabel: formatJobType(job.jobType),
    isFavorite,
  };
};
