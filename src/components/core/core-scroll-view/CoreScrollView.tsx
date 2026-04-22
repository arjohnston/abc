import './CoreScrollView.css'

import { forwardRef } from 'react'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export interface CoreScrollViewProps extends SharedLayoutProps {
  horizontal?: boolean
}

export const CoreScrollView = forwardRef<HTMLDivElement, CoreScrollViewProps>(
  ({ horizontal, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={[
        'core-scroll-view',
        horizontal && 'core-scroll-view--horizontal',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={buildSpacingStyle(rest)}
    >
      {children}
    </div>
  ),
)

CoreScrollView.displayName = 'CoreScrollView'
