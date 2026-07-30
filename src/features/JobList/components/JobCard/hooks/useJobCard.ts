import type { Job } from 'models/models';
import { formatPostedDate } from 'utils/formatPostedDate';

export const useJobCard = (job: Job) => ({
  postedDate: formatPostedDate(job.publicationDate),
});
