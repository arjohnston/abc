import './GameInstruction.css'

import { CoreText } from '@core'

interface GameInstructionProps {
  children: React.ReactNode
}

export function GameInstruction({ children }: GameInstructionProps) {
  return <CoreText size="h3" color="muted" align="center" className="game-instruction">{children}</CoreText>
}
