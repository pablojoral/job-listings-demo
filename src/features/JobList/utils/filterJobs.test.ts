import { makeJob } from 'test/fixtures';

import { filterJobs } from './filterJobs';

const noFilters = { search: '', category: null, jobTypes: [] };

describe('filterJobs', () => {
  it('returns every job when no filters are set', () => {
    const jobs = [makeJob(), makeJob()];
    expect(filterJobs(jobs, noFilters)).toEqual(jobs);
  });

  it('matches search text against the job title', () => {
    const target = makeJob({ title: 'Senior Backend Engineer' });
    const other = makeJob({ title: 'Product Designer' });
    const result = filterJobs([target, other], { ...noFilters, search: 'backend' });
    expect(result).toEqual([target]);
  });

  it('matches search text against the company name', () => {
    const target = makeJob({ companyName: 'Acme Corp' });
    const other = makeJob({ companyName: 'Globex' });
    const result = filterJobs([target, other], { ...noFilters, search: 'acme' });
    expect(result).toEqual([target]);
  });

  it('is case-insensitive and ignores surrounding whitespace', () => {
    const job = makeJob({ title: 'Senior Backend Engineer' });
    const result = filterJobs([job], { ...noFilters, search: '  BACKEND  ' });
    expect(result).toEqual([job]);
  });

  it('filters by category', () => {
    const target = makeJob({ category: 'Design' });
    const other = makeJob({ category: 'Sales' });
    const result = filterJobs([target, other], { ...noFilters, category: 'Design' });
    expect(result).toEqual([target]);
  });

  it('filters by a single job type', () => {
    const target = makeJob({ jobType: 'contract' });
    const other = makeJob({ jobType: 'full_time' });
    const result = filterJobs([target, other], { ...noFilters, jobTypes: ['contract'] });
    expect(result).toEqual([target]);
  });

  it('matches any of several selected job types', () => {
    const contract = makeJob({ jobType: 'contract' });
    const freelance = makeJob({ jobType: 'freelance' });
    const fullTime = makeJob({ jobType: 'full_time' });
    const result = filterJobs([contract, freelance, fullTime], {
      ...noFilters,
      jobTypes: ['contract', 'freelance'],
    });
    expect(result).toEqual([contract, freelance]);
  });

  it('combines search, category, and job type filters', () => {
    const target = makeJob({ title: 'Backend Engineer', category: 'Software Development', jobType: 'contract' });
    const wrongCategory = makeJob({ title: 'Backend Engineer', category: 'Design', jobType: 'contract' });
    const wrongJobType = makeJob({ title: 'Backend Engineer', category: 'Software Development', jobType: 'full_time' });

    const result = filterJobs([target, wrongCategory, wrongJobType], {
      search: 'backend',
      category: 'Software Development',
      jobTypes: ['contract'],
    });

    expect(result).toEqual([target]);
  });

  it('returns an empty array when nothing matches', () => {
    const job = makeJob({ title: 'Backend Engineer' });
    expect(filterJobs([job], { ...noFilters, search: 'designer' })).toEqual([]);
  });
});
