import type { GameConfig } from '../types/game'
import { generateCountingItems } from './counting'

export const GAMES: Record<string, GameConfig> = {
  abc: {
    title: 'ABCs',
    emoji: '🔤',
    description: 'Learn the alphabet!',
    color: 'var(--green)',
    colorDark: 'var(--green-dark)',
    items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  },
  numbers: {
    title: '123s',
    emoji: '🔢',
    description: 'Learn your numbers!',
    color: 'var(--blue)',
    colorDark: 'var(--blue-dark)',
    items: '1234567890'.split(''),
  },
  counting: {
    title: 'Counting',
    emoji: '🍎',
    description: 'Count the objects!',
    color: 'var(--orange)',
    colorDark: 'var(--orange-dark)',
    type: 'counting',
    generateItems: generateCountingItems,
  },
}
