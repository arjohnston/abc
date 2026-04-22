# AGENTS.md — ABC 123 Codebase Guide

Read this fully before making any changes. It is the authoritative reference for all layout, text, and component patterns.

---

## Core Component Library

All layout, text, and container primitives live in `src/core/`. Always import from the `@core` alias:

```ts
import { CoreRow, CoreCol, CoreText, CoreScreen, Spacing } from '@core'
```

**Never use a raw `div`, `span`, `p`, `h1`–`h6`, or `section` for layout or text.** Always use a core primitive.

---

## Rules

1. **No raw layout elements.** Use `CoreRow`, `CoreCol`, or `CoreBox` instead of `div`/`section`/`article`.
2. **No raw text elements.** Use `CoreText` instead of `h1`–`h6`, `p`, or `span`.
3. **No inline style for spacing on non-core components.** Pass `padding`, `gap`, `margin` etc. to the core primitive wrapping the content.
4. **No new flex wrapper divs.** Use `CoreRow` or `CoreCol`.
5. **Use Spacing tokens for scale values.** Use `Spacing.md` not `16` when the value maps to the scale. Raw numbers are OK for values not on the scale (10, 20, etc.).
6. **Follow BEM** in all CSS files: `block`, `block__element`, `block--modifier`.
7. **One exported component per file.** File name matches the component name.
8. **Co-locate CSS.** Each `.tsx` gets a matching `.css` file.

---

## Tokens

Exported from `@core`. Use in both JSX props and JavaScript logic.

### `Spacing`

8px-grid constants. Numeric props still accept raw numbers — tokens are opt-in aliases.

```ts
import { Spacing } from '@core'

Spacing.xxs // 4
Spacing.xs // 8
Spacing.sm // 12
Spacing.md // 16
Spacing.lg // 24
Spacing.xl // 32
Spacing.xxl // 48
```

**When to use tokens:** When the value is on the scale (4, 8, 12, 16, 24, 32, 48). Leave values like 10 or 20 as raw numbers — don't round to the nearest token.

```tsx
// ✅ good
<CoreRow gap={Spacing.md} padding={Spacing.lg} />

// ✅ also fine — 20 isn't on the scale
<CoreCol padding={20} />

// ❌ avoid
<CoreRow gap={16} />  // use Spacing.md
```

### `Colors`

Raw hex values mirroring every CSS variable. Use in JS-side logic (canvas, dynamic styles, computed values). In CSS, always use the CSS variable instead.

```ts
import { Colors } from '@core'

Colors.green // '#58cc02'
Colors.greenDark // '#46a302'
Colors.blue // '#1cb0f6'
Colors.purple // '#ce82ff'
Colors.orange // '#ff9600'
Colors.red // '#ff4b4b'
Colors.yellow // '#ffc800'
Colors.bg // '#131f24'
Colors.bgCard // '#1a2c33'
Colors.bgLight // '#235264'
Colors.text // '#ffffff'
Colors.textMuted // '#96b0bc'
```

```tsx
// ✅ JS-side color reference
const ctx = canvas.getContext('2d')
ctx.fillStyle = Colors.green

// ✅ CSS — use the variable, not the raw value
.my-element { color: var(--green); }
```

### `FontSize` / `FontWeight`

Match the values used in CoreText CSS. Use when you need to replicate typography in non-CoreText contexts (canvas, SVG, dynamic styles).

```ts
import { FontSize, FontWeight } from '@core'

FontSize.h1 // 'clamp(2.5rem, 7vw, 4.5rem)'
FontSize.body // '1rem'

FontWeight.regular // 400
FontWeight.semibold // 600
FontWeight.bold // 700
FontWeight.black // 900
```

---

## Shared Layout Props

All layout primitives (CoreBox, CoreRow, CoreCol, CoreScreen, CoreCard, CoreGameArena, CoreScrollView) inherit these:

```ts
// Spacing
padding?: number          paddingHorizontal?: number    paddingVertical?: number
paddingTop?: number       paddingBottom?: number        paddingLeft?: number
paddingRight?: number

margin?: number           marginHorizontal?: number     marginVertical?: number
marginTop?: number        marginBottom?: number         marginLeft?: number
marginRight?: number

// Layout
gap?: number              width?: number | string       height?: number | string
flex?: number             borderRadius?: number         background?: string

// React standard
style?: React.CSSProperties
className?: string        // appended to the block class, never replaces it
children?: React.ReactNode
```

Shorthand props expand to directional properties. Directional props override shorthands:

```tsx
// paddingLeft will be 20 (paddingLeft overrides the paddingHorizontal expansion)
<CoreRow paddingHorizontal={16} paddingLeft={20} />
```

---

## Primitives

### `CoreBox`

**What:** Generic block container. The `as` prop makes it polymorphic.  
**When to use:** Semantic wrappers (`section`, `article`, `main`) or any non-flex container needing spacing props.  
**When NOT to use:** When you need flex layout — use `CoreRow` or `CoreCol`.

```tsx
import { CoreBox } from '@core'

// Generic wrapper
<CoreBox padding={Spacing.lg}>...</CoreBox>

// Semantic element
<CoreBox as="section" padding={Spacing.lg} className="my-section">
  ...
</CoreBox>

// Ref forwarding
const ref = useRef<HTMLElement>(null)
<CoreBox ref={ref} />
```

Props:

```ts
as?: React.ElementType  // default: 'div'
// + SharedLayoutProps
```

---

### `CoreRow`

**What:** Horizontal flex container.  
**When to use:** Any side-by-side layout: toolbars, button groups, stat rows, icon+label pairs.  
**When NOT to use:** Vertical stacks — use `CoreCol`.

```tsx
<CoreRow align="center" justify="space-between" gap={Spacing.md} padding={Spacing.sm}>
  <BackButton />
  <ProgressBar />
  <ScoreBadge />
</CoreRow>

// With wrapping
<CoreRow wrap gap={Spacing.sm}>
  {items.map(item => <Tag key={item.id}>{item.label}</Tag>)}
</CoreRow>
```

Props:

```ts
align?:   'flex-start' | 'center' | 'flex-end' | 'stretch'
justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
wrap?:    boolean
// + SharedLayoutProps
```

---

### `CoreCol`

**What:** Vertical flex container.  
**When to use:** Any top-to-bottom stack: page sections, card content, form fields, game screens.  
**When NOT to use:** Horizontal layouts — use `CoreRow`.

```tsx
<CoreCol flex={1} align="center" justify="center" gap={Spacing.lg} padding={20}>
  <CoreText size="h3" color="muted">
    Press this key!
  </CoreText>
  <LetterDisplay />
  <VirtualKeyboard />
</CoreCol>
```

Props:

```ts
align?:   'flex-start' | 'center' | 'flex-end' | 'stretch'
justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
// + SharedLayoutProps
```

---

### `CoreScreen`

**What:** Full-height page shell. Always the root of a page component.  
**When to use:** Once per page/screen — wraps everything inside a route.  
**When NOT to use:** As a nested container inside another screen.

```tsx
<CoreScreen className="game" style={{ '--game-color': game.color } as React.CSSProperties}>
  <GameTopbar ... />
  <CoreCol flex={1}>...</CoreCol>
</CoreScreen>

// Centered layout (e.g. arcade/bonus screens)
<CoreScreen center padding={Spacing.md}>
  ...
</CoreScreen>
```

Props:

```ts
center?: boolean  // adds align-items: center
// + SharedLayoutProps
```

---

### `CoreText`

**What:** All text rendering — replaces every `h1`–`h6`, `p`, and `span`.  
**When to use:** Any visible text in the UI.  
**When NOT to use:** For non-text content; don't wrap icons or images in CoreText.

The `size` prop controls both the **rendered HTML tag** and the **font size**:

| size     | Tag      | Font size                  | Weight |
| -------- | -------- | -------------------------- | ------ |
| `'h1'`   | `<h1>`   | clamp(2.5rem, 7vw, 4.5rem) | 900    |
| `'h2'`   | `<h2>`   | clamp(1.4rem, 4vw, 2rem)   | 900    |
| `'h3'`   | `<h3>`   | clamp(1rem, 3vw, 1.5rem)   | 700    |
| `'body'` | `<p>`    | 1rem                       | 400    |
| `'sm'`   | `<span>` | 0.9rem                     | 600    |

```tsx
<CoreText size="h1" color="game">Amazing!</CoreText>
<CoreText size="h3" color="muted">Press this key!</CoreText>
<CoreText size="body">You got <strong>{score}</strong> out of <strong>{total}</strong>!</CoreText>

// With aria and data attributes (passes through to the HTML element)
<CoreText size="h2" id="modal-title" aria-label="Settings">Settings</CoreText>

// Ref forwarding
const ref = useRef<HTMLElement>(null)
<CoreText ref={ref} size="h1">Title</CoreText>
```

Props:

```ts
size?:      'h1' | 'h2' | 'h3' | 'body' | 'sm'  // default: 'body'
color?:     'default' | 'muted' | 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'yellow' | 'game'
align?:     'left' | 'center' | 'right'
// + React.HTMLAttributes<HTMLElement> (id, aria-*, data-*, onClick, etc.)
```

The `'game'` color resolves to `var(--game-color)`, which must be injected by an ancestor (GameScreen does this via `style={{ '--game-color': game.color }}`).

---

### `CoreCard`

**What:** Styled panel — `bg-card` background, subtle border, rounded corners.  
**When to use:** Any visually distinct content panel: modals, info sections, settings panels.  
**When NOT to use:** As a pure layout wrapper with no visual identity — use `CoreBox` or `CoreCol`.

**Compound sub-parts:** `CoreCard.Header`, `CoreCard.Body`, `CoreCard.Footer`

```tsx
import { CoreCard } from '@core'

// Simple card
<CoreCard padding={Spacing.lg}>
  <CoreText size="h3">Title</CoreText>
</CoreCard>

// Compound layout
<CoreCard>
  <CoreCard.Header padding={Spacing.md}>
    <CoreRow align="center" justify="space-between">
      <CoreText size="h3">Settings</CoreText>
      <button className="close-btn">✕</button>
    </CoreRow>
  </CoreCard.Header>

  <CoreCard.Body>
    <CoreText>Content here</CoreText>
  </CoreCard.Body>

  <CoreCard.Footer padding={Spacing.md}>
    <CoreRow gap={Spacing.sm}>
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
    </CoreRow>
  </CoreCard.Footer>
</CoreCard>
```

Props:

```ts
as?: React.ElementType  // default: 'div'
// + SharedLayoutProps (all three sub-parts also accept SharedLayoutProps)
```

Sub-parts default padding:

- `CoreCard.Header` — `padding: 16px`, `border-bottom`
- `CoreCard.Body` — `padding: 24px`, `flex: 1`
- `CoreCard.Footer` — `padding: 16px`, `border-top`

Override sub-part padding by passing the prop directly:

```tsx
<CoreCard.Body padding={Spacing.xl}>...</CoreCard.Body>
```

---

### `CorePressable`

**What:** Zero-style clickable wrapper that renders as a `<button>` for proper semantics and keyboard accessibility.  
**When to use:** Clickable containers that aren't styled buttons: game nodes, card taps, nav items, icon buttons.  
**When NOT to use:** When you need a button with visible label styling — use `Button` from `components/ui` instead.

The prop `htmlType` is the remapped form of the native `type` attribute. This prevents accidental collision when spreading props.

```tsx
import { CorePressable } from '@core'

// Basic clickable container
<CorePressable onClick={() => onSelect(game)} aria-label={game.title}>
  <div className="path-node__circle">{game.emoji}</div>
  <div className="path-node__label">{game.title}</div>
</CorePressable>

// Disabled state (must pair with onClick for the button to have a purpose)
<CorePressable onClick={handlePress} disabled={isLocked}>
  ...
</CorePressable>

// Submit button (non-default type)
<CorePressable htmlType="submit" padding={Spacing.md}>
  Submit
</CorePressable>

// Ref forwarding
const ref = useRef<HTMLButtonElement>(null)
<CorePressable ref={ref} onClick={handlePress} />
```

Props:

```ts
onClick?:         React.MouseEventHandler<HTMLButtonElement>
onPointerDown?:   React.PointerEventHandler<HTMLButtonElement>
onPointerUp?:     React.PointerEventHandler<HTMLButtonElement>
disabled?:        boolean
htmlType?:        'button' | 'submit' | 'reset'  // default: 'button'
'aria-label'?:    string
'aria-expanded'?: boolean
'aria-pressed'?:  boolean
'data-tooltip'?:  string
tabIndex?:        number
// + SharedLayoutProps
```

**Dev warning:** `disabled` without any click handler triggers a console warning — the button would be disabled but serve no purpose.

---

### `CoreGameArena`

**What:** The main game content area — visual container for the play space.  
**When to use:** Exactly once per game screen, wrapping the display component and keyboard.  
**When NOT to use:** For non-game content panels — use `CoreCard` instead.

Provides: `flex: 1`, centered column layout, overflow hidden, subtle border and border-radius for the game "stage" look.

```tsx
import { CoreGameArena } from '@core'

<CoreScreen>
  <GameTopbar ... />
  <CoreGameArena padding={Spacing.lg}>
    <LetterDisplay ... />
    <VirtualKeyboard ... />
  </CoreGameArena>
</CoreScreen>
```

Props:

```ts
// SharedLayoutProps only — visual identity comes from CSS, not props
```

---

### `CoreScrollView`

**What:** Scrollable container with consistent overflow handling.  
**When to use:** Content areas that may overflow: long lists, home screen paths, horizontal carousels.  
**When NOT to use:** When the parent or `window` already handles scroll.

```tsx
import { CoreScrollView } from '@core'

// Vertical scroll (default)
<CoreScrollView flex={1}>
  {items.map(item => <Row key={item.id} item={item} />)}
</CoreScrollView>

// Horizontal scroll
<CoreScrollView horizontal padding={Spacing.md}>
  {cards.map(card => <Card key={card.id} card={card} />)}
</CoreScrollView>

// Ref forwarding (e.g. programmatic scroll)
const ref = useRef<HTMLDivElement>(null)
<CoreScrollView ref={ref}>...</CoreScrollView>
```

Props:

```ts
horizontal?: boolean  // enables overflow-x: auto, disables overflow-y
// + SharedLayoutProps
```

---

## Utility Types

### `RemapProps<TProps, TMap>`

Renames a conflicting native HTML prop. Used internally in `CorePressable` (renames `type` → `htmlType`).

```ts
import type { RemapProps } from '@core'

// Example: rename native 'size' to 'htmlSize' on an input wrapper
type InputProps = RemapProps<React.ComponentPropsWithoutRef<'input'>, { htmlSize: 'size' }>
```

### `warnMutuallyExclusive`

Dev-only console warning for mutually exclusive or contradictory prop combinations. Strips to no-op in production.

```ts
import { warnMutuallyExclusive } from '@core'

// Warn if both 'value' and 'defaultValue' are set
warnMutuallyExclusive('MyComponent', props, ['value', 'defaultValue'])

// Warn on multiple groups
warnMutuallyExclusive('MyComponent', props, ['horizontal', 'vertical'], ['size', 'flex'])
```

---

## forwardRef

All core components forward their ref to the root DOM element:

| Component         | Ref type            |
| ----------------- | ------------------- |
| `CoreBox`         | `HTMLElement`       |
| `CoreCard`        | `HTMLElement`       |
| `CoreCard.Header` | `HTMLDivElement`    |
| `CoreCard.Body`   | `HTMLDivElement`    |
| `CoreCard.Footer` | `HTMLDivElement`    |
| `CoreCol`         | `HTMLDivElement`    |
| `CoreGameArena`   | `HTMLDivElement`    |
| `CorePressable`   | `HTMLButtonElement` |
| `CoreRow`         | `HTMLDivElement`    |
| `CoreScreen`      | `HTMLDivElement`    |
| `CoreScrollView`  | `HTMLDivElement`    |
| `CoreText`        | `HTMLElement`       |

```tsx
const rowRef = useRef<HTMLDivElement>(null)
<CoreRow ref={rowRef}>...</CoreRow>
```

---

## BEM Convention

All CSS in this project uses BEM:

- **Block:** `section-banner`, `path-node`, `game-complete`
- **Element:** `section-banner__title`, `path-node__stars`
- **Modifier:** `path-node--locked`, `core-row--wrap`

Never use descendant selectors (`.parent .child`) when a BEM element (`parent__child`) can express the relationship.

Core component class names follow the same convention:

- `.core-row`, `.core-row--wrap`
- `.core-card`, `.core-card__header`, `.core-card__body`, `.core-card__footer`
- `.core-text`, `.core-text--h1`, `.core-text--body`

---

## Example — Before / After

```tsx
// Before
<div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
  <h2>Settings</h2>
  <div style={{ display: 'flex', gap: 12 }}>
    <button onClick={onClose}>Close</button>
  </div>
</div>

// After
<CoreCard>
  <CoreCard.Header padding={Spacing.md}>
    <CoreText size="h2">Settings</CoreText>
  </CoreCard.Header>
  <CoreCard.Body>
    <CoreRow gap={Spacing.sm}>
      <Button onClick={onClose}>Close</Button>
    </CoreRow>
  </CoreCard.Body>
</CoreCard>
```

---

## File Structure

```
src/core/
├── index.ts                    # Barrel: all components, tokens, utils
├── tokens/
│   ├── spacing.ts              # Spacing constants (8px grid)
│   ├── colors.ts               # Raw hex values mirroring CSS vars
│   ├── typography.ts           # FontSize + FontWeight scales
│   └── index.ts
├── utils/
│   ├── types.ts                # RemapProps utility type
│   ├── validation.ts           # warnMutuallyExclusive
│   └── index.ts
├── shared/
│   └── spacing.ts              # SharedLayoutProps + buildSpacingStyle
├── core-box/
├── core-card/
├── core-col/
├── core-game-arena/
├── core-pressable/
├── core-row/
├── core-screen/
├── core-scroll-view/
└── core-text/
```
