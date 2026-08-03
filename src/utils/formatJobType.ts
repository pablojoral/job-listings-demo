import { isJobType, JOB_TYPE_LABELS, type Job } from 'models/Job';

/**
 * Human-readable label for a raw `Job.jobType` value. Remotive often leaves the
 * field empty ('') and could return values outside `JOB_TYPES`, so unknown
 * values fall back to the raw string rather than crashing or hiding the tag.
 */
export const formatJobType = (jobType: Job['jobType']): string =>
  isJobType(jobType) ? JOB_TYPE_LABELS[jobType] : jobType;
