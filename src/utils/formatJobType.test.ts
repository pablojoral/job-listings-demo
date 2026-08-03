import { formatJobType } from './formatJobType';

describe('formatJobType', () => {
  it('maps known job types to their display labels', () => {
    expect(formatJobType('full_time')).toBe('Full-time');
    expect(formatJobType('internship')).toBe('Internship');
  });

  it('falls back to the raw value for unknown job types', () => {
    expect(formatJobType('apprenticeship')).toBe('apprenticeship');
  });

  it('returns the empty string for an empty job type', () => {
    expect(formatJobType('')).toBe('');
  });
});
