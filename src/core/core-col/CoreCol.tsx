import './CoreCol.css'

import { forwardRef } from 'react'

import { buildSpacingStyle, type SharedLayoutProps } from '../shared/spacing'

export interface CoreColProps extends SharedLayoutProps {
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
}

export const CoreCol = forwardRef<HTMLDivElement, CoreColProps>(
  ({ align, justify, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={['core-col', className].filter(Boolean).join(' ')}
      style={{ alignItems: align, justifyContent: justify, ...buildSpacingStyle(rest) }}
    >
      {children}
    </div>
  ),
)

CoreCol.displayName = 'CoreCol'
