import './CoreCard.css'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export function CoreCard({ className, children, ...rest }: SharedLayoutProps) {
  return (
    <div
      className={['core-card', className].filter(Boolean).join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  )
}
