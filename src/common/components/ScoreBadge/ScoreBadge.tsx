import './ScoreBadge.css'

import { CoreBox, CoreRow } from '@core'

interface ScoreBadgeProps {
  score: number
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  return (
    <CoreBox className="score-badge">
      <CoreRow align="center" gap={6}>
        <span className="score-star">⭐</span>
        <span className="score-num">{score}</span>
      </CoreRow>
    </CoreBox>
  )
}
