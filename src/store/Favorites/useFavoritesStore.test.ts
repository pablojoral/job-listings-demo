import { act, renderHook } from '@testing-library/react-native';
import Storage from 'expo-sqlite/kv-store';

import { makeJob } from 'test/fixtures';

import { useFavoritesStore } from './useFavoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(async () => {
    await act(() => useFavoritesStore.getState().reset());
  });

  it('starts with no favorites', async () => {
    const { result } = await renderHook(() => useFavoritesStore());
    expect(result.current.favoriteIds).toEqual([]);
    expect(result.current.snapshots).toEqual({});
  });

  it('adds a job on first toggle and removes it on second toggle', async () => {
    const job = makeJob({ id: 7 });
    const { result } = await renderHook(() => useFavoritesStore());

    await act(() => result.current.toggleFavorite(job));
    expect(result.current.favoriteIds).toEqual([7]);

    await act(() => result.current.toggleFavorite(job));
    expect(result.current.favoriteIds).toEqual([]);
  });

  it('snapshots the job while favorited and drops the snapshot on removal', async () => {
    const job = makeJob({ id: 7, title: 'Snapshot Engineer' });
    const { result } = await renderHook(() => useFavoritesStore());

    await act(() => result.current.toggleFavorite(job));
    expect(result.current.snapshots[7]).toEqual(job);

    await act(() => result.current.toggleFavorite(job));
    expect(result.current.snapshots[7]).toBeUndefined();
  });

  it('keeps multiple favorites independently', async () => {
    const first = makeJob({ id: 1 });
    const second = makeJob({ id: 2 });
    const { result } = await renderHook(() => useFavoritesStore());

    await act(() => {
      result.current.toggleFavorite(first);
      result.current.toggleFavorite(second);
    });
    await act(() => result.current.toggleFavorite(first));

    expect(result.current.favoriteIds).toEqual([2]);
    expect(result.current.snapshots).toEqual({ 2: second });
  });

  // Asserts our persist wiring (storage key + partialize), not the middleware
  // internals — rehydration mechanics are zustand's own behavior.
  it('writes favorites through to the persisted storage key', async () => {
    const job = makeJob({ id: 7 });
    const { result } = await renderHook(() => useFavoritesStore());

    await act(() => result.current.toggleFavorite(job));

    const persisted = JSON.parse(Storage.getItemSync('favorite-jobs') ?? '{}');
    expect(persisted.state).toEqual({ favoriteIds: [7], snapshots: { 7: job } });
  });
});
