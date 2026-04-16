import './GameTopbar.css'

import { BackButton } from './BackButton'
import { ProgressBar } from './ProgressBar'
import { ScoreBadge } from './ScoreBadge'

interface GameTopbarProps {
  onBack: () => void
  percent: number
  score: number
}

export function GameTopbar({ onBack, percent, score }: GameTopbarProps) {
  return (
    <div className="game-topbar">
      <BackButton onClick={onBack} />
      <ProgressBar percent={percent} />
      <ScoreBadge score={score} />
    </div>
  )
}
