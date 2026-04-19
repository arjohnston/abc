import type { GameConfig, Section } from '../types/game'

/** Bonus mini-games that appear between sections once the next section is unlocked. */
export interface MiniGameEntry {
  id: string
  /** Index of the section this mini-game appears AFTER. */
  afterSectionIndex: number
  emoji: string
  title: string
  description: string
  color: string
  colorDark: string
}

export const MINI_GAMES: MiniGameEntry[] = [
  { id: 'letterMuncher', afterSectionIndex: 0, emoji: '🐛', title: 'Letter Muncher',    description: 'Eat the right letters!',    color: 'var(--green)',  colorDark: 'var(--green-dark)' },
  { id: 'dinoRun',       afterSectionIndex: 1, emoji: '🦕', title: 'Dino Run',          description: 'Jump over the cacti!',       color: 'var(--orange)', colorDark: 'var(--orange-dark)' },
  { id: 'clickCircle',   afterSectionIndex: 3, emoji: '🎯', title: 'Click the Circle',  description: 'Click the moving circle!',   color: 'var(--blue)',   colorDark: 'var(--blue-dark)' },
  { id: 'ticTacToe',     afterSectionIndex: 4, emoji: '🎮', title: 'Tic Tac Toe',       description: 'Beat the computer!',         color: 'var(--purple)', colorDark: 'var(--purple-dark)' },
  { id: 'frogger',       afterSectionIndex: 4, emoji: '🐸', title: 'Frogger',           description: 'Cross the road safely!',     color: 'var(--green)',  colorDark: 'var(--green-dark)' },
]
import { ANIMAL_ITEMS } from './animalSounds'
import { generateBuildNumberItems } from './buildNumber'
import { generateBuildWordItems } from './buildWord'
import { generateClockItems } from './clock'
import { COLOR_ITEMS } from './colorMatch'
import { generateCountingItems } from './counting'
import { generateWhatNextItems } from './whatNext'
import { generateWhichMoreItems } from './whichMore'

export const SECTIONS: Section[] = [
  { id: 'basics',       title: 'Basics',       emoji: '🌱', starsToUnlock: 0 },
  { id: 'growing',      title: 'Growing',      emoji: '🌿', starsToUnlock: 5 },
  { id: 'next-steps',   title: 'Next Steps',   emoji: '🚀', starsToUnlock: 5 },
  { id: 'mouse-skills', title: 'Mouse Skills', emoji: '🖱️',  starsToUnlock: 7 },
  { id: 'challenge',    title: 'Challenge',    emoji: '🏆', starsToUnlock: 5 },
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

  // --- Growing ---
  {
    id: 'lowercase',
    sectionId: 'growing',
    title: 'Lowercase',
    emoji: '🔡',
    description: 'Lowercase letters!',
    color: 'var(--purple)',
    colorDark: 'var(--purple-dark)',
    items: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    autoSpeak: true,
  },
  {
    id: 'build-number',
    sectionId: 'growing',
    title: 'Build a Number',
    emoji: '🔨',
    description: 'Type the big numbers!',
    color: 'var(--blue)',
    colorDark: 'var(--blue-dark)',
    type: 'buildNumber',
    generateItems: generateBuildNumberItems,
  },
  {
    id: 'build-word',
    sectionId: 'growing',
    title: 'Build a Word',
    emoji: '✏️',
    description: 'Spell the animal!',
    color: 'var(--orange)',
    colorDark: 'var(--orange-dark)',
    type: 'buildWord',
    items: generateBuildWordItems(false),
  },

  // --- Next Steps ---
  {
    id: 'follow-arrow',
    sectionId: 'next-steps',
    title: 'Follow the Arrow',
    emoji: '🏹',
    description: 'Press the matching arrow key!',
    color: 'var(--purple)',
    colorDark: 'var(--purple-dark)',
    type: 'arrowGame',
  },
  {
    id: 'hear-press',
    sectionId: 'next-steps',
    title: 'Hear & Press',
    emoji: '👂',
    description: 'Listen and press the number!',
    color: 'var(--yellow)',
    colorDark: 'var(--yellow-dark)',
    items: '123456789'.split(''),
    audioOnly: true,
    autoSpeak: true,
  },
  {
    id: 'which-more',
    sectionId: 'next-steps',
    title: 'Which is More?',
    emoji: '⚖️',
    description: 'Press the bigger number!',
    color: 'var(--orange)',
    colorDark: 'var(--orange-dark)',
    type: 'whichMore',
    generateItems: generateWhichMoreItems,
  },
  {
    id: 'clock',
    sectionId: 'next-steps',
    title: 'Tell the Time',
    emoji: '🕐',
    description: 'Type the time you hear!',
    color: 'var(--blue)',
    colorDark: 'var(--blue-dark)',
    type: 'clock',
    generateItems: generateClockItems,
  },
  {
    id: 'simon-says',
    sectionId: 'next-steps',
    title: 'Simon Says',
    emoji: '🤖',
    description: 'Only press when Simon says!',
    color: 'var(--yellow)',
    colorDark: 'var(--yellow-dark)',
    type: 'simonSays',
    items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  },

  // --- Mouse Skills ---
  {
    id: 'mouse-mover',
    sectionId: 'mouse-skills',
    title: 'Mouse Mover',
    emoji: '🎯',
    description: 'Move your mouse to the target!',
    color: 'var(--green)',
    colorDark: 'var(--green-dark)',
    type: 'mouseDirection',
  },
  {
    id: 'chase-the-ball',
    sectionId: 'mouse-skills',
    title: 'Chase the Ball',
    emoji: '🎾',
    description: 'Hover over the bouncing ball!',
    color: 'var(--blue)',
    colorDark: 'var(--blue-dark)',
    type: 'chaseBall',
  },
  {
    id: 'click-it',
    sectionId: 'mouse-skills',
    title: 'Click It!',
    emoji: '👆',
    description: 'Click the right letter!',
    color: 'var(--purple)',
    colorDark: 'var(--purple-dark)',
    type: 'clickLetter',
    items: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''),
  },

  // --- Challenge ---
  {
    id: 'animal-sounds',
    sectionId: 'challenge',
    title: 'Animal Sounds',
    emoji: '🐾',
    description: 'What letter does it start with?',
    color: 'var(--green)',
    colorDark: 'var(--green-dark)',
    type: 'animalSounds',
    items: ANIMAL_ITEMS,
  },
  {
    id: 'color-match',
    sectionId: 'challenge',
    title: 'Color Match',
    emoji: '🎨',
    description: 'Press the first letter!',
    color: 'var(--red)',
    colorDark: 'var(--red-dark)',
    type: 'colorMatch',
    items: COLOR_ITEMS,
  },
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
    id: 'what-next',
    sectionId: 'challenge',
    title: 'What Comes Next?',
    emoji: '🔮',
    description: 'Finish the pattern!',
    color: 'var(--purple)',
    colorDark: 'var(--purple-dark)',
    type: 'whatNext',
    generateItems: generateWhatNextItems,
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
