import { useQuery } from '@tanstack/react-query';

import { qk } from 'query/keys';
import { categoriesService } from 'services/api/services/CategoriesService';

/** Categories change far less often than the jobs list, so this can stay fresh much longer. */
export function useCategories() {
  return useQuery({
    queryKey: qk.categories.list(),
    queryFn: () => categoriesService.list(),
    staleTime: 30 * 60 * 1000,
  });
}
