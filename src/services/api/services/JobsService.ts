import { BaseService } from '../BaseService';
import type { Job } from 'models/Job';

/**
 * Query params Remotive's `GET /remote-jobs` accepts. Field names match the
 * API's own query string keys exactly (see
 * https://github.com/remotive-com/remote-jobs-api) — no camelCase transform.
 */
export interface JobFilters {
  search?: string;
  category?: string;
  company_name?: string;
  limit?: number;
}

/** A job exactly as Remotive's `GET /remote-jobs` returns it (snake_case). */
export interface JobDto {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  company_logo_url: string;
  category: string;
  tags: string[];
  /** Optional and "often not filled" per Remotive's docs — can come back as ''. */
  job_type: string;
  /** ISO 8601, no timezone suffix. */
  publication_date: string;
  candidate_required_location: string;
  /** Free-form display text (e.g. "$18 - $22/hr"), not a structured number. Can be empty. */
  salary: string;
  /** Raw HTML. */
  description: string;
}

/** Maps a raw `JobDto` (snake_case, as Remotive returns it) to the app's camelCase `Job`. */
const serializeJob = (dto: JobDto): Job => ({
  id: dto.id,
  url: dto.url,
  title: dto.title,
  companyName: dto.company_name,
  companyLogo: dto.company_logo,
  companyLogoUrl: dto.company_logo_url,
  category: dto.category,
  tags: dto.tags,
  jobType: dto.job_type,
  publicationDate: dto.publication_date,
  candidateRequiredLocation: dto.candidate_required_location,
  salary: dto.salary,
  description: dto.description,
});

/** The raw envelope exactly as returned by `GET /remote-jobs`. */
interface JobsResponseDto {
  'job-count': number;
  'total-job-count': number;
  jobs: JobDto[];
}

/** A serialized page of jobs — what the rest of the app consumes. */
export interface JobsPage {
  jobCount: number;
  totalJobCount: number;
  jobs: Job[];
}

class JobsService extends BaseService {
  async list(filters: JobFilters = {}): Promise<JobsPage> {
    const res = await this.apiClient.get<JobsResponseDto>('/remote-jobs', { params: filters });
    return {
      jobCount: res.data['job-count'],
      totalJobCount: res.data['total-job-count'],
      jobs: res.data.jobs.map(serializeJob),
    };
  }
}

export const jobsService = new JobsService();
