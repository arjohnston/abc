import './CoreGameArena.css'

import { forwardRef } from 'react'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export interface CoreGameArenaProps extends SharedLayoutProps {}

export const CoreGameArena = forwardRef<HTMLDivElement, CoreGameArenaProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={['core-game-arena', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  ),
)

CoreGameArena.displayName = 'CoreGameArena'
