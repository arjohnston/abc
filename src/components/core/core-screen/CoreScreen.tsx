import './CoreScreen.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

interface CoreScreenProps extends SharedLayoutProps {
  center?: boolean
}

export function CoreScreen({ center, className, children, ...rest }: CoreScreenProps) {
  return (
    <div
      className={['core-screen', center && 'core-screen--center', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  )
}
