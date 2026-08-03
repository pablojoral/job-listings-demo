import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';

import { makeJob } from 'test/fixtures';

import { useFavoritesStore } from 'store/Favorites/useFavoritesStore';

jest.mock('query/Jobs/useJobs', () => ({ useJobs: jest.fn() }));
jest.mock('expo-router', () => ({ useLocalSearchParams: jest.fn() }));
jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn() }));

import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useJobs } from 'query/Jobs/useJobs';

import { JobDetails } from './JobDetails';

const mockUseJobs = useJobs as jest.Mock;
const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockOpenBrowser = WebBrowser.openBrowserAsync as jest.Mock;

const baseResult = { data: undefined, isLoading: false };

describe('JobDetails', () => {
  beforeEach(async () => {
    await act(() => useFavoritesStore.getState().reset());
    mockUseLocalSearchParams.mockReturnValue({ id: '7' });
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

  it('renders a favorited job from its snapshot after it expires off the API list', async () => {
    const expired = makeJob({ id: 7, title: 'Expired Engineer' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 0, totalJobCount: 0, jobs: [] } });
    await act(() => useFavoritesStore.getState().toggleFavorite(expired));

    const { getByText, queryByText } = await render(<JobDetails />);
    expect(getByText('Expired Engineer')).toBeTruthy();
    expect(queryByText('Job not found')).toBeNull();
  });

  it('renders the job details with a plain-text description', async () => {
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
    expect(getByText('Build APIs')).toBeTruthy();
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
    await fireEvent.press(getByText('Open on Remotive'));
    expect(mockOpenBrowser).toHaveBeenCalledWith('https://remotive.com/remote-jobs/job-7');
  });
});
