import type { MathItem } from '../types/game'

const EMOJIS = ['🍎', '⭐', '🌸', '🐠', '🍪', '🎈', '🦋', '🍓', '🐣', '🐥']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

// All pairs (a, b) where 1 ≤ a,b ≤ 5 and a+b ≤ 9
const BASE_PAIRS: Array<[number, number]> = []
for (let a = 1; a <= 5; a++) {
  for (let b = 1; b <= 5; b++) {
    if (a + b <= 9) BASE_PAIRS.push([a, b])
  }
}

export function generateAdditionItems(isRandom: boolean): MathItem[] {
  const pairs = isRandom ? shuffle(BASE_PAIRS) : [...BASE_PAIRS]
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]!
  return pairs.slice(0, 10).map(([left, right]) => ({
    leftCount: left,
    rightCount: right,
    operator: '+' as const,
    answer: String(left + right),
    emoji,
  }))
}
