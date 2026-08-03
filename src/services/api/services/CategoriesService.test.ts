import type { AxiosInstance } from 'axios';

import { CategoriesService } from './CategoriesService';

const mockGet = jest.fn();
const fakeApiClient = { get: mockGet } as unknown as AxiosInstance;

describe('CategoriesService', () => {
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

    const categories = await new CategoriesService(fakeApiClient).list();

    expect(mockGet).toHaveBeenCalledWith('/remote-jobs/categories');
    expect(categories).toEqual([
      { id: 19, name: 'Software Development', slug: 'software-dev' },
      { id: 21, name: 'Design', slug: 'design' },
    ]);
  });
});
