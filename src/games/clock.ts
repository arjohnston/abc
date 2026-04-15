import type { ClockItem } from '../types/game'

const HOUR_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const CLOCK_EMOJIS = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘']

// Whole hours 1–9 for simplicity
const ITEMS: ClockItem[] = HOUR_WORDS.map((word, i) => {
  const hour = i + 1
  return {
    emoji: CLOCK_EMOJIS[i]!,
    display: `${hour}:00`,
    digits: [String(hour), '0', '0'],
    speech: `${word} o'clock`,
    hourDigitCount: 1,
  }
})

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function generateClockItems(isRandom: boolean): ClockItem[] {
  return isRandom ? shuffle(ITEMS) : [...ITEMS]
}
