# Progression System Design

## Overview

Replace the flat game card grid with a Duolingo-style vertical path progression system. Games are organized into sections (tiers) that unlock based on star ratings earned across all games.

## Data Model

### Section

```ts
interface Section {
  id: string
  title: string
  emoji: string
  starsToUnlock: number // 0 = unlocked by default
}
```

### GameConfig Changes

Extend the existing `GameConfig` types with:

```ts
interface BaseGameConfig {
  id: string        // unique key (e.g. 'abc', 'lowercase')
  sectionId: string // which section this belongs to
  // ...existing fields (title, emoji, description, color, colorDark)
}
```

### Progress Persistence

New localStorage key `abc123-progress`:

```ts
interface GameProgress {
  bestStars: number // 0-3, 0 = never completed
}

interface ProgressData {
  games: Record<string, GameProgress> // keyed by game id
}
```

### Star Calculation

After each game completion:
- **3 stars**: score === total (100% perfect, no wrong presses)
- **2 stars**: score >= 80% of total
- **1 star**: game completed (any score)

Only saves if better than the player's previous best for that game.

### Section Unlocking

A section is unlocked when the player's total stars (sum of bestStars across all games) >= that section's `starsToUnlock` threshold.

## Content Structure

### Section 1: "Basics" (starsToUnlock: 0)

| Game ID | Title | Type | Description |
|---------|-------|------|-------------|
| `abc` | ABCs | Standard | A-Z, press matching letter key |
| `numbers` | 123s | Standard | 1-0, press matching number key |
| `counting` | Counting | Counting | 1-9 emoji objects, press count |

### Section 2: "Next Steps" (starsToUnlock: 5, out of 9 possible)

| Game ID | Title | Type | Description |
|---------|-------|------|-------------|
| `lowercase` | Lowercase | Standard | a-z lowercase letters |
| `counting-higher` | Counting Higher | Counting | 10-20 objects, multi-digit input |
| `number-words` | Number Words | NumberWords (new) | Shows "three", press 3 |

### Section 3: "Challenge" (starsToUnlock: 10, out of 18 possible)

| Game ID | Title | Type | Description |
|---------|-------|------|-------------|
| `mixed` | Mixed | Standard | Random mix of A-Z + 1-0 |
| `counting-backwards` | Backwards | Counting | 9 down to 1 |
| `speed-round` | Speed Round | Timed (new) | ABCs with countdown timer |

**Totals**: 9 games, 27 possible stars, 3 sections.

## Home Screen UI

### Layout (top to bottom)

1. **Title header** — "ABC 123", subtitle, stats bar (unchanged)
2. **Random toggle** — stays below header
3. **Vertical path** — scrollable area containing sections:

### Section Rendering

Each section renders:
- **SectionBanner** — colored bar with emoji, title, star progress (e.g. "Basics ⭐ 5/9")
- **PathNode** list — game nodes in a zigzag pattern connected by a dotted line

### PathNode Component

Each node displays:
- Large circle with game emoji centered
- Game title below the circle
- 3 small star outlines below title (filled = earned)
- Green/colored border if playable, gray border + opacity if locked
- Locked nodes show shake animation on tap, don't navigate

### Section Locking

Locked sections show:
- Grayed out banner and nodes
- Lock icon on the banner
- "Need X more ⭐" text

### Auto-scroll

Page auto-scrolls to the first section with incomplete games on mount.

## New Components

### `components/ui/PathNode.tsx` + `.css`

Circular game node for the vertical path. Props:
- `game: GameConfig`
- `stars: number` (0-3)
- `locked: boolean`
- `onClick: () => void`

### `components/ui/SectionBanner.tsx` + `.css`

Section header banner. Props:
- `section: Section`
- `earnedStars: number`
- `totalPossibleStars: number`
- `locked: boolean`

### `components/WordDisplay.tsx` + `.css`

Shows a word (e.g. "three") in a display box. Similar to `LetterDisplay` but with smaller, auto-sizing font for longer text. Props same as `LetterDisplay`.

### `components/TimerBar.tsx` + `.css`

Horizontal countdown bar for the speed round. Props:
- `duration: number` (seconds)
- `onTimeUp: () => void`
- `running: boolean`

## New Hooks

### `hooks/useProgress.ts`

Manages per-game star ratings and section unlock state.

**Exposed API:**
- `getStars(gameId: string): number` — returns 0-3
- `getTotalStars(): number` — sum across all games
- `isSectionUnlocked(section: Section): boolean` — total stars >= threshold
- `recordResult(gameId: string, score: number, total: number): { stars: number, isNewBest: boolean }` — calculates stars, persists if better

## New Game Types

### NumberWords (`type: 'numberWords'`)

- Display component: `WordDisplay`
- Shows the English word for a number (one, two, ... nine)
- Player presses the digit key
- `generateItems` returns `[{ answer: '3', word: 'three' }, ...]`
- New `NumberWordItem` interface in `types/game.ts`

### Timed (`type: 'timed'`)

- Wraps a standard game with a countdown timer
- `TimerBar` component renders above the game area
- When timer expires, game ends (score = items completed so far)
- Config includes `timeLimit: number` (seconds)
- New `TimedGameConfig` interface in `types/game.ts`

### Multi-Digit Input (Counting Higher)

- Counting Higher shows 10-20 objects
- Player types two digits (e.g. "1" then "5" for 15)
- Input buffer collects digits, auto-submits after 1 second of no input or when 2 digits entered
- Small digit preview shown below the counting display during input
- Implemented in `GameScreen.tsx` as a conditional branch when expected answer length > 1

## GameComplete Changes

Enhanced completion screen:
- 3 large star icons above score text, animated pop-in sequence (staggered 200ms)
- Gold fill for earned stars, gray outline for unearned
- "New Best!" badge shown when beating previous record
- New props: `stars: number`, `isNewBest: boolean`

## Implementation Order

1. **Types** — Extend `game.ts` with Section, id/sectionId on configs, new game type interfaces
2. **Progress hook** — `useProgress.ts` with localStorage persistence
3. **Sections & games config** — Define sections, add 6 new game entries to config
4. **Path UI** — `PathNode`, `SectionBanner`, rewrite `HomeScreen` to vertical path
5. **GameComplete stars** — Add star display and new-best badge
6. **New display components** — `WordDisplay`, `TimerBar`
7. **New game logic** — Multi-digit input, timed game wrapper, number words generator
8. **Wire up** — Connect progress throughout App, GameScreen, HomeScreen
