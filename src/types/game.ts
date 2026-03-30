export interface CountingItem {
  answer: string
  emoji: string
  count: number
}

export type GameItem = string | CountingItem

export interface BaseGameConfig {
  title: string
  emoji: string
  description: string
  color: string
  colorDark: string
}

export interface StandardGameConfig extends BaseGameConfig {
  type?: undefined
  items: string[]
}

export interface CountingGameConfig extends BaseGameConfig {
  type: 'counting'
  generateItems: (isRandom: boolean) => CountingItem[]
}

export type GameConfig = StandardGameConfig | CountingGameConfig

export type GameKey = string

export type FeedbackState = 'correct' | 'wrong' | null
