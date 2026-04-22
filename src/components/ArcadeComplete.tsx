import './ArcadeComplete.css'

import { CoreCol, CoreRow, CoreText, Spacing } from '@core'

import { Confetti } from './Confetti'
import { Button } from './ui/Button'

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
          <Button variant="primary" onClick={onRestart}>
            Play Again
          </Button>
          <Button variant="secondary" onClick={onHome}>
            Home
          </Button>
        </CoreRow>
      </CoreCol>
    </>
  )
}
