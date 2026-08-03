import { useCallback, useMemo } from 'react';

import type { DropdownOption } from 'components/ui/Dropdown/Dropdown';
import type { MultiSelectOption } from 'components/ui/MultiSelect/MultiSelect';
import { useDebouncedCommit } from 'hooks/useDebouncedCommit';
import { JOB_TYPE_LABELS, JOB_TYPES, type JobType } from 'models/Job';
import { useCategories } from 'query/Categories/useCategories';
import { useJobFiltersStore } from 'store/JobFilters/useJobFiltersStore';

/**
 * Pause after the last keystroke before the search text is committed to the
 * store. The store's subscribers re-filter the full jobs list and re-render
 * the FlatList behind this modal — debouncing runs that once per pause
 * instead of once per keystroke.
 */
const SEARCH_DEBOUNCE_MS = 200;

const JOB_TYPE_OPTIONS: MultiSelectOption[] = JOB_TYPES.map((type) => ({ value: type, label: JOB_TYPE_LABELS[type] }));

/**
 * Every control commits straight to the filters store (search debounced) —
 * there is no submit step, because filtering is client-side and instant. In a
 * real app with server-side filtering this form should be built on
 * react-hook-form instead: local draft state, validation, and one explicit
 * submit per request rather than a store write per control change.
 */
export const useJobFilters = () => {
  const search = useJobFiltersStore((state) => state.search);
  const category = useJobFiltersStore((state) => state.category);
  const jobTypes = useJobFiltersStore((state) => state.jobTypes);
  const setSearch = useJobFiltersStore((state) => state.setSearch);
  const setCategory = useJobFiltersStore((state) => state.setCategory);
  const setJobTypes = useJobFiltersStore((state) => state.setJobTypes);
  const reset = useJobFiltersStore((state) => state.reset);

  const {
    draft: draftSearch,
    onChange: onChangeSearch,
    commitNow: commitSearchNow,
  } = useDebouncedCommit(search, setSearch, SEARCH_DEBOUNCE_MS);

  const onReset = () => {
    // Explicitly, not via reset() alone: the draft (and any pending commit)
    // must clear even when the store's search is already '' — an unchanged
    // store value never reaches the hook's adopt-external-changes path.
    commitSearchNow('');
    reset();
  };

  const { data: categories } = useCategories();

  const categoryOptions: DropdownOption[] = useMemo(
    () => (categories ?? []).map((cat) => ({ value: cat.name, label: cat.name })),
    [categories],
  );

  // Stable so the memoized MultiSelect bails out while the search draft
  // re-renders this hook's subtree on every keystroke. MultiSelect is generic
  // over `string[]`; every value it can pass back originated from
  // `JOB_TYPE_OPTIONS`, which is built from `JOB_TYPES`, so the cast is safe.
  const onChangeJobTypes = useCallback((values: string[]) => setJobTypes(values as JobType[]), [setJobTypes]);

  const hasActiveFilters = Boolean(draftSearch || category || jobTypes.length > 0);

  return {
    search: draftSearch,
    onChangeSearch,
    onClearSearch: () => commitSearchNow(''),
    categoryOptions,
    selectedCategory: category,
    onChangeCategory: setCategory,
    jobTypeOptions: JOB_TYPE_OPTIONS,
    selectedJobTypes: jobTypes,
    onChangeJobTypes,
    hasActiveFilters,
    onReset,
  };
};
