# Pages

Full-screen views routed to from `App.tsx`. Each page gets its own subdirectory.

```
pages/
  home/           HomeScreen — vertical game path with section banners
  game/           GameScreen — core game loop (all standard game types)
  bonus/          BonusScreen — Play Games hub
  arcade/         Standalone arcade/mini-game screens
    chase-ball/
    click-circle/
    click-letter/
    dino/
    follow-arrow/
    frogger/
    mini-game/
    mouse-direction/
    simon-says/
    space-math/
    tic-tac-toe/
```

## Rules

1. **Pages import components, never the reverse.** Common components must not import from `@pages`.
2. **Page-specific components** live in `pages/XX/components/YY/`. If a component is used by more than one page, move it to `src/common/components/`.
3. **One subdirectory per page.** Co-locate the page's CSS in the same directory.
4. **Arcade screens** live under `pages/arcade/XX/`. They are standalone screens registered in `App.tsx`'s `MINI_GAME_SCREENS` or `CUSTOM_SCREENS` registries.
5. **No cross-page imports.** Pages must not import from sibling page directories.

## Page-specific components

Components only used by one page live under that page:

```
pages/home/components/
  GamePreviewModal/   # modal shown when tapping a game node
  MiniGameNode/       # circular arcade game node on the path
  PathNode/           # circular game node on the vertical path
  SectionBanner/      # section header with stars + lock state

pages/game/components/
  AnimalDisplay/      # animal emoji display
  ClockBlanksDisplay/ # clock face with blanks
  ColorDisplay/       # color swatch display
  CountingDisplay/    # emoji grid for counting games
  GameBox/            # shared visual container for display components
  HearPressDisplay/   # audio-cue display
  LetterDisplay/      # single large character
  MathDisplay/        # math equation display
  MathMostDisplay/    # "which group has more?" display
  NumberBlanksDisplay/# fill-in-the-blank number display
  TimerBar/           # countdown timer bar
  VirtualKeyboard/    # on-screen keyboard
  WhatNextDisplay/    # pattern completion display
  WhichMoreDisplay/   # object count comparison display
  WordDisplay/        # word display (auto-sizing font)
```
