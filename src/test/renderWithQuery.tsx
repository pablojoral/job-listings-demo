import React from 'react';
import { render, renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

/** Renders `ui` inside a fresh QueryClient (retry disabled, so failing queries settle immediately). */
export const renderWithQuery = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

/** Same as `renderWithQuery`, for hooks that need a QueryClient. */
export const renderHookWithQuery = <TResult,>(hook: () => TResult) => {
  const queryClient = createTestQueryClient();
  return renderHook(hook, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};
