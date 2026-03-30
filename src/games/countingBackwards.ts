import type { CountingItem } from '../types/game'

const COUNTING_OBJECTS: { emoji: string; singular: string; plural: string }[] = [
  { emoji: '🍎', singular: 'apple', plural: 'apples' },
  { emoji: '🍌', singular: 'banana', plural: 'bananas' },
  { emoji: '🍊', singular: 'orange', plural: 'oranges' },
  { emoji: '🍓', singular: 'strawberry', plural: 'strawberries' },
  { emoji: '🌟', singular: 'star', plural: 'stars' },
  { emoji: '🐶', singular: 'puppy', plural: 'puppies' },
  { emoji: '🐱', singular: 'kitty', plural: 'kitties' },
  { emoji: '🐸', singular: 'frog', plural: 'frogs' },
  { emoji: '🦋', singular: 'butterfly', plural: 'butterflies' },
  { emoji: '🎈', singular: 'balloon', plural: 'balloons' },
]

export function generateCountingBackwardsItems(isRandom: boolean): CountingItem[] {
  const counts = isRandom
    ? Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
    : Array.from({ length: 9 }, (_, i) => 9 - i)
  return counts.map((count) => {
    const fallback = { emoji: '🍎', singular: 'apple', plural: 'apples' }
    const obj = COUNTING_OBJECTS[Math.floor(Math.random() * COUNTING_OBJECTS.length)] ?? fallback
    return {
      answer: String(count),
      emoji: obj.emoji,
      name: count === 1 ? obj.singular : obj.plural,
      count,
    }
  })
}
