import './GameTopbar.css'

import { ScoreBadge } from '@common/components/ScoreBadge/ScoreBadge'
import { CoreButton, CoreProgressBar, CoreRow, Spacing } from '@core'

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
      <CoreButton variant="ghost" aria-label="Back" onClick={onBack}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </CoreButton>
      <CoreProgressBar percent={percent} />
      <ScoreBadge score={score} />
    </CoreRow>
  )
}
