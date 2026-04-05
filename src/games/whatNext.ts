import type { WhatNextItem } from '../types/game'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

// Letter sequences: A B → C, B C → D, …, X Y → Z
const LETTER_ITEMS: WhatNextItem[] = []
for (let i = 0; i < 24; i++) {
  LETTER_ITEMS.push({
    shown: [
      String.fromCharCode(65 + i),
      String.fromCharCode(65 + i + 1),
    ],
    answer: String.fromCharCode(65 + i + 2),
  })
}

// Number sequences: 1 2 → 3, 2 3 → 4, …, 7 8 → 9
const NUMBER_ITEMS: WhatNextItem[] = []
for (let i = 1; i <= 7; i++) {
  NUMBER_ITEMS.push({
    shown: [String(i), String(i + 1)],
    answer: String(i + 2),
  })
}

const BASE_ITEMS: WhatNextItem[] = [...LETTER_ITEMS, ...NUMBER_ITEMS]

export function generateWhatNextItems(isRandom: boolean): WhatNextItem[] {
  return isRandom ? shuffle(BASE_ITEMS) : [...BASE_ITEMS]
}
