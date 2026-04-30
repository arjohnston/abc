# PWA Design — ABC 123

**Date:** 2026-04-29  
**Status:** Approved

## Goals

- Installable on Android and iOS ("Add to Home Screen")
- Fully offline after first visit
- Fullscreen display mode (no browser chrome)

## Approach

`vite-plugin-pwa` with Workbox `generateSW` mode. The plugin auto-generates a service worker from the Vite build output, handling hashed filenames automatically.

## 1. Web App Manifest

Configured in `vite.config.ts` via `vite-plugin-pwa`:

| Field              | Value          |
| ------------------ | -------------- |
| `name`             | "ABC 123"      |
| `short_name`       | "ABC 123"      |
| `display`          | `"fullscreen"` |
| `orientation`      | `"any"`        |
| `theme_color`      | `#131f24`      |
| `background_color` | `#131f24`      |
| `start_url`        | `"/"`          |

## 2. Service Worker

Mode: `generateSW` (Workbox-generated, no hand-written SW).

- **Precache**: all Vite build output (JS, CSS, HTML, icons) — automatic via Workbox manifest injection
- **Update behaviour**: `autoUpdate` — new SW activates silently on next page load

## 3. Icons

Generated once via `scripts/generate-icons.js` using `sharp` (renders SVG → PNG). Output committed to `public/`:

| File                          | Size    | Purpose                                  |
| ----------------------------- | ------- | ---------------------------------------- |
| `public/pwa-192.png`          | 192×192 | Android required minimum                 |
| `public/pwa-512.png`          | 512×512 | Android splash screen                    |
| `public/pwa-maskable-512.png` | 512×512 | Android adaptive icon (safe-zone padded) |
| `public/apple-touch-icon.png` | 180×180 | iOS "Add to Home Screen"                 |

The script is run manually when the favicon changes, not on every build.

## 4. Font Handling

Replace the Google Fonts `<link>` in `index.html` with `@fontsource/nunito` imported in `main.tsx`. Nunito becomes part of the Vite bundle — fully offline from first visit, no external font request.

Variants needed: weights 600, 700, 800, 900 (matching current `font-weight` usage in CSS).

## Files Changed

- `package.json` — add `vite-plugin-pwa`, `@fontsource/nunito`, `sharp` (dev)
- `vite.config.ts` — add `VitePWA` plugin with manifest + SW config
- `index.html` — remove Google Fonts `<link>` tags, add `<link rel="apple-touch-icon">`
- `src/main.tsx` — add `@fontsource/nunito` imports
- `public/` — add generated PNG icons
- `scripts/generate-icons.js` — icon generation script

## Out of Scope

- Push notifications
- Background sync
- iOS 12 compatibility (separate concern)
