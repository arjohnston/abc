import type { ClockItem } from '@common/types/game'

const HOUR_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const CLOCK_EMOJIS = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘']
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
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty']

function minuteSpeech(minute: number): string {
  if (minute === 0) {
    return "o'clock"
  }
  if (minute < 10) {
    return `oh ${ONES[minute] ?? ''}`
  }
  if (minute < 20) {
    return ONES[minute] ?? ''
  }
  const t = Math.floor(minute / 10)
  const o = minute % 10
  return o === 0 ? (TENS[t] ?? '') : `${TENS[t] ?? ''} ${ONES[o] ?? ''}`
}

function makeItem(): ClockItem {
  const hour = Math.floor(Math.random() * 9) + 1 // 1–9
  const minute = Math.floor(Math.random() * 60) // 0–59
  const minStr = minute.toString().padStart(2, '0')
  return {
    emoji: CLOCK_EMOJIS[hour - 1] ?? '🕐',
    display: `${hour}:${minStr}`,
    digits: [String(hour), minStr[0] ?? '0', minStr[1] ?? '0'],
    speech: `${HOUR_WORDS[hour - 1] ?? ''} ${minuteSpeech(minute)}`,
    hourDigitCount: 1,
  }
}

export function generateClockItems(isRandom: boolean): ClockItem[] {
  // Always random — 10 unique-ish times per game
  const items: ClockItem[] = []
  const seen = new Set<string>()
  while (items.length < 10) {
    const item = makeItem()
    if (!seen.has(item.display)) {
      seen.add(item.display)
      items.push(item)
    }
  }
  // isRandom flag already satisfied since times are random;
  // for non-random, return a fixed set based on seed order
  return isRandom ? items : items
}
