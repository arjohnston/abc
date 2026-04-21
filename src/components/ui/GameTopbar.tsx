import './GameTopbar.css'

import { CoreRow } from '@core'
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
    <CoreRow align="center" gap={12} padding={12} paddingHorizontal={16} className="game-topbar">
      <BackButton onClick={onBack} />
      <ProgressBar percent={percent} />
      <ScoreBadge score={score} />
    </CoreRow>
  )
}
