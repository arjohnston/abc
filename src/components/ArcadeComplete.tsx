import './ArcadeComplete.css'

import { Button } from './ui/Button'
import { Confetti } from './Confetti'
import { CoreCol, CoreRow, CoreText } from '@core'

interface ArcadeCompleteProps {
  emoji: string
  title: string
  subtitle: string
  onRestart: () => void
  onHome: () => void
  emojiClassName?: string
}

export function ArcadeComplete({ emoji, title, subtitle, onRestart, onHome, emojiClassName }: ArcadeCompleteProps) {
  return (
    <>
      <Confetti />
      <CoreCol flex={1} align="center" justify="center" gap={12} padding={20} className="arcade-complete">
        <span className={['arcade-complete__emoji', emojiClassName].filter(Boolean).join(' ')}>
          {emoji}
        </span>
        <CoreText size="h2" className="arcade-complete__title">{title}</CoreText>
        <CoreText size="p" className="arcade-complete__subtitle">{subtitle}</CoreText>
        <CoreRow gap={16} marginTop={16}>
          <Button variant="primary" onClick={onRestart}>Play Again</Button>
          <Button variant="secondary" onClick={onHome}>Home</Button>
        </CoreRow>
      </CoreCol>
    </>
  )
}
