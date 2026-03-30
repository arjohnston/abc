# ABC 123 - Toddler Learning Games

A React + Vite web app with fun, Duolingo-inspired keyboard games for toddlers. Dark theme with bright colors, chunky Nunito font, tactile 3D button effects, and celebratory animations.

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
    game.ts       # Game config types, item types, shared enums
  games/          # Game configuration and logic
    config.ts     # GAMES registry (add new games here)
    counting.ts   # Counting game item generator
  hooks/          # Custom React hooks
    useStats.ts   # Play/completion tracking via localStorage
  pages/          # Full-screen views (routed to from App.tsx)
    HomeScreen.tsx
    GameScreen.tsx
  components/     # Reusable and game-specific components
    ui/           # Generic reusable UI primitives
      BackButton.tsx
      Button.tsx
      GameCard.tsx
      ProgressBar.tsx
      ScoreBadge.tsx
      StreakBadge.tsx
      Toggle.tsx
    Confetti.tsx          # Celebration particle effect
    CountingDisplay.tsx   # Counting game display component
    GameComplete.tsx      # End-of-game score + actions screen
    LetterDisplay.tsx     # Standard game single-character display
  App.tsx         # Root component, game state, routing
  main.tsx        # React DOM entry point
  index.css       # Global styles, CSS variables, design tokens
```

Every `.tsx` component has a co-located `.css` file with the same name.

## Pages vs Components

### Pages (`src/pages/`)

Pages are **full-screen views** that represent a distinct screen in the app. They are composed of components and contain page-level layout and logic. The app routes between pages in `App.tsx`.

- `HomeScreen` — game selection grid with random/order toggle
- `GameScreen` — core game loop: sequence, keypress handling, scoring, progression

**When to create a new page**: when you need an entirely new screen (e.g., a settings page, a stats dashboard).

### Components (`src/components/`)

Components are **reusable building blocks** used by pages or other components. Each component is one function in one file.

#### `components/ui/` — Generic UI primitives

These are **fully reusable** across any page or context. They have no game-specific logic. They accept props for all customization.

- `Button` — primary/secondary variants, uses CSS variables for theming
- `Toggle` — on/off switch with label
- `ProgressBar` — horizontal fill bar (percent-based)
- `BackButton` — arrow icon button
- `ScoreBadge` — star + score number
- `StreakBadge` — fire emoji streak counter (auto-hides below 3)
- `GameCard` — clickable card for the home screen grid

**When to add a new UI component**: when you have a visual element used in 2+ places, or a self-contained element that would make a page file too large.

#### `components/` — Game-specific components

These are **display components** specific to a game type or shared game UI. They are not generic enough for `ui/` but are still isolated, single-responsibility components.

- `LetterDisplay` — shows a single large character with correct/wrong animations
- `CountingDisplay` — shows a grid of emoji objects with pop-in animation
- `GameComplete` — end-of-game celebration screen with score and action buttons
- `Confetti` — particle effect overlay

**When to add a game-specific component**: when adding a new game type that needs custom rendering (see "Adding a New Game" below).

### Rules

1. **One exported component per file.** File name matches the component name.
2. **Pages import components, never the reverse.** Components should not import from `pages/`.
3. **UI components are game-agnostic.** They should not import from `types/game.ts` except for prop typing. Exception: `GameCard` uses `GameConfig` for its props.
4. **Co-locate CSS.** Each `.tsx` gets a matching `.css` file in the same directory.
5. **Types live in `src/types/`.** Shared interfaces and types go here, not inline in components.
6. **Game config lives in `src/games/`.** The `GAMES` registry and per-game logic (item generators) go here.

## Type System

All game types are defined in `src/types/game.ts`:

- `GameConfig` = `StandardGameConfig | CountingGameConfig` (discriminated union on `type` field)
- `GameItem` = `string | CountingItem` (what the sequence contains)
- `FeedbackState` = `'correct' | 'wrong' | null`

When adding a new custom game type, extend the union:

```ts
// In src/types/game.ts
export interface MyNewItem {
  answer: string
  // ... custom fields
}

export interface MyNewGameConfig extends BaseGameConfig {
  type: 'myNewType'
  generateItems: (isRandom: boolean) => MyNewItem[]
}

export type GameConfig = StandardGameConfig | CountingGameConfig | MyNewGameConfig
export type GameItem = string | CountingItem | MyNewItem
```

## How Games Work

There are two game patterns:

### Standard games (ABCs, 123s)

Display a single character. Player presses matching key. Defined with a static `items` array in `src/games/config.ts`. `GameScreen` iterates through items (shuffled if random mode is on). Each item is a string; the expected keypress is `item.toUpperCase()`.

### Custom display games (Counting)

Games that need special rendering. Defined with a `type` discriminator and `generateItems` function. The game logic lives in a separate file under `src/games/` and the display component lives under `src/components/`.

## Adding a New Game

### Simple keypress game (like ABCs)

1. Add an entry to `GAMES` in `src/games/config.ts` with `items: string[]`
2. Optionally add a hint text branch in `GameScreen.tsx`'s `getHintText()`
3. Done — `LetterDisplay` and `GameScreen` handle everything else

### Custom display game (like Counting)

1. **Types**: Add item interface and game config interface to `src/types/game.ts`, extend the unions
2. **Logic**: Create `src/games/myGame.ts` with a `generateItems(isRandom: boolean)` function
3. **Config**: Add entry to `GAMES` in `src/games/config.ts` with `type` and `generateItems`
4. **Display**: Create `src/components/MyGameDisplay.tsx` + `.css`
5. **Wire up**: In `src/pages/GameScreen.tsx`:
   - Import the new display component
   - Add a branch in the render for `game.type === 'myNewType'`
   - Add a branch in `getExpectedKey()` if answer extraction differs
   - Add hint text in `getHintText()`

### Required game config fields

| Field | Type | Required for | Description |
|-------|------|-------------|-------------|
| `title` | `string` | All | Card title on home screen |
| `emoji` | `string` | All | Large emoji on the card |
| `description` | `string` | All | Subtitle on the card |
| `color` | `string` | All | CSS variable for primary color |
| `colorDark` | `string` | All | CSS variable for dark variant (3D border) |
| `items` | `string[]` | Standard | Array of single characters |
| `type` | `string` | Custom | Unique type identifier for discriminated union |
| `generateItems` | `function` | Custom | `(isRandom: boolean) => { answer: string, ... }[]` |

## Design Tokens

Color palette defined as CSS variables in `src/index.css`:

`--green`, `--blue`, `--purple`, `--orange`, `--red`, `--yellow` — each with a `-dark` variant for 3D button borders.

To add a new color: add both `--colorname` and `--colorname-dark` to `:root` in `src/index.css`.

## Game Mechanics

- **Correct keypress**: green border flash, scale pop animation, +1 score, advance after 400ms
- **Wrong keypress**: red border flash, horizontal shake animation, streak resets
- **Input locking**: all keyboard input is ignored while feedback animation is playing (prevents double-scoring on fast keypresses)
- **Streak**: fire badge at 3+ consecutive correct answers
- **Completion**: confetti animation, score summary, play again / home buttons
- **Random toggle**: on home screen, applies to all games. Standard games shuffle `items`; custom games pass `isRandom` to `generateItems`

## Persistence

Stats are stored in `localStorage` under the key `abc123-stats` via `src/hooks/useStats.ts`.

Tracked fields:
- `totalPlays` — incremented each time a game is started
- `totalCompletions` — incremented each time a game is finished

Stats are displayed on the home screen once at least one game has been played. Custom hooks live in `src/hooks/`.
