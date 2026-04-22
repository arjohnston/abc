import './ArcadeComplete.css'

import { Confetti } from '@common/components/Confetti/Confetti'
import { CoreButton, CoreCol, CoreRow, CoreText, Spacing } from '@core'

interface ArcadeCompleteProps {
  emoji: string
  title: string
  subtitle: string
  onRestart: () => void
  onHome: () => void
  emojiClassName?: string
}

export function ArcadeComplete({
  emoji,
  title,
  subtitle,
  onRestart,
  onHome,
  emojiClassName,
}: ArcadeCompleteProps) {
  return (
    <>
      <Confetti />
      <CoreCol flex={1} align="center" justify="center" gap={Spacing.sm} padding={20}>
        <span className={['arcade-complete__emoji', emojiClassName].filter(Boolean).join(' ')}>
          {emoji}
        </span>
        <CoreText size="h2" color="green">
          {title}
        </CoreText>
        <CoreText size="sm" color="muted">
          {subtitle}
        </CoreText>
        <CoreRow gap={Spacing.md} marginTop={Spacing.md}>
          <CoreButton variant="primary" onClick={onRestart}>
            Play Again
          </CoreButton>
          <CoreButton variant="secondary" onClick={onHome}>
            Home
          </CoreButton>
        </CoreRow>
      </CoreCol>
    </>
  )
}
