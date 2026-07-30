import { act, renderHook } from '@testing-library/react-native';

import { useJobFiltersStore } from './useJobFiltersStore';

describe('useJobFiltersStore', () => {
  beforeEach(async () => {
    await act(() => useJobFiltersStore.getState().reset());
  });

  it('starts with no filters applied', async () => {
    const { result } = await renderHook(() => useJobFiltersStore());
    expect(result.current.search).toBe('');
    expect(result.current.category).toBeNull();
    expect(result.current.jobTypes).toEqual([]);
  });

  it('updates search, category, and job types independently', async () => {
    const { result } = await renderHook(() => useJobFiltersStore());

    await act(() => result.current.setSearch('engineer'));
    expect(result.current.search).toBe('engineer');

    await act(() => result.current.setCategory('Software Development'));
    expect(result.current.category).toBe('Software Development');

    await act(() => result.current.setJobTypes(['contract', 'freelance']));
    expect(result.current.jobTypes).toEqual(['contract', 'freelance']);
  });

  it('resets all filters back to their initial values', async () => {
    const { result } = await renderHook(() => useJobFiltersStore());

    await act(() => {
      result.current.setSearch('engineer');
      result.current.setCategory('Design');
      result.current.setJobTypes(['freelance']);
    });

    await act(() => result.current.reset());

    expect(result.current.search).toBe('');
    expect(result.current.category).toBeNull();
    expect(result.current.jobTypes).toEqual([]);
  });
});
