import { CoreScreen, type SharedLayoutProps } from '@core'

import { GameTopbar } from './ui/GameTopbar'

interface GameShellProps extends SharedLayoutProps {
  onBack: () => void
  percent: number
  score: number
  center?: boolean
}

export function GameShell({ onBack, percent, score, center, children, ...rest }: GameShellProps) {
  return (
    <CoreScreen center={center} {...rest}>
      <GameTopbar onBack={onBack} percent={percent} score={score} />
      {children}
    </CoreScreen>
  )
}
