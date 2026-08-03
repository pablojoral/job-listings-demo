module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  // jest-expo's default pattern, extended: @native-html resolves to its
  // untranspiled `src/` (via its `react-native` package.json field) and pulls
  // in ESM-only deps (stringify-entities and its character-entities-* deps),
  // all of which Babel must transform.
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|@native-html|@jsamr|stringify-entities|character-entities))',
    '/node_modules/react-native-reanimated/plugin/',
    '/node_modules/@react-native/babel-preset/',
  ],
  // TanStack Query's per-test QueryClients leave internal timers/listeners
  // that keep the process alive well past the ~5s test run itself — a known
  // Jest + React Query interaction, not a real leak in app code.
  forceExit: true,
};
