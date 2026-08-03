---
description: Style rules for React Native components and screens in this project
---

# Styling Rules

## 1. All design constants come from `useTheme`

Never use raw numbers or color strings for design values. Every spacing, color, radius, font size, font weight, line height, and border value must come from the theme.

```ts
// BAD
const style = { padding: 12, backgroundColor: '#F5F3FF', borderRadius: 8 };

// GOOD
const theme = useTheme();
const style = {
  padding: theme.spacing['spacing-sm'],
  backgroundColor: theme.surfaceColor['surface-primary'],
  borderRadius: theme.cornerRad['corner-rad-md'],
};
```

Allowed raw values (structurally necessary, not design tokens):
- `flex: 1`, `flexGrow: 1`, `flexShrink: 1`
- `position: 'absolute'`, `overflow: 'hidden'`
- `width: '100%'`, `aspectRatio` when purely geometric
- Layout values derived from `theme.topInset` / `theme.bottomInset`

---

## 2. No inline styles on JSX elements

`style={{ ... }}` on a component is forbidden. All styles must live in the theme hook.

```tsx
// BAD
<View style={{ flex: 1, padding: 16 }}>

// GOOD
<View style={styles.container}>
```

Exception: dynamic transforms on Reanimated animated values, because the animated value must be passed directly:
```tsx
<Animated.View style={[styles.box, { transform: [{ translateY }] }]} />
```

---

## 3. All styles are encapsulated in a dedicated theme hook

Every screen and component has its own `use<Name>Theme` hook, co-located in a `theme/` subfolder.

```
src/features/JobList/
  JobList.tsx
  theme/
    useJobListTheme.ts
```

**The common case — styles that depend only on the theme — is defined through
the `makeThemedStyles` factory** (`theme/makeThemedStyles.ts`), which encodes
`useTheme()` + a `StyleSheet.create` memoized on `[theme]` once:

```ts
import { makeThemedStyles } from 'theme/makeThemedStyles';

export const useJobListTheme = makeThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.surfaceColor['surface-background'],
    paddingHorizontal: theme.spacing['spacing-md'],
  },
}));
```

**Hooks whose styles also depend on props or state are written by hand** and
must:
- Call `useTheme()` internally — never accept theme as a parameter
- Return `{ styles, theme }` — `styles` for layout/visual, `theme` for values passed as props (e.g. icon colors)
- Use `useMemo(() => StyleSheet.create({ ... }), [theme])` for the theme-only styles
- Use `useMemo` returning a plain object for the prop/state-dependent styles

```ts
import { useMemo } from 'react';

import { StyleSheet } from 'react-native';

import { useTheme } from 'theme/hooks/useTheme';

export const useJobRowTheme = (isActive: boolean) => {
  const theme = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.surfaceColor['surface-background'],
          paddingHorizontal: theme.spacing['spacing-md'],
        },
      }),
    [theme],
  );

  const rowStyle = useMemo(() => ({
    opacity: isActive ? 1 : 0.5,
    borderColor: isActive
      ? theme.borderColor['border-primary']
      : theme.borderColor['border-disabled'],
  }), [isActive, theme]);

  return { styles, rowStyle, theme };
};
```

Usage in the component:
```tsx
const { styles, rowStyle, theme } = useJobListTheme(isActive);

return (
  <View style={styles.container}>
    <View style={rowStyle}>
      <Icon color={theme.fontColor['font-primary']} />
    </View>
  </View>
);
```

---

## 4. `StyleSheet.create` vs `useMemo` — when to use each

| Situation | Use |
|---|---|
| Styles that depend only on the theme | `makeThemedStyles((theme) => ({ ... }))` |
| Style varies by prop or state | hand-written hook: `useMemo` returning a plain object |
| Animated style | `useAnimatedStyle` from Reanimated |

A bare `StyleSheet.create` in a hook body runs on **every render** — its
registration-time optimization only exists at module level, and theme-dependent
styles can't live there. The factory memoizes on `[theme]` internally; in
hand-written hooks, always wrap `StyleSheet.create` in `useMemo` keyed on
`[theme]`. `useTheme` returns a stable object, so styles rebuild only when the
color scheme or safe-area insets change.

```ts
// BAD — re-creates and re-validates every style object on every render
const styles = StyleSheet.create({ container: { flex: 1 } });

// GOOD — built once per theme change (what makeThemedStyles does for you)
const styles = useMemo(() => StyleSheet.create({ container: { flex: 1 } }), [theme]);
```

---

## 5. No module-level `StyleSheet.create` outside a theme hook

Do not define `const styles = StyleSheet.create(...)` at the top level of a screen or component file. All styles — even purely structural ones — belong in the theme hook.

```ts
// BAD — top-level in JobList.tsx
const styles = StyleSheet.create({ container: { flex: 1 } });

// GOOD — in useJobListTheme.ts
```

---

## 6. Prefer `gap` and `padding` over `margin`

Use `gap` on flex containers to space children. Use `padding` on parent containers to create insets. Avoid `margin` on children — it creates implicit dependencies between siblings and makes components harder to reuse.

```ts
// BAD
const styles = StyleSheet.create({
  card: { marginBottom: 12 },       // depends on siblings
  title: { marginTop: 8, marginBottom: 4 }, // margin on both sides
});

// GOOD
const styles = StyleSheet.create({
  list: { gap: theme.spacing['spacing-sm'] },      // gap on the container
  card: { padding: theme.spacing['spacing-md'] },  // padding for insets
});
```

`margin` is permitted only for asymmetric offsets that cannot be expressed as `gap` or `padding` (e.g. `marginLeft` to indent a single item, or `marginTop` on a screen's first section to account for a header).

---

## 7. Naming conventions

| What | Convention |
|---|---|
| Hook file | `use<ComponentName>Theme.ts` |
| Hook export | `use<ComponentName>Theme` |
| Styles object | `styles` (from `StyleSheet.create`) |
| Individual dynamic style | descriptive name + `Style` suffix (e.g. `rowStyle`, `activeTabStyle`) |
| Folder | `theme/` next to the component or screen file |
