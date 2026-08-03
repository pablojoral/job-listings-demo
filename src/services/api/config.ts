/**
 * API configuration.
 *
 * Remotive's public jobs API is a single fixed, public endpoint with no
 * per-environment variation (no dev/staging/prod split, no auth) — so unlike
 * a project's own backend, the base URL is a plain constant, not read from
 * `.env`.
 */
export const API_BASE_URL = 'https://remotive.com/api';

export const API_TIMEOUT_MS = 15000;
