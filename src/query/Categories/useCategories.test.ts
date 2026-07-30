import { waitFor } from '@testing-library/react-native';

import { renderHookWithQuery } from 'test/renderWithQuery';

jest.mock('services/api/services/CategoriesService', () => ({
  categoriesService: { list: jest.fn() },
}));

import { categoriesService } from 'services/api/services/CategoriesService';

import { useCategories } from './useCategories';

const mockList = categoriesService.list as jest.Mock;

describe('useCategories', () => {
  it('resolves with the categories from the service', async () => {
    const categories = [{ id: 19, name: 'Software Development', slug: 'software-dev' }];
    mockList.mockResolvedValue(categories);

    const { result } = await renderHookWithQuery(() => useCategories());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(categories);
  });
});
