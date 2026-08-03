import { BaseService } from '../BaseService';
import type { Category } from 'models/Category';

/** A category exactly as Remotive's `GET /remote-jobs/categories` returns it. */
export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
}

/** Maps a raw `CategoryDto` (as Remotive returns it) to the app's `Category` domain shape. */
const serializeCategory = (dto: CategoryDto): Category => ({
  id: dto.id,
  name: dto.name,
  slug: dto.slug,
});

/** The raw envelope exactly as returned by `GET /remote-jobs/categories` — reuses the jobs envelope's field names. */
interface CategoriesResponseDto {
  'job-count': number;
  'total-job-count': number;
  jobs: CategoryDto[];
}

export class CategoriesService extends BaseService {
  async list(): Promise<Category[]> {
    const res = await this.apiClient.get<CategoriesResponseDto>('/remote-jobs/categories');
    return res.data.jobs.map(serializeCategory);
  }
}

export const categoriesService = new CategoriesService();
