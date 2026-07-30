import { act, renderHook } from '@testing-library/react-native';

import { useJobFiltersStore } from 'store/JobFilters/useJobFiltersStore';

jest.mock('query/Categories/useCategories', () => ({ useCategories: jest.fn() }));

import { useCategories } from 'query/Categories/useCategories';

import { useJobFilters } from './useJobFilters';

const mockUseCategories = useCategories as jest.Mock;

const categories = [
  { id: 19, name: 'Software Development', slug: 'software-dev' },
  { id: 21, name: 'Design', slug: 'design' },
];

describe('useJobFilters', () => {
  beforeEach(async () => {
    await act(() => useJobFiltersStore.getState().reset());
    mockUseCategories.mockReturnValue({ data: categories });
  });

  it('reads the current filter selection from the store', async () => {
    const { result } = await renderHook(() => useJobFilters());
    expect(result.current.search).toBe('');
    expect(result.current.selectedCategory).toBeNull();
    expect(result.current.selectedJobTypes).toEqual([]);
  });

  it('maps categories from the query into dropdown options', async () => {
    const { result } = await renderHook(() => useJobFilters());
    expect(result.current.categoryOptions).toEqual([
      { value: 'Software Development', label: 'Software Development' },
      { value: 'Design', label: 'Design' },
    ]);
  });

  it('defaults categoryOptions to an empty list while categories are loading', async () => {
    mockUseCategories.mockReturnValue({ data: undefined });
    const { result } = await renderHook(() => useJobFilters());
    expect(result.current.categoryOptions).toEqual([]);
  });

  it('builds a job-type option per known job type with a human label', async () => {
    const { result } = await renderHook(() => useJobFilters());
    expect(result.current.jobTypeOptions).toEqual([
      { value: 'full_time', label: 'Full-time' },
      { value: 'part_time', label: 'Part-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'internship', label: 'Internship' },
    ]);
  });

  it('writes search, category, and job type changes to the store', async () => {
    const { result } = await renderHook(() => useJobFilters());

    await act(() => result.current.onChangeSearch('engineer'));
    expect(useJobFiltersStore.getState().search).toBe('engineer');

    await act(() => result.current.onChangeCategory('Design'));
    expect(useJobFiltersStore.getState().category).toBe('Design');

    await act(() => result.current.onChangeJobTypes(['contract', 'freelance']));
    expect(useJobFiltersStore.getState().jobTypes).toEqual(['contract', 'freelance']);
  });

  it('clears the search text via onClearSearch', async () => {
    const { result } = await renderHook(() => useJobFilters());
    await act(() => result.current.onChangeSearch('engineer'));

    await act(() => result.current.onClearSearch());
    expect(useJobFiltersStore.getState().search).toBe('');
  });

  it('reports hasActiveFilters as filters are applied and cleared via onReset', async () => {
    const { result } = await renderHook(() => useJobFilters());
    expect(result.current.hasActiveFilters).toBe(false);

    await act(() => result.current.onChangeCategory('Design'));
    expect(result.current.hasActiveFilters).toBe(true);

    await act(() => result.current.onReset());
    expect(result.current.hasActiveFilters).toBe(false);
    expect(useJobFiltersStore.getState().category).toBeNull();
  });
});
