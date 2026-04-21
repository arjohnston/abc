import './CoreGameArena.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export function CoreGameArena({ className, children, ...rest }: SharedLayoutProps) {
  return (
    <div
      className={['core-game-arena', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  )
}
