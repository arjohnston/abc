# Games — Configuration and Logic

Pure game logic with no UI dependencies. Import via `@games`:

```ts
import { GAMES, SECTIONS, getGamesForSection } from '@games/config'
import { generateAdditionItems } from '@games/mathAdd'
```

## Boundary rule

Games must not import from `@pages`, `@common/components`, or `@hooks`. Only `@common/types` is allowed for type imports.

## Files

| File              | Purpose                                                                |
| ----------------- | ---------------------------------------------------------------------- |
| `config.ts`       | `SECTIONS` + `GAMES` registry, `MINI_GAMES`, `BONUS_GAMES`, helper fns |
| `mathAdd.ts`      | Addition item generator                                                |
| `mathSub.ts`      | Subtraction item generator                                             |
| `mathMost.ts`     | "Which is more?" item generator                                        |
| `buildNumber.ts`  | Build-a-number item generator                                          |
| `clock.ts`        | Clock-reading item generator                                           |
| `counting.ts`     | Counting item generator                                                |
| `whichMore.ts`    | Object comparison item generator                                       |
| `whatNext.ts`     | Pattern completion item generator                                      |
| `colorMatch.ts`   | Color matching item generator                                          |
| `animalSounds.ts` | Animal sound item generator                                            |
| `buildWord.ts`    | Word building item generator                                           |
| `utils.ts`        | Shared utilities (shuffle, etc.)                                       |

## Tests

Test files live alongside the file they test: `mathAdd.test.ts` next to `mathAdd.ts`.

## Adding a new game

1. Add item generator in `src/games/yourGame.ts`
2. Add entry to `GAMES` array in `config.ts` with `id`, `sectionId`, and game-specific fields
3. If new game type: add interfaces to `src/common/types/game.ts`, extend `GameConfig` union
4. Wire up display in `src/pages/game/GameScreen.tsx` or add a new arcade screen under `src/pages/arcade/`
