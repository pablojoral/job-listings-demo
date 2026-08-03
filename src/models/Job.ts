/**
 * The `Job` domain model — one file per model under `src/models/`.
 *
 * Only types shared across *multiple* services get a file here. Types that
 * describe a single API contract (request/response shapes) live in that
 * resource's service file, not here (see api rules §7).
 *
 * The raw shape Remotive's `GET /remote-jobs` returns (snake_case, see
 * https://github.com/remotive-com/remote-jobs-api) lives as `JobDto` in
 * `services/api/services/JobsService.ts`. This `Job` is the camelCase domain
 * shape the rest of the app consumes — `serializeJob` maps one to the other.
 */

/** A job, in the app's own (camelCase) shape. */
export interface Job {
  id: number;
  url: string;
  title: string;
  companyName: string;
  companyLogo: string;
  companyLogoUrl: string;
  category: string;
  tags: string[];
  /** Optional and "often not filled" per Remotive's docs — can come back as ''. */
  jobType: string;
  /** ISO 8601, no timezone suffix. */
  publicationDate: string;
  candidateRequiredLocation: string;
  /** Free-form display text (e.g. "$18 - $22/hr"), not a structured number. Can be empty. */
  salary: string;
  /** Raw HTML. */
  description: string;
}

/** The set of `job_type` values Remotive's API can return (see the API docs). */
export const JOB_TYPES = ['full_time', 'part_time', 'contract', 'freelance', 'internship'] as const;
export type JobType = (typeof JOB_TYPES)[number];

/**
 * Display label for each `JobType`. Keyed as `Record<JobType, string>` so adding
 * a value to `JOB_TYPES` forces a label to be added here too.
 */
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
};
