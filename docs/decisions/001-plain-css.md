# ADR 001: Plain CSS with CSS Variables

**Status:** Accepted  
**Date:** 2026-04-22

## Context

The app needs a design system with a dark theme, bright accent colors, and consistent spacing. Options included Tailwind CSS, CSS Modules, styled-components, and plain CSS with variables.

## Decision

Use plain CSS with CSS custom properties (variables) defined in `src/index.css`. Each component gets a co-located `.css` file. No CSS-in-JS, no utility framework.

## Consequences

**Positive:**

- Zero runtime overhead — styles are static files bundled by Vite
- Design tokens (`--green`, `--blue-dark`, etc.) are globally visible and trivially overridable per-component via inline style or local scope
- Co-located `.css` files are easy to find and keep scoped by BEM-style class prefixes

**Negative:**

- No automatic scoping — name collisions are possible if BEM prefixes are not maintained
- Refactoring a component's CSS class names requires manual search-and-replace
