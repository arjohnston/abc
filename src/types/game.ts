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

export type GameItem = string | CountingItem | NumberWordItem

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

export type GameConfig =
  | StandardGameConfig
  | CountingGameConfig
  | NumberWordsGameConfig
  | TimedGameConfig

export type FeedbackState = 'correct' | 'wrong' | null

// --- Progress ---

export interface GameProgress {
  bestStars: number
}

export interface ProgressData {
  games: Record<string, GameProgress>
}
