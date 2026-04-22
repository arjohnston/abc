# ADR 002: noUncheckedIndexedAccess Enabled

**Status:** Accepted  
**Date:** 2026-04-22

## Context

TypeScript's `noUncheckedIndexedAccess` flag makes array and record indexing return `T | undefined` instead of `T`. Without it, `arr[i]` silently assumes in-bounds access — a common source of runtime crashes.

## Decision

Enable `noUncheckedIndexedAccess: true` in `tsconfig.json`. Handle out-of-bounds results with `?? fallback` at each callsite.

## Consequences

**Positive:**

- Catches a class of bugs statically (off-by-one, empty-array reads) that would otherwise surface as runtime errors
- Forces explicit default values at every array read, making assumptions visible

**Negative:**

- Requires `?? fallback` at every array/record index — adds minor verbosity
- Mathematically-safe lookups (e.g. `ONES[n]` where `n` is always `0–9`) still need a fallback; the type system cannot verify loop invariants
- Third-party types that return `T` from index signatures now appear as `T | undefined`, occasionally requiring unnecessary guards in library interop code
