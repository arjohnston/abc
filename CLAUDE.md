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
- `npm run test` — run all tests (unit + Storybook/Playwright)
- `npm run test:coverage` — run with coverage report
- `npm run storybook` — start Storybook dev server
- `npm run knip` — dead code detection
- `npm run preview` — preview production build

## Project Structure

```
src/
  core/           # Core component library — see src/core/CLAUDE.md
  common/         # Shared hooks, types, components — see src/common/CLAUDE.md
  games/          # Game config and pure logic — see src/games/CLAUDE.md
  pages/          # Full-screen views — see src/pages/CLAUDE.md
  App.tsx         # Root: routing, game state, registries
  main.tsx        # React DOM entry + ErrorBoundary
  index.css       # Global styles and CSS variables
```

## Path Aliases

```ts
@core           → src/core/index.ts
@common         → src/common/
@common/hooks/* → src/common/hooks/*
@common/types/* → src/common/types/*
@games          → src/games/
@hooks          → src/common/hooks/   (shorthand)
@pages          → src/pages/
```

## Subdirectory CLAUDE.md files

Each major directory has its own CLAUDE.md with detailed rules:

- [`src/core/CLAUDE.md`](src/core/CLAUDE.md) — core primitive API, tokens, rules
- [`src/common/CLAUDE.md`](src/common/CLAUDE.md) — shared hooks, components, types
- [`src/games/CLAUDE.md`](src/games/CLAUDE.md) — game config, item generators, adding games
- [`src/pages/CLAUDE.md`](src/pages/CLAUDE.md) — page structure, arcade screens, boundaries

## Design Tokens

CSS variables in `src/index.css`: `--green`, `--blue`, `--purple`, `--orange`, `--red`, `--yellow` — each with a `-dark` variant.

## Conventions

- **One exported component per file.** File name matches component name.
- **Co-locate CSS.** Each `.tsx` gets a matching `.css` file in the same directory.
- **Tests alongside source.** `Foo.test.ts` sits next to `Foo.ts`, not in `__tests__/`.
- **Stories alongside component.** `Foo.stories.tsx` sits next to `Foo.tsx`.
- **BEM CSS naming.** `.block__element--modifier` convention throughout.
- **No raw `<div>`/`<span>` for layout.** Use `@core` primitives.

## Progression System

Games → Sections → Stars:

- **3 stars**: 100% score | **2 stars**: ≥80% | **1 star**: completed
- localStorage keys: `abc123-stats` (global counters), `abc123-progress` (per-game stars)
- Section unlock thresholds defined in `src/games/config.ts`
