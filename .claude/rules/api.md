---
description: API layer rules — client, services, query hooks, and query keys
---

# API Rules

This is a public job listings demo — there is no login/session, so the client has no auth
concerns. The API layer uses Axios and TanStack Query (`axios`, `@tanstack/react-query`).

## Architecture overview

```
component / screen hook
  └── src/query/<Resource>/use<Action><Resource>.ts   ← TanStack Query hook
        └── src/services/api/services/<Resource>Service.ts   ← service class
              └── src/services/api/apiClient.ts              ← single Axios instance
```

---

## 1. Always use `apiClient` — never instantiate HTTP clients directly

All HTTP calls must go through the shared Axios instance at `services/api/apiClient.ts`. It
handles base URL and timeout on every request — no auth token to inject.

```ts
// BAD
import axios from 'axios';
const res = await axios.get('/jobs');

// BAD
fetch(`${API_BASE_URL}/jobs`);

// GOOD
import { apiClient } from 'services/api/apiClient';
const res = await apiClient.get('/jobs');
```

---

## 2. All API calls go through a service class

Every resource has a dedicated service that extends `BaseService` and exports a singleton. No component, hook, or store may call `apiClient` directly.

```ts
// services/api/services/JobsService.ts
import { BaseService } from '../BaseService';

class JobsService extends BaseService {
  async list(filters: JobFilters = {}): Promise<JobsPage> {
    const res = await this.apiClient.get<JobsPage>('/jobs', { params: filters });
    return res.data;
  }
}

export const jobsService = new JobsService();
```

Rules for services:
- Class name: `<Resource>Service`
- File: `services/api/services/<Resource>Service.ts`
- Always extends `BaseService`
- Always exports a singleton: `export const <resource>Service = new <Resource>Service()`
- Response types and request types are defined in the **same file** as the service
- **No try/catch that only rethrows** — let errors propagate naturally; TanStack Query handles them

```ts
// BAD — pointless try/catch
async list(): Promise<Job[]> {
  try {
    const res = await this.apiClient.get<Job[]>('/jobs');
    return res.data;
  } catch (error) {
    throw error; // adds nothing
  }
}

// GOOD
async list(): Promise<Job[]> {
  const res = await this.apiClient.get<Job[]>('/jobs');
  return res.data;
}
```

---

## 3. All data fetching and mutations use TanStack Query

Never call a service method directly from a component hook, store, or component. All reads use `useQuery` / `useInfiniteQuery`; all writes use `useMutation`.

```ts
// BAD — calling service directly in a component hook
const [jobs, setJobs] = useState([]);
useEffect(() => {
  jobsService.list().then(setJobs);
}, []);

// GOOD
const { data, isLoading } = useJobs();
```

---

## 4. All query and mutation hooks live under `src/query/<Resource>/`

```
src/query/
  keys.ts
  client.ts
  provider.tsx
  Jobs/
    useJobs.ts           ← useQuery (list — see note below)
  SavedJobs/
    useSavedJobs.ts      ← useQuery
    useSaveJob.ts        ← useMutation
    useRemoveSavedJob.ts ← useMutation
```

Naming conventions:

| Type | Pattern | Example |
|---|---|---|
| Query (list) | `use<Resource>s.ts` | `useSavedJobs.ts` |
| Query (detail) | `use<Resource>.ts` | `useJob.ts` |
| Infinite query | `use<Resource>s.ts` | (use when the resource's own API genuinely supports server-side paging) |
| Mutation (create/action) | `use<Verb><Resource>.ts` | `useSaveJob.ts` |
| Mutation (delete) | `useRemove<Resource>.ts` | `useRemoveSavedJob.ts` |
| Mutation (update) | `useUpdate<Resource>.ts` | `useUpdateFilters.ts` |

`useJobs` is a plain `useQuery`, not `useInfiniteQuery` — Remotive's `/remote-jobs`
has no pagination param (only a `limit` cap) and no per-id detail endpoint, so
there's no `useJob.ts` either. Treat the infinite-query row above as the pattern
for a future resource whose API actually supports real server-side paging.

---

## 5. All query keys come from `qk` in `src/query/keys.ts`

Never hardcode query key arrays inline. Every resource has an entry in `qk` with at minimum a `root` and named factory functions for each operation.

```ts
// BAD
useQuery({ queryKey: ['jobs', 'list'], ... });

// GOOD
useQuery({ queryKey: qk.jobs.list(filters), ... });
```

Structure for a new resource:

```ts
// src/query/keys.ts
export const qk = {
  // ...existing keys...
  jobs: {
    root:   ['jobs'] as const,
    list:   (filters: JobFilters) => ['jobs', 'list', filters] as const,
    detail: (id: string) => ['jobs', 'detail', id] as const,
  },
  savedJobs: {
    root: ['savedJobs'] as const,
    list: () => ['savedJobs', 'list'] as const,
  },
};
```

Rules:
- `root` is always a plain array — used for broad invalidation (`queryClient.invalidateQueries({ queryKey: qk.jobs.root })`)
- Parameterized keys include params as the last element: `(id: string) => ['resource', 'detail', id] as const`
- Always use `as const` on all key arrays

---

## 6. Mutations must invalidate affected queries on success

Any mutation that changes server state must call `queryClient.invalidateQueries` in `onSuccess` to keep the UI consistent. Prefer invalidating the `root` key to catch all related queries.

```ts
// GOOD
export function useSaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => savedJobsService.save(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.savedJobs.root });
    },
  });
}
```

Use a more specific key only when a root invalidation would be unnecessarily expensive.

---

## 7. Response and request types are co-located in the service file

Types that describe the API contract belong in the service file, not in `models/`. Only domain model types that are shared across multiple services belong in `src/models/models.ts`.

```ts
// services/api/services/JobsService.ts

// These types describe the API shape — they live here
export interface Job { ... }
export interface JobsPage { ... }
export interface JobFilters { ... }

class JobsService extends BaseService { ... }
export const jobsService = new JobsService();
```

The query hook then re-exports or imports these types directly from the service:

```ts
import { jobsService, JobsPage } from 'services/api/services/JobsService';
```

---

## 8. `staleTime` overrides belong in the query hook, not in `queryClient`

The global `queryClient` in `src/query/client.ts` defines the default `staleTime` (currently 30s). Override per-query only when the resource has meaningfully different freshness requirements.

```ts
// GOOD — Remotive itself advises against polling more than a few times a day
export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: qk.jobs.list(filters),
    queryFn: () => jobsService.list(filters),
    staleTime: 5 * 60 * 1000,
  });
}
```
