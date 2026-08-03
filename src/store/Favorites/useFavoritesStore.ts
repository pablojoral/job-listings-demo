import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type { Job } from 'models/Job';

export interface FavoritesState {
  favoriteIds: number[];
  /**
   * Snapshot of each favorited job, taken at save time. Remotive listings
   * expire off the list constantly, so a favorite must outlive the jobs query —
   * read paths prefer the fresh job from the cache and fall back to this.
   * Ids persisted before snapshots existed have no entry here and resolve only
   * while their job is still listed.
   */
  snapshots: Record<number, Job>;
  toggleFavorite: (job: Job) => void;
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

/** Client-held favorited jobs, persisted on-device (Remotive has no account/favorites API). */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      snapshots: {},
      toggleFavorite: (job) =>
        set((state) => {
          if (state.favoriteIds.includes(job.id)) {
            const { [job.id]: removed, ...snapshots } = state.snapshots;
            return { favoriteIds: state.favoriteIds.filter((favoriteId) => favoriteId !== job.id), snapshots };
          }
          return { favoriteIds: [...state.favoriteIds, job.id], snapshots: { ...state.snapshots, [job.id]: job } };
        }),
      reset: () => set({ favoriteIds: [], snapshots: {} }),
    }),
    {
      name: 'favorite-jobs',
      storage: createJSONStorage(() => favoritesStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds, snapshots: state.snapshots }),
    },
  ),
);
