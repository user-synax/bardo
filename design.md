# Bardo — Design System

Single source of truth for the Bardo cream UI. Code lives in
`src/constants/theme.ts`; this file explains the tokens and how to use them.
Update both together.

## 1. Philosophy

- **Warm paper, not sterile white.** Every surface is a warm cream; depth comes
  from slightly darker cream layers, never grey.
- **Android-first.** 48dp touch targets, bottom-reachable actions (FAB,
  composer), elevation shadows over blur, haptics on every commit action.
- **Calm + fast.** One accent color, one danger color, 160–260ms motion,
  memoized rows, debounced persistence.

## 2. Color tokens (`Colors`)

| Token               | Light (cream) | Dark (cocoa) | Usage                                              |
| ------------------- | ------------- | ------------ | -------------------------------------------------- |
| `background`        | `#F7F1E6`     | `#161009`    | App/page background, splash, root view             |
| `backgroundElement` | `#FFFDF7`     | `#221A12`    | Cards, sheets, search-adjacent surfaces            |
| `backgroundSelected`| `#EFE2CC`     | `#33271B`    | Search bar, filter row, bottom bar, pressed fills  |
| `text`              | `#2B2118`     | `#F5EBDD`    | Headings, titles, primary buttons (light)          |
| `textSecondary`     | `#8C7B66`     | `#A89885`    | Dates, previews, hints, inactive icons             |
| `border`            | `#E7D8BE`     | `#3A2E22`    | Card borders, sheet outlines, dividers             |
| `primary`           | `#2B2118`     | `#F5EBDD`    | Save buttons, add button (always contrasts page)   |
| `primaryText`       | `#FFF8EC`     | `#221A12`    | Text on `primary`                                  |
| `accent`            | `#C97E2C`     | `#E0A458`    | Section labels, progress fill, pin, active tab     |
| `accentSoft`        | `#F3E2C2`     | `#3A2C1C`    | Active tab icon wash, selected chips               |
| `danger`            | `#C14A3A`     | `#E07864`    | Delete, overdue, high priority                     |
| `dangerSoft`        | `#F7DDD6`     | `#3E211B`    | Delete button fill                                 |
| `success`           | `#5F7A5A`     | `#9DB89A`    | Checkbox fill, low priority                        |
| `fab`               | `#A87B4F`     | `#C99A68`    | Center + button                                    |
| `fabText`           | `#FFF8EC`     | `#221A12`    | + glyph                                            |

`ThemeColor = keyof light & dark`. `useTheme()` (`src/hooks/use-theme.ts`)
resolves the mode; pass the whole `theme` object down as a prop (never call
`useColorScheme` deep in cards — keeps rows memoizable).

### Priority colors (`PriorityColors`)

| Priority | Light     | Dark      |
| -------- | --------- | --------- |
| low      | `#6B8E6B` | `#9DB89A` |
| medium   | `#C98A1B` | `#E0A458` |
| high     | `#C14A3A` | `#E07864` |

Pills use `color + '1F'` fill and `color + '55'` border (8-digit hex alpha).

### Note tints (`NoteTints`, order in `NoteTintOrder`)

| Tint    | Light bg / border      | Dark bg / border       |
| ------- | ---------------------- | ---------------------- |
| `cream` | `#FFFDF7` / `#FFFDF7`  | `#221A12` / `#221A12`  |
| `sage`  | `#E7EDD6` / `#A9BE9A`  | `#26301F` / `#4A5A3E`  |
| `peach` | `#F5E3CE` / `#D9A97E`  | `#33251A` / `#6B4E33`  |
| `sky`   | `#DEE9F2` / `#9AB8D2`  | `#1E2A36` / `#3E5468`  |
| `lilac` | `#E7E1F0` / `#B3A4CF`  | `#282335` / `#544A70`  |

`cream` is borderless (border = bg). Pinned cards in the reference design use
`sage`/`peach`; users pick any tint in the editor.

## 3. Typography

System fonts only (`Fonts` in theme). No custom font loading = instant start.

| Style              | Size / weight              | Usage                                  |
| ------------------ | -------------------------- | -------------------------------------- |
| Screen title       | 42 / 800, ls −0.5          | "Notes"; Lists uses 34 / 800           |
| Date eyebrow       | 13 / 600, `textSecondary`  | "Monday, Oct 6" above titles           |
| Section label      | 15 / 800, ls 1.2, `accent` | PINNED / OTHERS / RESULTS              |
| Note card title    | 19 / 800, lh 25            | 2-line clamp                           |
| Note card date     | 12 / 600, `textSecondary`  | "16 Jul • 1:31 PM"                     |
| Note card body     | 14 / lh 20, `textSecondary`| 4-line clamp                           |
| Todo title         | 16 / 600, lh 22            | 2-line clamp, strike when done          |
| Meta / pills       | 11 / 700                   | Priority + due pills                   |
| Progress caption   | 12 / 600, `textSecondary`  | "3 of 5 done"                          |
| Bottom bar label   | 13 / 700                   | Notes / Lists                          |

## 4. Spacing, radius, elevation

- `Spacing`: half 2, one 4, two 8, three 16, four 24, five 32, six 64.
- `Radius`: small 10, medium 16, large 22, pill 999.
- Page gutter: 20 (notes) / 18 (lists). Card gap 12, grid gap 12.
- Cards: radius 20, padding 14, `elevation: 1` + soft shadow
  (`#3D2C17`, 0.07 / r8 / y2). Bottom bar: radius 30, `elevation: 6`
  (0.18 / r16 / y6). FAB: 76dp circle, raised −44, `elevation: 8`.
- Composer: radius `large`, padding 8 (16 left), `elevation: 3`.

## 5. Components

### App header (Notes)
`Notes` 42/800 + drop-down chevron (decorative — folders/accounts per PRD).
Right icons 24–26dp, gap 18: `sort` (decorative — sort options per PRD),
layout toggle (`view-agenda` ⇄ `dashboard`, live), `settings` (decorative —
settings screen per PRD). All icon presses fire `Haptics.selectionAsync`.

### Search bar
`backgroundSelected` pill, radius `large`, icons `search` / `close` (clear),
16sp input. Live filters title + body; results render under a
`RESULTS (n)` section in the active grid/list layout.

### Section header
`PINNED` / `OTHERS`, `accent`, chevron `keyboard-arrow-down/right` toggles
collapse. PINNED renders only when pins exist; empty state otherwise.

### NoteCard (`src/components/notes/NoteCard.tsx`)
Tint bg/border → top row (date + `bookmark` pin when pinned, tappable to
unpin) → title → body preview. Grid: `flex: 1` cells paired in rows
(min-height 148); list: full width. Enter `FadeInDown` 220ms staggered
(max 8 × 30ms), exit `FadeOut` 160ms, `LinearTransition` 220ms on reorder.

### NoteEditorSheet
Full-screen route (`src/app/note/[id].tsx`, `id === 'new'` for creation).
Back arrow (router back; hardware back pops natively) + pin toggle + delete
(confirm `Alert`; unsaved-new just goes back) in the header, live
`Edited {date}` caption, tint dots, 28/800 title field (autofocus on new),
16sp body filling the screen. **Auto-save**: 400ms-debounced store write per
keystroke batch — creates the row on first content, updates after; backing
out of an empty new note creates nothing. State: `NotesProvider`
(`src/store/notes-context.tsx`) wraps the Stack so list + editor share one
`useNotes` instance. Invalid ids `<Redirect href="/" />`.

### Lists components — PARKED
Lists UI was removed from the MVP. `src/components/todos/` (TodoItem,
Composer, FilterTabs, EditSheet, EmptyState) plus `src/hooks/use-todos.ts`,
`src/lib/todo-storage.ts`, `src/types/todo.ts` remain in the tree unused and
still typecheck. The motion/haptic specs for them live in git history; see
PRD §4.4 for their return.

### BottomBar (`src/components/BottomBar.tsx`)
`backgroundSelected`, radius 30, side margins 20. Notes tab (icon in
`accentSoft` wash + `accent` label), center FAB 76dp `fab` circle with 40dp +
glyph raised −44, spacer slot keeps the FAB optically centered. + uses
`impact Medium` and routes to `/note/new`.

## 6. Motion

| Token            | Value                                              |
| ---------------- | -------------------------------------------------- |
| Row enter        | `FadeInDown` 220ms, stagger ≤ 8 × 30ms             |
| Row exit/reorder | `FadeOut` 160ms / `LinearTransition` 220ms         |
| Screen transition | Stack `fade` (list ⇄ full-screen editor)            |
| Pressed          | opacity 0.92 + scale 0.99 (cards), 0.96 (buttons)   |
| Persist          | 250ms debounce after last list mutation; 400ms auto-save in editor |

## 7. Haptics (`expo-haptics`)

- `impact Light` — pin toggle
- `impact Medium` — create (+ button opens `/note/new`)
- `selection` — layout toggle, chips, icon buttons, tint dots
- `notification Success` — (reserved) explicit saves; `Warning` — delete

## 8. Iconography (`@expo/vector-icons`)

MaterialIcons throughout, 20–28dp: `search`, `close`, `sort`,
`view-agenda`, `dashboard`, `settings`, `arrow-drop-down`,
`keyboard-arrow-down/right`, `bookmark`, `bookmark-border`, `description`
(Notes), `checklist` (Lists), `add`. No emoji in UI.

## 9. Accessibility & Android specifics

- Minimum touch target 44–48dp (`hitSlop` 8–12 on small icon buttons);
  checkbox exposes `role="checkbox"` + `checked` state.
- `backgroundColor` splash / root view / adaptive icon all `#F7F1E6` so
  Android never flashes white or blue (`app.json`, `SystemUI` in `_layout`).
- `orientation: portrait`, `userInterfaceStyle: automatic` (cream ⇄ cocoa).
- `VIBRATE` permission is auto-added by `expo-haptics`.
- Storage keys versioned: `bardo.todos.v1`, `bardo.notes.v1` (AsyncStorage,
  unencrypted — see PRD security section before storing secrets).
