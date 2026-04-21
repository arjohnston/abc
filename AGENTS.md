# AGENTS.md — ABC 123 Codebase Guide

This file instructs AI agents working in this codebase. Read it fully before making any changes.

## Core Component Library

All layout, text, and container primitives live in `src/components/core/`. Always import from the `@core` alias:

```ts
import { CoreRow, CoreCol, CoreText, CoreScreen } from '@core'
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
size?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'label' | number  // semantic tag + font size, or raw px
variant?: 'heading' | 'subheading' | 'body' | 'muted' | 'label'
weight?: number      color?: string      align?: 'left' | 'center' | 'right'
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
