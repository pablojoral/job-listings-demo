import React from 'react';
import { Share } from 'react-native';
import { act, fireEvent, render } from '@testing-library/react-native';

import { makeJob } from 'test/fixtures';

import { useFavoritesStore } from 'store/Favorites/useFavoritesStore';

jest.mock('query/Jobs/useJobs', () => ({ useJobs: jest.fn() }));
jest.mock('expo-linking', () => ({ createURL: jest.fn(() => 'joblistingsdemo://jobs/7') }));
jest.mock('expo-router', () => ({ useLocalSearchParams: jest.fn() }));
jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn().mockResolvedValue(undefined) }));

import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useJobs } from 'query/Jobs/useJobs';

import { JobDetails } from './JobDetails';

const mockUseJobs = useJobs as jest.Mock;
const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockOpenBrowser = WebBrowser.openBrowserAsync as jest.Mock;

const shareSpy = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.dismissedAction });

const baseResult = { data: undefined, isLoading: false };

describe('JobDetails', () => {
  beforeEach(async () => {
    await act(() => useFavoritesStore.getState().reset());
    mockUseLocalSearchParams.mockReturnValue({ id: '7' });
    shareSpy.mockClear();
  });

  it('shows a loading indicator while the jobs query is loading', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, isLoading: true });
    const { getByTestId } = await render(<JobDetails />);
    expect(getByTestId('job-details-loading-indicator')).toBeTruthy();
  });

  it('shows a not-found state when the id matches no job', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 0, totalJobCount: 0, jobs: [] } });
    const { getByText } = await render(<JobDetails />);
    expect(getByText('Job not found')).toBeTruthy();
  });

  it('shows not-found for a favorited id whose listing expired off the API list', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 0, totalJobCount: 0, jobs: [] } });
    await act(() => useFavoritesStore.getState().toggleFavorite(7));

    const { getByText } = await render(<JobDetails />);
    expect(getByText('Job not found')).toBeTruthy();
  });

  it('renders the job details with a rich-text description', async () => {
    const job = makeJob({
      id: 7,
      title: 'Senior Backend Engineer',
      companyName: 'Acme',
      description: '<p>Build <strong>APIs</strong></p>',
    });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [job] } });

    const { getByText } = await render(<JobDetails />);
    expect(getByText('Senior Backend Engineer')).toBeTruthy();
    expect(getByText('Acme')).toBeTruthy();
    expect(getByText(/Build/)).toBeTruthy();
    expect(getByText('APIs')).toBeTruthy();
  });

  it('shows the salary range when the listing provides one', async () => {
    const job = makeJob({ id: 7, salary: '$100k - $130k' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [job] } });

    const { getByText } = await render(<JobDetails />);
    expect(getByText('$100k - $130k')).toBeTruthy();
  });

  it('omits the salary row when the listing has no salary', async () => {
    const job = makeJob({ id: 7, salary: '' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [job] } });

    const { queryByText } = await render(<JobDetails />);
    expect(queryByText(/\$/)).toBeNull();
  });

  it('toggles the job as favorite from the save button', async () => {
    const job = makeJob({ id: 7 });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [job] } });

    const { getByText } = await render(<JobDetails />);
    await fireEvent.press(getByText('Save job'));
    expect(getByText('Saved')).toBeTruthy();

    await fireEvent.press(getByText('Saved'));
    expect(getByText('Save job')).toBeTruthy();
  });

  it('opens the listing on Remotive', async () => {
    const job = makeJob({ id: 7, url: 'https://remotive.com/remote-jobs/job-7' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [job] } });

    const { getByText } = await render(<JobDetails />);
    await fireEvent.press(getByText('Apply on Remotive'));
    expect(mockOpenBrowser).toHaveBeenCalledWith('https://remotive.com/remote-jobs/job-7');
  });

  it('shares the job with a deep link via the native share sheet', async () => {
    const job = makeJob({ id: 7, title: 'Senior Backend Engineer', companyName: 'Acme' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [job] } });

    const { getByText } = await render(<JobDetails />);
    await fireEvent.press(getByText('Share'));

    expect(Linking.createURL).toHaveBeenCalledWith('/jobs/7');
    expect(shareSpy).toHaveBeenCalledWith({
      message: 'Senior Backend Engineer at Acme\njoblistingsdemo://jobs/7',
    });
  });
});
