# AmoledFit — Android-Ready Capacitor App

A fully offline bodyweight fitness tracker with AMOLED glassmorphism design, built with React + Vite + Capacitor.

## Tech Stack

- **Frontend**: React 18, Vite 6, TypeScript, Tailwind CSS v4, Framer Motion
- **Native**: Capacitor 6 (`@capacitor/android`, `@capacitor/local-notifications`, `@capacitor/haptics`, `@capacitor/splash-screen`, `@capacitor/status-bar`)
- **Storage**: localStorage (via the BOX pattern — fully offline, no backend)
- **Routing**: React Router v6 with HashRouter

## App ID

`com.amoledfit.workout`

## Building the APK

### Prerequisites

- **Node.js** ≥ 18
- **Android Studio** (latest stable) with:
  - Android SDK (API 34)
  - Android SDK Build-Tools
  - Android Emulator or physical device

### Steps

```bash
# 1. Install JS dependencies
npm install

# 2. Build the web app
npm run build

# 3. Sync to Android
npx cap sync android

# 4. Open in Android Studio
npx cap open android
```

In Android Studio:
- Wait for Gradle sync to complete
- Select **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`

### Or build directly via Gradle (no Android Studio UI needed)

```bash
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk

# Release build (requires a keystore)
./gradlew assembleRelease
```

## Features

- **5 screens**: Home, Workout, Progress, Nutrition, Settings
- **Workout timer**: Full exercise + rest timer with auto-advance, sound, and haptics
- **Daily reminders**: Native Android Local Notifications via `@capacitor/local-notifications`
- **Haptic feedback**: Uses `@capacitor/haptics` on Android, Web Vibration API on web
- **Streak tracking**: Consecutive scheduled-day completion streaks
- **Progress calendar**: Monthly calendar with completion markers
- **Nutrition tracker**: Water tracker, protein targets, grocery list, daily checklist
- **Data export**: Export all progress to JSON
- **100% offline**: No network requests, all data stored on-device

## Android Permissions

| Permission | Purpose |
|---|---|
| `INTERNET` | WebView requires it even for offline use |
| `POST_NOTIFICATIONS` | Android 13+ required for notifications |
| `SCHEDULE_EXACT_ALARM` | Exact daily reminder scheduling |
| `RECEIVE_BOOT_COMPLETED` | Restore reminders after device reboot |
| `VIBRATE` | Haptic feedback during workouts |
| `WAKE_LOCK` | Keep CPU awake during workout timer |

## Project Structure

```
├── src/
│   ├── App.tsx                    # Root with HashRouter + providers
│   ├── main.tsx                   # Bootstrap (Capacitor init)
│   ├── index.css                  # Tailwind + custom AMOLED styles
│   ├── components/                # Reusable UI components
│   ├── data/workoutData.ts        # Single source of truth for all workout data
│   ├── database/                  # localStorage abstraction (BOX pattern)
│   ├── models/types.ts            # All TypeScript domain types
│   ├── providers/                 # React contexts (Settings, Progress, Workout)
│   ├── screens/                   # 5 app screens
│   └── services/                  # notification, sound, vibration, streak services
├── android/                       # Capacitor Android project
├── public/
│   └── notification-sw.js         # Web Notifications SW fallback
├── capacitor.config.json
├── vite.config.ts
└── package.json
```

## Capacitor Plugins Used

| Plugin | Purpose |
|---|---|
| `@capacitor/local-notifications` | Daily workout reminders (fires in background) |
| `@capacitor/haptics` | Native haptic feedback patterns |
| `@capacitor/splash-screen` | Custom black splash screen |
| `@capacitor/status-bar` | Black status bar to match AMOLED theme |
| `@capacitor/app` | App lifecycle hooks |
