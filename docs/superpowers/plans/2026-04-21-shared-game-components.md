# Shared Game Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract four repeated patterns into shared components (`GameBox`, `GameInstruction`, `GameShell`, `ArcadeComplete`) so CSS lives exclusively in the component that owns it — no shared utility classes, no copy-pasted style blocks.

**Architecture:** Each new component owns its CSS and is placed in `src/components/` (game-specific, not core). Existing screens swap their raw boilerplate for the right component. `index.css` ends up with only reset, CSS variables, and global `@keyframes`.

**Tech Stack:** React 19, TypeScript strict (tsgo), plain CSS, `@core` primitives.

---

## File Map

| File | Action |
|------|--------|
| `src/components/GameBox.tsx` + `.css` | **Create** — visual box identity (`bg-card` + border pattern) |
| `src/components/GameInstruction.tsx` + `.css` | **Create** — instruction text above game arenas |
| `src/components/GameShell.tsx` | **Create** — `CoreScreen + GameTopbar` outer shell for every game screen |
| `src/components/ArcadeComplete.tsx` + `.css` | **Create** — standalone arcade-game completion screen (no stars) |
| `src/components/LetterDisplay.tsx` + `.css` | Modify — swap outer div for `GameBox` |
| `src/components/CountingDisplay.tsx` + `.css` | Modify — swap outer div for `GameBox` |
| `src/components/AnimalDisplay.tsx` + `.css` | Modify — swap outer div for `GameBox` |
| `src/components/HearPressDisplay.tsx` + `.css` | Modify — swap outer div for `GameBox` |
| `src/components/WordDisplay.tsx` + `.css` | Modify — swap outer div for `GameBox` |
| `src/pages/SimonSaysScreen.tsx` | Modify — `GameShell` + `GameInstruction` |
| `src/pages/FollowArrowScreen.tsx` | Modify — `GameShell` + `GameInstruction` |
| `src/pages/MouseDirectionScreen.tsx` | Modify — `GameShell` + `GameInstruction` |
| `src/pages/ChaseBallScreen.tsx` | Modify — `GameShell` |
| `src/pages/ClickLetterScreen.tsx` | Modify — `GameShell` |
| `src/pages/TicTacToeScreen.tsx` | Modify — `GameShell` |
| `src/pages/SpaceMathScreen.tsx` + `.css` | Modify — `GameShell`; remove layout from `.spmath` |
| `src/pages/FroggerScreen.tsx` + `.css` | Modify — `ArcadeComplete` early return + `GameShell` for active; remove completion CSS; add `.fg-bounce` class |
| `src/pages/MiniGameScreen.tsx` + `.css` | Modify — `ArcadeComplete` early return + `GameShell`; remove completion CSS; add `.worm-bounce` class |
| `src/pages/ClickCircleScreen.tsx` + `.css` | Modify — `ArcadeComplete` early return + `GameShell` + `GameInstruction`; remove completion CSS |
| `src/index.css` | Modify — remove `.game-instruction` block |

---

## Task 1: Create `GameBox` component and migrate 5 display components

The three-line box pattern (`background: var(--bg-card); border: 4px solid var(--bg-light); border-bottom: 6px solid var(--game-color-dark)`) and its `transition` are repeated verbatim in LetterDisplay, CountingDisplay, AnimalDisplay, HearPressDisplay, and WordDisplay. `GameBox` owns those lines; each display component keeps only its unique CSS.

**Files:**
- Create: `src/components/GameBox.tsx`
- Create: `src/components/GameBox.css`
- Modify: `src/components/LetterDisplay.tsx`
- Modify: `src/components/LetterDisplay.css`
- Modify: `src/components/CountingDisplay.tsx`
- Modify: `src/components/CountingDisplay.css`
- Modify: `src/components/AnimalDisplay.tsx`
- Modify: `src/components/AnimalDisplay.css`
- Modify: `src/components/HearPressDisplay.tsx`
- Modify: `src/components/HearPressDisplay.css`
- Modify: `src/components/WordDisplay.tsx`
- Modify: `src/components/WordDisplay.css`

- [ ] **Step 1: Create `GameBox.tsx`**

```tsx
import './GameBox.css'

interface GameBoxProps {
  className?: string
  children?: React.ReactNode
}

export function GameBox({ className, children }: GameBoxProps) {
  return (
    <div className={['game-box', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create `GameBox.css`**

```css
.game-box {
  background: var(--bg-card);
  border: 4px solid var(--bg-light);
  border-bottom: 6px solid var(--game-color-dark, var(--bg-light));
  transition: border-color 0.15s, background 0.15s;
}
```

The `var(--game-color-dark, var(--bg-light))` fallback means components not inside a `GameScreen` context (which sets `--game-color-dark` via `style`) gracefully fall back to the neutral border.

- [ ] **Step 3: Migrate `LetterDisplay.tsx`**

Replace the outer `div` with `GameBox`. Import `GameBox` from `'./GameBox'`. The `key` prop is set by the parent via React, not the component itself, so it stays off the JSX here.

```tsx
import './LetterDisplay.css'

import type { FeedbackState } from '../types/game'
import { GameBox } from './GameBox'

interface LetterDisplayProps {
  character: string
  feedback: FeedbackState
  animKey: string
}

export function LetterDisplay({ character, feedback, animKey }: LetterDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <GameBox key={animKey} className={`letter-display ${feedbackClass}`}>
      {character}
    </GameBox>
  )
}
```

- [ ] **Step 4: Update `LetterDisplay.css` — remove the 3 repeated lines and transition**

Remove these lines from `.letter-display`:
```
background: var(--bg-card);
border: 4px solid var(--bg-light);
border-bottom: 6px solid var(--game-color-dark);
transition: border-color 0.15s, background 0.15s;
```

Final `.letter-display` rule:
```css
.letter-display {
  font-size: clamp(120px, 30vw, 200px);
  font-weight: 900;
  color: var(--game-color);
  border-radius: 24px;
  width: clamp(180px, 50vw, 280px);
  height: clamp(180px, 50vw, 280px);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  user-select: none;
}
```

- [ ] **Step 5: Migrate `CountingDisplay.tsx`**

```tsx
import './CountingDisplay.css'

import type { CountingItem, FeedbackState } from '../types/game'
import { GameBox } from './GameBox'

interface CountingDisplayProps {
  item: CountingItem
  feedback: FeedbackState
  animKey: string
}

export function CountingDisplay({ item, feedback, animKey }: CountingDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <GameBox key={animKey} className={`counting-display ${feedbackClass}`}>
      <div className="counting-objects">
        {Array.from({ length: item.count }, (_, i) => (
          <span key={i} className="counting-object" style={{ animationDelay: `${i * 0.05}s` }}>
            {item.emoji}
          </span>
        ))}
      </div>
    </GameBox>
  )
}
```

- [ ] **Step 6: Update `CountingDisplay.css` — remove 4 repeated lines**

Remove from `.counting-display`:
```
background: var(--bg-card);
border: 4px solid var(--bg-light);
border-bottom: 6px solid var(--game-color-dark);
transition: border-color 0.15s, background 0.15s;
```

Final `.counting-display` rule:
```css
.counting-display {
  border-radius: 24px;
  padding: 32px 40px;
  min-width: clamp(200px, 60vw, 340px);
  min-height: clamp(180px, 40vw, 260px);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
```

- [ ] **Step 7: Migrate `AnimalDisplay.tsx`**

```tsx
import './AnimalDisplay.css'

import type { AnimalItem, FeedbackState } from '../types/game'
import { GameBox } from './GameBox'

interface AnimalDisplayProps {
  item: AnimalItem
  feedback: FeedbackState
  animKey: string
}

export function AnimalDisplay({ item, feedback, animKey }: AnimalDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <GameBox key={animKey} className={`animal-display ${feedbackClass}`}>
      <div className="animal-display__emoji">{item.emoji}</div>
    </GameBox>
  )
}
```

- [ ] **Step 8: Update `AnimalDisplay.css` — remove 4 repeated lines**

Remove from `.animal-display`:
```
background: var(--bg-card);
border: 4px solid var(--bg-light);
border-bottom: 6px solid var(--game-color-dark);
transition: border-color 0.15s, background 0.15s;
```

Final `.animal-display` rule:
```css
.animal-display {
  border-radius: 24px;
  width: clamp(180px, 50vw, 280px);
  height: clamp(180px, 50vw, 280px);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
```

- [ ] **Step 9: Migrate `HearPressDisplay.tsx`**

```tsx
import './HearPressDisplay.css'

import type { FeedbackState } from '../types/game'
import { GameBox } from './GameBox'

interface HearPressDisplayProps {
  feedback: FeedbackState
  animKey: string
}

export function HearPressDisplay({ feedback, animKey }: HearPressDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <GameBox key={animKey} className={`hear-press-display ${feedbackClass}`}>
      <span className="hear-press-display__icon">👂</span>
    </GameBox>
  )
}
```

- [ ] **Step 10: Update `HearPressDisplay.css` — remove 4 repeated lines**

Remove from `.hear-press-display`:
```
background: var(--bg-card);
border: 4px solid var(--bg-light);
border-bottom: 6px solid var(--game-color-dark);
transition: border-color 0.15s, background 0.15s;
```

Final `.hear-press-display` rule:
```css
.hear-press-display {
  border-radius: 24px;
  width: clamp(180px, 50vw, 280px);
  height: clamp(180px, 50vw, 280px);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
```

- [ ] **Step 11: Migrate `WordDisplay.tsx`**

```tsx
import './WordDisplay.css'

import type { FeedbackState } from '../types/game'
import { GameBox } from './GameBox'

interface WordDisplayProps {
  word: string
  feedback: FeedbackState
  animKey: string
}

export function WordDisplay({ word, feedback, animKey }: WordDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <GameBox key={animKey} className={`word-display ${feedbackClass}`}>
      {word}
    </GameBox>
  )
}
```

- [ ] **Step 12: Update `WordDisplay.css` — remove 4 repeated lines**

Remove from `.word-display`:
```
background: var(--bg-card);
border: 4px solid var(--bg-light);
border-bottom: 6px solid var(--game-color-dark);
transition: border-color 0.15s, background 0.15s;
```

Final `.word-display` rule:
```css
.word-display {
  font-size: clamp(48px, 12vw, 80px);
  font-weight: 900;
  color: var(--game-color);
  border-radius: 24px;
  min-width: clamp(180px, 50vw, 320px);
  height: clamp(140px, 35vw, 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  user-select: none;
  padding: 0 24px;
  text-transform: capitalize;
}
```

- [ ] **Step 13: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 14: Commit**

```bash
git add src/components/GameBox.tsx src/components/GameBox.css \
        src/components/LetterDisplay.tsx src/components/LetterDisplay.css \
        src/components/CountingDisplay.tsx src/components/CountingDisplay.css \
        src/components/AnimalDisplay.tsx src/components/AnimalDisplay.css \
        src/components/HearPressDisplay.tsx src/components/HearPressDisplay.css \
        src/components/WordDisplay.tsx src/components/WordDisplay.css
git commit -m "feat: GameBox component — extract repeated display box CSS from 5 components"
```

---

## Task 2: Create `GameInstruction` component and migrate 3 screens

`.game-instruction` is a shared CSS class in `index.css` used by 4 screens. Under the rule "CSS lives in the component that owns it", this becomes a component. (ClickCircleScreen is migrated in Task 4.)

**Files:**
- Create: `src/components/GameInstruction.tsx`
- Create: `src/components/GameInstruction.css`
- Modify: `src/pages/SimonSaysScreen.tsx`
- Modify: `src/pages/FollowArrowScreen.tsx`
- Modify: `src/pages/MouseDirectionScreen.tsx`

- [ ] **Step 1: Create `GameInstruction.tsx`**

```tsx
import './GameInstruction.css'

import { CoreText } from '@core'

interface GameInstructionProps {
  children: React.ReactNode
}

export function GameInstruction({ children }: GameInstructionProps) {
  return <CoreText size="p" className="game-instruction">{children}</CoreText>
}
```

- [ ] **Step 2: Create `GameInstruction.css`**

```css
.game-instruction {
  text-align: center;
  font-size: clamp(1rem, 3vw, 1.4rem);
  font-weight: 600;
  padding: 8px 20px 12px;
  color: var(--text-muted);
}
```

- [ ] **Step 3: Migrate `SimonSaysScreen.tsx`**

Find the line:
```tsx
<CoreText size="p" className="game-instruction">
```

Replace with `<GameInstruction>`. Add import at top of file:
```tsx
import { GameInstruction } from '../components/GameInstruction'
```

The full JSX after the change:
```tsx
<GameInstruction>
  {isDo ? `Press  ${currentRound.char}` : "Don't press anything!"}
</GameInstruction>
```

Remove `className="game-instruction"` and the `CoreText` import if it's no longer used elsewhere in that file (check: SimonSaysScreen may only use CoreText for this line).

- [ ] **Step 4: Migrate `FollowArrowScreen.tsx`**

Add import:
```tsx
import { GameInstruction } from '../components/GameInstruction'
```

Replace:
```tsx
<CoreText size="p" className="game-instruction">
  Press the <strong>{currentDir}</strong> arrow key
</CoreText>
```

With:
```tsx
<GameInstruction>
  Press the <strong>{currentDir}</strong> arrow key
</GameInstruction>
```

Remove `CoreText` from `@core` import if no longer used in this file.

- [ ] **Step 5: Migrate `MouseDirectionScreen.tsx`**

Add import:
```tsx
import { GameInstruction } from '../components/GameInstruction'
```

Replace:
```tsx
<CoreText size="p" className="game-instruction">
  Move your mouse to the <strong>{LABELS[currentDir]}</strong> box!
</CoreText>
```

With:
```tsx
<GameInstruction>
  Move your mouse to the <strong>{LABELS[currentDir]}</strong> box!
</GameInstruction>
```

Remove `CoreText` from `@core` import if no longer used in this file.

- [ ] **Step 6: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/GameInstruction.tsx src/components/GameInstruction.css \
        src/pages/SimonSaysScreen.tsx src/pages/FollowArrowScreen.tsx \
        src/pages/MouseDirectionScreen.tsx
git commit -m "feat: GameInstruction component — extract game-instruction CSS from index.css"
```

---

## Task 3: Create `GameShell` component and migrate 7 screens

Every custom game screen follows the exact same outer pattern: `CoreScreen` + `GameTopbar`. `GameShell` encapsulates this. It accepts all `SharedLayoutProps` (so `center`, `paddingBottom`, `style`, etc. pass through to `CoreScreen`) plus the three topbar props.

**Files:**
- Create: `src/components/GameShell.tsx`
- Modify: `src/pages/ChaseBallScreen.tsx`
- Modify: `src/pages/ClickLetterScreen.tsx`
- Modify: `src/pages/SimonSaysScreen.tsx`
- Modify: `src/pages/FollowArrowScreen.tsx`
- Modify: `src/pages/MouseDirectionScreen.tsx`
- Modify: `src/pages/TicTacToeScreen.tsx`
- Modify: `src/pages/SpaceMathScreen.tsx`
- Modify: `src/pages/SpaceMathScreen.css`

- [ ] **Step 1: Create `GameShell.tsx`**

No CSS file needed — `CoreScreen` owns the screen layout CSS, `GameTopbar` owns its own CSS.

```tsx
import { CoreScreen, type SharedLayoutProps } from '@core'
import { GameTopbar } from './ui/GameTopbar'

interface GameShellProps extends SharedLayoutProps {
  onBack: () => void
  percent: number
  score: number
  center?: boolean
}

export function GameShell({ onBack, percent, score, center, children, ...rest }: GameShellProps) {
  return (
    <CoreScreen center={center} {...rest}>
      <GameTopbar onBack={onBack} percent={percent} score={score} />
      {children}
    </CoreScreen>
  )
}
```

- [ ] **Step 2: Migrate `ChaseBallScreen.tsx`**

Add import:
```tsx
import { GameShell } from '../components/GameShell'
```

Remove import of `CoreScreen` from `@core` (no longer used directly). Remove import of `GameTopbar`.

Replace:
```tsx
return (
  <CoreScreen className="cbs">
    <GameTopbar onBack={onBack} percent={(round / TOTAL) * 100} score={score} />
    <div className="cbs-arena" ref={arenaRef} onMouseMove={handleMouseMove}>
```

With:
```tsx
return (
  <GameShell onBack={onBack} percent={(round / TOTAL) * 100} score={score} className="cbs">
    <div className="cbs-arena" ref={arenaRef} onMouseMove={handleMouseMove}>
```

And close `</GameShell>` instead of `</CoreScreen>`.

- [ ] **Step 3: Migrate `ClickLetterScreen.tsx`**

Add import:
```tsx
import { GameShell } from '../components/GameShell'
```

Remove `CoreScreen` from `@core` import. Remove `GameTopbar` import.

Replace:
```tsx
return (
  <CoreScreen className="cls">
    <GameTopbar onBack={onBack} percent={(round / TOTAL) * 100} score={score} />
```

With:
```tsx
return (
  <GameShell onBack={onBack} percent={(round / TOTAL) * 100} score={score} className="cls">
```

Update closing tag to `</GameShell>`.

- [ ] **Step 4: Migrate `SimonSaysScreen.tsx`**

Add import:
```tsx
import { GameShell } from '../components/GameShell'
```

Remove `CoreScreen` from `@core` import (already removed `CoreText` in Task 2 if applicable). Remove `GameTopbar` import.

Replace:
```tsx
return (
  <CoreScreen center className="ss">
    <GameTopbar onBack={onBack} percent={(round / TOTAL) * 100} score={score} />
```

With:
```tsx
return (
  <GameShell onBack={onBack} percent={(round / TOTAL) * 100} score={score} center className="ss">
```

Update closing tag to `</GameShell>`.

- [ ] **Step 5: Migrate `FollowArrowScreen.tsx`**

Add import:
```tsx
import { GameShell } from '../components/GameShell'
```

Remove `CoreScreen` from `@core` import. Remove `GameTopbar` import.

Replace:
```tsx
return (
  <CoreScreen className="fa">
    <GameTopbar onBack={onBack} percent={(round / TOTAL) * 100} score={score} />
```

With:
```tsx
return (
  <GameShell onBack={onBack} percent={(round / TOTAL) * 100} score={score} className="fa">
```

Update closing tag to `</GameShell>`.

- [ ] **Step 6: Migrate `MouseDirectionScreen.tsx`**

Add import:
```tsx
import { GameShell } from '../components/GameShell'
```

Remove `CoreScreen` from `@core` import. Remove `GameTopbar` import.

Replace:
```tsx
return (
  <CoreScreen className="mds">
    <GameTopbar onBack={onBack} percent={(round / TOTAL) * 100} score={score} />
```

With:
```tsx
return (
  <GameShell onBack={onBack} percent={(round / TOTAL) * 100} score={score} className="mds">
```

Update closing tag to `</GameShell>`.

- [ ] **Step 7: Migrate `TicTacToeScreen.tsx`**

Add import:
```tsx
import { GameShell } from '../components/GameShell'
```

Remove `CoreScreen` from `@core` import. Remove `GameTopbar` import.

Replace:
```tsx
return (
  <CoreScreen center paddingBottom={24} className="ttt">
    {result === 'win' && <Confetti />}
    <GameTopbar onBack={onBack} percent={0} score={0} />
```

With:
```tsx
return (
  <GameShell onBack={onBack} percent={0} score={0} center paddingBottom={24} className="ttt">
    {result === 'win' && <Confetti />}
```

Update closing tag to `</GameShell>`.

- [ ] **Step 8: Migrate `SpaceMathScreen.tsx`**

`SpaceMathScreen` currently uses a raw `<div className="spmath">` (does not import `CoreScreen`). Add imports:

```tsx
import { GameShell } from '../components/GameShell'
```

Remove `GameTopbar` import (no longer needed directly).

Replace:
```tsx
return (
  <div className="spmath">
    {phase === 'win' && <Confetti />}
    <GameTopbar onBack={onBack} percent={(score / WIN_SCORE) * 100} score={score} />
```

With:
```tsx
return (
  <GameShell onBack={onBack} percent={(score / WIN_SCORE) * 100} score={score} className="spmath">
    {phase === 'win' && <Confetti />}
```

Update closing tag: `</div>` → `</GameShell>`.

- [ ] **Step 9: Update `SpaceMathScreen.css` — remove layout declarations from `.spmath`**

`.spmath` currently contains layout declarations that `CoreScreen` now handles. Remove these lines:
```
display: flex;
flex-direction: column;
align-items: center;
height: 100dvh;
background: var(--bg);
```

Keep these (they are unique overrides and game-specific CSS vars):
```css
.spmath {
  --game-color: var(--purple);
  --game-color-dark: var(--purple-dark);
  overflow: hidden;
  user-select: none;
}
```

Note: `CoreScreen` uses `min-height: 100dvh`. SpaceMathScreen needs exactly `100dvh` (it's a fixed-viewport space shooter). Override by adding `height: 100dvh` to `.spmath`:
```css
.spmath {
  --game-color: var(--purple);
  --game-color-dark: var(--purple-dark);
  height: 100dvh;
  overflow: hidden;
  user-select: none;
}
```

- [ ] **Step 10: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 11: Commit**

```bash
git add src/components/GameShell.tsx \
        src/pages/ChaseBallScreen.tsx src/pages/ClickLetterScreen.tsx \
        src/pages/SimonSaysScreen.tsx src/pages/FollowArrowScreen.tsx \
        src/pages/MouseDirectionScreen.tsx src/pages/TicTacToeScreen.tsx \
        src/pages/SpaceMathScreen.tsx src/pages/SpaceMathScreen.css
git commit -m "feat: GameShell component — extract CoreScreen+GameTopbar pattern from 7 screens"
```

---

## Task 4: Create `ArcadeComplete` component and migrate 3 screens

FroggerScreen, MiniGameScreen, and ClickCircleScreen each have bespoke completion markup (raw `div`/`h2`/`p`) with duplicate CSS. `ArcadeComplete` is the standalone completion screen for arcade-style games (no star ratings). It mirrors the structure of `GameComplete` but without the progression-system elements.

Each screen also gets migrated to `GameShell` for its active-game state.

Note: Both FroggerScreen and MiniGameScreen have unique emoji bounce animations. These stay in their own CSS files but are applied via the `emojiClassName` prop on `ArcadeComplete`.

**Files:**
- Create: `src/components/ArcadeComplete.tsx`
- Create: `src/components/ArcadeComplete.css`
- Modify: `src/pages/FroggerScreen.tsx`
- Modify: `src/pages/FroggerScreen.css`
- Modify: `src/pages/MiniGameScreen.tsx`
- Modify: `src/pages/MiniGameScreen.css`
- Modify: `src/pages/ClickCircleScreen.tsx`
- Modify: `src/pages/ClickCircleScreen.css`

- [ ] **Step 1: Create `ArcadeComplete.tsx`**

```tsx
import './ArcadeComplete.css'

import { Button } from './ui/Button'
import { Confetti } from './Confetti'
import { CoreCol, CoreRow, CoreText } from '@core'

interface ArcadeCompleteProps {
  emoji: string
  title: string
  subtitle: string
  onRestart: () => void
  onHome: () => void
  emojiClassName?: string
}

export function ArcadeComplete({ emoji, title, subtitle, onRestart, onHome, emojiClassName }: ArcadeCompleteProps) {
  return (
    <>
      <Confetti />
      <CoreCol flex={1} align="center" justify="center" gap={12} padding={20} className="arcade-complete">
        <span className={['arcade-complete__emoji', emojiClassName].filter(Boolean).join(' ')}>
          {emoji}
        </span>
        <CoreText size="h2" className="arcade-complete__title">{title}</CoreText>
        <CoreText size="p" className="arcade-complete__subtitle">{subtitle}</CoreText>
        <CoreRow gap={16} marginTop={16}>
          <Button variant="primary" onClick={onRestart}>Play Again</Button>
          <Button variant="secondary" onClick={onHome}>Home</Button>
        </CoreRow>
      </CoreCol>
    </>
  )
}
```

- [ ] **Step 2: Create `ArcadeComplete.css`**

```css
.arcade-complete__emoji {
  font-size: 80px;
  line-height: 1;
}

.arcade-complete__title {
  color: var(--green);
  margin: 0;
}

.arcade-complete__subtitle {
  color: var(--text-muted);
  font-weight: 600;
  margin: 0;
}
```

- [ ] **Step 3: Migrate `FroggerScreen.tsx`**

Add imports at the top:
```tsx
import { ArcadeComplete } from '../components/ArcadeComplete'
import { GameShell } from '../components/GameShell'
```

Remove imports: `CoreScreen` (from `@core`), `GameTopbar`, `Confetti` (now handled inside `ArcadeComplete`).

**Add early return before the main `return`:**

```tsx
if (done) {
  return (
    <ArcadeComplete
      emoji="🐸"
      title="You made it!"
      subtitle={`Crossed ${GOAL_SCORE} times!`}
      onRestart={restart}
      onHome={onBack}
      emojiClassName="fg-bounce"
    />
  )
}
```

**Replace the main return:**

The current main return has `<CoreScreen className="fg">` + `<GameTopbar>` + conditional done/not-done content. After the early return above handles `done`, the main return only needs the active game state.

Remove `{done && <Confetti />}` and the `{done ? (...) : (...)}` conditional. Keep only the `fg-content` branch.

```tsx
return (
  <GameShell onBack={onBack} percent={(score / GOAL_SCORE) * 100} score={score} className="fg">
    <div className="fg-content">
      <div className="fg-arena" ref={arenaRef}>
        {/* ... rest of arena content unchanged ... */}
      </div>
      {/* ... rest of fg-content unchanged ... */}
    </div>
  </GameShell>
)
```

- [ ] **Step 4: Update `FroggerScreen.css` — remove completion CSS, add `.fg-bounce` class**

Remove the entire `/* ── Complete screen ──` block:
```css
.fg-complete { ... }
.fg-complete-emoji { ... }
@keyframes fg-bounce { ... }
.fg-complete-title { ... }
.fg-complete-sub { ... }
.fg-complete-actions { ... }
```

Add a standalone `.fg-bounce` class right after the removed block (the `@keyframes fg-bounce` stays, just the class that uses it changes name):

```css
/* Arcade complete emoji animation */
.fg-bounce {
  animation: fg-bounce 0.6s ease infinite alternate;
}

@keyframes fg-bounce {
  from { transform: translateY(0); }
  to   { transform: translateY(-16px); }
}
```

- [ ] **Step 5: Migrate `MiniGameScreen.tsx`**

Add imports:
```tsx
import { ArcadeComplete } from '../components/ArcadeComplete'
import { GameShell } from '../components/GameShell'
```

Remove imports: `CoreScreen` (from `@core`), `GameTopbar`, `Confetti` (handled inside `ArcadeComplete`), and `Button` if it is only used in the completion block (check the rest of the file first).

**Replace the `if (isComplete)` early return:**

Current:
```tsx
if (isComplete) {
  return (
    <>
      <Confetti />
      <CoreScreen className="mini-game">
        <GameTopbar onBack={onBack} percent={100} score={WIN_SCORE} />
        <div className="mini-game-complete">
          <div className="mini-complete-emoji">🐛</div>
          <h2 className="mini-complete-title">Yummy!</h2>
          <p className="mini-complete-subtitle">You ate {WIN_SCORE} letters!</p>
          <div className="mini-complete-actions">
            <Button variant="primary" onClick={restart}>Play Again</Button>
            <Button variant="secondary" onClick={onBack}>Home</Button>
          </div>
        </div>
      </CoreScreen>
    </>
  )
}
```

Replace with:
```tsx
if (isComplete) {
  return (
    <ArcadeComplete
      emoji="🐛"
      title="Yummy!"
      subtitle={`You ate ${WIN_SCORE} letters!`}
      onRestart={restart}
      onHome={onBack}
      emojiClassName="worm-bounce"
    />
  )
}
```

**Replace main `return`:**

```tsx
return (
  <GameShell onBack={onBack} percent={(score / WIN_SCORE) * 100} score={score} className="mini-game">
    <div className="mini-game-area">
      {/* ... rest unchanged ... */}
    </div>
  </GameShell>
)
```

Also remove the `Button` import if it's only used in the completion block (check the rest of the file — if not used elsewhere, remove it).

- [ ] **Step 6: Update `MiniGameScreen.css` — remove completion CSS, add `.worm-bounce` class**

Remove the entire `/* Complete screen */` block:
```css
.mini-game-complete { ... }
.mini-complete-emoji { ... }
@keyframes worm-bounce { ... }
.mini-complete-title { ... }
.mini-complete-subtitle { ... }
.mini-complete-actions { ... }
```

Add `.worm-bounce` class with the keyframe:
```css
/* Arcade complete emoji animation */
.worm-bounce {
  animation: worm-bounce 0.6s ease infinite alternate;
}

@keyframes worm-bounce {
  from { transform: translateY(0) rotate(-10deg); }
  to   { transform: translateY(-16px) rotate(10deg); }
}
```

- [ ] **Step 7: Migrate `ClickCircleScreen.tsx`**

Add imports:
```tsx
import { ArcadeComplete } from '../components/ArcadeComplete'
import { GameInstruction } from '../components/GameInstruction'
import { GameShell } from '../components/GameShell'
```

Remove imports: `CoreScreen` (from `@core`), `GameTopbar`, `Confetti` (handled inside `ArcadeComplete`), `Button` (only used in the done block). Remove `CoreText` from `@core` import (replaced by `GameInstruction`).

**Replace `if (done)` early return:**

Current:
```tsx
if (done) {
  return (
    <CoreScreen center className="cc">
      <Confetti />
      <GameTopbar onBack={onBack} percent={100} score={TOTAL} />
      <div className="cc-complete">
        <div className="cc-complete-emoji">🎉</div>
        <h2 className="cc-complete-title">You got them all!</h2>
        <p className="cc-complete-score">Clicked {TOTAL} circles!</p>
        <div className="cc-complete-actions">
          <Button variant="primary" onClick={handleRestart}>Play Again</Button>
          <Button variant="secondary" onClick={onBack}>Home</Button>
        </div>
      </div>
    </CoreScreen>
  )
}
```

Replace with:
```tsx
if (done) {
  return (
    <ArcadeComplete
      emoji="🎉"
      title="You got them all!"
      subtitle={`Clicked ${TOTAL} circles!`}
      onRestart={handleRestart}
      onHome={onBack}
    />
  )
}
```

**Replace main `return`:**

```tsx
return (
  <GameShell onBack={onBack} percent={(score / TOTAL) * 100} score={score} className="cc">
    <GameInstruction>Click the moving circle!</GameInstruction>
    <div className="cc-arena" ref={arenaRef}>
      <div
        ref={circleRef}
        className={`cc-circle ${flash ? 'cc-circle--hit' : ''}`}
        onClick={handleClick}
        style={{ width: CIRCLE_R * 2, height: CIRCLE_R * 2 }}
      />
    </div>
  </GameShell>
)
```

- [ ] **Step 8: Update `ClickCircleScreen.css` — remove completion CSS block**

Remove these rules (lines 25–38):
```css
.cc-complete { ... }
.cc-complete-emoji { ... }
.cc-complete-title { ... }
.cc-complete-score { ... }
.cc-complete-actions { ... }
```

The arena and circle rules stay.

- [ ] **Step 9: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add src/components/ArcadeComplete.tsx src/components/ArcadeComplete.css \
        src/pages/FroggerScreen.tsx src/pages/FroggerScreen.css \
        src/pages/MiniGameScreen.tsx src/pages/MiniGameScreen.css \
        src/pages/ClickCircleScreen.tsx src/pages/ClickCircleScreen.css
git commit -m "feat: ArcadeComplete component — replace bespoke completion markup in 3 arcade screens"
```

---

## Task 5: Clean up `index.css`

Now that `GameInstruction` owns `.game-instruction`, remove it from `index.css`. Verify nothing else was left behind.

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Remove `.game-instruction` block from `index.css`**

Remove these lines from `src/index.css`:
```css
.game-instruction {
  text-align: center;
  font-size: clamp(1rem, 3vw, 1.4rem);
  font-weight: 600;
  padding: 8px 20px 12px;
  color: var(--text-muted);
}
```

After removal, `index.css` should contain only:
- The `* { margin: 0; padding: 0; box-sizing: border-box; }` reset
- The `:root { ... }` CSS variable block
- The `body { ... }` and `#root { ... }` base layout rules
- The `.anim-pop` and `.anim-shake` classes and their `@keyframes`

These two animation classes and keyframes are intentionally global — they are referenced by component CSS files by name and `@keyframes` are inherently scoped to the stylesheet origin, not the component.

- [ ] **Step 2: Verify no remaining shared utility classes**

```bash
grep -n "^\." src/index.css
```

Expected output should be only:
```
.anim-pop
.anim-shake
```

If any other class selectors appear, investigate whether they belong in a component.

- [ ] **Step 3: Type-check**

```bash
source ~/.nvm/nvm.sh && npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "chore: remove .game-instruction from index.css — now owned by GameInstruction component"
```
