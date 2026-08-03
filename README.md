# Job Listings Demo

A remote job listings browser built with [Expo](https://expo.dev) (SDK 57) and React Native. It fetches jobs from the public [Remotive API](https://github.com/remotive-com/remote-jobs-api), with client-side search and filtering, favorites persisted on-device, and a native HTML job description renderer. No API keys or backend setup required.

## Requirements

- Node.js 20+
- **iOS:** Xcode 16+ with an iOS Simulator (macOS only)
- **Android:** Android Studio with an emulator (or a device with USB debugging)

> **Note:** the app uses native modules (`@expo/ui`, `expo-sqlite`), so it does **not** run in Expo Go — it must be built natively with the commands below. The native `ios/` and `android/` projects are already checked in.

## Run it

Install dependencies:

```bash
npm install
```

Build and launch on the iOS Simulator:

```bash
npx expo run:ios
```

Build and launch on an Android emulator/device:

```bash
npx expo run:android
```

The first build compiles the native project and takes a few minutes. After that, start just the Metro dev server and the installed dev build connects to it:

```bash
npx expo start
```

### Using Yarn instead

The equivalent Yarn scripts also work: `yarn install`, then `yarn ios`, `yarn android`, or `yarn start`.

## Scripts

| Command | What it does |
| --- | --- |
| `yarn ios` | Build the native iOS app and run it on the simulator |
| `yarn android` | Build the native Android app and run it on an emulator/device |
| `yarn start` | Start the Metro dev server (for an already-installed build) |
| `yarn test` | Run the Jest test suite |
| `yarn lint` | Lint with ESLint (`expo lint`) |
| `npx tsc --noEmit` | Type-check the project |

## Project structure

```
src/
  app/         Expo Router routes (tabs + job details)
  features/    Screen-level features (JobList, JobDetails, FavoritesList)
  components/  Shared components: ui/ (design system) and domain/ (job-aware)
  query/       TanStack Query hooks and query-key registry
  services/    Axios client + API service classes
  store/       Zustand stores (filters, persisted favorites)
  models/      Domain models
  theme/       Design tokens and theme hooks
```

Architectural conventions live in `.claude/rules/` and notable trade-offs are recorded in `DECISIONS.md`.
