import type { AxiosInstance } from 'axios';

import { apiClient as defaultApiClient } from './apiClient';

/**
 * Base class every resource service extends.
 *
 * Subclasses issue requests through `this.apiClient`. By default that is the
 * shared app-wide Axios instance, but a different one can be injected via the
 * constructor (e.g. a fake in tests, or a differently-configured client for a
 * future resource). Concrete services define their endpoints, request, and
 * response types and export a singleton (e.g.
 * `export const jobsService = new JobsService()`).
 */
export abstract class BaseService {
  constructor(protected readonly apiClient: AxiosInstance = defaultApiClient) {}
}
