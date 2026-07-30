export const useJobListStrings = () => ({
  screenTitle: 'Job Listings',
  emptyTitle: 'No jobs found',
  emptyMessage: 'Check back soon for new remote opportunities.',
  filteredEmptyTitle: 'No matching jobs',
  filteredEmptyMessage: 'Try adjusting your search or filters.',
  errorTitle: 'Something went wrong',
  errorMessage: "We couldn't load job listings. Pull down to try again.",
  filtersButtonLabel: 'Filters',
  filtersTitle: 'Filters',
  filtersCloseLabel: 'Close filters',
  showResults: (count: number) => (count === 1 ? 'Show 1 job' : `Show ${count} jobs`),
});
