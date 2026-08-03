import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export interface FavoritesState {
  favoriteIds: number[];
  toggleFavorite: (jobId: number) => void;
  reset: () => void;
}

/**
 * Sync accessors so hydration completes synchronously at store creation —
 * no "empty favorites" flash on launch while an async read resolves.
 */
const favoritesStorage: StateStorage = {
  getItem: (name) => Storage.getItemSync(name),
  setItem: (name, value) => Storage.setItemSync(name, value),
  removeItem: (name) => {
    Storage.removeItemSync(name);
  },
};

/**
 * Client-held favorited job ids, persisted on-device (Remotive has no
 * account/favorites API). Only ids are stored: the app fetches the full jobs
 * list anyway (all filtering is client-side), so read paths resolve each id
 * against the query cache. A favorite whose listing has expired off Remotive
 * no longer resolves and simply stops rendering.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      toggleFavorite: (jobId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(jobId)
            ? state.favoriteIds.filter((favoriteId) => favoriteId !== jobId)
            : [...state.favoriteIds, jobId],
        })),
      reset: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'favorite-jobs',
      storage: createJSONStorage(() => favoritesStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    },
  ),
);
