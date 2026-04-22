# Rested

A muscle-group rest tracker. The home screen lists every major muscle group sorted by how long it has been since you trained it — the one that has rested the longest sits on top, the one you just worked is on the bottom. Each row is green if the muscle has rested beyond its recommended window and red if it still needs recovery. A 3D body at the top highlights whichever muscle has been resting the longest.

Most workout apps are log-centric — built around recording what you just did. The question lifters actually ask between sessions is different: *"what should I train today?"* Rested flips that, showing recovery state instead of history. Rest windows are evidence-based defaults from ACSM / NSCA guidance (small muscles ≈ 48 h, large ≈ 72 h, abs ≈ 24 h); every value is editable per muscle.

## Tech stack

Expo SDK 53, React Native 0.79, React 19, `@react-three/fiber` v9 + `three.js` (via `expo-gl`), AsyncStorage, `react-native-gesture-handler` + `reanimated`, `expo-notifications` (iOS), `expo-clipboard`, `moment`.

## Run it

```bash
npm install
```

**Web**
```bash
npm run web
```
Open [http://localhost:8081](http://localhost:8081).

**iOS** (needs a dev client build because `expo-gl` has a native module):
```bash
npx expo prebuild
npx expo run:ios
```
