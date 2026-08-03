import type { Job } from 'models/Job';

let jobCounter = 0;

/** Deterministic Job factory — no Math.random, no Date.now. */
export const makeJob = (overrides: Partial<Job> = {}): Job => {
  jobCounter += 1;

  return {
    id: jobCounter,
    url: `https://remotive.com/remote-jobs/job-${jobCounter}`,
    title: `Software Engineer ${jobCounter}`,
    companyName: 'Acme',
    companyLogo: '',
    companyLogoUrl: '',
    category: 'Software Development',
    tags: [],
    jobType: 'full_time',
    publicationDate: '2020-06-15T12:00:00',
    candidateRequiredLocation: 'Worldwide',
    salary: '',
    description: '',
    ...overrides,
  };
};
