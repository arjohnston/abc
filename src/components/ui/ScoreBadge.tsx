import './ScoreBadge.css'

import { CoreRow } from '../core'

interface ScoreBadgeProps {
  score: number
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  return (
    <CoreRow align="center" gap={6} className="score-badge">
      <span className="score-star">⭐</span>
      <span className="score-num">{score}</span>
    </CoreRow>
  )
}
