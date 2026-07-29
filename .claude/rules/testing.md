---
description: Testing rules for this project
---

# Testing Rules

## Stack

Tests run on **Jest** with the **`jest-expo`** preset and **React Native Testing
Library (RNTL) v14** for anything that renders. Config lives in `jest.config.js` +
`jest.setup.ts`. Run with `yarn jest` (or `yarn test`).

- Use **RNTL** (`@testing-library/react-native`) to render components and hooks — never
  a bare test renderer directly.
- RNTL v14 targets React 19's async rendering model: `render`, `renderHook`, `fireEvent`,
  and `act` all return a `Promise` and must be `await`ed, even when the callback itself is
  synchronous. It depends on the `test-renderer` package (not the deprecated
  `react-test-renderer`) — keep both on the version line matching the installed React minor.

---

## 1. Co-locate test files as `*.test.ts(x)`

Each test sits next to the unit it covers; only cross-cutting harness code lives in `test/`.

```
src/features/JobList/utils/sortJobs.ts
src/features/JobList/utils/sortJobs.test.ts   ← beside its unit
test/                                         ← shared helpers only
  fixtures.ts  renderWithQuery.tsx
```

---

## 2. Tests must be deterministic — no real time or network

Every test controls its inputs. Nothing hits the OS clock or the network.

| Dependency | How to control it |
|---|---|
| `Date.now()` / relative dates (e.g. "posted 2 days ago") | `jest.useFakeTimers().setSystemTime(fixedDate)` |
| HTTP (`apiClient`/axios) | `jest.mock('services/api/apiClient', …)` |
| Safe-area insets | mock globally in `jest.setup.ts` |

```ts
// BAD — depends on the wall clock; assertion drifts over time
expect(formatPostedDate(iso)).toBe('2 days ago');

// GOOD — fix the clock first
jest.useFakeTimers().setSystemTime(new Date('2020-06-15T12:00:00Z'));
expect(formatPostedDate(twoDaysBefore)).toBe('2 days ago');
```

---

## 3. Use the shared test helpers — don't hand-roll them

| Need | Use (from `test/`) |
|---|---|
| A domain fixture | `makeJob(overrides)` / `makeCompany(overrides)` — `test/fixtures` |
| Render a component needing query + safe-area | `renderWithQuery(ui)` — `test/renderWithQuery` |
| Render a hook needing a QueryClient | `renderHookWithQuery(hook)` — `test/renderWithQuery` |

The query wrappers create a **fresh client with `retry: false`** so failing queries settle
immediately. Never build an ad-hoc `QueryClientProvider` or inline fixture objects.

```tsx
// BAD — bespoke wrapper + retries left on (hangs on error paths)
await renderHook(() => useJobs(filters), {
  wrapper: ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  ),
});

// GOOD
const { result } = await renderHookWithQuery(() => useJobs(filters));
```

---

## 4. Mock at the seam directly below the unit under test

Test a layer for real; replace only the layer beneath it.

| Unit under test | Mock this |
|---|---|
| A service (`JobsService`) | `services/api/apiClient` |
| A query hook (`useJobs`) | the service (`services/api/services/JobsService`) |
| A screen / component hook (`useJobListScreen`, `JobList`) | the query hook (`query/Jobs/useJobs`) |

```ts
// GOOD — query-hook test mocks the service, exercises real TanStack Query wiring
jest.mock('services/api/services/JobsService', () => ({
  jobsService: { list: jest.fn() },
}));
```

Do **not** reach two layers down (e.g. mocking `apiClient` to test a screen) — mock the
immediate dependency so the intermediate layer is actually covered.

---

## 5. Test behavior, not implementation

Query by what the user sees (text, role, accessibility) and assert observable outcomes.
Never assert internal state, style objects, or private structure.

```tsx
// BAD — reaches into internals
expect(instance.state.isSaved).toBe(true);

// GOOD — drives the UI and asserts the effect
await fireEvent.press(getByText('Save job'));
expect(onSave).toHaveBeenCalledWith('job-1');
```

- Prefer the queries returned by `render` (`getByText`, `queryByText`, `getAllByText`).
- Use `queryBy*` to assert **absence** (returns `null`), `getBy*` when it must exist.
- RNTL only renders host elements — there's no query for a composite component by type. For
  an element with no accessible role or text (an icon, a bare spinner), give it a `testID`
  and query with `getByTestId`.

---

## 6. Await async query/state with `waitFor`

Query hooks resolve asynchronously — assert their settled state via `waitFor`, never a bare
`setTimeout` or an immediate read.

```ts
const { result } = await renderHookWithQuery(() => useJobs(filters));
await waitFor(() => expect(result.current.isSuccess).toBe(true));
expect(result.current.data).toEqual(jobsPage);
```

State transitions from `act`-triggering calls (setters returned by a hook) are always
awaited — `act` returns a `Promise` even for a synchronous callback:

```ts
await act(() => result.current.setFilters({ remote: true }));
```

---

## 7. Fixtures are deterministic factories with overrides

`test/fixtures` builds objects from a stable counter — no `Math.random`, no `Date.now`.
Pass only the fields a test cares about.

```ts
// GOOD — explicit, minimal, deterministic
const job = makeJob({ title: 'Senior Backend Engineer', company: makeCompany({ name: 'Acme' }) });
```

---

## 8. Coverage: logic ~100%, thin wrappers get a smoke test

Prioritize logic-heavy modules — pure utils, derivation hooks, services, and query hooks —
toward full line/branch coverage. Thin presentational wrappers (`Text`, `ActivityIndicator`)
need only a render/props smoke test.

---

## 9. Don't test these

Call it out rather than silently skipping, but do not write tests for:
- native module internals (RN/Reanimated behavior),
- the real backend contract (would need the live server or MSW),
- pixel/snapshot diffs — assert content and behavior instead.
