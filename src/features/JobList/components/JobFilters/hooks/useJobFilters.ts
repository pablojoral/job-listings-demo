import type { DropdownOption } from 'components/ui/Dropdown/Dropdown';
import type { MultiSelectOption } from 'components/ui/MultiSelect/MultiSelect';
import { useDebouncedCommit } from 'hooks/useDebouncedCommit';
import { useCategories } from 'query/Categories/useCategories';
import { JOB_TYPE_LABELS, JOB_TYPES, type JobType } from 'models/Job';
import { useJobFiltersStore } from 'store/JobFilters/useJobFiltersStore';

/**
 * Pause after the last keystroke before the search text is committed to the
 * store. The store's subscribers re-filter the full jobs list and re-render
 * the FlatList behind this modal — debouncing runs that once per pause
 * instead of once per keystroke.
 */
const SEARCH_DEBOUNCE_MS = 200;

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

  const { data: categories = [] } = useCategories();

  const categoryOptions: DropdownOption[] = categories.map((cat) => ({ value: cat.name, label: cat.name }));
  const jobTypeOptions: MultiSelectOption[] = JOB_TYPES.map((type) => ({ value: type, label: JOB_TYPE_LABELS[type] }));

  const hasActiveFilters = Boolean(draftSearch || category || jobTypes.length > 0);

  return {
    search: draftSearch,
    onChangeSearch,
    onClearSearch: () => commitSearchNow(''),
    categoryOptions,
    selectedCategory: category,
    onChangeCategory: setCategory,
    jobTypeOptions,
    selectedJobTypes: jobTypes,
    // MultiSelect is generic over `string[]`; every value it can pass back originated
    // from `jobTypeOptions`, which is built from `JOB_TYPES`, so this cast is safe.
    onChangeJobTypes: (values: string[]) => setJobTypes(values as JobType[]),
    hasActiveFilters,
    onReset,
  };
};
