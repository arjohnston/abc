import type { WhichMoreItem } from '../types/game'

const EMOJIS = ['🍎', '⭐', '🌸', '🐠', '🍪', '🎈', '🦋', '🍓', '🐣', '🐥']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

// All pairs of digits 1–6 where they differ by at least 1
const BASE_PAIRS: Array<[number, number]> = []
for (let a = 1; a <= 6; a++) {
  for (let b = a + 1; b <= 6; b++) {
    BASE_PAIRS.push([a, b])
    BASE_PAIRS.push([b, a])
  }
}

export function generateWhichMoreItems(isRandom: boolean): WhichMoreItem[] {
  const pairs = isRandom ? shuffle(BASE_PAIRS) : [...BASE_PAIRS]
  const trimmed = pairs.slice(0, 10)
  return trimmed.map(([left, right], i) => ({
    left: String(left),
    right: String(right),
    answer: String(Math.max(left, right)),
    emoji: EMOJIS[i % EMOJIS.length]!,
  }))
}
