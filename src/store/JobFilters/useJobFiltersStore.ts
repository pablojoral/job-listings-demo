import { create } from 'zustand';

import type { JobType } from 'models/Job';

export interface JobFiltersState {
  search: string;
  category: string | null;
  jobTypes: JobType[];
  setSearch: (search: string) => void;
  setCategory: (category: string | null) => void;
  setJobTypes: (jobTypes: JobType[]) => void;
  reset: () => void;
}

const initialFilters: Pick<JobFiltersState, 'search' | 'category' | 'jobTypes'> = {
  search: '',
  category: null,
  jobTypes: [],
};

/** Client-held selection for the job list's search text, category, and job type filters. */
export const useJobFiltersStore = create<JobFiltersState>((set) => ({
  ...initialFilters,
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setJobTypes: (jobTypes) => set({ jobTypes }),
  reset: () => set(initialFilters),
}));
