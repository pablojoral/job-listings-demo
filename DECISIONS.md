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
