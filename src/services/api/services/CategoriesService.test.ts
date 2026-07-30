jest.mock('services/api/apiClient', () => ({ apiClient: { get: jest.fn() } }));

import { apiClient } from 'services/api/apiClient';

import { categoriesService } from './CategoriesService';

const mockGet = apiClient.get as jest.Mock;

describe('categoriesService', () => {
  it('maps the raw envelope to a list of categories', async () => {
    mockGet.mockResolvedValue({
      data: {
        'job-count': 2,
        'total-job-count': 2,
        jobs: [
          { id: 19, name: 'Software Development', slug: 'software-dev' },
          { id: 21, name: 'Design', slug: 'design' },
        ],
      },
    });

    const categories = await categoriesService.list();

    expect(mockGet).toHaveBeenCalledWith('/categories');
    expect(categories).toEqual([
      { id: 19, name: 'Software Development', slug: 'software-dev' },
      { id: 21, name: 'Design', slug: 'design' },
    ]);
  });
});
