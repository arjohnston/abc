# Full Core-Component Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every raw layout `div`/`span`/`h1-h6`/`p` with the appropriate `Core*` primitive across all remaining components and pages.

**Architecture:** Each component keeps its BEM CSS class (passed via `className` prop) for visual/non-layout styles; layout declarations (`display`, `flex-direction`, `align-items`, `justify-content`, `gap`, `padding`, `margin`) are removed from CSS and expressed as props on the core primitive instead. After all consumers migrate, deprecated global classes (`.game-shell`, `.game-arena`, `.game-instruction`) are pruned from `index.css`.

**Tech Stack:** React 19, TypeScript strict (tsgo), plain CSS, `src/components/core/` primitives.

---

## File Map

| File | Change |
|------|--------|
| `src/components/core/shared/spacing.ts` | Add `style?: React.CSSProperties` to SharedLayoutProps |
| `src/components/ColorDisplay.tsx` + `.css` | Outer div → CoreCol |
| `src/components/WhichMoreDisplay.tsx` + `.css` | Outer div → CoreRow |
| `src/components/WhatNextDisplay.tsx` + `.css` | Outer div → CoreRow |
| `src/components/NumberBlanksDisplay.tsx` + `.css` | Outer div → CoreCol |
| `src/components/ClockBlanksDisplay.tsx` + `.css` | Outer div → CoreCol |
| `src/components/ui/GameTopbar.tsx` + `.css` | Outer div → CoreRow |
| `src/components/ui/ScoreBadge.tsx` + `.css` | Outer div → CoreRow |
| `src/components/ui/SectionBanner.tsx` + `.css` | Outer div → CoreRow wrap |
| `src/components/SettingsModal.tsx` + `.css` | Inner layout divs → CoreRow / CoreCol |
| `src/components/GamePreviewModal.tsx` + `.css` | Inner layout divs → CoreRow / CoreCol |
| `src/pages/GameScreen.tsx` + `.css` | Outer div → CoreScreen; inner layout divs → CoreRow / CoreCol |
| `src/pages/HomeScreen.tsx` + `.css` | `stats-bar` div → CoreRow |
| `src/pages/BonusScreen.tsx` + `.css` | Outer div → CoreScreen; header div → CoreRow; title → CoreText |
| `src/pages/SimonSaysScreen.tsx` | Outer div.game-shell → CoreScreen |
| `src/pages/ChaseBallScreen.tsx` | Outer div.game-shell → CoreScreen |
| `src/pages/ClickLetterScreen.tsx` | Outer div.game-shell → CoreScreen |
| `src/pages/ClickCircleScreen.tsx` | Outer div.game-shell → CoreScreen (both render paths) |
| `src/pages/FollowArrowScreen.tsx` | Outer div.game-shell → CoreScreen |
| `src/pages/MouseDirectionScreen.tsx` | Outer div.game-shell → CoreScreen |
| `src/pages/FroggerScreen.tsx` | Outer div.game-shell → CoreScreen |
| `src/pages/TicTacToeScreen.tsx` + `.css` | Outer div.ttt → CoreScreen center |
| `src/pages/DinoGameScreen.tsx` + `.css` | Outer div.dino-game → CoreScreen center |
| `src/pages/MiniGameScreen.tsx` + `.css` | Outer div.mini-game → CoreScreen |
| `src/index.css` | Remove `.game-shell`, `.game-shell--center`, `.game-arena`, `.game-instruction` |

---

### Task 1: Add `style` prop to SharedLayoutProps

Needed so screens like `GameScreen` can set CSS custom properties (e.g. `--game-color`) via the core primitive.

**Files:**
- Modify: `src/components/core/shared/spacing.ts`

- [ ] **Step 1: Add `style` prop to SharedLayoutProps and apply it**

In `src/components/core/shared/spacing.ts`, add `style?: React.CSSProperties` to the interface and merge it into the returned style object:

```ts
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
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
}

export function buildSpacingStyle(props: SharedLayoutProps): React.CSSProperties {
  const style: React.CSSProperties = {}

  const pv = props.paddingVertical
  const ph = props.paddingHorizontal
  const pt = props.paddingTop ?? pv ?? props.padding
  const pb = props.paddingBottom ?? pv ?? props.padding
  const pl = props.paddingLeft ?? ph ?? props.padding
  const pr = props.paddingRight ?? ph ?? props.padding
  if (pt !== undefined) style.paddingTop = pt
  if (pb !== undefined) style.paddingBottom = pb
  if (pl !== undefined) style.paddingLeft = pl
  if (pr !== undefined) style.paddingRight = pr

  const mv = props.marginVertical
  const mh = props.marginHorizontal
  const mt = props.marginTop ?? mv ?? props.margin
  const mb = props.marginBottom ?? mv ?? props.margin
  const ml = props.marginHorizontal ?? props.margin
  const mr = props.marginHorizontal ?? props.margin
  if (mt !== undefined) style.marginTop = mt
  if (mb !== undefined) style.marginBottom = mb
  if (ml !== undefined) style.marginLeft = ml
  if (mr !== undefined) style.marginRight = mr

  if (props.gap !== undefined) style.gap = props.gap
  if (props.width !== undefined) style.width = props.width
  if (props.height !== undefined) style.height = props.height
  if (props.flex !== undefined) style.flex = props.flex
  if (props.borderRadius !== undefined) style.borderRadius = props.borderRadius
  if (props.background !== undefined) style.background = props.background

  return { ...style, ...props.style }
}
```

- [ ] **Step 2: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/core/shared/spacing.ts
git commit -m "feat(core): add style passthrough prop to SharedLayoutProps"
```

---

### Task 2: Display components — ColorDisplay, WhichMoreDisplay, WhatNextDisplay

**Files:**
- Modify: `src/components/ColorDisplay.tsx`, `src/components/ColorDisplay.css`
- Modify: `src/components/WhichMoreDisplay.tsx`, `src/components/WhichMoreDisplay.css`
- Modify: `src/components/WhatNextDisplay.tsx`, `src/components/WhatNextDisplay.css`

- [ ] **Step 1: Refactor ColorDisplay.tsx**

```tsx
import './ColorDisplay.css'

import { CoreCol } from './core'
import type { ColorItem, FeedbackState } from '../types/game'

interface ColorDisplayProps {
  item: ColorItem
  feedback: FeedbackState
  animKey: string
}

export function ColorDisplay({ item, feedback, animKey }: ColorDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <CoreCol align="center" gap={16} className="color-display">
      <div
        key={animKey}
        className={`color-display__circle ${feedbackClass}`}
        style={{ background: item.color }}
      />
    </CoreCol>
  )
}
```

- [ ] **Step 2: Remove layout from ColorDisplay.css**

Remove these lines from `.color-display`:
```css
/* remove: */
display: flex;
flex-direction: column;
align-items: center;
gap: 16px;
```

The `.color-display` rule becomes empty — delete it entirely.

- [ ] **Step 3: Refactor WhichMoreDisplay.tsx**

```tsx
import './WhichMoreDisplay.css'

import { CoreRow } from './core'
import type { FeedbackState, WhichMoreItem } from '../types/game'

function CountBox({
  count,
  emoji,
  feedbackClass,
}: {
  count: number
  emoji: string
  feedbackClass: string
}) {
  return (
    <div className="wm-box-wrap">
      <div className={`wm-box ${feedbackClass}`}>
        <div className="wm-objects">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className="wm-object">
              {emoji}
            </span>
          ))}
        </div>
      </div>
      <div className="wm-number">{count}</div>
    </div>
  )
}

interface WhichMoreDisplayProps {
  item: WhichMoreItem
  feedback: FeedbackState
  pressedKey: string | null
  animKey: string
}

export function WhichMoreDisplay({ item, feedback, pressedKey, animKey }: WhichMoreDisplayProps) {
  const getClass = (side: string) => {
    if (!feedback) return ''
    if (side === item.answer) return feedback === 'correct' ? 'wm-box--correct' : ''
    if (side === pressedKey && feedback === 'wrong') return 'wm-box--wrong'
    return ''
  }

  return (
    <CoreRow key={animKey} align="flex-start" gap={16} className="which-more">
      <CountBox count={parseInt(item.left)} emoji={item.emoji} feedbackClass={getClass(item.left)} />
      <div className="which-more__vs">or</div>
      <CountBox count={parseInt(item.right)} emoji={item.emoji} feedbackClass={getClass(item.right)} />
    </CoreRow>
  )
}
```

- [ ] **Step 4: Remove layout from WhichMoreDisplay.css**

Remove from `.which-more`:
```css
/* remove: */
display: flex;
align-items: flex-start;
gap: 16px;
```

The `.which-more` rule becomes empty — delete it entirely.

- [ ] **Step 5: Refactor WhatNextDisplay.tsx**

```tsx
import './WhatNextDisplay.css'

import { CoreRow } from './core'
import type { FeedbackState, WhatNextItem } from '../types/game'

interface WhatNextDisplayProps {
  item: WhatNextItem
  feedback: FeedbackState
  animKey: string
  reversed?: boolean
}

export function WhatNextDisplay({ item, feedback, animKey, reversed }: WhatNextDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  const blank = (
    <div
      key={animKey}
      className={`what-next__tile what-next__tile--blank ${feedbackClass}`}
    >
      ?
    </div>
  )

  const shown = item.shown.map((char, i) => (
    <div key={i} className="what-next__tile what-next__tile--shown">
      {char}
    </div>
  ))

  return (
    <CoreRow align="center" gap={12} wrap justify="center" className="what-next">
      {reversed ? (
        <>
          {blank}
          <div className="what-next__arrow">←</div>
          {shown}
        </>
      ) : (
        <>
          {shown}
          <div className="what-next__arrow">→</div>
          {blank}
        </>
      )}
    </CoreRow>
  )
}
```

- [ ] **Step 6: Remove layout from WhatNextDisplay.css**

Remove from `.what-next`:
```css
/* remove: */
display: flex;
align-items: center;
gap: 12px;
flex-wrap: wrap;
justify-content: center;
```

The `.what-next` rule becomes empty — delete it entirely.

- [ ] **Step 7: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/ColorDisplay.tsx src/components/ColorDisplay.css \
        src/components/WhichMoreDisplay.tsx src/components/WhichMoreDisplay.css \
        src/components/WhatNextDisplay.tsx src/components/WhatNextDisplay.css
git commit -m "refactor: migrate ColorDisplay, WhichMoreDisplay, WhatNextDisplay to core primitives"
```

---

### Task 3: Display components — NumberBlanksDisplay, ClockBlanksDisplay

**Files:**
- Modify: `src/components/NumberBlanksDisplay.tsx`, `src/components/NumberBlanksDisplay.css`
- Modify: `src/components/ClockBlanksDisplay.tsx`, `src/components/ClockBlanksDisplay.css`

- [ ] **Step 1: Refactor NumberBlanksDisplay.tsx**

```tsx
import './NumberBlanksDisplay.css'

import { CoreCol } from './core'
import type { FeedbackState } from '../types/game'

interface NumberBlanksDisplayProps {
  display: string
  label?: string
  slots: string[]
  filled: string
  feedback: FeedbackState
  shakeKey: number
}

export function NumberBlanksDisplay({ display, label, slots, filled, feedback, shakeKey }: NumberBlanksDisplayProps) {
  const activeSlot = filled.length

  return (
    <CoreCol align="center" gap={24} className="number-blanks">
      <div className="number-blanks__display">{display}</div>
      {label && <div className="number-blanks__label">{label}</div>}
      <div className="number-blanks__slots">
        {slots.map((_, i) => {
          const isActive = i === activeSlot
          const isFilled = i < filled.length
          const char = filled[i] ?? ''
          const isWrong = feedback === 'wrong' && isActive

          return (
            <div
              key={isWrong ? `slot-${i}-${shakeKey}` : `slot-${i}`}
              className={[
                'number-blanks__slot',
                isFilled ? 'number-blanks__slot--filled' : '',
                isActive ? 'number-blanks__slot--active' : '',
                isWrong ? 'number-blanks__slot--wrong' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {char}
            </div>
          )
        })}
      </div>
    </CoreCol>
  )
}
```

- [ ] **Step 2: Remove layout from NumberBlanksDisplay.css**

Remove from `.number-blanks`:
```css
/* remove: */
display: flex;
flex-direction: column;
align-items: center;
gap: 24px;
```

Delete the now-empty `.number-blanks` rule.

- [ ] **Step 3: Refactor ClockBlanksDisplay.tsx**

```tsx
import './ClockBlanksDisplay.css'

import { CoreCol } from './core'
import type { ClockItem, FeedbackState } from '../types/game'

interface ClockBlanksDisplayProps {
  item: ClockItem
  filled: string
  feedback: FeedbackState
  shakeKey: number
}

export function ClockBlanksDisplay({ item, filled, feedback, shakeKey }: ClockBlanksDisplayProps) {
  const activeSlot = filled.length

  const renderSlot = (i: number) => {
    const isActive = i === activeSlot
    const isFilled = i < filled.length
    const char = filled[i] ?? ''
    const isWrong = feedback === 'wrong' && isActive

    return (
      <div
        key={isWrong ? `slot-${i}-${shakeKey}` : `slot-${i}`}
        className={[
          'clock-blanks__slot',
          isFilled ? 'clock-blanks__slot--filled' : '',
          isActive ? 'clock-blanks__slot--active' : '',
          isWrong ? 'clock-blanks__slot--wrong' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {char}
      </div>
    )
  }

  const hourSlots = Array.from({ length: item.hourDigitCount }, (_, i) => renderSlot(i))
  const minuteSlots = Array.from({ length: 2 }, (_, i) => renderSlot(item.hourDigitCount + i))

  return (
    <CoreCol align="center" gap={20} className="clock-blanks">
      <div className="clock-blanks__emoji">{item.emoji}</div>
      <div className="clock-blanks__digital">{item.display}</div>
      <div className="clock-blanks__slots">
        {hourSlots}
        <span className="clock-blanks__colon">:</span>
        {minuteSlots}
      </div>
    </CoreCol>
  )
}
```

- [ ] **Step 4: Remove layout from ClockBlanksDisplay.css**

Remove from `.clock-blanks`:
```css
/* remove: */
display: flex;
flex-direction: column;
align-items: center;
gap: 20px;
```

Delete the now-empty `.clock-blanks` rule.

- [ ] **Step 5: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/NumberBlanksDisplay.tsx src/components/NumberBlanksDisplay.css \
        src/components/ClockBlanksDisplay.tsx src/components/ClockBlanksDisplay.css
git commit -m "refactor: migrate NumberBlanksDisplay, ClockBlanksDisplay to core primitives"
```

---

### Task 4: UI components — GameTopbar, ScoreBadge

**Files:**
- Modify: `src/components/ui/GameTopbar.tsx`, `src/components/ui/GameTopbar.css`
- Modify: `src/components/ui/ScoreBadge.tsx`, `src/components/ui/ScoreBadge.css`

- [ ] **Step 1: Refactor GameTopbar.tsx**

```tsx
import './GameTopbar.css'

import { CoreRow } from '../core'
import { BackButton } from './BackButton'
import { ProgressBar } from './ProgressBar'
import { ScoreBadge } from './ScoreBadge'

interface GameTopbarProps {
  onBack: () => void
  percent: number
  score: number
}

export function GameTopbar({ onBack, percent, score }: GameTopbarProps) {
  return (
    <CoreRow align="center" gap={12} padding={12} paddingHorizontal={16} className="game-topbar">
      <BackButton onClick={onBack} />
      <ProgressBar percent={percent} />
      <ScoreBadge score={score} />
    </CoreRow>
  )
}
```

- [ ] **Step 2: Remove layout from GameTopbar.css**

Current `GameTopbar.css`:
```css
.game-topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  box-sizing: border-box;
}
```

Replace with:
```css
.game-topbar {
  width: 100%;
  box-sizing: border-box;
}
```

- [ ] **Step 3: Refactor ScoreBadge.tsx**

```tsx
import './ScoreBadge.css'

import { CoreRow } from '../core'

interface ScoreBadgeProps {
  score: number
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  return (
    <CoreRow align="center" gap={6} className="score-badge">
      <span className="score-star">⭐</span>
      <span className="score-num">{score}</span>
    </CoreRow>
  )
}
```

- [ ] **Step 4: Remove layout from ScoreBadge.css**

Remove from `.score-badge`:
```css
/* remove: */
display: flex;
align-items: center;
gap: 6px;
```

Remaining `.score-badge`:
```css
.score-badge {
  background: var(--bg-card);
  border: 2px solid var(--bg-light);
  border-radius: 12px;
  padding: 8px 14px;
  font-weight: 800;
  font-size: 18px;
  flex-shrink: 0;
}
```

- [ ] **Step 5: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/GameTopbar.tsx src/components/ui/GameTopbar.css \
        src/components/ui/ScoreBadge.tsx src/components/ui/ScoreBadge.css
git commit -m "refactor: migrate GameTopbar, ScoreBadge to core primitives"
```

---

### Task 5: UI component — SectionBanner

**Files:**
- Modify: `src/components/ui/SectionBanner.tsx`, `src/components/ui/SectionBanner.css`

- [ ] **Step 1: Refactor SectionBanner.tsx**

The outer div uses `gap: 8px 12px` (row-gap ≠ column-gap) which `CoreRow`'s single `gap` prop can't express — leave `gap` in CSS and only remove `display`/`flex-wrap`/`align-items`/`justify-content`.

```tsx
import './SectionBanner.css'

import { CoreRow } from '../core'
import type { Section } from '../../types/game'

interface SectionBannerProps {
  section: Section
  earnedStars: number
  totalPossibleStars: number
  locked: boolean
}

export function SectionBanner({
  section,
  earnedStars,
  totalPossibleStars,
  locked,
}: SectionBannerProps) {
  return (
    <CoreRow
      wrap
      align="center"
      justify="center"
      className={`section-banner ${locked ? 'section-banner--locked' : ''}`}
    >
      <span className="section-banner__emoji">{section.emoji}</span>
      <CoreText as="h2" className="section-banner__title">{section.title}</CoreText>
      <span className="section-banner__stars">
        ⭐ {earnedStars}/{totalPossibleStars}
      </span>
      {locked && (
        <span className="section-banner__lock">
          🔒 Need {section.starsToUnlock - earnedStars} more ⭐
        </span>
      )}
    </CoreRow>
  )
}
```

Wait — add `CoreText` to the import:

```tsx
import { CoreRow, CoreText } from '../core'
```

- [ ] **Step 2: Remove layout from SectionBanner.css**

Remove from `.section-banner`:
```css
/* remove: */
display: flex;
flex-wrap: wrap;
align-items: center;
justify-content: center;
```

Keep:
```css
.section-banner {
  gap: 8px 12px;
  background: var(--bg-card);
  border: 2px solid var(--bg-light);
  border-radius: 16px;
  padding: 16px 24px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
```

Also remove from `.section-banner__title`:
```css
/* remove — CoreText resets margin: */
margin: 0;
```

- [ ] **Step 3: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/SectionBanner.tsx src/components/ui/SectionBanner.css
git commit -m "refactor: migrate SectionBanner to core primitives"
```

---

### Task 6: SettingsModal

**Files:**
- Modify: `src/components/SettingsModal.tsx`, `src/components/SettingsModal.css`

- [ ] **Step 1: Refactor SettingsModal.tsx**

The backdrop `div.settings-backdrop` uses `position: fixed` and is not a simple layout primitive — keep it as a raw div. The inner modal and its content use flex layouts we can migrate.

```tsx
import './SettingsModal.css'

import { useState } from 'react'

import { CoreCol, CoreRow, CoreText } from './core'
import { Toggle } from './ui/Toggle'

interface SettingsModalProps {
  isRandom: boolean
  onToggleRandom: () => void
  onReset: () => void
  onClose: () => void
}

export function SettingsModal({ isRandom, onToggleRandom, onReset, onClose }: SettingsModalProps) {
  const [confirming, setConfirming] = useState(false)

  const handleReset = () => {
    onReset()
    setConfirming(false)
    onClose()
  }

  return (
    <div className="settings-backdrop" onPointerDown={onClose}>
      <CoreCol gap={24} className="settings-modal" onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}>
        <CoreRow align="center" justify="space-between" className="settings-header">
          <CoreText as="span" className="settings-title">Settings</CoreText>
          <button className="settings-close" onClick={onClose}>✕</button>
        </CoreRow>

        <hr className="settings-divider" />

        <CoreRow align="center" justify="space-between" gap={16} className="settings-row">
          <CoreText as="span" className="settings-row-label">🎲 Random Order</CoreText>
          <Toggle active={isRandom} label="" onToggle={onToggleRandom} />
        </CoreRow>

        <hr className="settings-divider" />

        {confirming ? (
          <CoreCol gap={10} className="settings-confirm">
            <CoreText as="p" className="settings-confirm-text">This will erase all stars and progress. Are you sure?</CoreText>
            <CoreRow gap={10} className="settings-confirm-btns">
              <button className="settings-confirm-yes" onClick={handleReset}>Yes, reset</button>
              <button className="settings-confirm-no" onClick={() => setConfirming(false)}>Cancel</button>
            </CoreRow>
          </CoreCol>
        ) : (
          <button className="settings-reset-btn" onClick={() => setConfirming(true)}>
            🗑️ Reset Game
          </button>
        )}
      </CoreCol>
    </div>
  )
}
```

Note: `CoreCol` needs to accept `onPointerDown`. Check if `CoreCol` passes through event handlers. If not, wrap with a raw div instead of CoreCol for the modal container. If type errors appear, use:

```tsx
<div className="settings-modal" onPointerDown={(e) => e.stopPropagation()}>
  <CoreCol gap={24}>
    ...
  </CoreCol>
</div>
```

and remove only `display: flex; flex-direction: column; gap: 24px;` from `.settings-modal`, keeping all visual styles.

- [ ] **Step 2: Remove layout from SettingsModal.css**

Remove from `.settings-modal`:
```css
/* remove: */
display: flex;
flex-direction: column;
gap: 24px;
```

Remove from `.settings-header`:
```css
/* remove: */
display: flex;
align-items: center;
justify-content: space-between;
```

Delete the now-empty `.settings-header` rule.

Remove from `.settings-row`:
```css
/* remove: */
display: flex;
align-items: center;
justify-content: space-between;
gap: 16px;
```

Delete the now-empty `.settings-row` rule.

Remove from `.settings-confirm`:
```css
/* remove: */
display: flex;
flex-direction: column;
gap: 10px;
```

Delete the now-empty `.settings-confirm` rule.

Remove from `.settings-confirm-btns`:
```css
/* remove: */
display: flex;
gap: 10px;
```

Delete the now-empty `.settings-confirm-btns` rule.

- [ ] **Step 3: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

If `onPointerDown` causes a type error on CoreCol, use the wrapper-div fallback described in Step 1 and remove only the inner layout rules.

- [ ] **Step 4: Commit**

```bash
git add src/components/SettingsModal.tsx src/components/SettingsModal.css
git commit -m "refactor: migrate SettingsModal inner layout to core primitives"
```

---

### Task 7: GamePreviewModal

**Files:**
- Modify: `src/components/GamePreviewModal.tsx`, `src/components/GamePreviewModal.css`

- [ ] **Step 1: Refactor GamePreviewModal.tsx**

The backdrop and card are positioned/visual elements — keep as raw divs. Only inner layout containers become core primitives.

```tsx
import './GamePreviewModal.css'

import { useEffect, useRef } from 'react'

import { CoreRow } from './core'
import type { GameConfig } from '../types/game'

interface GamePreviewModalProps {
  game: GameConfig
  stars: number
  onPlay: () => void
  onClose: () => void
}

export function GamePreviewModal({ game, stars, onPlay, onClose }: GamePreviewModalProps) {
  const readyRef = useRef(false)
  useEffect(() => {
    const t = setTimeout(() => { readyRef.current = true }, 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="gpm-backdrop" onClick={() => { if (readyRef.current) onClose() }}>
      <div
        className="gpm-card"
        style={{ '--gpm-color': game.color, '--gpm-dark': game.colorDark } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="gpm-banner">
          <span className="gpm-banner-emoji">{game.emoji}</span>
        </div>

        {/* Info */}
        <div className="gpm-body">
          <h2 className="gpm-title">{game.title}</h2>
          <p className="gpm-desc">{game.description}</p>
          <CoreRow gap={4} className="gpm-stars">
            {[1, 2, 3].map((i) => (
              <span key={i} className={`gpm-star ${i <= stars ? 'gpm-star--earned' : ''}`}>★</span>
            ))}
          </CoreRow>
        </div>

        {/* Actions */}
        <CoreRow gap={10} className="gpm-actions">
          <button className="gpm-btn gpm-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="gpm-btn gpm-btn--play" onClick={onPlay}>Play! →</button>
        </CoreRow>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Remove layout from GamePreviewModal.css**

Remove from `.gpm-stars`:
```css
/* remove: */
display: flex;
gap: 4px;
```

Delete the now-empty `.gpm-stars` rule.

Remove from `.gpm-actions`:
```css
/* remove: */
display: flex;
gap: 10px;
```

Keep `padding: 12px 24px 24px;` in `.gpm-actions`.

- [ ] **Step 3: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/GamePreviewModal.tsx src/components/GamePreviewModal.css
git commit -m "refactor: migrate GamePreviewModal inner layout to core primitives"
```

---

### Task 8: GameScreen

**Files:**
- Modify: `src/pages/GameScreen.tsx`, `src/pages/GameScreen.css`

- [ ] **Step 1: Update GameScreen.tsx imports and outer shell**

Add to imports:
```tsx
import { CoreCol, CoreRow, CoreScreen, CoreText } from '../components/core'
```

Replace the outer `<div className="game" style={...}>` with `<CoreScreen>` using the `style` prop (added in Task 1):

```tsx
return (
  <CoreScreen
    className="game"
    style={{ '--game-color': game.color, '--game-color-dark': game.colorDark } as React.CSSProperties}
  >
    <GameTopbar onBack={onBack} percent={progress} score={score} />

    {isTimed && !isComplete && (
      <CoreRow justify="center" paddingBottom={8} paddingHorizontal={20} className="game-timer">
        <TimerBar duration={(game as TimedGameConfig).timeLimit} running={!isComplete} onTimeUp={handleTimeUp} />
      </CoreRow>
    )}

    {!isComplete && <StreakBadge streak={streak} />}

    {isComplete && completionResult ? (
      <GameComplete
        score={score}
        total={sequence.length}
        stars={completionResult.stars}
        isNewBest={completionResult.isNewBest}
        onRestart={handleRestart}
        onHome={onBack}
      />
    ) : currentItem ? (
      <CoreCol flex={1} align="center" justify="center" gap={24} padding={20} className="game-area">
        <CoreText as="p" className="game-prompt">{getPromptText()}</CoreText>
        {renderDisplay()}
        {isMultiDigit && digitBuffer && <div className="digit-preview">{digitBuffer}</div>}
        <CoreCol align="center" gap={12} className="game-bottom">
          <button
            className="hint-btn"
            onPointerDown={(e) => { e.preventDefault(); handleHint() }}
            disabled={!!feedback}
          >
            💡 Hint{hintUsed ? ' (max ★★)' : ''}
          </button>
          <CoreText as="p" className="game-progress">{getProgressText()}</CoreText>
        </CoreCol>
        <VirtualKeyboard layout={kbLayout} onKeyPress={handleInput} disabled={!!feedback || isComplete} />
      </CoreCol>
    ) : null}
  </CoreScreen>
)
```

- [ ] **Step 2: Remove layout from GameScreen.css**

Remove from `.game`:
```css
/* remove: */
flex: 1;
display: flex;
flex-direction: column;
min-height: 100dvh;
```

Delete the now-empty `.game` rule.

Remove from `.game-timer`:
```css
/* remove: */
padding: 0 20px 8px;
display: flex;
justify-content: center;
```

Delete the now-empty `.game-timer` rule.

Remove from `.game-area`:
```css
/* remove: */
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 24px;
padding: 20px;
```

Delete the now-empty `.game-area` rule.

Remove from `.game-bottom`:
```css
/* remove: */
display: flex;
flex-direction: column;
align-items: center;
gap: 12px;
```

Delete the now-empty `.game-bottom` rule.

- [ ] **Step 3: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/GameScreen.tsx src/pages/GameScreen.css
git commit -m "refactor: migrate GameScreen layout to core primitives"
```

---

### Task 9: HomeScreen and BonusScreen

**Files:**
- Modify: `src/pages/HomeScreen.tsx`, `src/pages/HomeScreen.css`
- Modify: `src/pages/BonusScreen.tsx`, `src/pages/BonusScreen.css`

- [ ] **Step 1: Update HomeScreen.tsx**

`div.home` uses a `ref` so it can't become CoreCol without ref forwarding — convert only inner layout containers.

Add to imports:
```tsx
import { CoreRow } from '../components/core'
```

Find the stats bar section and convert it:
```tsx
{(stats.totalPlays > 0 || totalStars > 0) && (
  <CoreRow justify="center" gap={24} className="stats-bar">
    <span className="stat">🎮 {stats.totalPlays} played</span>
    <span className="stat">⭐ {totalStars} stars</span>
  </CoreRow>
)}
```

- [ ] **Step 2: Remove layout from HomeScreen.css**

Remove from `.stats-bar`:
```css
/* remove: */
display: flex;
gap: 24px;
justify-content: center;
```

Delete the now-empty `.stats-bar` rule.

- [ ] **Step 3: Refactor BonusScreen.tsx**

```tsx
import './BonusScreen.css'

import { CoreRow, CoreScreen, CoreText } from '../components/core'
import { BONUS_GAMES } from '../games/config'
import { BackButton } from '../components/ui/BackButton'

interface PlayGamesScreenProps {
  onBack: () => void
  onPlay: (id: string) => void
}

export function BonusScreen({ onBack, onPlay }: PlayGamesScreenProps) {
  return (
    <CoreScreen className="pg">
      <CoreRow align="center" gap={12} padding={12} paddingHorizontal={16} className="pg-header">
        <BackButton onClick={onBack} />
        <CoreText as="h2" className="pg-title">🎮 Play Games</CoreText>
      </CoreRow>

      <div className="pg-grid">
        {BONUS_GAMES.map(game => (
          <button
            key={game.id}
            className="pg-card"
            style={{ '--card-color': game.color, '--card-dark': game.colorDark } as React.CSSProperties}
            onClick={() => onPlay(game.id)}
          >
            <div className="pg-card-art">
              <span className="pg-card-emoji">{game.emoji}</span>
            </div>
            <div className="pg-card-info">
              <div className="pg-card-title">{game.title}</div>
              <div className="pg-card-desc">{game.description}</div>
            </div>
          </button>
        ))}
      </div>
    </CoreScreen>
  )
}
```

- [ ] **Step 4: Remove layout from BonusScreen.css**

Remove from `.pg`:
```css
/* remove: */
display: flex;
flex-direction: column;
min-height: 100dvh;
```

Keep `background: var(--bg); color: var(--text);` in `.pg`.

Remove from `.pg-header`:
```css
/* remove: */
display: flex;
align-items: center;
gap: 12px;
padding: 12px 16px;
```

Delete the now-empty `.pg-header` rule.

Remove from `.pg-title`:
```css
/* remove: */
margin: 0;
```

- [ ] **Step 5: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/HomeScreen.tsx src/pages/HomeScreen.css \
        src/pages/BonusScreen.tsx src/pages/BonusScreen.css
git commit -m "refactor: migrate HomeScreen stats-bar and BonusScreen to core primitives"
```

---

### Task 10: game-shell screens (SimonSays, ChaseBall, ClickLetter, ClickCircle, FollowArrow, MouseDirection, Frogger)

These screens all use `<div className="game-shell ...">`. Replace with `<CoreScreen>`. Where `.game-shell--center` is also applied, use `center` prop. Where `p.game-instruction` is used, convert to `<CoreText as="p" className="game-instruction">`.

**Files:**
- Modify: `src/pages/SimonSaysScreen.tsx`
- Modify: `src/pages/ChaseBallScreen.tsx`
- Modify: `src/pages/ClickLetterScreen.tsx`
- Modify: `src/pages/ClickCircleScreen.tsx`
- Modify: `src/pages/FollowArrowScreen.tsx`
- Modify: `src/pages/MouseDirectionScreen.tsx`
- Modify: `src/pages/FroggerScreen.tsx`

- [ ] **Step 1: SimonSaysScreen.tsx**

Add import:
```tsx
import { CoreScreen, CoreText } from '../components/core'
```

Replace:
```tsx
// before:
<div className="game-shell game-shell--center ss">

// after:
<CoreScreen center className="ss">
```

Replace the closing `</div>` at the end with `</CoreScreen>`.

Replace:
```tsx
// before:
<p className="game-instruction">
  {isDo ? `Press  ${currentRound.char}` : "Don't press anything!"}
</p>

// after:
<CoreText as="p" className="game-instruction">
  {isDo ? `Press  ${currentRound.char}` : "Don't press anything!"}
</CoreText>
```

- [ ] **Step 2: ChaseBallScreen.tsx**

Add import:
```tsx
import { CoreScreen } from '../components/core'
```

Replace:
```tsx
// before:
<div className="game-shell cbs">

// after:
<CoreScreen className="cbs">
```

Replace closing `</div>` with `</CoreScreen>`.

- [ ] **Step 3: ClickLetterScreen.tsx**

Add import:
```tsx
import { CoreScreen } from '../components/core'
```

Replace:
```tsx
// before:
<div className="game-shell cls">

// after:
<CoreScreen className="cls">
```

Replace closing `</div>` with `</CoreScreen>`.

- [ ] **Step 4: ClickCircleScreen.tsx**

Add import:
```tsx
import { CoreScreen } from '../components/core'
```

There are two return paths with `.game-shell`. Update both:

First (completion state):
```tsx
// before:
<div className="game-shell game-shell--center cc">

// after:
<CoreScreen center className="cc">
```

Second (active game):
```tsx
// before:
<div className="game-shell cc">

// after:
<CoreScreen className="cc">
```

Replace:
```tsx
// before:
<p className="game-instruction">Click the moving circle!</p>

// after:
<CoreText as="p" className="game-instruction">Click the moving circle!</CoreText>
```

Add `CoreText` to the import.

- [ ] **Step 5: FollowArrowScreen.tsx**

Add import:
```tsx
import { CoreScreen, CoreText } from '../components/core'
```

Replace:
```tsx
// before:
<div className="game-shell fa">

// after:
<CoreScreen className="fa">
```

Replace:
```tsx
// before:
<p className="game-instruction">
  Press the <strong>{currentDir}</strong> arrow key
</p>

// after:
<CoreText as="p" className="game-instruction">
  Press the <strong>{currentDir}</strong> arrow key
</CoreText>
```

- [ ] **Step 6: MouseDirectionScreen.tsx**

Add import:
```tsx
import { CoreScreen, CoreText } from '../components/core'
```

Replace:
```tsx
// before:
<div className="game-shell mds">

// after:
<CoreScreen className="mds">
```

Replace:
```tsx
// before:
<p className="game-instruction">
  Move your mouse to the <strong>{LABELS[currentDir]}</strong> box!
</p>

// after:
<CoreText as="p" className="game-instruction">
  Move your mouse to the <strong>{LABELS[currentDir]}</strong> box!
</CoreText>
```

- [ ] **Step 7: FroggerScreen.tsx**

Add import:
```tsx
import { CoreScreen } from '../components/core'
```

Replace:
```tsx
// before:
<div className="game-shell fg">

// after:
<CoreScreen className="fg">
```

Replace closing `</div>` with `</CoreScreen>`.

- [ ] **Step 8: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add src/pages/SimonSaysScreen.tsx src/pages/ChaseBallScreen.tsx \
        src/pages/ClickLetterScreen.tsx src/pages/ClickCircleScreen.tsx \
        src/pages/FollowArrowScreen.tsx src/pages/MouseDirectionScreen.tsx \
        src/pages/FroggerScreen.tsx
git commit -m "refactor: replace game-shell divs with CoreScreen in mini-game screens"
```

---

### Task 11: TicTacToeScreen, DinoGameScreen, MiniGameScreen

These screens have custom outer div names but also use `min-height: 100dvh` full-page layout — migrate to CoreScreen.

**Files:**
- Modify: `src/pages/TicTacToeScreen.tsx`, `src/pages/TicTacToeScreen.css`
- Modify: `src/pages/DinoGameScreen.tsx`, `src/pages/DinoGameScreen.css`
- Modify: `src/pages/MiniGameScreen.tsx`, `src/pages/MiniGameScreen.css`

- [ ] **Step 1: TicTacToeScreen.tsx**

Add import:
```tsx
import { CoreScreen } from '../components/core'
```

Replace:
```tsx
// before:
<div className="ttt">

// after:
<CoreScreen center paddingBottom={24} className="ttt">
```

Replace closing `</div>` with `</CoreScreen>`.

- [ ] **Step 2: Remove layout from TicTacToeScreen.css**

Remove from `.ttt`:
```css
/* remove: */
display: flex;
flex-direction: column;
align-items: center;
min-height: 100dvh;
background: var(--bg);
color: var(--text);
padding-bottom: 24px;
```

Delete the now-empty `.ttt` rule (or keep it empty as a BEM anchor if desired).

- [ ] **Step 3: DinoGameScreen.tsx**

Add import:
```tsx
import { CoreScreen } from '../components/core'
```

Replace:
```tsx
// before:
<div className="dino-game">

// after:
<CoreScreen center padding={16} gap={16} className="dino-game">
```

Replace closing `</div>` with `</CoreScreen>`.

- [ ] **Step 4: Remove layout from DinoGameScreen.css**

Remove from `.dino-game`:
```css
/* remove: */
display: flex;
flex-direction: column;
align-items: center;
min-height: 100dvh;
background: var(--bg);
padding: 16px;
gap: 16px;
```

Keep `user-select: none;` in `.dino-game`.

- [ ] **Step 5: MiniGameScreen.tsx**

Add import:
```tsx
import { CoreScreen } from '../components/core'
```

Replace both instances of `<div className="mini-game">` with `<CoreScreen className="mini-game">` and their closing `</div>` with `</CoreScreen>`.

- [ ] **Step 6: Remove layout from MiniGameScreen.css**

Remove from `.mini-game`:
```css
/* remove: */
flex: 1;
display: flex;
flex-direction: column;
min-height: 100dvh;
```

Delete the now-empty `.mini-game` rule.

- [ ] **Step 7: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/pages/TicTacToeScreen.tsx src/pages/TicTacToeScreen.css \
        src/pages/DinoGameScreen.tsx src/pages/DinoGameScreen.css \
        src/pages/MiniGameScreen.tsx src/pages/MiniGameScreen.css
git commit -m "refactor: migrate TicTacToe, Dino, MiniGame outer shells to CoreScreen"
```

---

### Task 12: index.css cleanup

Remove deprecated global layout classes that no longer have consumers.

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Verify no remaining .game-shell usages**

```bash
grep -r "game-shell\|game-arena\|game-instruction" src/ --include="*.tsx" --include="*.ts"
```

Expected: no matches. If any appear, fix them before proceeding.

- [ ] **Step 2: Remove deprecated classes from index.css**

In `src/index.css`, find and delete the entire block:
```css
/* ─── Shared game layout ───────────────────────────────── */

.game-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--text);
}

.game-shell--center {
  align-items: center;
}

.game-instruction {
  text-align: center;
  font-size: clamp(1rem, 3vw, 1.4rem);
  font-weight: 600;
  padding: 8px 20px 12px;
  color: var(--text-muted);
}

.game-arena {
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

Note: `.game-instruction` styles should be retained if any screen still references `.game-instruction` via CSS class (on a CoreText element). In that case, keep the CSS rule but remove it from the "shared layout" comment block.

- [ ] **Step 3: Verify .game-instruction CSS still works**

The screens in Task 10 now use `<CoreText as="p" className="game-instruction">`. The CSS rule for `.game-instruction` should remain so the styling still applies. Only remove `.game-shell`, `.game-shell--center`, and `.game-arena`. Keep `.game-instruction`.

Correct deletion — remove only:
```css
.game-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--text);
}

.game-shell--center {
  align-items: center;
}

.game-arena {
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

- [ ] **Step 4: Run type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "cleanup: remove deprecated .game-shell and .game-arena from global CSS"
```

---

## Self-Review

**Spec coverage:**
- Display components: ColorDisplay ✓, WhichMoreDisplay ✓, WhatNextDisplay ✓, NumberBlanksDisplay ✓, ClockBlanksDisplay ✓
- UI: GameTopbar ✓, ScoreBadge ✓, SectionBanner ✓
- Modals: SettingsModal ✓, GamePreviewModal ✓
- Pages: GameScreen ✓, HomeScreen ✓, BonusScreen ✓
- game-shell screens: SimonSays ✓, ChaseBall ✓, ClickLetter ✓, ClickCircle ✓, FollowArrow ✓, MouseDirection ✓, Frogger ✓
- Other screens: TicTacToe ✓, DinoGame ✓, MiniGame ✓
- Cleanup: index.css ✓

**Excluded by design:**
- `LetterDisplay`, `WordDisplay`, `AnimalDisplay`, `CountingDisplay`, `HearPressDisplay` — outer div IS the visual element (border, animation, background), not a layout-only container
- `SpaceMathScreen` — uses `height: 100dvh` with `overflow: hidden` (not `min-height`); CoreScreen uses `min-height` which differs semantically; leave as-is
- `div.home` in HomeScreen — has a `scrollRef` ref which CoreCol doesn't accept without forwardRef; only inner containers converted
- `gpm-banner`, `gpm-body` in GamePreviewModal — have visual CSS (background, border, padding) baked in beyond layout

**Placeholder scan:** All steps contain actual code.

**Type consistency:** `CoreScreen`, `CoreRow`, `CoreCol`, `CoreText` imported from `'../components/core'` or `'./core'` depending on file depth.
