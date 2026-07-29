module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  // TanStack Query's per-test QueryClients leave internal timers/listeners
  // that keep the process alive well past the ~5s test run itself — a known
  // Jest + React Query interaction, not a real leak in app code.
  forceExit: true,
};
