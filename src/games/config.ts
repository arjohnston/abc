import type { GameConfig, Section } from '../types/game'
import { generateCountingItems } from './counting'
import { generateCountingBackwardsItems } from './countingBackwards'
import { generateCountingHigherItems } from './countingHigher'
import { generateNumberWordItems } from './numberWords'

export const SECTIONS: Section[] = [
  { id: 'basics', title: 'Basics', emoji: '🌱', starsToUnlock: 0 },
  { id: 'next-steps', title: 'Next Steps', emoji: '🚀', starsToUnlock: 5 },
  { id: 'challenge', title: 'Challenge', emoji: '🏆', starsToUnlock: 7 },
]

export const GAMES: GameConfig[] = [
  // --- Basics ---
  {
    id: 'abc',
    sectionId: 'basics',
    title: 'ABCs',
    emoji: '🔤',
    description: 'Learn the alphabet!',
    color: 'var(--green)',
    colorDark: 'var(--green-dark)',
    items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    autoSpeak: true,
  },
  {
    id: 'numbers',
    sectionId: 'basics',
    title: '123s',
    emoji: '🔢',
    description: 'Learn your numbers!',
    color: 'var(--blue)',
    colorDark: 'var(--blue-dark)',
    items: '1234567890'.split(''),
    autoSpeak: true,
  },
  {
    id: 'counting',
    sectionId: 'basics',
    title: 'Counting',
    emoji: '🍎',
    description: 'Count the objects!',
    color: 'var(--orange)',
    colorDark: 'var(--orange-dark)',
    type: 'counting',
    generateItems: generateCountingItems,
  },

  // --- Next Steps ---
  {
    id: 'lowercase',
    sectionId: 'next-steps',
    title: 'Lowercase',
    emoji: '🔡',
    description: 'Lowercase letters!',
    color: 'var(--purple)',
    colorDark: 'var(--purple-dark)',
    items: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  },
  {
    id: 'counting-higher',
    sectionId: 'next-steps',
    title: 'Count Higher',
    emoji: '🔢',
    description: 'Count to 20!',
    color: 'var(--orange)',
    colorDark: 'var(--orange-dark)',
    type: 'counting',
    generateItems: generateCountingHigherItems,
  },
  {
    id: 'number-words',
    sectionId: 'next-steps',
    title: 'Number Words',
    emoji: '📝',
    description: 'Read the word!',
    color: 'var(--yellow)',
    colorDark: 'var(--yellow-dark)',
    type: 'numberWords',
    generateItems: generateNumberWordItems,
  },

  // --- Challenge ---
  {
    id: 'mixed',
    sectionId: 'challenge',
    title: 'Mixed',
    emoji: '🎯',
    description: 'Letters & numbers!',
    color: 'var(--red)',
    colorDark: 'var(--red-dark)',
    items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split(''),
  },
  {
    id: 'counting-backwards',
    sectionId: 'challenge',
    title: 'Backwards',
    emoji: '🔄',
    description: 'Count down!',
    color: 'var(--purple)',
    colorDark: 'var(--purple-dark)',
    type: 'counting',
    generateItems: generateCountingBackwardsItems,
  },
  {
    id: 'speed-round',
    sectionId: 'challenge',
    title: 'Speed Round',
    emoji: '⚡',
    description: 'Beat the clock!',
    color: 'var(--red)',
    colorDark: 'var(--red-dark)',
    type: 'timed',
    items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    timeLimit: 60,
  },
]

export function getGamesForSection(sectionId: string): GameConfig[] {
  return GAMES.filter((g) => g.sectionId === sectionId)
}

export function getGameById(id: string): GameConfig | undefined {
  return GAMES.find((g) => g.id === id)
}
