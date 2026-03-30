import type { CountingItem } from '../types/game'

const COUNTING_OBJECTS = [
  '🍎', '🍌', '🍊', '🍓', '🌟', '🐶', '🐱', '🐸',
  '🦋', '🌈', '🎈', '🍪', '🧁', '🍉', '🐝', '🐢',
]

export function generateCountingItems(isRandom: boolean): CountingItem[] {
  const counts = Array.from({ length: 9 }, (_, i) => i + 1)
  if (isRandom) {
    counts.sort(() => Math.random() - 0.5)
  }
  return counts.map(count => ({
    answer: String(count),
    emoji: COUNTING_OBJECTS[Math.floor(Math.random() * COUNTING_OBJECTS.length)]!,
    count,
  }))
}
