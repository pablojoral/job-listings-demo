/* eslint-env jest */

// Provide deterministic safe-area insets (all zero) so components using
// useSafeAreaInsets render without a native provider.
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

// In-memory stand-in for expo-sqlite's key-value store (native SQLite), so
// persisted zustand stores stay deterministic and never touch the disk.
jest.mock('expo-sqlite/kv-store', () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItemSync: (key: string) => store.get(key) ?? null,
      setItemSync: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItemSync: (key: string) => store.delete(key),
    },
  };
});
