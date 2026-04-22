# ADR 004: No External State Management Library

**Status:** Accepted  
**Date:** 2026-04-22

## Context

Large React apps often adopt Redux, Zustand, Jotai, or similar libraries to share state across the component tree. This app has two pieces of global state: play/completion counts (`useStats`) and per-game star ratings (`useProgress`). Both are stored in `localStorage` and surfaced via custom hooks.

## Decision

Use React's built-in `useState`/`useRef`/`useCallback` + custom hooks. No external state management library.

## Consequences

**Positive:**

- Zero additional dependencies and bundle weight
- `localStorage` is the source of truth — no in-memory store to sync
- The two global hooks (`useStats`, `useProgress`) are simple enough to implement and test with `@testing-library/react`'s `renderHook`

**Negative:**

- If global state needs grow significantly (e.g., real-time multiplayer, deeply nested subscriptions), a store library would reduce prop drilling
- Custom hooks re-initialize from `localStorage` on every mount — acceptable for this app's scope but inefficient at scale
