import { formatPostedDate } from './formatPostedDate';

describe('formatPostedDate', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-06-15T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([
    ['2020-06-15T11:59:30', 'just now'],
    ['2020-06-15T11:59:00', '1 minute ago'],
    ['2020-06-15T11:15:00', '45 minutes ago'],
    ['2020-06-15T11:00:00', '1 hour ago'],
    ['2020-06-15T04:00:00', '8 hours ago'],
    ['2020-06-14T10:00:00', 'yesterday'],
    ['2020-06-12T12:00:00', '3 days ago'],
    ['2020-06-01T12:00:00', '2 weeks ago'],
    ['2020-03-15T12:00:00', '3 months ago'],
    ['2018-06-15T12:00:00', '2 years ago'],
  ])('formats %s as "%s"', (isoDate, expected) => {
    expect(formatPostedDate(isoDate)).toBe(expected);
  });

  it('treats a future date (clock skew) as just now', () => {
    expect(formatPostedDate('2020-06-15T12:05:00')).toBe('just now');
  });

  it('returns an empty string for unparseable input', () => {
    expect(formatPostedDate('not-a-date')).toBe('');
  });
});
