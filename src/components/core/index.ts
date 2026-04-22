// ─── Components ───────────────────────────────────────────
export { CoreBox } from './core-box/CoreBox'
export type { CoreBoxProps } from './core-box/CoreBox'

export { CoreCard } from './core-card/CoreCard'
export type { CoreCardProps } from './core-card/CoreCard'

export { CoreCol } from './core-col/CoreCol'
export type { CoreColProps } from './core-col/CoreCol'

export { CoreGameArena } from './core-game-arena/CoreGameArena'
export type { CoreGameArenaProps } from './core-game-arena/CoreGameArena'

export { CorePressable } from './core-pressable/CorePressable'
export type { CorePressableProps } from './core-pressable/CorePressable'

export { CoreRow } from './core-row/CoreRow'
export type { CoreRowProps } from './core-row/CoreRow'

export { CoreScreen } from './core-screen/CoreScreen'
export type { CoreScreenProps } from './core-screen/CoreScreen'

export { CoreScrollView } from './core-scroll-view/CoreScrollView'
export type { CoreScrollViewProps } from './core-scroll-view/CoreScrollView'

export { CoreText } from './core-text/CoreText'
export type { CoreTextProps, TextColor } from './core-text/CoreText'

// ─── Shared layout ────────────────────────────────────────
export type { SharedLayoutProps } from './shared/spacing'

// ─── Tokens ───────────────────────────────────────────────
export { Spacing } from './tokens/spacing'
export type { SpacingValue } from './tokens/spacing'
export { Colors } from './tokens/colors'
export type { ColorToken } from './tokens/colors'
export { FontSize, FontWeight } from './tokens/typography'

// ─── Utils ────────────────────────────────────────────────
export type { RemapProps } from './utils/types'
export { warnMutuallyExclusive } from './utils/validation'
