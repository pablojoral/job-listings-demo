import { useEffect, useRef, useState } from 'react';

interface PendingCommit<T> {
  timeout: ReturnType<typeof setTimeout>;
  value: T;
}

/**
 * A local draft over a committed value, for inputs whose every change is
 * expensive to propagate (e.g. a search box whose store subscribers re-filter
 * a large list). The draft echoes changes instantly; `commit` fires once per
 * pause of `delayMs` instead of once per change.
 *
 * - `onChange(next)` — update the draft now, commit after the pause.
 * - `commitNow(next)` — skip the pause and cancel any pending commit, for
 *   single deliberate actions like a clear button.
 * - External changes to `value` are adopted into the draft while no commit is
 *   pending (the draft is newer than `value` while one is).
 * - Unmounting flushes a pending commit — the last changes apply, never drop.
 */
export const useDebouncedCommit = <T>(value: T, commit: (value: T) => void, delayMs: number) => {
  const [draft, setDraft] = useState(value);
  const pendingCommit = useRef<PendingCommit<T> | null>(null);

  // Callers may pass an unstable `commit`; the ref keeps the scheduled and
  // unmount paths on the latest one without re-arming effects.
  const commitRef = useRef(commit);
  commitRef.current = commit;

  const discardPending = () => {
    if (pendingCommit.current) {
      clearTimeout(pendingCommit.current.timeout);
      pendingCommit.current = null;
    }
  };

  const onChange = (next: T) => {
    setDraft(next);
    discardPending();
    const timeout = setTimeout(() => {
      pendingCommit.current = null;
      commitRef.current(next);
    }, delayMs);
    pendingCommit.current = { timeout, value: next };
  };

  const commitNow = (next: T) => {
    discardPending();
    setDraft(next);
    commitRef.current(next);
  };

  useEffect(() => {
    if (!pendingCommit.current) {
      setDraft(value);
    }
  }, [value]);

  useEffect(
    () => () => {
      if (pendingCommit.current) {
        clearTimeout(pendingCommit.current.timeout);
        commitRef.current(pendingCommit.current.value);
      }
    },
    [],
  );

  return { draft, onChange, commitNow };
};
