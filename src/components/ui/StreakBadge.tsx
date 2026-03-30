import './StreakBadge.css'

interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak < 3) {
    return null
  }
  return <div className="streak-badge">🔥 {streak} in a row!</div>
}
