import './WhatNextDisplay.css'

import type { FeedbackState, WhatNextItem } from '@common/types/game'
import { CoreRow, Spacing } from '@core'

interface WhatNextDisplayProps {
  item: WhatNextItem
  feedback: FeedbackState
  animKey: string
  reversed?: boolean
}

export function WhatNextDisplay({ item, feedback, animKey, reversed }: WhatNextDisplayProps) {
  const feedbackClass =
    feedback === 'correct' ? 'pop-correct' : feedback === 'wrong' ? 'shake-wrong' : ''

  const blank = (
    <div key={animKey} className={`what-next__tile what-next__tile--blank ${feedbackClass}`}>
      ?
    </div>
  )

  const shown = item.shown.map((char, i) => (
    <div key={i} className="what-next__tile what-next__tile--shown">
      {char}
    </div>
  ))

  return (
    <CoreRow align="center" gap={Spacing.sm} wrap justify="center">
      {reversed ? (
        <>
          {blank}
          <div className="what-next__arrow">←</div>
          {shown}
        </>
      ) : (
        <>
          {shown}
          <div className="what-next__arrow">→</div>
          {blank}
        </>
      )}
    </CoreRow>
  )
}
