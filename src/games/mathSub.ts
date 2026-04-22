import type { MathItem } from '../types/game'
import { shuffle } from './utils'

const EMOJIS = ['🍎', '⭐', '🌸', '🐠', '🍪', '🎈', '🦋', '🍓', '🐣', '🐥']

// All pairs (a, b) where 2 ≤ a ≤ 8, 1 ≤ b < a, a ≤ 8 (keeps objects on screen manageable)
const BASE_PAIRS: Array<[number, number]> = []
for (let a = 2; a <= 8; a++) {
  for (let b = 1; b < a; b++) {
    BASE_PAIRS.push([a, b])
  }
}

export function generateSubtractionItems(isRandom: boolean): MathItem[] {
  const pairs = isRandom ? shuffle(BASE_PAIRS) : [...BASE_PAIRS]
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)] ?? '🍎'
  return pairs.slice(0, 10).map(([left, right]) => ({
    leftCount: left,
    rightCount: right,
    operator: '-' as const,
    answer: String(left - right),
    emoji,
  }))
}
