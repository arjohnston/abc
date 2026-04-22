# Core System Refactor — Design Spec
**Date:** 2026-04-21  
**Status:** Approved

## Overview

Refactor the `src/components/core/` library to adopt six patterns from the Fuel design system (Convoy). The goal is an extensible, scalable platform with typed design tokens, consistent component APIs, and full primitive coverage across the app.

---

## Patterns Being Adopted

| # | Pattern | Scope |
|---|---------|-------|
| 1 | TypeScript spacing/color/typography token exports | New `tokens/` directory |
| 2 | `forwardRef` on all core components | All 4 existing + 5 new components |
| 3 | Compound components via `Object.assign` | CoreCard (Header/Body/Footer) + wherever it makes sense |
| 4 | `RemapProps` utility type | CoreText, CorePressable |
| 5 | Mutually exclusive prop validation (dev-only warnings) | Any component with conflicting prop combos |
| 6 | Design token TS exports (raw hex/values) | `tokens/colors.ts`, `tokens/spacing.ts`, `tokens/typography.ts` |

---

## Phase 1: Token Layer

**New directory:** `src/components/core/tokens/`

### `spacing.ts`
8px-grid constants. Props still accept `number` — tokens are optional named aliases.

```ts
export const Spacing = {
  xxs: 4,
  xs:  8,
  sm:  12,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const
export type SpacingValue = typeof Spacing[keyof typeof Spacing]
```

### `colors.ts`
Raw hex values mirroring every CSS variable in `src/index.css`. Used for JS-side logic (e.g., generating dynamic styles, charts, canvas).

```ts
export const Colors = {
  green:     '#58cc02',   greenDark:  '#46a302',
  blue:      '#1cb0f6',   blueDark:   '#1899d6',
  purple:    '#ce82ff',   purpleDark: '#a855f7',
  orange:    '#ff9600',   orangeDark: '#e08600',
  red:       '#ff4b4b',   redDark:    '#ea2b2b',
  yellow:    '#ffc800',   yellowDark: '#e0b000',
  bg:        '#131f24',
  bgCard:    '#1a2c33',
  bgLight:   '#235264',
  text:      '#ffffff',
  textMuted: '#96b0bc',
} as const
export type ColorToken = keyof typeof Colors
```

### `typography.ts`
Font size and weight scales matching CoreText CSS values.

```ts
export const FontSize = {
  h1:   'clamp(2.5rem, 7vw, 4.5rem)',
  h2:   'clamp(1.4rem, 4vw, 2rem)',
  h3:   'clamp(1rem, 3vw, 1.5rem)',
  body: '1rem',
  sm:   '0.9rem',
} as const

export const FontWeight = {
  regular:  400,
  semibold: 600,
  bold:     700,
  black:    900,
} as const
```

### `index.ts`
```ts
export { Spacing } from './spacing'
export type { SpacingValue } from './spacing'
export { Colors } from './colors'
export type { ColorToken } from './colors'
export { FontSize, FontWeight } from './typography'
```

Tokens re-exported from `@core` barrel alongside components.

---

## Phase 2: Utility Layer

**New directory:** `src/components/core/utils/`

### `types.ts` — RemapProps
Allows a component to rename a conflicting native HTML prop without losing the underlying functionality.

```ts
type ValueOf<T> = T[keyof T]

export type RemapProps<TProps, TMap extends Record<string, keyof TProps>> =
  Omit<TProps, ValueOf<TMap>> & {
    [TKey in keyof TMap]?: TProps[TMap[TKey]]
  }
```

**Applied to:**
- `CorePressable` — renames native `type` → `htmlType` to avoid shadowing the button attribute
- `CoreText` — not a rename case, but props are extended to pass through native HTML attributes (`id`, `aria-label`, `data-*`)

### `validation.ts` — Mutually Exclusive Prop Warning
Dev-only runtime warning. Strips to a no-op in production.

```ts
export function warnMutuallyExclusive(
  componentName: string,
  props: Record<string, unknown>,
  ...groups: string[][]
): void {
  if (process.env.NODE_ENV === 'production') return
  for (const group of groups) {
    const defined = group.filter(k => props[k] !== undefined)
    if (defined.length > 1)
      console.warn(`[${componentName}] Props "${defined.join('" and "')}" are mutually exclusive.`)
  }
}
```

**Applied to:**
- `CorePressable` — warns if `disabled` is set without `onClick`

### `index.ts`
```ts
export type { RemapProps } from './types'
export { warnMutuallyExclusive } from './validation'
```

`shared/spacing.ts` remains in place — it's layout plumbing, not tokens or utilities.

---

## Phase 3: Retrofit Existing Components

All four existing components get `forwardRef`. No callsite changes required.

### CoreText
- Add `forwardRef<HTMLElement>`
- Extend props to accept `React.HTMLAttributes<HTMLElement>` for passthrough (`id`, `aria-label`, `data-*`, etc.)
- Fix: the dynamic tag renders `h1`–`p`/`span` — ref type is `HTMLElement` (common base)

### CoreRow / CoreCol
- `forwardRef<HTMLDivElement>`
- Forward ref to root `<div>`

### CoreScreen
- `forwardRef<HTMLDivElement>`
- Forward ref to root `<div>`

### `shared/spacing.ts` fix
- Add `marginLeft?: number` and `marginRight?: number` to `SharedLayoutProps` interface (they are already handled in `buildSpacingStyle` but missing from the type)

---

## Phase 4: Five New Components

### CoreBox
**Purpose:** Generic block container. Satisfies the "never use raw div" rule for non-flex wrappers.  
**When to use:** Semantic wrappers (`<section>`, `<article>`, `<main>`) or any non-flex container that needs spacing props.  
**When NOT to use:** When you need flex layout — use `CoreRow` or `CoreCol` instead.

```ts
interface CoreBoxProps extends SharedLayoutProps {
  as?: React.ElementType  // defaults to 'div'
}
```

- `forwardRef<HTMLElement>`
- CSS: `.core-box { display: block }`
- No compound sub-parts

---

### CoreCard
**Purpose:** Styled panel — `bg-card` background, border, rounded corners.  
**When to use:** Any visually distinct content panel: game cards, settings panels, info sections.  
**When NOT to use:** As a layout wrapper with no visual identity — use `CoreBox` or `CoreCol` instead.

```ts
interface CoreCardProps extends SharedLayoutProps {
  as?: React.ElementType  // defaults to 'div'
}
```

**Compound sub-parts:**
- `CoreCard.Header` — bottom border separator, typically holds a title row
- `CoreCard.Body` — padded content area (default padding: `Spacing.lg`)
- `CoreCard.Footer` — top border separator, typically holds action buttons

All sub-parts extend `SharedLayoutProps` and have `forwardRef`.

```tsx
<CoreCard>
  <CoreCard.Header padding={Spacing.md}>
    <CoreText size="h3">Title</CoreText>
  </CoreCard.Header>
  <CoreCard.Body>
    <CoreText>Content here</CoreText>
  </CoreCard.Body>
  <CoreCard.Footer padding={Spacing.md}>
    <Button>Action</Button>
  </CoreCard.Footer>
</CoreCard>
```

CSS:
```css
.core-card { background: var(--bg-card); border-radius: 16px; border: 2px solid rgba(255,255,255,0.08); }
.core-card__header { border-bottom: 1px solid rgba(255,255,255,0.08); }
.core-card__footer { border-top: 1px solid rgba(255,255,255,0.08); }
.core-card__body { padding: 24px; }
```

---

### CorePressable
**Purpose:** Clickable non-semantic wrapper that renders as a `<button>`.  
**When to use:** Any clickable container that isn't a text button: game nodes, cards, nav items.  
**When NOT to use:** When you need a styled button with a label — use `Button` instead.

```ts
type NativeButtonProps = React.ComponentProps<'button'>
type CorePressableProps = RemapProps<NativeButtonProps, { htmlType: 'type' }> &
  SharedLayoutProps & {
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
    htmlType?: 'button' | 'submit' | 'reset'  // remapped from native 'type'
    'aria-label'?: string
  }
```

- `forwardRef<HTMLButtonElement>`
- CSS: `.core-pressable { background: none; border: none; cursor: pointer; padding: 0; text-align: inherit; color: inherit; }`
- Validation: `warnMutuallyExclusive` warns if `disabled` is `true` without `onClick`
- Default `htmlType="button"` to prevent accidental form submission

---

### CoreGameArena
**Purpose:** The game content area — visual container for the play space in every game.  
**When to use:** Exactly once per game screen, wrapping the display component and keyboard.  
**When NOT to use:** As a general panel — use `CoreCard` for non-game content.

```ts
interface CoreGameArenaProps extends SharedLayoutProps {}
```

- `forwardRef<HTMLDivElement>`
- CSS:
```css
.core-game-arena {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 3px solid rgba(255,255,255,0.1);
  border-radius: 20px;
}
```
- No compound sub-parts — single-purpose container

---

### CoreScrollView
**Purpose:** Scrollable container with consistent overflow handling.  
**When to use:** Any content area that may overflow its container: HomeScreen path, long lists.  
**When NOT to use:** When the parent already handles scroll or content is always in-viewport.

```ts
interface CoreScrollViewProps extends SharedLayoutProps {
  horizontal?: boolean  // scrolls horizontally; default is vertical
}
```

- `forwardRef<HTMLDivElement>`
- CSS:
```css
.core-scroll-view { overflow-y: auto; overflow-x: hidden; }
.core-scroll-view--horizontal { overflow-x: auto; overflow-y: hidden; white-space: nowrap; }
```

---

## Phase 5: App-wide Callsite Sweep

**Spacing tokens** — replace hardcoded numbers with `Spacing.*` constants where the value matches the scale exactly (`8`, `12`, `16`, `24`, `32`, `48`). Values that don't map (e.g., `20`) stay as raw numbers — no forced fit.

**New component adoption:**
| Component | Replaces |
|-----------|----------|
| `CorePressable` | Clickable `<div>` wrappers in `PathNode`, `GameCard`, `SectionBanner` |
| `CoreCard` | Styled panel patterns on HomeScreen |
| `CoreScrollView` | HomeScreen vertical path scroll container |
| `CoreGameArena` | Game content area `CoreCol` in `GameScreen` |
| `CoreBox` | Any remaining raw `<div>`/`<section>`/`<article>` that isn't flex layout |

**Rules:**
- Only migrate existing usage where the new component is a clear fit
- Do not refactor components that already work correctly just to introduce a primitive
- Run `npm run type-check` after the sweep; fix all errors before marking done

---

## Phase 6: AGENTS.md Overhaul

Full rewrite covering:

1. **Token usage guide** — when and how to use `Spacing`, `Colors`, `FontWeight` with examples
2. **Per-component reference** — for each of the 9 primitives:
   - What it is and when to use it
   - When NOT to use it (critical for agents to avoid misuse)
   - Full prop table
   - Usage examples including compound sub-parts where applicable
3. **Pattern guides:**
   - `forwardRef` — how to access refs on core components
   - `RemapProps` — what it solves, where it's applied, how to extend it
   - Mutually exclusive validation — which components warn and on what
4. **Updated rules table** — all 9 components (CoreSpacer removed)

---

## File Structure After Refactor

```
src/components/core/
├── index.ts                          # Barrel: all components + tokens + types
├── tokens/
│   ├── spacing.ts                    # Spacing constants
│   ├── colors.ts                     # Color hex values
│   ├── typography.ts                 # FontSize + FontWeight
│   └── index.ts
├── utils/
│   ├── types.ts                      # RemapProps
│   ├── validation.ts                 # warnMutuallyExclusive
│   └── index.ts
├── shared/
│   └── spacing.ts                    # SharedLayoutProps + buildSpacingStyle (unchanged)
├── core-text/
│   ├── CoreText.tsx                  # + forwardRef, HTML attr passthrough
│   └── CoreText.css
├── core-row/
│   ├── CoreRow.tsx                   # + forwardRef
│   └── CoreRow.css
├── core-col/
│   ├── CoreCol.tsx                   # + forwardRef
│   └── CoreCol.css
├── core-screen/
│   ├── CoreScreen.tsx                # + forwardRef
│   └── CoreScreen.css
├── core-box/
│   ├── CoreBox.tsx                   # NEW
│   └── CoreBox.css
├── core-card/
│   ├── CoreCard.tsx                  # NEW — compound (Header, Body, Footer)
│   └── CoreCard.css
├── core-pressable/
│   ├── CorePressable.tsx             # NEW — RemapProps, validation
│   └── CorePressable.css
├── core-game-arena/
│   ├── CoreGameArena.tsx             # NEW
│   └── CoreGameArena.css
└── core-scroll-view/
    ├── CoreScrollView.tsx            # NEW
    └── CoreScrollView.css
```

---

## Success Criteria

- [ ] All 9 core components exported from `@core`
- [ ] All components have `forwardRef`
- [ ] `Spacing`, `Colors`, `FontSize`, `FontWeight` exported from `@core`
- [ ] `RemapProps` applied to CoreText and CorePressable
- [ ] `warnMutuallyExclusive` applied to CorePressable
- [ ] All app callsites use `Spacing.*` tokens where scale matches
- [ ] New components adopted at all appropriate callsites
- [ ] `npm run type-check` passes with zero errors
- [ ] AGENTS.md fully rewritten with per-component docs and pattern guides
