import './ScoreBadge.css'

import { CoreBox, CoreRow, CoreText } from '@core'

interface ScoreBadgeProps {
  score: number
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  return (
    <CoreBox className="score-badge">
      <CoreRow align="center" gap={6}>
        <CoreText size="sm" className="score-star">
          ⭐
        </CoreText>
        <CoreText size="sm">{score}</CoreText>
      </CoreRow>
    </CoreBox>
  )
}
