const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const ago = (value: number, unit: string) => `${value} ${unit}${value === 1 ? '' : 's'} ago`;

/**
 * Formats an ISO date as a relative "posted" label (e.g. "2 days ago").
 * Returns '' for unparseable input; treats future dates (clock skew) as "just now".
 */
export const formatPostedDate = (isoDate: string): string => {
  const timestamp = new Date(isoDate).getTime();
  if (Number.isNaN(timestamp)) {
    return '';
  }

  const elapsed = Date.now() - timestamp;
  if (elapsed < MINUTE) return 'just now';
  if (elapsed < HOUR) return ago(Math.floor(elapsed / MINUTE), 'minute');
  if (elapsed < DAY) return ago(Math.floor(elapsed / HOUR), 'hour');
  if (elapsed < 2 * DAY) return 'yesterday';
  if (elapsed < WEEK) return ago(Math.floor(elapsed / DAY), 'day');
  if (elapsed < MONTH) return ago(Math.floor(elapsed / WEEK), 'week');
  if (elapsed < YEAR) return ago(Math.floor(elapsed / MONTH), 'month');
  return ago(Math.floor(elapsed / YEAR), 'year');
};
