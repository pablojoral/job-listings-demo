/**
 * The `Category` domain model — one file per model under `src/models/`.
 *
 * Identical to `CategoryDto` (in `services/api/services/CategoriesService.ts`)
 * today; kept as a separate type in case the API shape diverges.
 */

/** A job category, in the app's own shape. */
export interface Category {
  id: number;
  name: string;
  slug: string;
}
