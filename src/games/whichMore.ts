import type { WhichMoreItem } from '../types/game'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

// All pairs of digits 1–9 where they differ by at least 2 (easier to judge)
const BASE_ITEMS: WhichMoreItem[] = []
for (let a = 1; a <= 9; a++) {
  for (let b = a + 2; b <= 9; b++) {
    // Both orderings so the bigger one isn't always on the same side
    BASE_ITEMS.push({ left: String(a), right: String(b), answer: String(b) })
    BASE_ITEMS.push({ left: String(b), right: String(a), answer: String(b) })
  }
}

export function generateWhichMoreItems(isRandom: boolean): WhichMoreItem[] {
  const items = isRandom ? shuffle(BASE_ITEMS) : [...BASE_ITEMS]
  // Trim to a reasonable game length
  return items.slice(0, 20)
}
