import type { NumberWordItem } from '../types/game'

const WORDS: { digit: string; word: string }[] = [
  { digit: '1', word: 'one' },
  { digit: '2', word: 'two' },
  { digit: '3', word: 'three' },
  { digit: '4', word: 'four' },
  { digit: '5', word: 'five' },
  { digit: '6', word: 'six' },
  { digit: '7', word: 'seven' },
  { digit: '8', word: 'eight' },
  { digit: '9', word: 'nine' },
]

export function generateNumberWordItems(isRandom: boolean): NumberWordItem[] {
  const items = WORDS.map((w) => ({ answer: w.digit, word: w.word }))
  if (isRandom) {
    items.sort(() => Math.random() - 0.5)
  }
  return items
}
