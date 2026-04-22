import './ColorDisplay.css'

import type { ColorItem, FeedbackState } from '@common/types/game'
import { CoreCol, Spacing } from '@core'

interface ColorDisplayProps {
  item: ColorItem
  feedback: FeedbackState
  animKey: string
}

export function ColorDisplay({ item, feedback, animKey }: ColorDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  return (
    <CoreCol align="center" gap={Spacing.md}>
      <div
        key={animKey}
        className={`color-display__circle ${feedbackClass}`}
        style={{ background: item.color }}
      />
    </CoreCol>
  )
}
