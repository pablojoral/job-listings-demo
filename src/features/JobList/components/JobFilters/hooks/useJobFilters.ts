import type { DropdownOption } from 'components/ui/Dropdown/Dropdown';
import type { MultiSelectOption } from 'components/ui/MultiSelect/MultiSelect';
import { useCategories } from 'query/Categories/useCategories';
import { JOB_TYPE_LABELS, JOB_TYPES, type JobType } from 'models/Job';
import { useJobFiltersStore } from 'store/JobFilters/useJobFiltersStore';

export const useJobFilters = () => {
  const search = useJobFiltersStore((state) => state.search);
  const category = useJobFiltersStore((state) => state.category);
  const jobTypes = useJobFiltersStore((state) => state.jobTypes);
  const setSearch = useJobFiltersStore((state) => state.setSearch);
  const setCategory = useJobFiltersStore((state) => state.setCategory);
  const setJobTypes = useJobFiltersStore((state) => state.setJobTypes);
  const reset = useJobFiltersStore((state) => state.reset);

  const { data: categories = [] } = useCategories();

  const categoryOptions: DropdownOption[] = categories.map((cat) => ({ value: cat.name, label: cat.name }));
  const jobTypeOptions: MultiSelectOption[] = JOB_TYPES.map((type) => ({ value: type, label: JOB_TYPE_LABELS[type] }));

  const hasActiveFilters = Boolean(search || category || jobTypes.length > 0);

  return {
    search,
    onChangeSearch: setSearch,
    onClearSearch: () => setSearch(''),
    categoryOptions,
    selectedCategory: category,
    onChangeCategory: setCategory,
    jobTypeOptions,
    selectedJobTypes: jobTypes,
    // MultiSelect is generic over `string[]`; every value it can pass back originated
    // from `jobTypeOptions`, which is built from `JOB_TYPES`, so this cast is safe.
    onChangeJobTypes: (values: string[]) => setJobTypes(values as JobType[]),
    hasActiveFilters,
    onReset: reset,
  };
};
