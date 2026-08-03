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
    list: () => ['jobs', 'list'] as const,
  },
  categories: {
    root: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
  },
} as const;

export type QueryKeys = typeof qk;
