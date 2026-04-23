# Games — Configuration and Logic

Pure game logic with no UI dependencies. Import via `@games`:

```ts
import { GAMES, SECTIONS, getGamesForSection } from '@games/config'
import { generateAdditionItems } from '@games/mathAdd/mathAdd'
```

## Boundary rule

Games must not import from `@pages`, `@common/components`, or `@hooks`. Only `@common/types` is allowed for type imports.

## Structure

Each game lives in its own subdirectory alongside its test:

```
games/
  config.ts            ← SECTIONS + GAMES registry
  utils/
    utils.ts
    utils.test.ts
  mathAdd/
    mathAdd.ts
    mathAdd.test.ts
  ...
```

| Directory       | Purpose                                                                |
| --------------- | ---------------------------------------------------------------------- |
| `config.ts`     | `SECTIONS` + `GAMES` registry, `MINI_GAMES`, `BONUS_GAMES`, helper fns |
| `mathAdd/`      | Addition item generator                                                |
| `mathSub/`      | Subtraction item generator                                             |
| `mathMost/`     | "Which is more?" item generator                                        |
| `buildNumber/`  | Build-a-number item generator                                          |
| `clock/`        | Clock-reading item generator                                           |
| `counting/`     | Counting item generator                                                |
| `whichMore/`    | Object comparison item generator                                       |
| `whatNext/`     | Pattern completion item generator                                      |
| `colorMatch/`   | Color matching item generator                                          |
| `animalSounds/` | Animal sound item generator                                            |
| `buildWord/`    | Word building item generator                                           |
| `utils/`        | Shared utilities (shuffle, etc.)                                       |

## Adding a new game

1. Add a subdirectory `src/games/yourGame/` with `yourGame.ts` (and `yourGame.test.ts`)
2. Add entry to `GAMES` array in `config.ts` with `id`, `sectionId`, and game-specific fields
3. If new game type: add interfaces to `src/common/types/game.ts`, extend `GameConfig` union
4. Wire up display in `src/pages/game/GameScreen.tsx` or add a new arcade screen under `src/pages/arcade/`
