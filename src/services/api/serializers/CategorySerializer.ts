import type { Category, CategoryDto } from '../services/CategoriesService';

/** Maps a raw `CategoryDto` (as Remotive returns it) to the app's `Category` domain shape. */
export const serializeCategory = (dto: CategoryDto): Category => ({
  id: dto.id,
  name: dto.name,
  slug: dto.slug,
});
