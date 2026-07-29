---
description: Testing rules for this project
---

<!-- @format -->

# Testing Rules

## Stack

Tests run on **Jest** with the **`@react-native/jest-preset`** preset and
**React Native Testing Library (RNTL)** for anything that renders. Config lives in
`jest.config.js` + `jest.setup.ts`. Run with `yarn jest` (or `yarn test`).

- Use **RNTL** (`@testing-library/react-native`) to render components and hooks — never
  bare `react-test-renderer` for component tests.
- Pin RNTL to the major that pairs with `react-test-renderer` for the installed React/RN
  version — check compatibility before upgrading across a major.

---

## 1. Co-locate test files as `*.test.ts(x)`

Each test sits next to the unit it covers; only cross-cutting harness code lives in `test/`.

```
src/features/jobs-list/utils/sort-jobs.ts
src/features/jobs-list/utils/sort-jobs.test.ts   ← beside its unit
test/                                            ← shared helpers only
  fixtures.ts  render-with-query.tsx
```

---

## 2. Tests must be deterministic — no real time or network

Every test controls its inputs. Nothing hits the OS clock or the network.

| Dependency                                               | How to control it                               |
| -------------------------------------------------------- | ----------------------------------------------- |
| `Date.now()` / relative dates (e.g. "posted 2 days ago") | `jest.useFakeTimers().setSystemTime(fixedDate)` |
| HTTP (`apiClient`/axios)                                 | `jest.mock('services/api/api-client', …)`       |
| Safe-area insets                                         | mock globally in `jest.setup.ts`                |

```ts
// BAD — depends on the wall clock; assertion drifts over time
expect(formatPostedDate(iso)).toBe("2 days ago");

// GOOD — fix the clock first
jest.useFakeTimers().setSystemTime(new Date("2020-06-15T12:00:00Z"));
expect(formatPostedDate(twoDaysBefore)).toBe("2 days ago");
```

---

## 3. Use shared test helpers — don't hand-roll them

| Need                                         | Use (from `test/`)                                                |
| -------------------------------------------- | ----------------------------------------------------------------- |
| A domain fixture                             | `makeJob(overrides)` / `makeCompany(overrides)` — `test/fixtures` |
| Render a component needing query + safe-area | `renderWithQuery(ui)` — `test/render-with-query`                  |
| Render a hook needing a QueryClient          | `renderHookWithQuery(hook)` — `test/render-with-query`            |

The query wrappers create a **fresh client with `retry: false`** so failing queries settle
immediately. Never build an ad-hoc `QueryClientProvider` or inline fixture objects.

```tsx
// BAD — bespoke wrapper + retries left on (hangs on error paths)
renderHook(() => useJobs(filters), {
  wrapper: ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  ),
});

// GOOD
const { result } = renderHookWithQuery(() => useJobs(filters));
```

---

## 4. Mock at the seam directly below the unit under test

Test a layer for real; replace only the layer beneath it.

| Unit under test                                     | Mock this                                          |
| --------------------------------------------------- | -------------------------------------------------- |
| A service (`JobsService`)                           | `services/api/api-client`                          |
| A query hook (`useJobs`)                            | the service (`services/api/services/jobs-service`) |
| A screen / component hook (`useJobList`, `JobList`) | the query hook (`query/jobs/use-jobs`)             |

```ts
// GOOD — query-hook test mocks the service, exercises real TanStack Query wiring
jest.mock("services/api/services/jobs-service", () => ({
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
fireEvent.press(getByText("Save job"));
expect(onSave).toHaveBeenCalledWith("job-1");
```

- Prefer the queries returned by `render` (`getByText`, `queryByText`, `getAllByText`).
- Use `queryBy*` to assert **absence** (returns `null`), `getBy*` when it must exist.
- Reserve `UNSAFE_getByType` for things with no accessible handle (e.g. a spinner).

---

## 6. Await async query/state with `waitFor`

Query hooks resolve asynchronously — assert their settled state via `waitFor`, never a bare
`setTimeout` or an immediate read.

```ts
const { result } = renderHookWithQuery(() => useJobs(filters));
await waitFor(() => expect(result.current.isSuccess).toBe(true));
expect(result.current.data).toEqual(jobsPage);
```

State transitions from `act`-triggering calls (setters returned by a hook) are wrapped in
`act(...)`:

```ts
act(() => result.current.setFilters({ remote: true }));
```

---

## 7. Fixtures are deterministic factories with overrides

`test/fixtures` builds objects from a stable counter — no `Math.random`, no `Date.now`.
Pass only the fields a test cares about.

```ts
// GOOD — explicit, minimal, deterministic
const job = makeJob({
  title: "Senior Backend Engineer",
  company: makeCompany({ name: "Acme" }),
});
```

---

## 8. Coverage: logic ~100%, thin wrappers get a smoke test

Prioritize logic-heavy modules — pure utils, derivation hooks, services, and query hooks —
toward full line/branch coverage. Thin presentational wrappers (`ThemedText`, `ThemedView`)
need only a render/props smoke test.

---

## 9. Don't test these

Call it out rather than silently skipping, but do not write tests for:

- native module internals (RN/Reanimated behavior),
- the real backend contract (would need the live server or MSW),
- pixel/snapshot diffs — assert content and behavior instead.
