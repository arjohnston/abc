import type { CountingItem } from '@common/types/game'

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
  { emoji: '🍪', singular: 'cookie', plural: 'cookies' },
  { emoji: '🧁', singular: 'cupcake', plural: 'cupcakes' },
  { emoji: '🍉', singular: 'watermelon', plural: 'watermelons' },
  { emoji: '🐝', singular: 'bee', plural: 'bees' },
  { emoji: '🐢', singular: 'turtle', plural: 'turtles' },
]

export function generateCountingItems(isRandom: boolean): CountingItem[] {
  const counts = Array.from({ length: 9 }, (_, i) => i + 1)
  if (isRandom) {
    counts.sort(() => Math.random() - 0.5)
  }
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
