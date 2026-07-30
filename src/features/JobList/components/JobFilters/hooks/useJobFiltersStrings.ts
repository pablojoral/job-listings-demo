import type { JobType } from 'services/api/services/JobsService';

export const useJobFiltersStrings = () => ({
  clearLabel: 'Clear filters',
  searchPlaceholder: 'Search by title or company',
  searchClearLabel: 'Clear search',
  categoryLabel: 'Category',
  categoryPlaceholder: 'All categories',
  jobTypeLabel: 'Job type',
  jobTypeLabels: {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    freelance: 'Freelance',
    internship: 'Internship',
  } satisfies Record<JobType, string>,
});
