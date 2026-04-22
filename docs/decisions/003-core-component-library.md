# ADR 003: Core Component Library via @core Alias

**Status:** Accepted  
**Date:** 2026-04-22

## Context

React components that render raw `<div>`, `<span>`, and `<p>` elements directly spread layout and spacing logic across the codebase. Without primitives, every new component invents its own flex row, padding, and text sizing — making global design changes expensive.

## Decision

All layout, text, and container concerns route through `src/components/core/`. The public API is re-exported via `@core` path alias. Raw `div`/`span`/`p` are not used for layout or text — only for game-specific visual identity where custom CSS is required.

Core components: `CoreBox`, `CoreRow`, `CoreCol`, `CoreText`, `CoreCard`, `CorePressable`, `CoreScreen`, `CoreScrollView`, `CoreSpacer`.

An ESLint rule (`no-restricted-imports`) enforces that the core directory is imported through `@core`, never by relative path.

## Consequences

**Positive:**

- Spacing, color, and typography changes propagate from one place
- Consistent accessible defaults (semantic elements, proper ARIA roles) baked into primitives
- ESLint boundary enforcement makes the rule impossible to accidentally violate

**Negative:**

- New contributors must learn the core API before writing UI
- Primitive wrapper overhead is negligible but non-zero; deeply nested core components can add DOM depth
