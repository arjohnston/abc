import { CoreBox, CoreText } from '@core'

interface GameInstructionProps {
  children: React.ReactNode
}

export function GameInstruction({ children }: GameInstructionProps) {
  return (
    <CoreBox paddingTop={8} paddingHorizontal={20} paddingBottom={12}>
      <CoreText size="h3" color="muted" align="center">
        {children}
      </CoreText>
    </CoreBox>
  )
}
