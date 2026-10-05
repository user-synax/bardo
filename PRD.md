# Bardo — Product Requirements Document

## 1. Vision

A calm, fast, beautiful home for quick notes and daily task lists —
cream-paper UI, Android-first, fully offline, private by default.

## 2. Users

- **Primary:** Android user who jots notes (study, links, credentials-ish
  text) and keeps a short daily todo list. Wants zero friction, zero accounts.
- **Non-users (for now):** teams, sync-across-devices seekers, markdown /
  rich-text power users.

## 3. Status quo (shipped — v1.1)

### Notes tab (default)
- 2-column grid / 1-column list (toggle live in header).
- Search across title + body with `RESULTS (n)` view + clear button.
- Pin / unpin (card bookmark + editor toggle); `PINNED` / `OTHERS`
  collapsible sections, pinned sorted by recency.
- Note editor bottom sheet: title, body, 5 tints (cream/sage/peach/sky/lilac),
  pin, delete, save. Empty draft discards silently.
- Persisted locally (`bardo.notes.v1`, AsyncStorage).

### Lists tab
- Add / complete / delete / edit tasks; title + notes + priority
  (low/medium/high) + due date (None/Today/Tomorrow/Next wk).
- All / Active / Done filter with counts, progress bar, clear-completed.
- Swipe-to-delete, haptics, Reanimated row motion.
- Persisted locally (`bardo.todos.v1`, AsyncStorage).

### Shell
- Bottom bar (Notes | + | Lists), context-aware + (new note / focus composer).
- Cream light + dark cocoa themes follow system; splash + root bg cream.

## 4. Planned features

### 4.1 Notes upgrades (P1)
- [ ] Sort options (sheet behind the `sort` icon): by updated, by created,
  alphabetical. Persist choice.
- [ ] Note detail full-screen editor (for long notes) — sheet stays for
  quick capture.
- [ ] Checklist blocks inside notes (link to Lists items).
- [ ] Trash with 30-day restore instead of instant delete.
- [ ] Duplicate note.

### 4.2 Appearance (P1)
- [ ] Settings screen (behind gear icon): theme mode (System / Cream /
  Cocoa), accent choice, font-size (S/M/L), reduce-motion toggle honoring
  system setting.
- [ ] More card tints + custom color.
- [ ] Grid density option (2 vs 3 columns on large screens).

### 4.3 Security & privacy (P1)
- [ ] **Biometric app lock** (`expo-local-authentication`): Face / fingerprint
  / device credential on cold start + from background after N minutes.
  - Setting: on/off, auto-lock timeout (immediately / 1 min / 5 min).
  - Fallback: device PIN/pattern via `local-authentication` device-credential
    path; graceful message on devices without hardware.
  - Must keep working fully offline; **never** store notes/todos in
    SecureStore (too small) — lock is a gate, data stays in AsyncStorage.
  - Note: `expo-local-authentication` needs a dev build (not in Expo Go
    for production testing); add `expo install expo-local-authentication`.
- [ ] Hide-content mode: blur cards / require auth per-note (locked notes).
- [ ] Export backup (JSON) + import; share note as text.
- [ ] Explicit warning: storage is **unencrypted** — users must not treat it
  as a password manager (throws of `MONGODB_URI=` strings seen in testing).

### 4.4 Lists upgrades (P2)
- [ ] Multiple lists (Groceries, Study…) + per-list colors.
- [ ] Reminders / due-time notifications (`expo-notifications`).
- [ ] Recurring tasks.
- [ ] Widgets (Android home-screen widget via EAS / native module).

### 4.5 Platform & quality (ongoing)
- [ ] Haptic + motion audit on low-end Android (Moto G class).
- [ ] Play Store release via EAS (`eas build`, `eas submit`).
- [ ] Crash reporting (Sentry) + basic analytics (opt-in).
- [ ] Web parity check (current target is Android-first; web must not crash).

## 5. Non-goals (v1.x)

- Accounts, cloud sync, collaboration.
- Rich text / markdown rendering.
- iOS-specific features before Android ships.

## 6. Data model (current)

```ts
Note: { id, title, body, pinned, tint, createdAt, updatedAt }
Todo: { id, title, notes, completed, priority, dueDate (YYYY-MM-DD|null),
        createdAt, updatedAt }
```

Keys: `bardo.notes.v1`, `bardo.todos.v1`. New fields must be optional with
migration-tolerant loaders (current `loadNotes`/`loadTodos` drop malformed
rows — change to repair-and-keep before adding fields users care about).

## 7. Success metrics

- Cold start to interactive < 1.5s on mid Android.
- Note create → saved < 2 taps; task complete = 1 tap.
- Zero data-loss reports across updates (storage keys versioned, never
  renamed without migration).
- Rating prompt only after 7-day retention (post-P2).

## 8. Open questions

1. Should locked (biometric) notes use encrypted storage (`expo-secure-store`
   per-note) instead of gate-only lock? (SecureStore has size limits —
   likely gate-only + full-app lock for v1.)
2. One shared search across Notes + Lists, or per-tab search?
3. Does the Lists tab need pinning too, or is recency enough?
4. Backup format: plain JSON vs encrypted export with user passphrase?
