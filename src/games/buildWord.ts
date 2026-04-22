import type { BuildWordItem } from '@common/types/game'

const WORDS: BuildWordItem[] = [
  { emoji: '🐱', letters: ['C', 'A', 'T'], word: 'cat' },
  { emoji: '🐶', letters: ['D', 'O', 'G'], word: 'dog' },
  { emoji: '🦉', letters: ['O', 'W', 'L'], word: 'owl' },
  { emoji: '🐝', letters: ['B', 'E', 'E'], word: 'bee' },
  { emoji: '🐜', letters: ['A', 'N', 'T'], word: 'ant' },
  { emoji: '🐓', letters: ['H', 'E', 'N'], word: 'hen' },
  { emoji: '🐷', letters: ['P', 'I', 'G'], word: 'pig' },
  { emoji: '🐮', letters: ['C', 'O', 'W'], word: 'cow' },
  { emoji: '🦊', letters: ['F', 'O', 'X'], word: 'fox' },
  { emoji: '🐛', letters: ['B', 'U', 'G'], word: 'bug' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j] as T
    a[j] = tmp as T
  }
  return a
}

export function generateBuildWordItems(isRandom: boolean): BuildWordItem[] {
  return isRandom ? shuffle(WORDS) : [...WORDS]
}
