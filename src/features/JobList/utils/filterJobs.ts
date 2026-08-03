import type { Job } from 'models/Job';
import type { JobType } from 'models/Job';

export interface JobFilterCriteria {
  search: string;
  category: string | null;
  jobTypes: JobType[];
}

/** Filters an already-fetched job list by search text (title + company name), category, and job type(s). */
export const filterJobs = (jobs: Job[], { search, category, jobTypes }: JobFilterCriteria): Job[] => {
  const query = search.trim().toLowerCase();

  return jobs.filter((job) => {
    const matchesSearch =
      !query || job.title.toLowerCase().includes(query) || job.companyName.toLowerCase().includes(query);
    const matchesCategory = !category || job.category === category;
    const matchesJobType = jobTypes.length === 0 || jobTypes.includes(job.jobType as JobType);

    return matchesSearch && matchesCategory && matchesJobType;
  });
};
