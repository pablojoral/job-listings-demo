import { act, renderHook } from '@testing-library/react-native';
import Storage from 'expo-sqlite/kv-store';

import { useFavoritesStore } from './useFavoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(async () => {
    await act(() => useFavoritesStore.getState().reset());
  });

  it('starts with no favorites', async () => {
    const { result } = await renderHook(() => useFavoritesStore());
    expect(result.current.favoriteIds).toEqual([]);
  });

  it('adds an id on first toggle and removes it on second toggle', async () => {
    const { result } = await renderHook(() => useFavoritesStore());

    await act(() => result.current.toggleFavorite(7));
    expect(result.current.favoriteIds).toEqual([7]);

    await act(() => result.current.toggleFavorite(7));
    expect(result.current.favoriteIds).toEqual([]);
  });

  it('keeps multiple favorites independently', async () => {
    const { result } = await renderHook(() => useFavoritesStore());

    await act(() => {
      result.current.toggleFavorite(1);
      result.current.toggleFavorite(2);
    });
    await act(() => result.current.toggleFavorite(1));

    expect(result.current.favoriteIds).toEqual([2]);
  });

  // Asserts our persist wiring (storage key + partialize), not the middleware
  // internals — rehydration mechanics are zustand's own behavior.
  it('persists only the ids to the storage key', async () => {
    const { result } = await renderHook(() => useFavoritesStore());

    await act(() => result.current.toggleFavorite(7));

    const persisted = JSON.parse(Storage.getItemSync('favorite-jobs') ?? '{}');
    expect(persisted.state).toEqual({ favoriteIds: [7] });
  });
});
