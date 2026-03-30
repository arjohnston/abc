# ABC 123 - Toddler Learning Games

A React + Vite web app with fun, Duolingo-inspired keyboard games for toddlers. Dark theme with bright colors, chunky Nunito font, tactile 3D button effects, and celebratory animations. Features a progression system with sections, star ratings, and unlockable tiers.

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: React 19 + Vite 8
- **Type checking**: tsgo (`@typescript/native-preview`) — the Go-based TypeScript compiler
- **Styling**: Plain CSS with CSS variables — Duolingo-inspired design system
- **Node**: 24 (see `.nvmrc`)

## Commands

- `npm run dev` — start Vite dev server (hot reload, no type checking)
- `npm run type-check` — run tsgo type checking once
- `npm run type-check:watch` — run tsgo in watch mode (run alongside `npm run dev`)
- `npm run build` — tsgo type check + Vite production build
- `npm run lint` — ESLint
- `npm run preview` — preview production build

## Project Structure

```
src/
  types/          # TypeScript type definitions
    game.ts       # Game config types, item types, section types, progress types
  games/          # Game configuration and logic
    config.ts     # SECTIONS + GAMES registry, helper functions
    counting.ts   # Counting game (1-9) item generator
    countingHigher.ts   # Counting Higher (10-20) item generator
    countingBackwards.ts # Counting Backwards (9-1) item generator
    numberWords.ts      # Number Words item generator
  hooks/          # Custom React hooks
    useStats.ts       # Global play/completion tracking via localStorage
    useProgress.ts    # Per-game star ratings + section unlocking via localStorage
    useSpeech.ts      # Text-to-speech via Web Speech API
    useSoundEffects.ts # Sound effects via Web Audio API
  pages/          # Full-screen views (routed to from App.tsx)
    HomeScreen.tsx    # Vertical path with sections and game nodes
    GameScreen.tsx    # Core game loop: all game types
  components/     # Reusable and game-specific components
    ui/           # Generic reusable UI primitives
      BackButton.tsx
      Button.tsx
      GameCard.tsx
      PathNode.tsx       # Circular game node for the vertical path
      ProgressBar.tsx
      ScoreBadge.tsx
      SectionBanner.tsx  # Section header with star progress
      StreakBadge.tsx
      Toggle.tsx
    Confetti.tsx          # Celebration particle effect
    CountingDisplay.tsx   # Counting game display (emoji grid)
    GameComplete.tsx      # End-of-game: stars, score, actions
    LetterDisplay.tsx     # Single-character display
    TimerBar.tsx          # Countdown timer for Speed Round
    WordDisplay.tsx       # Word display for Number Words game
  App.tsx         # Root component, game state, routing
  main.tsx        # React DOM entry point
  index.css       # Global styles, CSS variables, design tokens
```

Every `.tsx` component has a co-located `.css` file with the same name.

## Progression System

### Sections

Games are organized into sections (tiers) defined in `src/games/config.ts`:

| Section | Emoji | Stars to Unlock | Games |
|---------|-------|-----------------|-------|
| Basics | 🌱 | 0 (default) | ABCs, 123s, Counting |
| Next Steps | 🚀 | 5 | Lowercase, Count Higher, Number Words |
| Challenge | 🏆 | 10 | Mixed, Backwards, Speed Round |

### Star Ratings

Each game awards 1-3 stars based on accuracy:
- **3 stars**: 100% perfect (score === total)
- **2 stars**: 80%+ correct
- **1 star**: game completed (any score)

Only the best star rating per game is saved. Total stars across all games determines which sections are unlocked.

### Persistence

Two localStorage keys:
- `abc123-stats` — global counters (totalPlays, totalCompletions)
- `abc123-progress` — per-game star ratings `{ games: { [gameId]: { bestStars: number } } }`

## Pages vs Components

### Pages (`src/pages/`)

- `HomeScreen` — vertical path with section banners and game nodes, random toggle, stats
- `GameScreen` — core game loop handling all game types: standard, counting, numberWords, timed

### Components (`src/components/`)

#### `components/ui/` — Generic UI primitives

- `Button` — primary/secondary variants
- `Toggle` — on/off switch with label
- `ProgressBar` — horizontal fill bar
- `BackButton` — arrow icon button
- `ScoreBadge` — star + score number
- `StreakBadge` — fire emoji streak counter (auto-hides below 3)
- `GameCard` — clickable card (legacy, may be removed)
- `PathNode` — circular game node for the vertical path (emoji, title, 3 stars)
- `SectionBanner` — section header with title, emoji, star progress, lock state

#### `components/` — Game-specific components

- `LetterDisplay` — single large character with correct/wrong animations
- `CountingDisplay` — grid of emoji objects with pop-in animation
- `WordDisplay` — word display for Number Words game (auto-sizing font)
- `TimerBar` — countdown timer bar for Speed Round
- `GameComplete` — end-of-game: animated stars, score, new-best badge, action buttons
- `Confetti` — particle effect overlay

### Rules

1. **One exported component per file.** File name matches the component name.
2. **Pages import components, never the reverse.**
3. **UI components are game-agnostic.**
4. **Co-locate CSS.** Each `.tsx` gets a matching `.css` file.
5. **Types live in `src/types/`.** Shared interfaces and types go here.
6. **Game config lives in `src/games/`.** The registries and per-game logic go here.

## Type System

All types defined in `src/types/game.ts`:

- `GameConfig` = `StandardGameConfig | CountingGameConfig | NumberWordsGameConfig | TimedGameConfig`
- `GameItem` = `string | CountingItem | NumberWordItem`
- `FeedbackState` = `'correct' | 'wrong' | null`
- `Section` = `{ id, title, emoji, starsToUnlock }`
- `ProgressData` = `{ games: Record<string, GameProgress> }`

## How Games Work

### Standard games (ABCs, 123s, Lowercase, Mixed)

Display a single character via `LetterDisplay`. Player presses matching key. Defined with `items: string[]`.

### Counting games (Counting, Count Higher, Backwards)

Display emoji objects via `CountingDisplay`. Player presses the count. Uses `generateItems` function. Count Higher (10-20) uses multi-digit input with a digit buffer and 1.5s auto-submit timeout.

### Number Words

Display a word ("three") via `WordDisplay`. Player presses the digit key. Uses `generateItems` returning `NumberWordItem[]`.

### Timed (Speed Round)

Standard game with a `TimerBar` countdown. When timer expires, game ends with current score. Defined with `items: string[]` + `timeLimit: number`.

## Adding a New Game

1. Choose a game type (standard, counting, numberWords, timed) — or add a new type
2. If new type: add interfaces to `types/game.ts`, extend the `GameConfig` union, add display component
3. Add item generator to `src/games/` if needed
4. Add entry to `GAMES` array in `src/games/config.ts` with `id`, `sectionId`, and game-specific fields
5. Wire up display in `GameScreen.tsx` if new type

## Design Tokens

CSS variables in `src/index.css`:

`--green`, `--blue`, `--purple`, `--orange`, `--red`, `--yellow` — each with a `-dark` variant.

## Game Mechanics

- **Correct keypress**: green flash, pop animation, +1 score, advance after 400ms
- **Wrong keypress**: red flash, shake animation, streak resets
- **Input locking**: keyboard ignored during feedback animation
- **Multi-digit input**: for counts > 9, digit buffer with 1.5s auto-submit
- **Streak**: fire badge at 3+ consecutive correct
- **Completion**: star display (animated pop-in), confetti, score, new-best badge
- **Random toggle**: on home screen, applies to all games
- **Speech**: Web Speech API announces each item (letters, numbers, counting objects)
- **Sound effects**: Web Audio API chimes for correct/wrong/complete
