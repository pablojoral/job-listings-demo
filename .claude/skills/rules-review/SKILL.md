---
name: rules-review
description: Review the current diff against this project's .claude/rules/*.md conventions (api, components, styling, testing) and report violations, most severe first. Use after finishing a feature slice, or whenever asked to check rules compliance, check conventions, or review against the project rules. Pass --fix to apply high-confidence fixes after reporting.
---

# Rules Review

Checks the working diff against this repo's four convention files —
`.claude/rules/api.md`, `components.md`, `styling.md`, `testing.md` — each of
which is a numbered rule list. A generic code review won't reliably check
"did this mutation invalidate `qk.<resource>.root`" or "is the theme hook
file named `use<ComponentName>Theme`" unless those rules are fed in
explicitly — that's what this skill does.

## 1. Scope the diff

Default to uncommitted changes: `git diff HEAD` plus `git status --porcelain`
for untracked files. If that's empty, diff against the base branch instead:
`git diff origin/main...HEAD` (or `main` if no remote). If there is still no
diff, say so and stop — there is nothing to review.

## 2. Map changed files to applicable rule files

A file can map to more than one rule file (e.g. a screen component maps to
both `components.md` and `styling.md`).

| Changed path pattern | Applicable rule file(s) |
|---|---|
| `src/services/api/**`, `src/query/**` | `api.md` |
| `src/components/**/*.tsx`, `src/features/**/*.tsx` (excluding `theme/`) | `components.md` |
| `**/theme/*.ts`, `**/use*Theme.ts` | `styling.md` |
| `**/*.test.ts`, `**/*.test.tsx`, `test/**` | `testing.md` |

Skip a rule file entirely if no changed file matches its patterns.

## 3. Review each applicable rule file

For each rule file with matches, spawn one review agent (Agent tool,
`general-purpose` or `code-reviewer`) in parallel with the others (single
message, multiple tool calls — these are independent). Give each agent:

- The full numbered rule list from that one rule file (read it fresh, don't
  paraphrase from memory — rules can change).
- Only the diff hunks for files matching that rule file's patterns.
- Instructions to report only concrete, cited violations — a rule number, a
  `file:line`, and why it's a violation — not general style opinions outside
  the numbered rules. Skepticism default: if a "violation" is arguable, drop
  it rather than pad the list.

## 4. Aggregate and report

Collect all agents' findings and report them with the `ReportFindings` tool,
most severe first (a correctness-adjacent rule break — e.g. missing
`invalidateQueries`, `any` in a prop type — ranks above a naming nit). Tag
each finding's `category` with the rule file + number, e.g. `api-rule-6`.

If invoked with `--fix`: after reporting, apply fixes for every finding
you're confident about directly (Edit tool), then re-report with `outcome`
set per finding (`fixed` / `skipped` / `no_change_needed`) as `ReportFindings`
expects for a re-report pass.
