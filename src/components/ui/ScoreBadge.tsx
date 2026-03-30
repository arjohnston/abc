import './ScoreBadge.css'

interface ScoreBadgeProps {
  score: number
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  return (
    <div className="score-badge">
      <span className="score-star">⭐</span>
      <span className="score-num">{score}</span>
    </div>
  )
}
