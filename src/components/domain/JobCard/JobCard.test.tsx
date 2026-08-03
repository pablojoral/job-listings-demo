import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';

import { makeJob } from 'test/fixtures';

import { useFavoritesStore } from 'store/Favorites/useFavoritesStore';

import { JobCard } from './JobCard';

describe('JobCard', () => {
  beforeEach(async () => {
    await act(() => useFavoritesStore.getState().reset());
  });

  it('renders the job title, company, and location', async () => {
    const job = makeJob({ title: 'Senior Backend Engineer', companyName: 'Acme', candidateRequiredLocation: 'USA' });
    const { getByText } = await render(<JobCard job={job} />);
    expect(getByText('Senior Backend Engineer')).toBeTruthy();
    expect(getByText('Acme')).toBeTruthy();
    expect(getByText('USA')).toBeTruthy();
  });

  it('does not render the salary', async () => {
    const job = makeJob({ salary: '$100k - $130k' });
    const { queryByText } = await render(<JobCard job={job} />);
    expect(queryByText('$100k - $130k')).toBeNull();
  });

  it('shows the job type as a human-readable label', async () => {
    const job = makeJob({ jobType: 'full_time' });
    const { getByText, queryByText } = await render(<JobCard job={job} />);
    expect(getByText('Full-time')).toBeTruthy();
    expect(queryByText('full_time')).toBeNull();
  });

  it('omits the job type tag when empty', async () => {
    const job = makeJob({ jobType: '' });
    const { queryByText } = await render(<JobCard job={job} />);
    expect(queryByText('full_time')).toBeNull();
  });

  it('shows the company logo when a logo URL is present', async () => {
    const job = makeJob({ companyLogoUrl: 'https://remotive.com/logo.png' });
    const { getByTestId } = await render(<JobCard job={job} />);
    expect(getByTestId('company-logo')).toBeTruthy();
  });

  it('omits the company logo when the logo URL is empty', async () => {
    const job = makeJob({ companyLogoUrl: '' });
    const { queryByTestId } = await render(<JobCard job={job} />);
    expect(queryByTestId('company-logo')).toBeNull();
  });

  it('shows no favorite indicator by default', async () => {
    const job = makeJob();
    const { queryByTestId } = await render(<JobCard job={job} />);
    expect(queryByTestId('favorite-indicator')).toBeNull();
  });

  it('shows the favorite indicator when the job is favorited', async () => {
    const job = makeJob({ id: 7 });
    const { getByTestId } = await render(<JobCard job={job} />);

    await act(() => useFavoritesStore.getState().toggleFavorite(job));

    expect(getByTestId('favorite-indicator')).toBeTruthy();
  });

  it('calls onPress when the card is pressed', async () => {
    const onPress = jest.fn();
    const job = makeJob({ title: 'Senior Backend Engineer' });
    const { getByText } = await render(<JobCard job={job} onPress={onPress} />);
    await fireEvent.press(getByText('Senior Backend Engineer'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows the publication date as a relative label', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-06-17T12:00:00'));
    const job = makeJob({ publicationDate: '2020-06-15T12:00:00' });

    const { getByText } = await render(<JobCard job={job} />);
    expect(getByText('2 days ago')).toBeTruthy();

    jest.useRealTimers();
  });
});
