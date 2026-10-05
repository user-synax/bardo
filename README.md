<div align="center">
  <img src="./bardo.png" width="120" alt="Bardo logo" />
  <h1>Bardo</h1>
  <p>A calm, fast, beautiful notes app — cream-paper UI, Android-first, fully offline.</p>
</div>

## Features

- **Notes** — quick capture with title + body, 5 card tints (cream, sage, peach, sky, lilac)
- **Full-screen editor** — back, pin, delete, live "Edited …" stamp, auto-save on every keystroke (debounced)
- **Pin + sections** — collapsible `PINNED` / `OTHERS`, pinned notes stay on top
- **Search** — live filtering across titles and bodies with a results view
- **Grid / list layouts** — toggle in the header, animated row transitions
- **Cream + cocoa themes** — warm light mode, dark cocoa mode, follows the system
- **Private by default** — everything in on-device AsyncStorage, no accounts, no network

## Get started

Prerequisites: Node 22+, the [Expo Go](https://expo.dev/go) app on your Android device (or an Android emulator).

```bash
# install dependencies (this project uses bun)
bun install

# start the dev server
bunx expo start
```

Then press `a` for the Android emulator, or scan the QR code with Expo Go.

## Scripts

| Command              | What it does                              |
| -------------------- | ----------------------------------------- |
| `bunx expo start`    | Start the dev server (use ` --android`)    |
| `bunx tsc --noEmit`  | Typecheck                                 |
| `bunx eslint src/`   | Lint                                      |
| `bunx expo export`   | Production bundle check (`--platform android`) |

This project follows the rules in `AGENTS.md`: use `bunx expo install <pkg>`
for SDK-compatible native modules, and run lint + typecheck before calling
work done.

## Project structure

```
src/
  app/               Expo Router screens (index = notes home, note/[id] = editor)
  components/notes/  NotesHome, NoteCard (todos/ is parked for later)
  store/             NotesProvider — one shared useNotes instance
  hooks/             use-notes (load/save/filter), theme helpers
  lib/               AsyncStorage persistence, date formatting
  constants/         Cream/cocoa theme tokens (see design.md)
design.md            Full design system (tokens, components, motion, haptics)
PRD.md               Product requirements + roadmap (sort, settings, biometrics…)
bardo.png            App logo (also wired as icon, splash, and favicon)
```

## Tech stack

Expo SDK 57 · React Native 0.86 · Expo Router · Reanimated · Gesture Handler ·
AsyncStorage · Haptics · MaterialIcons — all Expo Go compatible, no dev build needed.

## Roadmap

Short term: sort options, settings screen (appearance), biometric app lock.
Details live in [PRD.md](./PRD.md).

## License

See [LICENSE](./LICENSE).
