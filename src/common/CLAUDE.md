# Common — Shared Hooks, Types, and Components

Code used by more than one page lives here. Import via aliases:

```ts
import { useProgress } from '@hooks/useProgress'
import type { GameConfig } from '@common/types/game'
import { GameShell } from '@common/components/GameShell/GameShell'
```

## Structure

```
common/
  components/   # UI components used by 2+ pages
  hooks/        # Custom React hooks
  types/        # Shared TypeScript types
```

## Boundary rules

- **Hooks** must not import from `@common/components` or `@pages`.
- **Components** must not import from `@pages`.
- Neither hooks nor components belong here if they're only used by one page — move them into `pages/XX/components/` instead.

## components/

Each component gets its own subdirectory with co-located CSS and test/story files:

```
components/
  Button/
    Button.tsx
    Button.css
  GameShell/
    GameShell.tsx       # no CSS — layout via CoreScreen
```

One exported component per file. File name matches component name.

## hooks/

Custom hooks that encapsulate reusable stateful logic:

| Hook               | Purpose                                                    |
| ------------------ | ---------------------------------------------------------- |
| `useProgress`      | Per-game star ratings + section unlocking via localStorage |
| `useStats`         | Global play/completion tracking via localStorage           |
| `useSpeech`        | Text-to-speech via Web Speech API                          |
| `useSoundEffects`  | Sound effects via Web Audio API                            |
| `useKeyInput`      | Global keydown listener with stable handler ref            |
| `useRound`         | Round progression (items, score, streak, completion)       |
| `usePhysicsObject` | RAF-based physics for bounce/catch games                   |

Test files live alongside the hook they test: `useProgress.test.ts` next to `useProgress.ts`.

## types/

`game.ts` is the single source of truth for all game-related TypeScript types:

- `GameConfig` union type (Standard | Counting | NumberWords | Timed | ...)
- `GameItem`, `FeedbackState`, `Section`, `ProgressData`
