// --- Sections ---

export interface Section {
  id: string
  title: string
  emoji: string
  starsToUnlock: number
}

// --- Game Items ---

export interface CountingItem {
  answer: string
  emoji: string
  name: string
  count: number
}

export interface NumberWordItem {
  answer: string
  word: string
}

export interface AnimalItem {
  emoji: string
  name: string
  key: string // uppercase first letter
}

export interface BuildNumberItem {
  display: string // e.g. "12"
  digits: string[] // e.g. ['1', '2']
  word: string // e.g. "twelve" — for TTS
}

export interface WhichMoreItem {
  left: string // digit char
  right: string // digit char
  answer: string // the larger digit char
  emoji: string // object to display (e.g. '🍎')
}

export interface WhatNextItem {
  shown: string[] // e.g. ['A', 'B'] or ['1', '2']
  answer: string // e.g. 'C' or '3'
}

export interface BuildWordItem {
  emoji: string // e.g. '🐱'
  letters: string[] // e.g. ['C', 'A', 'T']
  word: string // e.g. 'cat' — for TTS
}

export interface ColorItem {
  name: string // e.g. 'red'
  key: string // uppercase first letter, e.g. 'R'
  color: string // CSS value, e.g. 'var(--red)'
}

export interface ClockItem {
  emoji: string // clock emoji e.g. '🕐'
  display: string // e.g. '1:00'
  digits: string[] // e.g. ['1', '0', '0']
  speech: string // e.g. "one o'clock"
  hourDigitCount: number // 1 for hours 1-9, 2 for 10-12
}

export interface MathItem {
  leftCount: number
  rightCount: number
  operator: '+' | '-'
  answer: string // single digit char
  emoji: string
}

export interface MathMostItem {
  counts: [number, number, number]
  answer: string // digit char of the largest count
  emoji: string
}

export type GameItem =
  | string
  | CountingItem
  | MathMostItem
  | NumberWordItem
  | AnimalItem
  | BuildNumberItem
  | WhichMoreItem
  | WhatNextItem
  | BuildWordItem
  | ColorItem
  | ClockItem
  | MathItem

// --- Game Configs ---

export interface BaseGameConfig {
  id: string
  sectionId: string
  title: string
  emoji: string
  description: string
  color: string
  colorDark: string
  autoSpeak?: boolean
}

export interface StandardGameConfig extends BaseGameConfig {
  type?: undefined
  items: string[]
  expectLower?: boolean // show uppercase, speak/label as lowercase
  audioOnly?: boolean // hide the character, rely on TTS
}

export interface CountingGameConfig extends BaseGameConfig {
  type: 'counting'
  generateItems: (isRandom: boolean) => CountingItem[]
}

export interface NumberWordsGameConfig extends BaseGameConfig {
  type: 'numberWords'
  generateItems: (isRandom: boolean) => NumberWordItem[]
}

export interface TimedGameConfig extends BaseGameConfig {
  type: 'timed'
  items: string[]
  timeLimit: number
}

export interface AnimalSoundsGameConfig extends BaseGameConfig {
  type: 'animalSounds'
  items: AnimalItem[]
}

export interface BuildNumberGameConfig extends BaseGameConfig {
  type: 'buildNumber'
  generateItems: (isRandom: boolean) => BuildNumberItem[]
}

export interface WhichMoreGameConfig extends BaseGameConfig {
  type: 'whichMore'
  generateItems: (isRandom: boolean) => WhichMoreItem[]
}

export interface WhatNextGameConfig extends BaseGameConfig {
  type: 'whatNext'
  generateItems: (isRandom: boolean) => WhatNextItem[]
}

export interface WhatBeforeGameConfig extends BaseGameConfig {
  type: 'whatBefore'
  generateItems: (isRandom: boolean) => WhatNextItem[]
}

export interface BuildWordGameConfig extends BaseGameConfig {
  type: 'buildWord'
  items: BuildWordItem[]
}

export interface ColorMatchGameConfig extends BaseGameConfig {
  type: 'colorMatch'
  items: ColorItem[]
}

export interface ClockGameConfig extends BaseGameConfig {
  type: 'clock'
  generateItems: (isRandom: boolean) => ClockItem[]
}

export interface ArrowGameConfig extends BaseGameConfig {
  type: 'arrowGame'
}

export interface SimonSaysGameConfig extends BaseGameConfig {
  type: 'simonSays'
  items: string[]
}

export interface MouseDirectionGameConfig extends BaseGameConfig {
  type: 'mouseDirection'
}

export interface ChaseBallGameConfig extends BaseGameConfig {
  type: 'chaseBall'
}

export interface ClickLetterGameConfig extends BaseGameConfig {
  type: 'clickLetter'
  items: string[]
}

export interface AdditionGameConfig extends BaseGameConfig {
  type: 'mathAdd'
  generateItems: (isRandom: boolean) => MathItem[]
}

export interface SubtractionGameConfig extends BaseGameConfig {
  type: 'mathSub'
  generateItems: (isRandom: boolean) => MathItem[]
}

export interface MathMostGameConfig extends BaseGameConfig {
  type: 'mathMost'
  generateItems: (isRandom: boolean) => MathMostItem[]
}

export type GameConfig =
  | ArrowGameConfig
  | SimonSaysGameConfig
  | StandardGameConfig
  | CountingGameConfig
  | NumberWordsGameConfig
  | TimedGameConfig
  | AnimalSoundsGameConfig
  | BuildNumberGameConfig
  | WhichMoreGameConfig
  | WhatNextGameConfig
  | BuildWordGameConfig
  | ColorMatchGameConfig
  | ClockGameConfig
  | WhatBeforeGameConfig
  | MouseDirectionGameConfig
  | ChaseBallGameConfig
  | ClickLetterGameConfig
  | AdditionGameConfig
  | SubtractionGameConfig
  | MathMostGameConfig

export type FeedbackState = 'correct' | 'wrong' | null

/** Standard props contract for all custom game screens (non-GameScreen). */
export interface CustomGameScreenProps {
  game: GameConfig
  onBack: () => void
  onComplete: (
    score: number,
    total: number,
    maxStars: number,
  ) => { stars: number; isNewBest: boolean }
}

// --- Progress ---

export interface GameProgress {
  bestStars: number
}

export interface ProgressData {
  games: Record<string, GameProgress>
}
