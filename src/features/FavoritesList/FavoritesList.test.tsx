import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';

import { makeJob } from 'test/fixtures';

import { useFavoritesStore } from 'store/Favorites/useFavoritesStore';

jest.mock('query/Jobs/useJobs', () => ({ useJobs: jest.fn() }));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ useRouter: () => ({ push: mockPush }) }));

import { useJobs } from 'query/Jobs/useJobs';

import { FavoritesList } from './FavoritesList';

const mockUseJobs = useJobs as jest.Mock;

const baseResult = { data: undefined, isLoading: false };

describe('FavoritesList', () => {
  beforeEach(async () => {
    await act(() => useFavoritesStore.getState().reset());
    mockPush.mockClear();
  });

  it('shows a loading indicator while the jobs query is loading', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, isLoading: true });
    const { getByTestId } = await render(<FavoritesList />);
    expect(getByTestId('favorites-loading-indicator')).toBeTruthy();
  });

  it('shows the empty state when nothing is favorited', async () => {
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [makeJob()] } });
    const { getByText } = await render(<FavoritesList />);
    expect(getByText('No favorites yet')).toBeTruthy();
  });

  it('renders only the favorited jobs', async () => {
    const favorite = makeJob({ id: 1, title: 'Favorited Engineer' });
    const other = makeJob({ id: 2, title: 'Other Engineer' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 2, totalJobCount: 2, jobs: [favorite, other] } });
    await act(() => useFavoritesStore.getState().toggleFavorite(favorite));

    const { getByText, queryByText } = await render(<FavoritesList />);
    expect(getByText('Favorited Engineer')).toBeTruthy();
    expect(queryByText('Other Engineer')).toBeNull();
  });

  it('renders a favorited job from its snapshot after it expires off the API list', async () => {
    const expired = makeJob({ id: 3, title: 'Expired Engineer' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 0, totalJobCount: 0, jobs: [] } });
    await act(() => useFavoritesStore.getState().toggleFavorite(expired));

    const { getByText } = await render(<FavoritesList />);
    expect(getByText('Expired Engineer')).toBeTruthy();
  });

  it('navigates to the listing details when a card is pressed', async () => {
    const favorite = makeJob({ id: 1, title: 'Favorited Engineer' });
    mockUseJobs.mockReturnValue({ ...baseResult, data: { jobCount: 1, totalJobCount: 1, jobs: [favorite] } });
    await act(() => useFavoritesStore.getState().toggleFavorite(favorite));

    const { getByText } = await render(<FavoritesList />);
    await fireEvent.press(getByText('Favorited Engineer'));
    expect(mockPush).toHaveBeenCalledWith('/jobs/1');
  });
});
