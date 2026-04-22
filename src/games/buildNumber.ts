import type { BuildNumberItem } from '../types/game'
import { shuffle } from './utils'

const ONES = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function numberToWord(n: number): string {
  if (n < 20) {
    return ONES[n] ?? ''
  }
  const t = TENS[Math.floor(n / 10)] ?? ''
  const o = ONES[n % 10]
  return o ? `${t}-${o}` : t
}

// All two-digit numbers 10–99
const ALL_NUMBERS = Array.from({ length: 90 }, (_, i) => i + 10)

export function generateBuildNumberItems(isRandom: boolean): BuildNumberItem[] {
  const pool = isRandom ? shuffle(ALL_NUMBERS).slice(0, 10) : ALL_NUMBERS.slice(0, 10)
  return pool.map((n) => {
    const display = String(n)
    return { display, digits: display.split(''), word: numberToWord(n) }
  })
}
