import './GameTopbar.css'

import { BackButton } from '@common/components/BackButton/BackButton'
import { ProgressBar } from '@common/components/ProgressBar/ProgressBar'
import { ScoreBadge } from '@common/components/ScoreBadge/ScoreBadge'
import { CoreRow, Spacing } from '@core'

interface GameTopbarProps {
  onBack: () => void
  percent: number
  score: number
}

export function GameTopbar({ onBack, percent, score }: GameTopbarProps) {
  return (
    <CoreRow
      align="center"
      gap={Spacing.sm}
      padding={Spacing.sm}
      paddingHorizontal={Spacing.md}
      className="game-topbar"
    >
      <BackButton onClick={onBack} />
      <ProgressBar percent={percent} />
      <ScoreBadge score={score} />
    </CoreRow>
  )
}
