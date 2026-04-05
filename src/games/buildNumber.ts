import type { BuildNumberItem } from '../types/game'

const NUMBER_WORDS: Record<number, string> = {
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'fifteen',
  16: 'sixteen',
  17: 'seventeen',
  18: 'eighteen',
  19: 'nineteen',
  20: 'twenty',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

const BASE_ITEMS: BuildNumberItem[] = Array.from({ length: 10 }, (_, i) => {
  const n = i + 11 // 11–20
  const display = String(n)
  return {
    display,
    digits: display.split(''),
    word: NUMBER_WORDS[n] ?? display,
  }
})

export function generateBuildNumberItems(isRandom: boolean): BuildNumberItem[] {
  return isRandom ? shuffle(BASE_ITEMS) : [...BASE_ITEMS]
}
