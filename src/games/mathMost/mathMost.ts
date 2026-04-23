import type { MathMostItem } from '@common/types/game'

import { shuffle } from '../utils/utils'

const EMOJIS = ['🍎', '⭐', '🌸', '🐠', '🍪', '🎈', '🦋', '🍓', '🐣', '🐥']

// Generate triples (a, b, c) that are all different, each 1–7
function buildTriples(): Array<[number, number, number]> {
  const triples: Array<[number, number, number]> = []
  for (let a = 1; a <= 7; a++) {
    for (let b = 1; b <= 7; b++) {
      if (b === a) {
        continue
      }
      for (let c = 1; c <= 7; c++) {
        if (c === a || c === b) {
          continue
        }
        triples.push([a, b, c])
      }
    }
  }
  return triples
}

const ALL_TRIPLES = buildTriples()

export function generateMathMostItems(isRandom: boolean): MathMostItem[] {
  const triples = isRandom ? shuffle(ALL_TRIPLES) : [...ALL_TRIPLES]
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)] ?? '🍎'
  return triples.slice(0, 10).map(([a, b, c]) => ({
    counts: [a, b, c] as [number, number, number],
    answer: String(Math.max(a, b, c)),
    emoji,
  }))
}
