# Bardo — Product Requirements Document

## 1. Vision

A calm, fast, beautiful home for quick notes and daily task lists —
cream-paper UI, Android-first, fully offline, private by default.

## 2. Users

- **Primary:** Android user who jots notes (study, links, credentials-ish
  text) and keeps a short daily todo list. Wants zero friction, zero accounts.
- **Non-users (for now):** teams, sync-across-devices seekers, markdown /
  rich-text power users.

## 3. Status quo (shipped — v1.2, notes-only MVP)

### Notes tab (only tab)
- 2-column grid / 1-column list (toggle live in header).
- Search across title + body with `RESULTS (n)` view + clear button.
- Pin / unpin (card bookmark + editor toggle); `PINNED` / `OTHERS`
  collapsible sections, pinned sorted by recency.
- **Full-screen editor** (`/note/[id]`, `/note/new`): back arrow, pin,
  delete (confirm), live `Edited …` caption, 5 tints
  (cream/sage/peach/sky/lilac). **Auto-save** — 400ms-debounced write per
  keystroke batch; backing out of an empty new note creates nothing.
- Persisted locally (`bardo.notes.v1`, AsyncStorage).
- Trash: delete moves notes to Trash (restorable 30 days, auto-purged);
  Trash screen via Settings → Trash with restore / delete-forever / empty.
- Settings (gear): theme mode (System / Cream / Cocoa, live override),
  biometric app lock (fingerprint/face + Immediately/1min/5min timeout),
  trash entry, about. See `design.md`.

### Shell
- Bottom bar (Notes + raised +), + routes to `/note/new`.
- Cream light + dark cocoa themes follow system; splash + root bg cream.

### Parked (code kept, UI removed)
- Lists tab: `src/components/todos/`, `src/hooks/use-todos.ts`,
  `src/lib/todo-storage.ts`, `src/types/todo.ts` remain in-tree and
  typecheck. Was: add/complete/delete/edit tasks, priority + due dates,
  filters, swipe-to-delete. Return planned in §4.4.

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
- [x] Settings screen with theme mode (System / Cream / Cocoa).
- [ ] Accent choice, font-size (S/M/L), reduce-motion toggle.
- [ ] More card tints + custom color.
- [ ] Grid density option (2 vs 3 columns on large screens).

### 4.3 Security & privacy (P1)
- [x] **Biometric app lock** (`expo-local-authentication`): fingerprint/face
  gate on cold start + background timeout (Immediately/1 min/5 min),
  auto-prompt, fail-closed when biometrics unenrolled. FaceID permission
  string configured for iOS builds.
- [x] Trash with 30-day restore + auto-purge.
- [ ] Hide-content mode / per-note locked notes.
- [ ] Export backup (JSON) + import; share note as text.
- Note: storage stays **unencrypted** AsyncStorage (lock is a gate, and
  SecureStore is too small for notes) — users must not treat the app as a
  password manager. Device PIN/pattern fallback comes free with the default
  `authenticateAsync` policy.

### 4.4 Lists return (P2 — parked code exists, see §3)
- [ ] Restore Lists tab + bottom-bar slot; re-christen tab label if needed.
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
- Note create → visible in list < 1 tap after back; zero lost keystrokes
  (auto-save covers backgrounding mid-typing).
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
