---
description: Component architecture rules for React Native screens and components in this project
---

# Component Rules

## 1. One component per file

Each file exports exactly one React component. No helper components defined in the same file.

```tsx
// BAD — JobFiltersHeader defined inside JobList.tsx
const JobFiltersHeader = () => { ... };
export const JobList = () => { ... };

// GOOD — split into separate files
// features/JobList/components/JobFiltersHeader/JobFiltersHeader.tsx
export const JobFiltersHeader = () => { ... };

// features/JobList/JobList.tsx
import { JobFiltersHeader } from './components/JobFiltersHeader/JobFiltersHeader';
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
features/JobList/
  JobList.tsx               ← only JSX + hook call
  hooks/
    useJobListScreen.ts     ← query, pagination, derived state
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
// hooks/useJobListScreen.ts
export const useJobListScreen = (filters: JobFilters) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useJobs(filters);
  const jobs = data?.pages.flatMap(p => p.data) ?? [];
  const handleEndReached = () => { if (hasNextPage) fetchNextPage(); };
  return { jobs, isLoading, isFetchingNextPage, handleEndReached };
};

// JobList.tsx
export const JobList = () => {
  const { jobs, isLoading, isFetchingNextPage, handleEndReached } = useJobListScreen(filters);
  const { styles } = useJobListTheme();
  ...
};
```

Pure formatting/utility functions (e.g. `formatSalaryRange`, `formatPostedDate`) belong in `utils/` or the hook file — never loose in the component file.

---

## 4. Always use project custom components over React Native primitives

When a custom component exists, always use it. Never reach for the bare RN primitive.

| Instead of                                 | Use                                                                            |
| ------------------------------------------ | -------------------------------------------------------------------------------|
| `<Text>` from `react-native`               | `<Text>` from `components/ui/Text/Text`                                        |
| `<ActivityIndicator>` from `react-native`  | `<ActivityIndicator>` from `components/ui/ActivityIndicator/ActivityIndicator` |
| `<TouchableOpacity>` for a labelled action | `<Button>` from `components/ui/Button/Button`                                  |

```tsx
// BAD
import { Text, ActivityIndicator } from 'react-native';

// GOOD
import { Text } from 'components/ui/Text/Text';
import { ActivityIndicator } from 'components/ui/ActivityIndicator/ActivityIndicator';
```

---

## 5. Extract abstract components whenever a pattern repeats

If a UI pattern appears more than once, or is complex enough to reason about independently, extract it out of the feature. Prefer a reusable abstraction over copy-pasting structure.

Signs you should extract:

- Same visual structure used in two or more places
- A self-contained section inside a screen (empty state, list header, card)
- Any component with its own local state or animation

**Shared components live in one of two tiers under `src/components/` — pick by what the
component knows, not who calls it:**

| Tier | Folder | May import | Examples |
|---|---|---|---|
| Design system (app-agnostic) | `components/ui/` | `theme/`, other `components/ui/` — **never** `models/`, `store/`, `query/`, `features/`, `components/domain/` | `Text`, `Button`, `Dropdown`, `EmptyState`, `Tag` |
| Domain-shared | `components/domain/` | `components/ui/`, `models/`, `store/`, `query/` | `JobCard`, `JobHeader`, `CompanyLogo` |

A component that takes only generic props (`label`, `icon`, `onPress`) belongs in
`components/ui/`, even if only job screens use it today. A component that imports a domain
model or a store belongs in `components/domain/`.

**Features never import from another feature's folder.** `features/<A>/` importing from
`features/<B>/` is forbidden — the moment a second feature needs a component, promote it to
the appropriate tier instead. A feature's `components/` folder is private to that feature.

```tsx
// BAD — FavoritesList reaching into JobList's internals
import { JobCard } from 'features/JobList/components/JobCard/JobCard';

// GOOD — domain-shared component promoted to components/domain/
import { JobCard } from 'components/domain/JobCard/JobCard';
```

```
src/components/
  ui/
    Button/
      Button.tsx
      theme/
        useButtonTheme.ts
  domain/
    JobCard/
      JobCard.tsx
      hooks/
        useJobCard.ts
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

**Exception:** Expo Router resolves each route from the default export of its file under
`src/app/`, so route files must use `default export`. Keep the route file to an import +
default export of a named component so the rest of the rule set still applies to the actual
logic:

```tsx
// src/app/jobs/[id].tsx
import { JobDetail } from 'features/JobDetail/JobDetail';
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
// components/JobsEmptyState/JobsEmptyState.tsx
export const JobsEmptyState = () => { ... };
```

---

## 10. No `any` in component props or hook return types

Use proper model types from `src/models/` or derive precise types from API responses. `any` in a prop type defeats TypeScript's value entirely.

```tsx
// BAD
const salaryMax = (job as any).salaryMax as number | undefined;

// GOOD — add the field to the Job model
job.salaryMax;
```
