## Project Summary
- Login via **DummyJSON**.
- Auto-locks after **10 seconds of inactivity** and when the app goes to background.
- Unlocks via **biometrics only** (no password fallback).
- Three screens only:
  1. Login Screen  
  2. All Products (list)  
  3. Specific Category (list filtered for one category)
- React Query for data fetching; query cache persisted with **MMKV** for instant re-render and offline access.
- **Superadmin** user (special UI privilege) can delete products on the All Products screen.
- Displays an **offline indicator** when the device is disconnected.

---

## Chosen Values
- **Superadmin user**: `emilys`  
  **Password**: `emilyspass`  
  (When signed in as this user, Delete buttons appear on the All Products screen.)

---

## Tech Stack / Notable Libraries
- React Native + TypeScript  
- React Navigation (native stack + bottom tabs)  
- @tanstack/react-query + persist client (MMKV)  
- react-native-mmkv (v3.x)  
- expo-local-authentication (biometrics)  
- Redux Toolkit  
- Axios  
- @react-native-community/netinfo  

---

## How to Build and Run the App
1. Install modules:
     ```bash
   pnpm install
     ```
2. Build the app:
     ```bash
     npx expo prebuild
     ```
3. Run the app:
     ```bash
     npx expo run:android
     npx expo run:ios
     ```
---

## App Behavior & Usage
- **Login**:
  - Use DummyJSON credentials to sign in.  
  - Superadmin: `emilys / emilyspass`  
  - After login, the token is stored in MMKV.  
  - On app relaunch or return from background, the app prompts for **biometric authentication** before resuming the session.

- **Auto-lock**:
  - Locks after **10 seconds of inactivity** or immediately when app moves to background.
  - Unlock requires biometric authentication.

- **All Products**:
  - Shows product title and thumbnail.  
  - Supports pull-to-refresh.  
  - Superadmin can delete items (simulated delete using DummyJSON endpoint).  
  - Sign-out button clears MMKV token and Redux session.

- **Specific Category**:
  - Displays filtered list of products.  
  - Supports pull-to-refresh.

- **Offline Support**:
  - React Query cache persisted to MMKV — lists load instantly and work offline.  
  - Network banner appears when offline.

---

## Trade-offs & If I Had More Time
### Trade-offs
- **MMKV for tokens**: Chosen for speed and simplicity. Secure storage (Keychain/Keystore) is recommended for production.  
- **Biometrics-only**: Simpler flow. Falls back to manual login if biometrics unavailable.  
- **Short 10s auto-lock**: Meets challenge criteria but should be configurable in real apps.  
- **Minimal UI**: Focused on correctness, not design polish.  
- **No automated tests**: Prioritized functional features.

### If I Had More Time
- Migrate sensitive data to secure storage or encrypt MMKV.  
- Add passcode fallback for non-biometric users.  
- Improve UX (animations, countdown, toasts).  
- Add retry handling and error toasts.  
- Add automated tests (unit/integration).  
- Add debug screen for cache and superadmin toggling.

---

## Final Note
- **Superadmin credentials**: `emilys / emilyspass`  
  Use only for development with DummyJSON API.
