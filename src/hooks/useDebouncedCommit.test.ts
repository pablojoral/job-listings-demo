import { act, renderHook } from '@testing-library/react-native';

import { useDebouncedCommit } from './useDebouncedCommit';

describe('useDebouncedCommit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const renderDebounced = (commit: (value: string) => void, initialValue = '') =>
    renderHook(({ value }: { value: string }) => useDebouncedCommit(value, commit, 200), {
      initialProps: { value: initialValue },
    });

  it('echoes changes into the draft immediately but commits only after the pause', async () => {
    const commit = jest.fn();
    const { result } = await renderDebounced(commit);

    await act(() => result.current.onChange('engineer'));
    expect(result.current.draft).toBe('engineer');
    expect(commit).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(200));
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith('engineer');
  });

  it('collapses a burst of changes into one commit of the last value', async () => {
    const commit = jest.fn();
    const { result } = await renderDebounced(commit);

    await act(() => result.current.onChange('e'));
    await act(() => jest.advanceTimersByTime(100));
    await act(() => result.current.onChange('en'));
    await act(() => jest.advanceTimersByTime(100));
    await act(() => result.current.onChange('eng'));
    expect(commit).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(200));
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith('eng');
  });

  it('commitNow commits immediately and cancels the pending commit', async () => {
    const commit = jest.fn();
    const { result } = await renderDebounced(commit);
    await act(() => result.current.onChange('engineer'));

    await act(() => result.current.commitNow(''));
    expect(result.current.draft).toBe('');
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith('');

    await act(() => jest.advanceTimersByTime(300));
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it('adopts external value changes into the draft while no commit is pending', async () => {
    const commit = jest.fn();
    const { result, rerender } = await renderDebounced(commit, 'initial');
    expect(result.current.draft).toBe('initial');

    await rerender({ value: 'external' });
    expect(result.current.draft).toBe('external');
    expect(commit).not.toHaveBeenCalled();
  });

  it('keeps the newer draft when the value changes while a commit is pending', async () => {
    const commit = jest.fn();
    const { result, rerender } = await renderDebounced(commit);
    await act(() => result.current.onChange('engineer'));

    await rerender({ value: 'external' });
    expect(result.current.draft).toBe('engineer');

    await act(() => jest.advanceTimersByTime(200));
    expect(commit).toHaveBeenCalledWith('engineer');
  });

  it('flushes a pending commit on unmount instead of dropping it', async () => {
    const commit = jest.fn();
    const { result, unmount } = await renderDebounced(commit);
    await act(() => result.current.onChange('engineer'));
    expect(commit).not.toHaveBeenCalled();

    await unmount();
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith('engineer');
  });
});
