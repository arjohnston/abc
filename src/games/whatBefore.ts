import type { WhatNextItem } from '../types/game'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

// Letter sequences: shown=[B,C] answer=A, shown=[C,D] answer=B, …, shown=[Y,Z] answer=X
const LETTER_ITEMS: WhatNextItem[] = []
for (let i = 1; i < 25; i++) {
  LETTER_ITEMS.push({
    shown: [String.fromCharCode(65 + i), String.fromCharCode(65 + i + 1)],
    answer: String.fromCharCode(65 + i - 1),
  })
}

// Number sequences: shown=[2,3] answer=1, …, shown=[8,9] answer=7
const NUMBER_ITEMS: WhatNextItem[] = []
for (let i = 2; i <= 8; i++) {
  NUMBER_ITEMS.push({
    shown: [String(i), String(i + 1)],
    answer: String(i - 1),
  })
}

const BASE_ITEMS: WhatNextItem[] = [...LETTER_ITEMS, ...NUMBER_ITEMS]

export function generateWhatBeforeItems(isRandom: boolean): WhatNextItem[] {
  return isRandom ? shuffle(BASE_ITEMS) : [...BASE_ITEMS]
}
