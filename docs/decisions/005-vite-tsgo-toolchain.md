# ADR 005: Vite + tsgo Toolchain

**Status:** Accepted  
**Date:** 2026-04-22

## Context

TypeScript compilation has two jobs: type-checking and transpilation. The TypeScript compiler (`tsc`) does both but is slow at scale. Vite uses esbuild for transpilation (fast, no type checking) and delegates type checking to a separate invocation.

`@typescript/native-preview` (`tsgo`) is Anthropic's Go-based TypeScript compiler port, which is significantly faster than `tsc` for type checking.

## Decision

- **Dev server:** `vite dev` — esbuild transpilation, HMR, no type checking
- **Type checking:** `tsgo --noEmit` (via `npm run type-check`) — runs separately, not blocking the dev loop
- **Production build:** `tsgo --noEmit && vite build`
- **Test runner:** Vitest (shares Vite config, same esbuild pipeline)

## Consequences

**Positive:**

- Sub-second HMR regardless of project size — esbuild is order-of-magnitude faster than tsc for transpilation
- `tsgo` type checks in a fraction of the time of `tsc`, making type-check-on-save viable
- Vitest reuses the Vite transform pipeline — no separate Babel/Jest config to maintain

**Negative:**

- `tsgo` is a preview tool — it may lag behind the latest TypeScript language features and its error messages may differ subtly from `tsc`
- Type errors are not surfaced in-browser during dev; developers must run `npm run type-check` explicitly (or use the watch mode)
- Two tools (esbuild for transpile, tsgo for types) means two potential sources of divergence; in practice this is rare
