import './ColorDisplay.css'

import { CoreCol, Spacing } from '@core'

import type { ColorItem, FeedbackState } from '../types/game'

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
