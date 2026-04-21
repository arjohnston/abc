# Core Component Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 10-primitive prop-driven core component library in `src/components/core/`, document it in `AGENTS.md` and `CLAUDE.md`, then validate the pattern by refactoring `GameComplete` as the first consumer.

**Architecture:** A shared spacing utility converts prop values to inline styles. Each primitive's CSS file carries only the structural baseline (display, flex-direction). Props drive all spacing and sizing. Game-specific components keep their own CSS for visual identity — they just swap raw divs for core primitives.

**Tech Stack:** TypeScript (strict), React 19, plain CSS (BEM), Vite. No test framework — verification is `source ~/.nvm/nvm.sh && npm run type-check`.

---

## File Map

**Create:**
- `src/components/core/shared/spacing.ts` — shared prop types + `buildSpacingStyle` utility
- `src/components/core/core-box/CoreBox.tsx` + `CoreBox.css`
- `src/components/core/core-row/CoreRow.tsx` + `CoreRow.css`
- `src/components/core/core-col/CoreCol.tsx` + `CoreCol.css`
- `src/components/core/core-text/CoreText.tsx` + `CoreText.css`
- `src/components/core/core-pressable/CorePressable.tsx` + `CorePressable.css`
- `src/components/core/core-screen/CoreScreen.tsx` + `CoreScreen.css`
- `src/components/core/core-card/CoreCard.tsx` + `CoreCard.css`
- `src/components/core/core-game-arena/CoreGameArena.tsx` + `CoreGameArena.css`
- `src/components/core/core-scroll-view/CoreScrollView.tsx` + `CoreScrollView.css`
- `src/components/core/core-spacer/CoreSpacer.tsx` + `CoreSpacer.css`
- `src/components/core/index.ts` — barrel export
- `AGENTS.md` — agent-facing codebase guide

**Modify:**
- `CLAUDE.md` — add Core Component Library section
- `src/components/GameComplete.tsx` — refactor to use core primitives
- `src/components/GameComplete.css` — remove layout declarations now owned by core

---

## Task 1: Shared spacing utility

**Files:**
- Create: `src/components/core/shared/spacing.ts`

- [ ] **Step 1: Create the spacing utility**

```ts
// src/components/core/shared/spacing.ts
import type React from 'react'

export interface SharedLayoutProps {
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
  marginTop?: number
  marginBottom?: number
  gap?: number
  width?: number | string
  height?: number | string
  flex?: number
  borderRadius?: number
  background?: string
  className?: string
  children?: React.ReactNode
}

export function buildSpacingStyle(props: SharedLayoutProps): React.CSSProperties {
  const s: React.CSSProperties = {}
  if (props.padding !== undefined) s.padding = props.padding
  if (props.paddingHorizontal !== undefined) { s.paddingLeft = props.paddingHorizontal; s.paddingRight = props.paddingHorizontal }
  if (props.paddingVertical !== undefined) { s.paddingTop = props.paddingVertical; s.paddingBottom = props.paddingVertical }
  if (props.paddingTop !== undefined) s.paddingTop = props.paddingTop
  if (props.paddingBottom !== undefined) s.paddingBottom = props.paddingBottom
  if (props.paddingLeft !== undefined) s.paddingLeft = props.paddingLeft
  if (props.paddingRight !== undefined) s.paddingRight = props.paddingRight
  if (props.margin !== undefined) s.margin = props.margin
  if (props.marginHorizontal !== undefined) { s.marginLeft = props.marginHorizontal; s.marginRight = props.marginHorizontal }
  if (props.marginVertical !== undefined) { s.marginTop = props.marginVertical; s.marginBottom = props.marginVertical }
  if (props.marginTop !== undefined) s.marginTop = props.marginTop
  if (props.marginBottom !== undefined) s.marginBottom = props.marginBottom
  if (props.gap !== undefined) s.gap = props.gap
  if (props.width !== undefined) s.width = props.width
  if (props.height !== undefined) s.height = props.height
  if (props.flex !== undefined) s.flex = props.flex
  if (props.borderRadius !== undefined) s.borderRadius = props.borderRadius
  if (props.background !== undefined) s.background = props.background
  return s
}
```

- [ ] **Step 2: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/core/shared/spacing.ts
git commit -m "feat: add shared spacing utility for core primitives"
```

---

## Task 2: CoreBox

**Files:**
- Create: `src/components/core/core-box/CoreBox.tsx`
- Create: `src/components/core/core-box/CoreBox.css`

- [ ] **Step 1: Create CoreBox.css**

```css
/* src/components/core/core-box/CoreBox.css */
.core-box {
  box-sizing: border-box;
}
```

- [ ] **Step 2: Create CoreBox.tsx**

```tsx
// src/components/core/core-box/CoreBox.tsx
import './CoreBox.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CoreBoxProps extends SharedLayoutProps {
  as?: 'div' | 'section' | 'article' | 'main' | 'nav'
}

export function CoreBox({ as: Tag = 'div', className, children, ...rest }: CoreBoxProps) {
  return (
    <Tag
      className={['core-box', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/core/core-box/
git commit -m "feat: add CoreBox primitive"
```

---

## Task 3: CoreRow

**Files:**
- Create: `src/components/core/core-row/CoreRow.tsx`
- Create: `src/components/core/core-row/CoreRow.css`

- [ ] **Step 1: Create CoreRow.css**

```css
/* src/components/core/core-row/CoreRow.css */
.core-row {
  display: flex;
  flex-direction: row;
}

.core-row--wrap {
  flex-wrap: wrap;
}
```

- [ ] **Step 2: Create CoreRow.tsx**

```tsx
// src/components/core/core-row/CoreRow.tsx
import './CoreRow.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CoreRowProps extends SharedLayoutProps {
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  wrap?: boolean
}

export function CoreRow({ align, justify, wrap, className, children, ...rest }: CoreRowProps) {
  return (
    <div
      className={['core-row', wrap && 'core-row--wrap', className].filter(Boolean).join(' ')}
      style={{ alignItems: align, justifyContent: justify, ...buildSpacingStyle(rest) }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/core/core-row/
git commit -m "feat: add CoreRow primitive"
```

---

## Task 4: CoreCol

**Files:**
- Create: `src/components/core/core-col/CoreCol.tsx`
- Create: `src/components/core/core-col/CoreCol.css`

- [ ] **Step 1: Create CoreCol.css**

```css
/* src/components/core/core-col/CoreCol.css */
.core-col {
  display: flex;
  flex-direction: column;
}
```

- [ ] **Step 2: Create CoreCol.tsx**

```tsx
// src/components/core/core-col/CoreCol.tsx
import './CoreCol.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CoreColProps extends SharedLayoutProps {
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
}

export function CoreCol({ align, justify, className, children, ...rest }: CoreColProps) {
  return (
    <div
      className={['core-col', className].filter(Boolean).join(' ')}
      style={{ alignItems: align, justifyContent: justify, ...buildSpacingStyle(rest) }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/core/core-col/
git commit -m "feat: add CoreCol primitive"
```

---

## Task 5: CoreText

**Files:**
- Create: `src/components/core/core-text/CoreText.tsx`
- Create: `src/components/core/core-text/CoreText.css`

- [ ] **Step 1: Create CoreText.css**

```css
/* src/components/core/core-text/CoreText.css */
.core-text {
  font-family: var(--font);
  margin: 0;
}

.core-text--heading {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 800;
  color: var(--text);
}

.core-text--subheading {
  font-size: clamp(1.1rem, 3vw, 1.6rem);
  font-weight: 700;
  color: var(--text);
}

.core-text--body {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text);
}

.core-text--muted {
  font-size: clamp(1rem, 3vw, 1.4rem);
  font-weight: 600;
  color: var(--text-muted);
}

.core-text--label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
}
```

- [ ] **Step 2: Create CoreText.tsx**

```tsx
// src/components/core/core-text/CoreText.tsx
import './CoreText.css'

interface CoreTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'label'
  variant?: 'heading' | 'subheading' | 'body' | 'muted' | 'label'
  size?: number
  weight?: number
  color?: string
  align?: 'left' | 'center' | 'right'
  className?: string
  children?: React.ReactNode
}

export function CoreText({ as: Tag = 'p', variant, size, weight, color, align, className, children }: CoreTextProps) {
  return (
    <Tag
      className={['core-text', variant && `core-text--${variant}`, className].filter(Boolean).join(' ')}
      style={{ fontSize: size, fontWeight: weight, color, textAlign: align }}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/core/core-text/
git commit -m "feat: add CoreText primitive"
```

---

## Task 6: CorePressable

**Files:**
- Create: `src/components/core/core-pressable/CorePressable.tsx`
- Create: `src/components/core/core-pressable/CorePressable.css`

- [ ] **Step 1: Create CorePressable.css**

```css
/* src/components/core/core-pressable/CorePressable.css */
.core-pressable {
  cursor: pointer;
  user-select: none;
}

.core-pressable--disabled {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.5;
}
```

- [ ] **Step 2: Create CorePressable.tsx**

```tsx
// src/components/core/core-pressable/CorePressable.tsx
import './CorePressable.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CorePressableProps extends SharedLayoutProps {
  onClick?: () => void
  disabled?: boolean
}

export function CorePressable({ onClick, disabled, className, children, ...rest }: CorePressableProps) {
  return (
    <div
      className={['core-pressable', disabled && 'core-pressable--disabled', className].filter(Boolean).join(' ')}
      onClick={disabled ? undefined : onClick}
      style={buildSpacingStyle(rest)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/core/core-pressable/
git commit -m "feat: add CorePressable primitive"
```

---

## Task 7: CoreScreen

**Files:**
- Create: `src/components/core/core-screen/CoreScreen.tsx`
- Create: `src/components/core/core-screen/CoreScreen.css`

- [ ] **Step 1: Create CoreScreen.css**

```css
/* src/components/core/core-screen/CoreScreen.css */
.core-screen {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--text);
}

.core-screen--center {
  align-items: center;
}
```

- [ ] **Step 2: Create CoreScreen.tsx**

```tsx
// src/components/core/core-screen/CoreScreen.tsx
import './CoreScreen.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CoreScreenProps extends SharedLayoutProps {
  center?: boolean
}

export function CoreScreen({ center, className, children, ...rest }: CoreScreenProps) {
  return (
    <div
      className={['core-screen', center && 'core-screen--center', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/core/core-screen/
git commit -m "feat: add CoreScreen primitive"
```

---

## Task 8: CoreCard

**Files:**
- Create: `src/components/core/core-card/CoreCard.tsx`
- Create: `src/components/core/core-card/CoreCard.css`

- [ ] **Step 1: Create CoreCard.css**

```css
/* src/components/core/core-card/CoreCard.css */
.core-card {
  background: var(--bg-card);
  border: 3px solid var(--bg-light);
  border-radius: 20px;
}
```

- [ ] **Step 2: Create CoreCard.tsx**

```tsx
// src/components/core/core-card/CoreCard.tsx
import './CoreCard.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export function CoreCard({ className, children, ...rest }: SharedLayoutProps) {
  return (
    <div
      className={['core-card', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/core/core-card/
git commit -m "feat: add CoreCard primitive"
```

---

## Task 9: CoreGameArena

**Files:**
- Create: `src/components/core/core-game-arena/CoreGameArena.tsx`
- Create: `src/components/core/core-game-arena/CoreGameArena.css`

- [ ] **Step 1: Create CoreGameArena.css**

```css
/* src/components/core/core-game-arena/CoreGameArena.css */
.core-game-arena {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
  margin: 8px 16px 16px;
  border-radius: 20px;
  border: 3px solid var(--bg-light);
  min-height: 300px;
}
```

- [ ] **Step 2: Create CoreGameArena.tsx**

```tsx
// src/components/core/core-game-arena/CoreGameArena.tsx
import './CoreGameArena.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export function CoreGameArena({ className, children, ...rest }: SharedLayoutProps) {
  return (
    <div
      className={['core-game-arena', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/core/core-game-arena/
git commit -m "feat: add CoreGameArena primitive"
```

---

## Task 10: CoreScrollView

**Files:**
- Create: `src/components/core/core-scroll-view/CoreScrollView.tsx`
- Create: `src/components/core/core-scroll-view/CoreScrollView.css`

- [ ] **Step 1: Create CoreScrollView.css**

```css
/* src/components/core/core-scroll-view/CoreScrollView.css */
.core-scroll-view {
  overflow-y: auto;
  overflow-x: hidden;
}

.core-scroll-view--horizontal {
  overflow-x: auto;
  overflow-y: hidden;
}
```

- [ ] **Step 2: Create CoreScrollView.tsx**

```tsx
// src/components/core/core-scroll-view/CoreScrollView.tsx
import './CoreScrollView.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CoreScrollViewProps extends SharedLayoutProps {
  horizontal?: boolean
}

export function CoreScrollView({ horizontal, className, children, ...rest }: CoreScrollViewProps) {
  return (
    <div
      className={['core-scroll-view', horizontal && 'core-scroll-view--horizontal', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/core/core-scroll-view/
git commit -m "feat: add CoreScrollView primitive"
```

---

## Task 11: CoreSpacer

**Files:**
- Create: `src/components/core/core-spacer/CoreSpacer.tsx`
- Create: `src/components/core/core-spacer/CoreSpacer.css`

- [ ] **Step 1: Create CoreSpacer.css**

```css
/* src/components/core/core-spacer/CoreSpacer.css */
.core-spacer {
  flex: 1;
}
```

- [ ] **Step 2: Create CoreSpacer.tsx**

```tsx
// src/components/core/core-spacer/CoreSpacer.tsx
import './CoreSpacer.css'

import type React from 'react'

interface CoreSpacerProps {
  size?: number
}

export function CoreSpacer({ size }: CoreSpacerProps) {
  const style: React.CSSProperties = size !== undefined
    ? { width: size, height: size, flex: 'none' }
    : {}
  return <div className="core-spacer" style={style} />
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/core/core-spacer/
git commit -m "feat: add CoreSpacer primitive"
```

---

## Task 12: Barrel export

**Files:**
- Create: `src/components/core/index.ts`

- [ ] **Step 1: Create barrel index.ts**

```ts
// src/components/core/index.ts
export { CoreBox } from './core-box/CoreBox'
export { CoreCard } from './core-card/CoreCard'
export { CoreCol } from './core-col/CoreCol'
export { CoreGameArena } from './core-game-arena/CoreGameArena'
export { CorePressable } from './core-pressable/CorePressable'
export { CoreRow } from './core-row/CoreRow'
export { CoreScreen } from './core-screen/CoreScreen'
export { CoreScrollView } from './core-scroll-view/CoreScrollView'
export { CoreSpacer } from './core-spacer/CoreSpacer'
export { CoreText } from './core-text/CoreText'
export type { SharedLayoutProps } from './shared/spacing'
```

- [ ] **Step 2: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/core/index.ts
git commit -m "feat: add barrel export for core component library"
```

---

## Task 13: AGENTS.md and CLAUDE.md update

**Files:**
- Create: `AGENTS.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Create AGENTS.md**

```markdown
# AGENTS.md — ABC 123 Codebase Guide

This file instructs AI agents working in this codebase. Read it fully before making any changes.

## Core Component Library

All layout, text, and container primitives live in `src/components/core/`. Always import from the barrel:

```ts
import { CoreRow, CoreCol, CoreText, CoreScreen } from '../components/core'
```

### Rules

1. **Never use a raw `div` or `span` for layout.** Use `CoreRow`, `CoreCol`, or `CoreBox` instead.
2. **Never use raw `h1`–`h6`, `p`, or `span` for text content.** Use `CoreText` with an `as` prop.
3. **Never write inline `style` for padding, gap, or margin on non-core components.** Pass those props to the core primitive that wraps the content.
4. **Never introduce a new flex wrapper div.** Use `CoreRow` or `CoreCol`.
5. **Follow BEM naming** in all CSS files: `block`, `block__element`, `block--modifier`.

### Primitives

| Primitive | Purpose |
|-----------|---------|
| `CoreBox` | Generic container — no flex assumptions |
| `CoreRow` | Horizontal flex container |
| `CoreCol` | Vertical flex container |
| `CoreText` | All text: h1–h6, p, span |
| `CorePressable` | Clickable non-semantic wrapper |
| `CoreScreen` | Full-height page shell (replaces `.game-shell`) |
| `CoreCard` | Styled panel: bg-card + border + rounded corners |
| `CoreGameArena` | Game play area: flex-1, bordered, overflow hidden |
| `CoreScrollView` | Scrollable container |
| `CoreSpacer` | Flexible spacer (flex: 1) or fixed-size gap |

### Shared Props (all layout primitives)

```ts
padding?: number           paddingHorizontal?: number     paddingVertical?: number
paddingTop?: number        paddingBottom?: number          paddingLeft?: number
paddingRight?: number      margin?: number                 marginHorizontal?: number
marginVertical?: number    marginTop?: number              marginBottom?: number
gap?: number               width?: number | string         height?: number | string
flex?: number              borderRadius?: number           background?: string
className?: string         // appended to block class, never replaces it
children?: React.ReactNode
```

### CoreText Props

```ts
as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'label'
variant?: 'heading' | 'subheading' | 'body' | 'muted' | 'label'
size?: number      weight?: number      color?: string      align?: 'left' | 'center' | 'right'
```

### CoreRow / CoreCol Props

```ts
align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
wrap?: boolean  // CoreRow only
```

### CoreScreen Props

```ts
center?: boolean    // adds align-items: center
```

### CoreScrollView Props

```ts
horizontal?: boolean    // scrolls horizontally instead of vertically
```

### CoreSpacer Props

```ts
size?: number    // fixed px; omit for flex: 1
```

### Example — Before / After

```tsx
// Before
<div className="settings-modal">
  <h2 className="settings-modal__title">Settings</h2>
  <div style={{ display: 'flex', gap: 16 }}>
    <button onClick={onClose}>Close</button>
  </div>
</div>

// After
<CoreCard padding={24} className="settings-modal">
  <CoreText as="h2" variant="subheading" className="settings-modal__title">Settings</CoreText>
  <CoreRow gap={16}>
    <Button onClick={onClose}>Close</Button>
  </CoreRow>
</CoreCard>
```

## BEM Convention

All CSS in this project uses BEM:
- **Block:** `section-banner`, `path-node`, `game-complete`
- **Element:** `section-banner__title`, `path-node__stars`
- **Modifier:** `path-node--locked`, `core-row--wrap`

Never use descendant selectors (`.parent .child`) when a BEM element (`parent__child`) can express the relationship.
```

- [ ] **Step 2: Add Core Component Library section to CLAUDE.md**

Open `CLAUDE.md` and add this section after the `## Components` section (before `## Type System`):

```markdown
## Core Component Library

All layout, text, and containers route through `src/components/core/`. See `AGENTS.md` for the full API reference and rules.

Import from the barrel:

```ts
import { CoreRow, CoreCol, CoreText, CoreScreen } from '../components/core'
```

Never use raw `div`/`span`/`p` for layout or text — use the core primitives. Game-specific components keep their own CSS for visual identity; core primitives own structure and spacing.
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md CLAUDE.md
git commit -m "docs: add AGENTS.md core component guide; update CLAUDE.md"
```

---

## Task 14: Refactor GameComplete (first consumer)

This task validates the core library pattern by migrating the first real component.

**Files:**
- Modify: `src/components/GameComplete.tsx`
- Modify: `src/components/GameComplete.css`

- [ ] **Step 1: Replace GameComplete.tsx**

```tsx
// src/components/GameComplete.tsx
import './GameComplete.css'

import { CoreCol, CoreRow, CoreText } from './core'
import { Confetti } from './Confetti'
import { Button } from './ui/Button'

interface GameCompleteProps {
  score: number
  total: number
  stars: number
  isNewBest: boolean
  onRestart: () => void
  onHome: () => void
}

export function GameComplete({ score, total, stars, isNewBest, onRestart, onHome }: GameCompleteProps) {
  return (
    <>
      <Confetti />
      <CoreCol flex={1} align="center" justify="center" gap={12} padding={20} className="game-complete">
        <CoreRow gap={8} marginBottom={8} className="complete-stars">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`complete-star${i <= stars ? ' complete-star--earned' : ''}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              ★
            </span>
          ))}
        </CoreRow>
        {isNewBest && <div className="complete-new-best">New Best!</div>}
        <CoreText as="h2" className="complete-title">Amazing!</CoreText>
        <CoreText as="p" className="complete-score">
          You got <strong>{score}</strong> out of <strong>{total}</strong>!
        </CoreText>
        <CoreRow gap={16} marginTop={16}>
          <Button variant="primary" onClick={onRestart}>Play Again</Button>
          <Button variant="secondary" onClick={onHome}>Home</Button>
        </CoreRow>
      </CoreCol>
    </>
  )
}
```

- [ ] **Step 2: Update GameComplete.css — remove layout declarations now owned by core**

```css
/* src/components/GameComplete.css */
.game-complete {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.complete-star {
  font-size: 56px;
  color: var(--bg-light);
  opacity: 0;
  animation: starPop 0.4s ease forwards;
}

.complete-star--earned {
  color: var(--yellow);
}

@keyframes starPop {
  0% { opacity: 0; transform: scale(0) rotate(-20deg); }
  60% { transform: scale(1.3) rotate(5deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

.complete-new-best {
  font-size: 18px;
  font-weight: 800;
  color: var(--yellow);
  background: rgba(255, 200, 0, 0.15);
  padding: 4px 16px;
  border-radius: 8px;
  animation: fadeIn 0.5s ease 0.8s both;
}

.complete-title {
  font-size: 48px;
  font-weight: 900;
  color: var(--game-color);
}

.complete-score {
  font-size: 22px;
  color: var(--text-muted);
  font-weight: 700;
}

.complete-score strong {
  color: var(--text);
}
```

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/GameComplete.tsx src/components/GameComplete.css
git commit -m "refactor: migrate GameComplete to core primitives"
```

---

## Done

The core library is built, documented, and validated. The next step is **Plan 2: Full Refactor** which migrates all remaining components (`HomeScreen`, `GameScreen`, all display components, all page screens, and the modals) to use core primitives and adopts BEM throughout.
