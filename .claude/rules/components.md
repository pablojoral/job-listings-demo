---
description: Component architecture rules for React Native screens and components in this project
---

# Component Rules

Component/screen files and folders are kebab-case (`job-card.tsx`), matching the existing
codebase (`themed-text.tsx`). Theme hooks are the one exception — file and export both use
`use<ComponentName>Theme` (e.g. `useJobCardTheme.ts`), per styling.md rule 7. Component and
class identifiers stay PascalCase; other hooks stay camelCase with a `use` prefix.

**Exception — Expo Router route files.** Files under `src/app/` are routes and must use a
`default export`, per [Expo Router's file-based routing](https://docs.expo.dev/versions/v57.0.0/router/introduction/) (see rule 7). Keep route files thin: they render a real,
named-export screen component that lives elsewhere and follows every rule below.

---

## 1. One component per file

Each file exports exactly one React component. No helper components defined in the same file.

```tsx
// BAD — JobsListHeader defined inside job-list.tsx
const JobsListHeader = () => { ... };
export const JobList = () => { ... };

// GOOD — split into separate files
// features/jobs-list/components/jobs-list-header/jobs-list-header.tsx
export const JobsListHeader = () => { ... };

// features/jobs-list/job-list.tsx
import { JobsListHeader } from './components/jobs-list-header/jobs-list-header';
export const JobList = () => { ... };
```

---

## 2. No inline component definitions

Never define a component inside another component's body or render scope. Components defined inline are re-created on every render and defeat React's reconciliation.

```tsx
// BAD
export const JobList = () => {
  const EmptyState = () => <Text>No jobs found</Text>; // re-created every render
  return <FlatList ListEmptyComponent={<EmptyState />} />;
};

// GOOD — EmptyState lives in its own file or is defined at module scope (if truly trivial and file-private)
```

---

## 3. No logic in component files — always use a component hook

The component file contains only JSX. All data derivation, transformations, event handlers, query calls, store reads, and computed values belong in a `use<ComponentName>.ts` hook co-located next to the component.

```
features/jobs-list/
  job-list.tsx               ← only JSX + hook call
  hooks/
    use-job-list.ts           ← query, pagination, derived state
```

```tsx
// BAD — logic in component body
export const JobList = () => {
  const { data } = useJobs(filters);
  const jobs = data?.pages.flatMap(p => p.data) ?? [];  // derivation
  const handleEndReached = () => { if (hasNextPage) fetchNextPage(); }; // handler
  ...
};

// GOOD — all logic in hook
// hooks/use-job-list.ts
export const useJobList = (filters: JobFilters) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useJobs(filters);
  const jobs = data?.pages.flatMap(p => p.data) ?? [];
  const handleEndReached = () => { if (hasNextPage) fetchNextPage(); };
  return { jobs, isLoading, isFetchingNextPage, handleEndReached };
};

// job-list.tsx
export const JobList = () => {
  const { jobs, isLoading, isFetchingNextPage, handleEndReached } = useJobList(filters);
  const { styles } = useJobListTheme();
  ...
};
```

Pure formatting/utility functions (e.g. `formatSalaryRange`, `formatPostedDate`) belong in `utils/` or the hook file — never loose in the component file.

---

## 4. Always use project custom components over React Native primitives

When a custom component exists, always use it. Never reach for the bare RN primitive.

| Instead of                                 | Use                                            |
| ------------------------------------------ | ----------------------------------------------- |
| `<Text>` from `react-native`               | `<ThemedText>` from `@/components/themed-text`   |
| `<View>` from `react-native`               | `<ThemedView>` from `@/components/themed-view`   |

```tsx
// BAD
import { Text, View } from 'react-native';

// GOOD
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
```

For any other RN primitive that needs a custom wrapper (`ActivityIndicator`, `Button`, etc.),
add it under `src/components/` (e.g. `src/components/button/button.tsx`) following this same
rule set instead of reaching for the bare RN primitive inline.

---

## 5. Extract abstract components whenever a pattern repeats

If a UI pattern appears more than once, or is complex enough to reason about independently, extract it to `src/components/`. Prefer a reusable abstraction over copy-pasting structure.

Signs you should extract:

- Same visual structure used in two or more places
- A self-contained section inside a screen (empty state, list header, card)
- Any component with its own local state or animation

```
src/components/
  job-card/
    job-card.tsx
    theme/
      useJobCardTheme.ts
```

---

## 6. Props interface always named `<ComponentName>Props`

Every component has an explicitly typed props interface. No inline types or anonymous objects.

```tsx
// BAD
export const JobCard = ({ job }: { job: Job }) => { ... };

// GOOD
interface JobCardProps {
  job: Job;
}
export const JobCard = ({ job }: JobCardProps) => { ... };
```

---

## 7. Named exports only — no default exports

Consistent with the rest of the codebase. Named exports make refactoring and searching reliable.

```tsx
// BAD
export default function JobList() { ... }

// GOOD
export const JobList = () => { ... };
```

**Exception:** route files under `src/app/` (Expo Router) must use `default export` — that's
how Expo Router registers a screen for a route. Keep the route file to an import + default
export of a named component so the rest of the rule set still applies to the actual logic:

```tsx
// src/app/jobs/[id].tsx
import { JobDetail } from '@/features/job-detail/job-detail';
export default JobDetail;
```

---

## 8. `renderItem` and `keyExtractor` defined in the hook, not inline

Inline arrow functions in `FlatList` props are recreated on every render. Define them in the component hook and pass stable references.

```tsx
// BAD
<FlatList
  renderItem={({ item }) => <JobCard job={item} />}
  keyExtractor={item => item.id}
/>;

// GOOD — in the hook
const renderItem = useCallback(
  ({ item }: { item: Job }) => <JobCard job={item} />,
  [],
);
const keyExtractor = useCallback((item: Job) => item.id, []);

// in the component
<FlatList renderItem={renderItem} keyExtractor={keyExtractor} />;
```

---

## 9. Empty, loading, and error states are named components

Never inline loading spinners or empty state copy directly in the component JSX. Give them a name — either as an imported component or, if used only once and trivially small, as a named constant in the hook's return value.

```tsx
// BAD
ListEmptyComponent={
  <View style={styles.empty}>
    <Text>No jobs match your filters.</Text>
  </View>
}

// GOOD — own file
// components/jobs-empty-state/jobs-empty-state.tsx
export const JobsEmptyState = () => { ... };
```

---

## 10. Copy and labels live in a dedicated `use[Component]Strings` hook

Never hardcode more than a couple of literal strings inline in a logic hook. Once a component
has more than one or two labels, extract them into a separate `use[Component]Strings.ts` file
co-located in the same `hooks/` folder; the logic hook imports from it. This project has no
i18n library installed — if one is added later, that hook is where the `useTranslation`/`t()`
calls go, and no other file needs to change.

```
features/job-list/hooks/
  use-job-list.ts          ← logic only — no inline copy
  use-job-list-strings.ts  ← all label/copy strings live here
```

```ts
// BAD — copy mixed into logic hook
export const useJobList = () => {
  const title = 'Open positions';
  const emptyLabel = 'No jobs match your filters.';
  const [filters, setFilters] = useState({});
  return { title, emptyLabel, filters, setFilters };
};

// GOOD — copy isolated
// use-job-list-strings.ts
export const useJobListStrings = () => ({
  title: 'Open positions',
  emptyLabel: 'No jobs match your filters.',
});

// use-job-list.ts
export const useJobList = () => {
  const { title, emptyLabel } = useJobListStrings();
  const [filters, setFilters] = useState({});
  return { title, emptyLabel, filters, setFilters };
};
```

If a hook contains **only** copy and no logic, name the file `use[Component]Strings.ts` directly — do not create a separate empty logic hook.

---

## 11. No `any` in component props or hook return types

Use proper model types from `src/models/` or derive precise types from API responses. `any` in a prop type defeats TypeScript's value entirely.

```tsx
// BAD
const salaryMax = (job as any).salaryMax as number | undefined;

// GOOD — add the field to the Job model
job.salaryMax;
```
