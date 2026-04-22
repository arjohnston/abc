# Core Component Library

Primitive layout, text, and container components. Import via the `@core` alias — never via relative paths into this directory.

```ts
import { CoreRow, CoreText, CoreScreen, Spacing } from '@core'
```

## Components

| Component        | Purpose                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `CoreBox`        | Polymorphic container (`as` prop, defaults to `div`)                                                |
| `CoreRow`        | Horizontal flex row (`gap`, `justify`, `align`, `wrap`)                                             |
| `CoreCol`        | Vertical flex column (`gap`, `justify`, `align`)                                                    |
| `CoreScreen`     | Full-height page shell (`center` for centering content)                                             |
| `CoreText`       | Typed text (`size`: h1–h3/body/sm; `color`: default/muted/green/blue/purple/orange/red/yellow/game) |
| `CoreCard`       | Panel with optional `CoreCard.Header` / `CoreCard.Body` / `CoreCard.Footer` sub-parts               |
| `CorePressable`  | Semantic `<button>` wrapper with layout props and ARIA support                                      |
| `CoreGameArena`  | Game stage container                                                                                |
| `CoreScrollView` | Vertical/horizontal overflow container                                                              |

## Tokens (JS-side)

```ts
Spacing.xs   // 4   — use for gap/padding props
Spacing.sm   // 8
Spacing.md   // 16
Spacing.lg   // 24
Spacing.xl   // 32
Spacing.xxl  // 48

Colors.green / Colors.blue / Colors.purple ...
FontSize.sm / FontSize.body / FontSize.h1 ...
FontWeight.regular / FontWeight.bold / FontWeight.black
```

Use CSS variables (`var(--green)`) in `.css` files, token constants only in JS/TS logic.

## Rules

1. Never import from `**/core/**` — always use `@core`.
2. Never use raw `<div>` / `<span>` / `<p>` for layout or text — use core primitives.
3. Core components must not import from pages, common/components, or games.
4. Co-locate `.css` with `.tsx` in each `core-X/` subdirectory.
5. Stories live alongside the component: `core-X/CoreX.stories.tsx`.
6. All primitives forward refs and accept `SharedLayoutProps` (padding, margin, gap, etc.).
