import { BaseService } from '../BaseService';
import { serializeCategory } from '../serializers/CategorySerializer';

/** A category exactly as Remotive's `GET /remote-jobs/categories` returns it. */
export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
}

/** A category, in the app's own shape (identical to `CategoryDto` today, kept separate in case the API diverges). */
export interface Category {
  id: number;
  name: string;
  slug: string;
}

/** The raw envelope exactly as returned by `GET /remote-jobs/categories` — reuses the jobs envelope's field names. */
interface CategoriesResponseDto {
  'job-count': number;
  'total-job-count': number;
  jobs: CategoryDto[];
}

class CategoriesService extends BaseService {
  async list(): Promise<Category[]> {
    const res = await this.apiClient.get<CategoriesResponseDto>('/categories');
    return res.data.jobs.map(serializeCategory);
  }
}

export const categoriesService = new CategoriesService();
