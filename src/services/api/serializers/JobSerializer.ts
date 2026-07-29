import type { Job } from 'models/models';

import type { JobDto } from '../services/JobsService';

/** Maps a raw `JobDto` (snake_case, as Remotive returns it) to the app's camelCase `Job`. */
export const serializeJob = (dto: JobDto): Job => ({
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
