# Decisions Log

A running log of notable decisions for this project — what was decided and why,
so the reasoning isn't lost once the moment has passed.

---

## 2026-07-29 — Work directly on `main`, no feature branches/PRs

**Decision:** Commit directly to `main` instead of using feature branches and pull requests.

**Context:** This repo is a demo built for a recruitment process, not a production
app with a team or a release process to protect. There's a single contributor and
no CI gate to satisfy, so branch protection and PR review add process overhead
without a corresponding benefit here.

**Revisit if:** the project grows collaborators, needs a deployed environment
that `main` should track safely, or otherwise stops being a single-author demo.

---

## 2026-08-03 — Query errors replace the job list, even when cached data exists

**Decision:** When the jobs query is in error state, the list renders empty and
the full error state shows in its place (`useJobListScreen` maps `isError` to
`[]`) — including after a failed refetch where TanStack Query still holds
previously fetched data.

**Context:** This is deliberate so the error state is easy to reach and
demonstrate in a demo: turn off connectivity, pull to refresh, and the error UI
appears — no need to cold-start the app without a network to ever see it. The
error renders inside the FlatList's empty slot (not an early-return view) so
pull-to-refresh stays mounted and can retry.

The production-friendly pattern is known and intentionally not used here: show
the full-screen error only when there is no data at all (`isError && !data`),
and surface refetch failures as a banner/toast over the stale list so a flaky
refresh never makes existing results vanish.

**Revisit if:** this stops being a demo and real users would lose a loaded
list to a failed background refresh.

---

## 2026-08-03 — Fetch the full jobs list, descriptions included, in one request

**Decision:** `JobsService.list` fetches Remotive's entire jobs list with no
`limit`, including every job's HTML `description`, and the whole payload lives
in a single query cache entry.

**Context:** This is a demo, and the app's design is fetch-once + client-side
filtering: Remotive has no server-side pagination and no per-id detail
endpoint, so favorites and the details screen resolve jobs against this one
cached list. Trimming the payload (a `limit`, or stripping `description` from
the list) would break that resolution for no demo benefit. The cost — a
multi-MB JSON payload parsed on launch and re-fetched wholesale on refresh —
is accepted.

**Revisit if:** the backend gains real pagination/filtering or a detail
endpoint, or the payload grows enough to hurt launch time on real devices.

---

## 2026-08-03 — A categories fetch failure degrades silently

**Decision:** If the categories query errors out, the dropdown just renders
with no options — no error message or retry button. To compensate,
`useCategories` retries harder than the global default (`retry: 4`,
exponential backoff), and an errored query refetches each time the filters
sheet mounts it again.

**Context:** Categories power a secondary filter and the app is fully usable
without them, so a dedicated error UI isn't worth the surface area in a demo.
The known improvement, deliberately skipped: surface the error (inline state
or toast — Expo has no universal one) with a manual retry.

**Revisit if:** categories become load-bearing, or users would mistake a
failed fetch for "there are no categories".
