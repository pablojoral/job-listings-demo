import type { JobFilters } from 'services/api/services/JobsService';

/**
 * Query key registry.
 *
 * Every query and mutation key comes from `qk` — never hardcode key arrays
 * inline. Each resource has a `root` (plain array, used for broad invalidation)
 * and named factory functions for each operation. Parameterized keys put their
 * params last, and every array is `as const`.
 */
export const qk = {
  jobs: {
    root: ['jobs'] as const,
    list: (filters: JobFilters) => ['jobs', 'list', filters] as const,
  },
} as const;

export type QueryKeys = typeof qk;
