# Core Component Library — Design Spec

**Date:** 2026-04-20  
**Status:** Approved

## Overview

Introduce a `src/components/core/` primitive library — a thin, prop-driven abstraction layer over raw HTML elements. Every layout, text, and container pattern in the app routes through these primitives. Game-specific components own their logic and visual identity; core components own structure and spacing.

---

## Directory Structure

Each primitive lives in its own subdirectory with a co-located CSS file. A barrel `index.ts` provides clean imports.

```
src/components/core/
  core-box/
    CoreBox.tsx
    CoreBox.css
  core-row/
    CoreRow.tsx
    CoreRow.css
  core-col/
    CoreCol.tsx
    CoreCol.css
  core-text/
    CoreText.tsx
    CoreText.css
  core-pressable/
    CorePressable.tsx
    CorePressable.css
  core-screen/
    CoreScreen.tsx
    CoreScreen.css
  core-card/
    CoreCard.tsx
    CoreCard.css
  core-game-arena/
    CoreGameArena.tsx
    CoreGameArena.css
  core-scroll-view/
    CoreScrollView.tsx
    CoreScrollView.css
  core-spacer/
    CoreSpacer.tsx
    CoreSpacer.css
  index.ts
```

Usage anywhere in the app:
```ts
import { CoreRow, CoreText, CoreScreen } from '../components/core'
```

---

## CSS Convention

Each primitive's `.css` file carries **only the structural baseline** for that element (e.g. `display: flex; flex-direction: row`). All spacing and sizing values come exclusively from props → inline styles. CSS files use **BEM naming**: `core-row`, `core-row__inner`, `core-row--wrap`, etc.

---

## Shared Prop API

All layout primitives (`CoreBox`, `CoreRow`, `CoreCol`, `CoreScreen`, `CoreCard`, `CoreGameArena`, `CoreScrollView`) accept these shared spacing/sizing props:

```ts
padding?: number
paddingHorizontal?: number
paddingVertical?: number
paddingTop?: number
paddingBottom?: number
paddingLeft?: number
paddingRight?: number
margin?: number
marginHorizontal?: number
marginVertical?: number
gap?: number
width?: number | string
height?: number | string
flex?: number
borderRadius?: number
background?: string        // e.g. 'var(--bg-card)'
children?: React.ReactNode
className?: string         // appended to the block class, never replaces it
```

Prop → inline style resolution (shared utility):
- `padding` sets `padding: Npx`
- `paddingHorizontal` sets `paddingLeft` + `paddingRight`
- `paddingVertical` sets `paddingTop` + `paddingBottom`
- Individual sides override shorthands (last-wins)

---

## Primitive Specifications

### CoreBox
Generic container. No flex assumptions. Just a `div` (or swapped element) with shared props.

```ts
as?: 'div' | 'section' | 'article' | 'main' | 'nav'
```

CSS class: `core-box`

---

### CoreRow
Horizontal flex container.

```ts
align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
wrap?: boolean
```

CSS class: `core-row`, modifier `core-row--wrap`  
CSS baseline: `display: flex; flex-direction: row`

---

### CoreCol
Vertical flex container.

```ts
align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
```

CSS class: `core-col`  
CSS baseline: `display: flex; flex-direction: column`

---

### CoreText
Unified text primitive. Replaces ad-hoc `h1`–`h6`, `p`, `span`.

```ts
as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'label'
variant?: 'heading' | 'subheading' | 'body' | 'muted' | 'label'
size?: number           // override font-size in px
weight?: number         // override font-weight
color?: string          // CSS value or var()
align?: 'left' | 'center' | 'right'
```

CSS class: `core-text`, variant modifiers e.g. `core-text--heading`, `core-text--muted`  
Variants map to the design token scale defined in `index.css`.

---

### CorePressable
Clickable container for non-semantic interactive wrappers (not a `<button>`).

```ts
onClick?: () => void
disabled?: boolean
```

CSS class: `core-pressable`, modifier `core-pressable--disabled`  
Handles `cursor: pointer`, `user-select: none`, disabled pointer-events.

---

### CoreScreen
Full-height page shell. Replaces the `.game-shell` pattern.

```ts
center?: boolean    // adds align-items: center
```

CSS class: `core-screen`, modifier `core-screen--center`  
CSS baseline: `display: flex; flex-direction: column; min-height: 100dvh; background: var(--bg); color: var(--text)`

---

### CoreCard
Styled panel with `bg-card` background, border, and border-radius. Replaces repeated card patterns.

```ts
// shared props only — card look is fully CSS-driven
```

CSS class: `core-card`  
CSS baseline: `background: var(--bg-card); border: 3px solid var(--bg-light); border-radius: 20px`

---

### CoreGameArena
Replaces `.game-arena` exactly: `flex: 1`, `bg-card`, margin, rounded, bordered, `overflow: hidden`.

```ts
// shared spacing props for overrides
```

CSS class: `core-game-arena`

---

### CoreScrollView
Scrollable container.

```ts
horizontal?: boolean    // scrolls horizontally; default is vertical
```

CSS class: `core-scroll-view`, modifier `core-scroll-view--horizontal`

---

### CoreSpacer
Flexible empty spacer.

```ts
size?: number    // fixed px (width or height); omit for flex: 1
```

CSS class: `core-spacer`

---

## BEM Convention

All core component CSS files follow BEM:
- Block: `core-box`, `core-row`, `core-text`, etc.
- Element: `core-card__header`, `core-game-arena__inner`
- Modifier: `core-row--wrap`, `core-text--muted`, `core-screen--center`

All other components in the app (`PathNode`, `SectionBanner`, `GameComplete`, etc.) should also adopt BEM for any new or refactored CSS, following the same pattern.

---

## Refactor Scope

### Full refactor
- `HomeScreen`, `GameScreen`, `GameComplete`
- `SectionBanner`, `PathNode`, `GameTopbar`
- All game display components: `LetterDisplay`, `CountingDisplay`, `WordDisplay`, `AnimalDisplay`, `ColorDisplay`, `NumberBlanksDisplay`, `WhichMoreDisplay`, `WhatNextDisplay`, `ClockBlanksDisplay`, `HearPressDisplay`
- All page screens: `TicTacToeScreen`, `SimonSaysScreen`, `DinoGameScreen`, `FroggerScreen`, `ChaseBallScreen`, `ClickCircleScreen`, `ClickLetterScreen`, `FollowArrowScreen`, `MouseDirectionScreen`, `MiniGameScreen`, `BonusScreen`

### Partial refactor
- `GamePreviewModal`, `SettingsModal` — outer shell becomes `CoreCard`/`CoreCol`; internals stay as-is

### Leave alone
- `Confetti` — purely animation, no layout primitives
- `src/index.css` — keep CSS variables and animations; prune deprecated classes after all consumers are migrated
- All hooks — untouched

### Migration strategy
Build the entire core library first. Then refactor file-by-file, running `npm run type-check` after each file. No big-bang rewrite.

---

## Documentation

### AGENTS.md (project root)
Create `AGENTS.md` with a **Core Components** section instructing all AI agents to:
- Use `src/components/core/` primitives for all layout, text, and containers
- Never introduce new ad-hoc flex wrappers when `CoreRow`/`CoreCol` covers it
- Never write inline `style` for padding/gap directly on non-core components — pass those props to core primitives instead
- Follow BEM naming in all CSS files

### CLAUDE.md
Add a note pointing to `AGENTS.md` for the core components convention.
