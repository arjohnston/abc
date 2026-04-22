import './CoreScreen.css'

import { forwardRef } from 'react'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export interface CoreScreenProps extends SharedLayoutProps {
  center?: boolean
}

export const CoreScreen = forwardRef<HTMLDivElement, CoreScreenProps>(
  ({ center, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={['core-screen', center && 'core-screen--center', className]
        .filter(Boolean)
        .join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  ),
)

CoreScreen.displayName = 'CoreScreen'
